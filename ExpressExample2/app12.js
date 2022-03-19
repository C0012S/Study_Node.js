var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // npm install body-parser --save로 외장 모듈 설치
var cookieParser = require('cookie-parser'); // npm install cookie-parser --save로 외장 모듈 설치
var expressSession = require('express-session');

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
