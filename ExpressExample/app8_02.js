var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var router = express.Router();

router.route('/process/login/:name').post(function(req, res) {
    console.log('/process/login/:name 라우팅 함수에서 받음.'); // name 정보가 어디로 넘어오는가? name이라고 하는 게 파라미터처럼 넘어온다.
    
    var paramName = req.params.name; // req.params.name으로 참조 // 위의 name이라는 요청 path에 들어가 있는 일부가 이쪽으로 처리되어서 들어가는 것이다. express에서 그거를 처리해 주게 된다. // 다른 파라미터와 중복되지 않도록 해 주는 게 좋다.
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramName + "</p></div>");
    res.write("<div><p>" + paramId + "</p></div>");
    res.write("<div><p>" + paramPassword + "</p></div>")
    res.end();
});

app.use('/', router);

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});

// localhost:3000/public/login3.html에 접속 후 전송해 보면, localhost:3000/process/login/mike로 이동한다. 요청 path에 들어간 mike가 paramName에 그대로 온 것을 볼 수가 있다. // 이거를 그래서 요청 path라고 하는 것 안에 들어가 있다 보니까, 이거를 URL 파라미터라고 부를 수가 있다.
