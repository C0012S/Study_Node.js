var express = require('express');
var http = require('http'); // require 함수를 이용해서 외장 모듈을 불러들이는 경우는, 되도록이면 위쪽에 갖다 놓는 경우가 많다. 중간에 해도 상관없다. 근데 미리 준비할 수 있도록 하는 것이다. 모듈을 로딩하는 시간이 걸릴 수도 있으니까 말이다.
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // body parser 미들웨어는 요청 파라미터 관련된 것이다. // POST 방식으로 처리하겠다고 하면, body parser라는 외장 모듈을 사용한다.  // body-parser는 외장 모듈이므로 추가로 설치해야 한다. → 명령 프롬프트에서 npm install body-parser --save 실행
// 웹 브라우저에서 GET 방식이 아니라 POST 방식으로 요청해야 한다. → 주소 표시줄에 그냥 요청할 수는 없다. 주소 표시줄에 넣게 되면, 무조건 GET 방식으로 요청하게 된다. 그래서 일반적으로 POST 방식으로 요청할 때 사용하는 툴, 테스트 툴 같은 것들을 많이 쓴다. 그래서 그 중 하나로 postman이라는 게 있다.
// postman에서 POST 방식으로 테스트 할 수가 있다. // 직접 웹 페이지를 만들어서 웹 페이지에서 요청할 수도 있다. → 나중에 같이 할 것이다.

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public'))); // use : 미들웨어 등록 // 직접 함수를 만들지 않고, 미리 만들어진 serve-static을 쓴다. // static이라는 게 함수로 실행될 수가 있다. // path 모듈 사용해서, join으로 상위 폴더와 하위 폴더, 또는 상위 폴더와 파일 이름을 같이 붙여 줄 수가 있다. // __dirname : app7.js 파일이 실행되는 그 폴더의 path를 얘기한다. // 'public' : 그 아래에 있는 public 폴더를 붙여서 path를 만들어 준다. // 그 다음부터는 public 폴더 안에 있는 파일을 가져다 쓸 수가 있다.  // → http://localhost:3000/house.png 접속이 가능하다.(public 폴더 안에 house.png가 있다.) // house.png 파일이 그대로 노출이 된다. // 보안 관련해서는 그냥 막 다 노출해야 되는 그런 파일로 하면 안 된다. 이렇게 특정한 폴더를 지정해서 그 안에 노출해도 되는 것만 집어 넣게 된다. // 그냥 이렇게 하면, 이미지나 이런 것들이 명확히 구분이 안 될 수가 있다.  // → public 폴더 안에 images 폴더 생성 후 house.png를 images 폴더로 옮기면, http://localhost:3000/images/house.png 접속이 가능하다. // 마찬가지로 images 폴더가 아니라 js 폴더에는 자바스크립트, css 폴더에는 css, 이런 식으로 나눠서 넣으면, public이라고 하는 특정한 폴더를 오픈해서 사용할 수 있도록 만들어 줄 수가 있다.  // public 폴더를 똑같이 public이라고 하는 path를 통해서 가져가도록 만들고 싶다면 앞에 파라미터를 '/public' 붙여 주면 된다. // → http://localhost:3000/public/images/house.png 접속 가능 // 실무에서는 빼고 images나, js, css 같은 폴더를 두고 해도 된다.

app.use(bodyParser.urlencoded({extended:false})); // use : 미들웨어 등록 함수 // urlencoded 안에 설정을 위한 객체를 넣어 준다.
app.use(bodyParser.json()); // json을 사용하는 경우 이렇게 설정할 수 없게 되는데, 일반적으로 그냥 이런 식으로 등록해서 사용한다고 보면 된다. 그래서 POST 방식으로 넘길 경우에는 req.query로 그냥 접근할 수 없다. POST 방식 자체가 요청 파라미터를 헤더나 이런 데에, 그러니까 요청 path 뒤에 붙여서 가는 방식이 아니고, 헤더에 넣는 방식이 아니고, body라고 해서 실제 내용물이 들어가는, 우리가 데이터를 주고 받을 때 헤더가 아니라 body라고 하는 영역에 넣는다. POST 방식은 그 영역 안에 들어간다. 그러다 보니까, 그거를 처리할 수 있는 별도의 외장 모듈을 만들어 놓는 것이다. // 이렇게 등록을 해 놓는 경우에는, 파라미터를 받을 때 req.query.name이 아니라 req.body.name으로 받을 수 있다.

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    // var paramName = req.query.name; // GET 방식
    // var paramName = req.body.name; // POST 방식
    var paramName = req.body.name || req.query.name; // 만약 이게 POST 방식으로 넘어올 수도 있고, GET 방식으로도 넘어올 수 있다고 하면, body에 없으면 req.query.name으로 참조하라고 할 수도 있다.  // 지금은 미들웨어지만, 나중에 라우터라고 하는, 라우터 함수, 라우팅 함수를 등록할 때는, POST 방식으로 할 수도 있고, GET 방식으로 할 수도 있다. 이렇게 자꾸 바뀌는 경우가 있다. 그래서 이런 식으로 등록을 해 놓으면 좀 편하게 사용할 수가 있다.
    
    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Name -> ' + paramName + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
