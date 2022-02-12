// ch06-01 MongoDB 설치 & 실행
// mongod --dbpath /Users/user/database/local
// mongo  // use local

// ch06-02 익스프레스에서 몽고디비 사용하기
// 모듈 설치 - npm init으로 설정 후, express, http, path, body-parser, cookie-parser, express-session, express-error-handler 설치
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // body-parser : POST 방식으로 요청할 때 요청 파라미터를 처리하기 위한 모듈
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 예외(Exception, Error) 처리를 위한 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false})); // use 메소드를 이용해서 미들웨어 등록
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


var router = express.Router();

app.use('/', router);

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
