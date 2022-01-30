var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨.');
    
    // 첫 번째 미들웨어에서 응답을 보낸다. // writeHead, end를 쓰든 res.send를 쓰든 상관없다.
    // 이렇게 응답을 보낸다고 했을 때, 그러면 클라이언트가 응답을 받을 것이다. // 그게 아니라 res.redirect 함수를 사용할 수 있다.
    res.redirect('http://google.co.kr'); // 특정 요청 path를 넣을 수가 있다. // 나중에 여러 가지 요청 path를 처리할 수 있도록 만들면, 그 우리가 만든 웹 서버 안에 다른 요청 path로 다시 redirect를 할 수가 있다. // 이렇게 되면, 예를 들어 로그인을 안 했을 때 로그인 페이지로 옮겨가는 것을 여기서 구현할 수가 있다. // redirect은 자동으로 이동하도록 만들어 주는 것이다. // 어떤 웹 서버든 다른 데로 이동할 수 있는 기능인 redirection 기능을 다 제공해 준다.
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});

// 그 다음 내용 : 헤더 정보와 바디 정보, 요청 파라미터 정보를 어떻게 확인할 수 있는지 얘기하고 있다. 요청 파라미터는 주소를 쓸 때, http:://localhost:3000/ 이렇게 하면, IP와 포트 정보가 된다. 웹 서버를 지정하는 것이다. http:://localhost:3000/users 이렇게 하면, /users가 요청 path가 된다. 똑같은 웹 서버에서 응답을 받지만, 그 안에 특정한 경로를 지정하는 것이다. 그래서 그 경로에 해당하는 기능을 실행해 주라는 의미가 되는 것이다. http:://localhost:3000/users?name=mike처럼 Key Value 값을 구성하게 되면, name=mike가 요청 파라미터가 된다. 요청 파라미터는 & 표시를 해서 여러 개를 계속 연속으로 붙일 수가 있다. 그래서 주소 표시 줄에 바로 요청을 하는 방식을 GET 방식이라고 할 수 있다. GET 방식을 이용해서 웹 서버에 요청하게 된다. // → 실행해서 http:://localhost:3000/users?name=mike에 접속하면 원래 하던 기능들 그대로 실행된다. 요청 path에 따라서 구분되는 게 없어 똑같은 기능이 실행이 된다.
// 요청 path라는 거, 요청 파라미터가 넘어왔을 때, 요청 파라미터라는 건 어떤 데이터를 전달하기 위한 목적으로 넣는 것이다. 그래서 그거를 어떻게 뽑아서 사용할 수가 있는지 같이 보도록 하겠다.
