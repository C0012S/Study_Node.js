var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨.');
    
    req.user = 'mike';
    
    next();
});

app.use(function(req, res, next) {
    console.log('두 번째 미들웨어 호출됨.');
    
    // res.send('<h1>서버에서 응답한 결과입니다 : ' + req.user + '</h1>'); // res.writeHead, res.end로 응답을 보낼 수 있고, send 메소드로도 보낼 수 있다. // send라고 해서 바로 보낼 수 있다. // writeHead, end, 이렇게 하게 되면 메소드를 여러 번 호출해야 되지만, send로 그냥 보낼 수 있다.
    // writeHead & end로 할 때, 자바스크립트 객체를 넣으면 어떻게 되지?
    var person = {name:'소녀시대', age:20};
    // res.send(person); // send로 보내는 걸 자바스크립트 객체를 그대로 보낼 수도 있다. // 실행 후 접속하면 → json format으로 넘어온다. // json은 똑같이 중괄호가 객체를 가리키는 것이고, 속성의 이름에 문자열을 집어 넣는다. 기존의 자바스크립트에서는 문자열이 아니라 그냥 집어 넣어도 된다. // 이거를 json format이라고 하고, 요즘의 웹 서버들은 데이터만 주고 받고 싶은 경우에는 이렇게 json format을 쓰는 경우가 많다. // 그래서 json format으로 서비스를 하게 되는 경우가 많으니까, 이렇게 보낼 수 있다는 거 생각해 주면 된다.  // 실제로 여기서 자바스크립트 객체를 넣어 줬을 때, 내부적으로 JSON 문자열로 변경해서 보낸 것이다.
    
    // res.send(person);과 다르게 보내는 방법 // 이렇게(JSON 문자열로 변경해서) 명시적으로 보내는 방법이 훨씬 더 안전한 방법이다.
    // var personStr = JSON.stringify(person); // JSON.stringify 함수를 실행해서 문자열로 바꾼 다음 보내 줄 수 있다. // 자바스크립트 객체는 문자열이 아니다. // 이것을 문자열로 바꾸면, personStr이 JSON 문자열이 된다. // JSON은 문자열이다. 글자가 쭉 들어가 있는 형태가 된다는 것이다.
    // res.send(personStr); // res.send(person);과 동일한 결과를 볼 수가 있다.
    
    // 조금 더 바꿔서 이렇게 할 수도 있다.
    // res.writeHead(200, {"Content-Type":"application/json;charset=utf8"}); // 헤더 정보를 보낸다. // 200과 객체를 만들고 헤드 속성을 넣는다. // Content-Type이라는 속성을 넣어 준다. // 헤더 정보가 될 것이다. // text/html이라는 body 안에 들어가는 데이터의 타입을 넣어 줬다. 그것을 application/json이라고 한 번 넣어 줄 수도 있다.
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"}); // application/json 대신 text/html 넣어서 보내 본다. → 그래도 계속 오류 발생
    // res.write(personStr);
    res.write(person); // res.write(person), res.write(personStr) 모두 정상적으로 처리하지 못하는 상태가 된다. 다시 변경해서 확인해 보기!
    res.end();
    // 이런 형태로도 보낼 수 있다.
    // 웹 브라우저가 반복적으로 에러가 생겼을 때, 계속 요청을 하는 형태가 된다.
    // 에러? - 헤더 정보가 정확하지 않아서 그런 거라고 할 수가 있다. → 다시 확인.
    
    // 이런 식으로 다른 형태로 바꿔서 보낼 수 있다.
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
// app3.js와 동일한 결과가 나온다.(person 객체를 전달하는 send 대신, 첫 번째 send로 실행할 때.)
// 결국 send는 좀 더 간단하게 응답을 보낼 수 있는 방법이다.

// send로 바로 자바스크립트 객체를 보내면, JSON이라는 자바스크립트의 객체를 문자열로 바꾼 형태로 날아가게 된다. 그리고 그거를 아예 명시적으로 문자열로 바꿔서 보낼 수도 있다. // 그 다음에 이거를 send가 아니라, 이런 식으로 다시 나눠서 보낼 수도 있다.

// res에서 할 수 있는 기능들이 여러 가지가 있다.
