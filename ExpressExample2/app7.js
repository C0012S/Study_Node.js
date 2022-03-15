var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // npm install body-parser --save로 외장 모듈 설치

var app = express();

app.set('port', process.env.PORT || 3000);
// app.use(static(path.join(__dirname, 'public'))); // 경로에 public을 붙이지 않는다.
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.body.name || req.query.name; // POST 방식 : body // GET 방식 : query
    
    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Name -> ' + paramName + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
