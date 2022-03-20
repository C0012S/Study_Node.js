var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // npm install body-parser --save로 외장 모듈 설치
var cookieParser = require('cookie-parser'); // npm install cookie-parser --save로 외장 모듈 설치
var expressSession = require('express-session'); // npm install express-session --save로 외장 모듈 설치

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var router = express.Router();

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
