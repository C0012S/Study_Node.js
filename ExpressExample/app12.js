var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); // 세션은 쿠키를 같이 사용한다.
var expressSession = require('express-session'); // npm install express-session --save로 express-session 외장 모듈 설치


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({ // 객체를 넣는다. // 세션에 대한 설정 정보가 들어간다. // 세션은 서버 쪽에 저장된다. - 파일로 저장하든가 Redis(레디스) 메모리 데이터베이스에 저장할 수도 있다. 저장할 때, 만약 파일이라고 하면 저장할 파일을 미리 만들어 놓고 저장할 정보를 나중에 넣을 것인지, 저장할 정보를 아예 안 만들어 놓고 저장할 정보가 생겼을 때 파일을 만들 것인지, 이런 정보가 옵션으로 설정된다. 이 secret라는 키 정보를 이용해서 그런 정보를 관리하게 된다.
    secret:'my key',
    resave:true,
    saveUninitialized:true
})); // expressSession을 미들웨어로 등록  // 이렇게 하면 세션을 사용할 수 있는 상태가 된다.


var router = express.Router();

router.route('/process/product').get(function(req, res) {
    console.log('/process/product 라우팅 함수 호출됨.');
    
    if (req.session.user) { // 세션 정보는 쿠키를 썼던 거와 별반 다르지 않다. 그래서 세션을 설정할 수 있고, 필요하면 그 설정한 정보를 확인할 수가 있다. 그 정보들은 req의 session에 들어가 있다. 쿠키 같은 경우는 req의 요청 객체 안에 cookies 안에 들어가 있었다. 세션은 session에 들어가 있다. // 확인하는 거는 req 객체 안에서 확인한다. 근데 cookies와 session을 확인한다. // 나중에 session에 user를 넣을 것이다. - 로그인을 정상적으로 하게 되면, 그걸 한 번 확인해 볼 것이다. - 상품 페이지에서 user가 있으면 로그인이 되었다고 보자는 것이다.
        res.redirect('/public/product.html'); // 로그인이 되었다고 보면, public 안의 product.html로 이동한다.
    }
    else { // 로그인이 안 되어 있으면
        res.redirect('/public/login2.html'); // /public/login2.html로 이동
    }
}); // 상품 페이지가 로그인이 안 되어 있으면 볼 수 없게 만들겠다는 것이다. 그러면 로그인 페이지로 이동한다. 로그인이 되어 있는지, 안 되어 있는지는 어떻게 이해하냐면, session 안의 user 정보가 있는지 보겠다는 것이다.  // → 로그인 하는 과정을 조금 이따 같이 본다.


// 로그인에서는, 세션 정보를 남겨 줘야 product 상품 정보를 줘야 할 때 그 정보를 위에서처럼 사용할 수 있게 된다.
router.route('/process/login').post(function(req, res) {
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
    if (req.session.user) {
        console.log('이미 로그인되어 있습니다.');
        
        res.redirect('/public/product.html');
    }
    else { // 서버 쪽에 user라는 session 정보가 없다면
        req.session.user = { // 속성으로 객체 추가
            id:paramId,
            name:'소녀시대',
            authorized:true
        };
        
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>Id : ' + paramId + '</p>');
        // res.write('<br><br><a href="/public/product.html">상품 페이지로 이동하기</a>'); // 상품 페이지로 이동할 수 있는 링크 제공 - /process/product로 해도 이동하는 데 문제는 없을 것이다.
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>'); // process로 한 번 더 검증한다. // /process/product로만 접속할 수 있도록 만들 수 있다. // 안 그러면 /public/product.html을 주소 표시줄을 통해 접속을 할 수 있게 된다. // public에 product.html을 그냥 열어 두지 않고, process의 product.html 이쪽으로 접근하도록 만들어 주면 세션 정보를 이용해서 접근하게 된다.
        res.end(); // 브라우저 쪽으로 전송
    }
}); // 로그인에 대한 코드

router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout 라우팅 함수 호출됨.');
    
    if (req.session.user) { // 요청 객체 안 session 객체 안에 user 속성이 있다면, 로그인이 되어 있다는 것이다. → 로그아웃 하면 된다.
        console.log('로그아웃 합니다.');
        
        req.session.destroy(function(err) {
            if (err) {
                console.log('세션 삭제 시 에러 발생.');
                return;
            }
            
            console.log('세션 삭제 성공');
            res.redirect('/public/login2.html'); // 로그아웃 후 로그인 쪽으로 이동하도록 유도한다.
        }); // destroy 메소드 : session 안에 들어가 있는 정보를 없애 준다.
    }
    else { // 이미 로그아웃이 되어 있는 상태 또는 로그인이 안 되어 있는 상태라면
        console.log('로그인되어 있지 않습니다.');
        res.redirect('public/login2.html'); // 로그인 페이지로 이동하도록 만들어 준다.
    }
}); // 로그아웃에 대한 코드


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
