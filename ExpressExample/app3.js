var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) { // 첫 번째 미들웨어는 next로 넘긴다.
    console.log('첫 번째 미들웨어 호출됨.');
    
    // 첫 번째 받는 이 미들웨어에서는 다른 처리를 하고 싶다. 즉, 응답을 여기서 보내고 싶지 않다. // 첫 번째 미들웨어가 하는 역할은 사용자를 확인하는 것이다.
    req.user = 'mike'; // user라는 사용자 정보를 속성으로 추가 // 어떤 객체든 속성을 추가할 수 있다.
    
    next(); // 응답을 바로 보내는 게 아니라, next로 파라미터를 받으면 함수를 실행한다. // next라고 하면 이 미들웨어를 떠나게 된다. // 이 미들웨어를 떠나게 되면, 그 다음 미들웨어가 이제 요청을 받아서 처리하게 된다.
});

app.use(function(req, res, next) { // 앞에 요청 path를 입력할 수도 있다.
    console.log('두 번째 미들웨어 호출됨.');
    
    // 응답을 보낸다.
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.end('<h1>서버에서 응답한 결과입니다 : ' + req.user + '</h1>'); // 두 번째 미들웨어에서도 req가 넘어온다. 첫 번째를 거쳐서 넘어왔기 때문에 req 밑에 user라는 속성이 추가되어 있다. // mike(user)가 어떻게 넘어왔냐면, 클라이언트에서 보낸 것도 아니고 설정을 했다. 설정을 임의로 집어 넣은 것도 아니고 첫 번째 미들웨어에서 넣은 정보를 두 번째에서 받아서 처리를 한 것이다. 그때 사용될 수 있는 게 req라는 객체다. // req든 res든 공통적으로 파라미터로 받기 때문에 동일한 객체라고 하면, 거기에 속성을 넣어서 전달할 수 있다고 생각하면 쉽다.
}); // 여러 개의 미들웨어를 등록해서 사용할 수 있다.

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});

// 이렇게 미들웨어를 가지고 나중에 여러 가지 기능들을 수행하게 된다.
