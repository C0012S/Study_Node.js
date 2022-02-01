var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); // 프롬프트에서 npm install cookie-parser --save로 외장 모듈 cookie-parser 설치


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser()); // 미들웨어로 등록


var router = express.Router();

router.route('/process/setUserCookie').get(function(req, res) { // 응답 객체 안에 cookie 메소드를 제공해 준다. // cookie 메소드를 사용하면 쿠키 정보를 남겨 둘 수 있다. 쿠키 정보는 객체를 넣어 둘 수 있는 상태가 된다.
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    
    res.cookie('user', {
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    
    res.redirect('/process/showCookie'); // 응답을 보낼 때 저 정보가 같이 들어간다. 그래서 웹 브라우저, 클라이언트로 전송된다. // redirect : 다른 path로 옮겨 줄 수가 있다. // 요청 path '/process/showCookie'로 옮겨 갈 수 있도록, 그쪽 페이지를 열도록 바꿔 준다.
}); // 이 요청 path로 웹 브라우저가 요청을 하게 되면, 여기서 쿠키 정보를 저장해 달라고 웹 브라우저가 날리겠다는 것이다. 그러면 웹 브라우저에서 그거를 쿠키로 저장을 한다.

router.route('/process/showCookie').get(function(req, res) { // 웹 브라우저가 쿠키 정보를 갖고 있는데, 그 쿠키 정보를 우리 쪽으로 요청할 때마다 넘겨 주게 된다. 그래서 그 정보를 확인할 수가 있는데, 그 정보를 확인할 때 res 응답 객체안의 cookies 객체를 가지고 확인한다.
    console.log('/process/showCookie 라우팅 함수 호출됨.');
    
    res.send(req.cookies); // send : 클라이언트 쪽으로 데이터를 보낸다. // cookies 안에 user라는 게 들어가 있을 것이다. // cookies는 서버에 있는 것은 아니다. 지금 요청 객체 들어가 있다. 그래서 웹 브라우저가 저장하고 있고, 이쪽을 접속할 때 그 정보를 보내 준 것이다. 그래서 확인용이라고 볼 수가 있다. // 저 정보가 넘어오면, 필요한 정보, 처리 과정을 하라는 것이다. 필요한 과정이 있으면 처리하라고 넘겨 주는 거라고 볼 수가 있다.
}); // 설정된 쿠키 정보를 본다.


app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>');
}); // app.use('/', router); 밑으로 옮겼다. // → 라우팅 함수를 처리하는 것과 app.all이라는 함수가 분리된다. // all이라고 해서 나머지, 등록한 페이지 외의 것들에 대해서 '요청하신 페이지는 없어요'는 이 밑에서 처리되어야 한다.

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});

// 이런 식으로 쿠키 정보를 처리할 수가 있다. // 쿠키를 조금 더 확인하고, 세션에 대해서 알아보도록 하겠다.


// setUserCookie를 하게 되면, 웹 서버에서 웹 브라우저에 user 객체를 저장해 달라고 보내 준다. 그러면, 웹 브라우저에 저장되었는지 한 번 가서 볼 수가 있다. // → 개발자 도구 → Application → Storage - Cookies에 들어가면, Name user에 Value가 들어가 있는 것을 볼 수가 있다. 그냥 볼 수 있는 정보는 아니도록 되어 있는 상태다. 브라우저에 user라는 Key 값으로 정보가 저장되어 있다는 것이다. 여러 가지 정보들이 쭉 나와 있게 된다. 이게 쿠키라는 것이다.
// 그래서 서버에서 setUserCookie를 했을 때, 응답으로 user 객체를 저장해 주라고 하면, 본 것처럼 브라우저에 쿠키라는 정보가 저장되는 것이다. // 쿠키라는 정보가 저장이 됐다가, 그 다음에 redirect를 해서 showCookie를 했을 때 동일한 사이트니까 그쪽으로 쿠키 정보를 넘겨 주는 것이다. 그게 요청 객체의 cookies 안에 들어가게 된다. 그래서 cookies 안에 들어가니까, 그 정보를 showCookie를 해서 보니까 user라는 이름으로 들어갔다는 것을 알 수 있다. 
// 결국에는 요청 객체 안에서 req.cookies.user라고 하면, 설정했던 정보를 그대로 확인할 수가 있다.
// 쿠키 설정한 소스를 실행한 게 실행이 안 돼서 에러를 보고 수정했다.
