var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // npm install body-parser --save로 외장 모듈 설치
var cookieParser = require('cookie-parser'); // npm install cookie-parser --save로 외장 모듈 설치
var expressSession = require('express-session'); // npm install express-session --save로 외장 모듈 설치

var multer = require('multer'); // 파일 업로드 할 수 있게 도와 주는 외장 모듈 multer // npm install multer --save로 외장 모듈 설치
var fs = require('fs');

var cors = require('cors'); // cors : 다중 서버 접속에 대한 문제를 해결하기 위한 것 // npm install cors --save로 외장 모듈 설치

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

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
    destination: function(req, file, callback) {
        callback(null, 'uploads'); // 어떤 폴더로 업로드 되게 할 건지 정한다.
    },
    filename: function(req, file, callback) {
        // callback(null, file.originalname + Date.now()); // 책에는 이렇게 되어 있다.
        var extension = path.extname(file.originalname); // 확장자를 살리려면 이렇게 한다
        var basename = path.basename(file.originalname, extension); // path.basename : 파일 이름만 빠지게 된다. // 확장자만 뺀 나머지 이름만 return 한 것을 basename으로 받는다.
        callback(null, basename + Date.now() + extension); // 파일이 업로드 될 때 이름을 어떻게 바꿀 건지를 설정한다.
    }
});

var upload = multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    } // 몇 개까지 올릴 수 있게 할 건지 정한다.
});

var router = express.Router();

router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
    console.log('/process/photo 라우팅 함수 호출됨.');
    
    var files = req.files;
    console.log('==== 업로드 된 파일 ====');
    if (files.length > 0) {
        console.dir(files[0]);
    }
    else {
        console.log('파일이 없습니다.');
    }
    
    var originalname;
    var filename;
    var mimetype;
    var size;
    
    if (Array.isArray(files)) {
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
    res.write("<p>저장 파일 : " + filename + "</p>");
    res.end();
});

router.route('/process/product').get(function(req, res) {
    console.log('/process/product 라우팅 함수 호출됨.');
    
    if (req.session.user) { // 로그인이 되어 있으면 // session 안에 user 정보가 있는지
        res.redirect('/public/product.html');
    }
    else { // 로그인이 안 되어 있으면
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
        // res.write('<br><br><a href="/public/product.html">상품 페이지로 이동하기</a>'); // <a href="/process/product/">로 하더라도 이동하는 데 문제는 없을 것이지만 페이지를 바로 열어 주는 게 훨씬 나을 것이다.
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>'); // process로 한 번 더 검증할 수 있으므로 /process/product로만 접속할 수 있도록 만들 수 있다. - 세션 정보를 이용해서 접근하게 된다.
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
            
            console.log('세션 삭제 성공.');
            res.redirect('/public/login2.html');
        }); // session.destroy : 세션 정보를 없애 준다.
    }
    else {
        console.log('로그인 되어 있지 않습니다.');
        res.redirect('/public/login2.html');
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
}); // all : 모든 요청에 대해서 처리하겠다는 함수

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
