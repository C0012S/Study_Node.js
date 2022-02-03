var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var multer = require('multer'); // multer 외장 모듈 - 파일 업로드 할 수 있게 도와 주는 외장 모듈 // npm install multer --save로 외장 모듈 설치
var fs = require('fs'); // fs 외장 모듈 - 파일 다루는 것과 관련이 있다고 하면 거의 fs를 사용한다.

// 보안 관련해서, 서버에서 웹 페이지를 조회해서 웹 브라우저에서 봤다고 하면 그 웹 페이지에서 ajax라고 하는 거로 데이터를 요청할 수가 있다. // 지금까지 보면, 페이지를 응답으로 보내 주면 새로운 페이지가 딱 뜬다. 그게 아니라 페이지는 그대로 있는 상태에서 데이터만 주고 받으면서 페이지 안의 태그만 변경하겠다. 또는 태그의 속성만 변경하겠다는 경우는 ajax라는 걸 쓴다. 그리고 이제 서버 쪽에 특정한 정보, 데이터를 요청하면 데이터가 json format의 파일로 오게 된다. 근데 웹 페이지를 연 서버가 있으면 그 웹 서버로만 접속할 수 있게 되어 있다. 그래서 지금은 그거를 표준으로 그런 문제 하나의 서버만 접속할 수 있는 문제는 보안 떄문에 처음에 그렇게 규정되었던 거다. 근데 요즘에는 예를 들어 공공 API라든가 이런 게 있어서 다른 서버로 접속을 클라이언트에서 바로 하고 싶다는 경우가 있을 수 있겠다. 그런 경우, mash up이라고도 하는데 그런 경우에는 다른 서버로 접속해야 하는 경우가 생긴다. 그래서 그걸 위해서 표준 프로토콜에 더 추가한 게 cors라고 하는 게 있다. 그래서 다중 서버 접속이라고 할 수 있는데, 그거는 이제 서버 쪽에서 어떤 정보를 옵션으로 더 주면, 그러면 브라우저가 그렇게 접속한 걸 허용하거나 이렇게 만드는 과정이라고 볼 수 있다. 그것도 구체적으로 알려고 그러면, 프로토콜이 어떻게 되고 뭐 이런 것들 다 이해할 수 있지만, 그런 과정을 cors 외장 모듈이 해결해 준다.
var cors = require('cors'); // 지금 직접 하는 거에 쓰인다기보다는, 앞으로도 만약에 다른 웹 서버를 다른 데에서, 다른 IP를 가진 곳에서 웹 서버를 접속해서 가져가야겠다는 경우 cors가 사용된다. // cors : 다중 접속, 다중 서버 접속에 대한 문제를 해결하기 위한 것  // npm install cors --save로 외장 모듈 설치


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads'))); // 업로드 폴더를 열어 놓을 것이다. 업로드 된 파일을 직접 조회할 수 있도록 열어 본다. // 업로드 된 파일 있으면 uploads 폴더로 저장되도록 만든다. 업로드 된 폴더는 그대로 오픈되어 있으므로 조회할 수가 있다.

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(cors());

var storage = multer.diskStorage({
    destination: function(req, file, callback) { // multer에서 정의한 것이므로 그대로 써 줘야 한다.
        callback(null, 'uploads'); // uploads : destination 폴더를 얘기한다. // uploads 폴더 쪽으로 destination, 목적지를 정한다.
    },
    filename:function(req, file, callback) {
        // callback(null, file.originalname + Date.now()) // 파일을 가지고 업로드를 하게 되면, 동일한 이름으로 업로드 될 수도 있다. 같은 이름을 두 번 하게 되면 기존 거를 덮어 쓰는 문제가 생긴다. // 그래서 업로드 된 파일은 고유한 정보를 이용해서 별도의 이름으로 만들어 주는 경우가 상당히 많이 있다. // → 시간 정보를 같이 붙여 본다.  // file.originalname : 원래 파일 이름 - 업로드 된 파일인 경우, originalname에 원래 파일 이름이 들어가 있다. // Date.now : 현재 시간을 붙인다. // 파일 이름이 변경된다. // 이렇게 하게 되면, 예를 들어 person.png 파일이면 person.png 뒤에 Date.now가 붙어 이미지로 조회가 안 된다. 그래서 그런 경우에는 person~~~.png로 만들어 줄 필요가 있다. 
        
        var extension = path.extname(file.originalname); // png라는 확장자를 살리겠다면  // 확장자만 빼낸다.
        var basename = path.basename(file.originalname, extension); // 파일 이름만 빠지게 된다. // extension(.png)만 뺀 나머지 이름만 return 한다.
        callback(null, basename + Date.now() + extension); // basename에 Date.now(현재 시간 정보)를 이름에 붙여 준다. extension을 붙이면, .png 파일로 된다. // 이렇게 하면, 이거를 폴더에서 오픈 된 폴더(업로드 폴더) 그 쪽에서 그대로 조회해도 이미지로 조회된다.
    }
});

var upload = multer({
    storage:storage,
    limits:{
        files:10, // 최대 한 번에 업로드 할 수 있는 최대 파일 수
        fileSize:1024*1024*1024 // 한 번에 업로드 할 수 있는 최대 파일 사이즈
    }
});
// multer를 사용할 때의 기본 설정 - 몇 개까지 올릴 수 있게 할 건지, 어떤 폴더로 업로드 되게 할 건지, 파일이 업로드 될 때 이름을 어떻게 바꿀 건지 설정
// 설정 후 이 multer를 이용해서, 실제 업로드 할 수 있도록 라우팅 함수를 만들면 된다. // 라우팅 함수를 만들고, 그 다음에 html 페이지에서 업로드 한다고 하면, 만약 form 태그를 쓴다고 하면 form 태그를 썼을 때 어떻게 속성을 넣으면 되는지 같이 해 보도록 할 것이다.


var router = express.Router();


router.route('/process/photo').post(upload.array('photo', 1), function(req, res) { // photo 이름으로 넘어온 파일이 있으면 배열에 들어간다.
    console.log('/process/photo 라우팅 함수 호출됨.');
    
    var files = req.files;
    console.log('=== 업로드된 파일 ===');
    if(files.length > 0) {
        console.dir(files[0]);
    }
    else {
        console.log('파일이 없습니다.');
    }

    var originalname;
    var filename;
    var mimetype;
    var size;
    
    if (Array.isArray(files)) { // files가 배열이 맞다면
        for (var i = 0; i < files.length; i++) {
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본 파일 : " + originalname + "</p>");
    res.write("<p>저장 파일 : " + filename + "</p>"); // 업로드 된 파일을 다른 거와 중복되지 않도록 다른 이름으로 변경한 이름이 filename
    res.end();
});


router.route('/process/product').get(function(req, res) {
    console.log('/process/product 라우팅 함수 호출됨.');
    
    if (req.session.user) {
        res.redirect('/public/product.html');
    }
    else {
        res.redirect('/public/login2.html');
    }
});


router.route('/process/login').post(function(req, res) {
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
    if (req.session.user) {
        console.log('이미 로그인되어 있습니다.');
        
        res.redirect('/public/product.html');
    }
    else {
        req.session.user = {
            id:paramId,
            name:'소녀시대',
            authorized:true
        };
        
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>Id : ' + paramId + '</p>');
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>');
        res.end();
    }
});

router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout 라우팅 함수 호출됨.');
    
    if (req.session.user) {
        console.log('로그아웃 합니다.');
        
        req.session.destroy(function(err) {
            if (err) {
                console.log('세션 삭제 시 에러 발생.');
                return;
            }
            
            console.log('세션 삭제 성공');
            res.redirect('/public/login2.html');
        });
    }
    else {
        console.log('로그인되어 있지 않습니다.');
        res.redirect('public/login2.html');
    }
});


router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    
    res.cookie('user', {
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 라우팅 함수 호출됨.');
    
    res.send(req.cookies);
});


app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>');
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
