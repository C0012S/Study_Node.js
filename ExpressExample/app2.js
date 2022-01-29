var express = require('express');
var http = require('http');

var app = express(); // app 객체 : express server 객체. 실제로는 웹 서버 객체가 될 것이다.

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) { // request, response는 http 모듈에서 제공하는 거가 있을 텐데, express에서 필요한 것들을 조금 더 추가된 형태로 만든 다음에 파라미터로 전달한다고 생각하면 된다.
    console.log('첫 번째 미들웨어 호출됨.');
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"}); // writeHead : 헤더 정보를 얻겠다. // 200 : 정상 응답 // 파라미터로 객체를 넣어 줄 텐데, 이 객체는 헤더 정보가 들어갈 수 있다. → Content-Type : 웹 페이지의 콘텐츠 유형을 결정 // 헤더 정보를 그냥 하나 넣어 주는 것이다.
    res.end('<h1>서버에서 응답한 결과입니다.</h1>');
}); // use라는 게 미들웨어를 등록하는 것이다. // 미들웨어는 함수다. // 그 함수가 클라이언트가 요청이 들어왔을 때 호출이 되는 것이다.

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});

// 여기서 중요한 것은, 미들웨어를 사용해 봤다는 것이다. // app.use 함수를 통해서 미들웨어를 등록해서 실행되도록 할 수 있다. // 클라이언트가 요청이 들어오면, 그 요청을 받아서 처리하게 된다.
