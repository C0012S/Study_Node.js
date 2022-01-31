var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // POST 방식으로 들어오는 요청 파라미터를 처리할 수 있도록 body-parser 등록


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// 라우팅 함수
var router = express.Router();

// 미들웨어에서 해 주는 게 응답을 보내 주는 것이다. → 이렇게 쓰지 않고, 라우팅 함수를 사용하겠다.  // 라우팅 함수로 처리하는 방식으로 바뀌었고, /process/login만 처리된다.
router.route('/process/login').post(function(req, res) { // 클라이언트가 요청이 들어온 정보를 확인할 수 있고, 응답을 res로 보낼 수 있다. // 미들웨어처럼 모든 걸 받는 게 아니라 요청 path(/process/login)로 들어온 것만 받는다.  // localhost:3000/public/login2.html에서 아이디와 비밀번호 입력 후 전송하면, 값이 localhost:3000/process/login으로 전달된다. 우리가 요청한 요청 path(/process/login)가 그대로 넘어간 것을 확인할 수가 있다.  // '/process/add'로 접속하면 처리가 안 된다. 라우팅 함수는 미들웨어처럼 전체를 받는 게 아니라, 요청 path만 처리하기 때문이다. 요청 path가 아닌 것에 대해서는 처리할 수가 없는 상태가 된다.
    console.log('/process/login 라우팅 함수에서 받음.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password; // User-Agent라는 헤더 정보도 빼낼 수 있지만, 여기서는 그냥 파라미터만 확인해 본다.
    
    // 응답 코드
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramId + "</p></div>"); // 이런 식으로 입력하면 번거롭다. 다시 +를 하고 "로 하다 보면, "가 중복되면서 에러가 생기곤 한다. → 그래서 view를 통해서 웹 페이지를 미리 저장해 놓고, 그 정보를 이용해서 응답을 만든다.
    res.write("<div><p>" + paramPassword + "</p></div>")
    res.end();
});

// 모든 페이지에 대해서 처리를 하겠다.
app.all('*', function(req, res) { // all 함수 : 모든 요청에 대해서 처리하겠다.
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>'); // res.status : 응답 // 200 : 정상 응답 // 404 : 문서를 찾을 수 없다는 내용
}); // 지정된 라우팅 함수 쪽으로 요청 path를 만들지 않으면, 에러 페이지처럼 보여 주겠다는 것이다.


app.use('/', router); // 미들웨어로 등록한다.

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
