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
    // var paramName = req.body.name || req.query.name; // 만약 이게 POST 방식으로 넘어올 수도 있고, GET 방식으로도 넘어올 수 있다고 하면, body에 없으면 req.query.name으로 참조하라고 할 수도 있다.  // 지금은 미들웨어지만, 나중에 라우터라고 하는, 라우터 함수, 라우팅 함수를 등록할 때는, POST 방식으로 할 수도 있고, GET 방식으로 할 수도 있다. 이렇게 자꾸 바뀌는 경우가 있다. 그래서 이런 식으로 등록을 해 놓으면 좀 편하게 사용할 수가 있다.
    var paramId = req.body.id || req.query.id; // login.html 생성 후 paramName이 undefined 뜨지 않기 위해 id로 변경했다. body의 name이 아니라 id로 넣었기 때문이다. // 이런 형태로 파라미터를 확인할 수가 있는데, POST 방식인 경우 body 안에 요청 파라미터가 들어 있다.
    
    // res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Name -> ' + paramName + '</h3>');
    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Id -> ' + paramId + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});


// 웹 서버를 만들어 놓고, POST 방식으로 요청해서 어떻게 결과가 나오는지 봤다. // POST 방식으로 요청할 때는, 그냥 주소 표시줄에 입력하는 것만으로 요청 파라미터를 넘기기 힘들다. 그래서 postman이라고 하는 걸 이용해서 테스트 해 봤다. // postman을 가지고 일일이 테스트 해 볼 수 있지만, 바로 웹 브라우저에서 보이는 웹 페이지를 만들고, 웹 페이지에서 POST 방식으로 요청을 해서, 결과를 확인해 봐도 된다.
// public 폴더는 이미 외부에 오픈을 해 놓은 것이다.

// 이렇게 미들웨어를 같이 봤다. 미들웨어는 express 서버 객체인 app 객체에 use 메소드를 이용해서 등록할 수 있다. 미들웨어는 use를 여러 번 실행해서 순서대로 여러 개를 등록할 수 있다. 그런데 공통인 기능인 경우는 다른 사람들이 미리 만들어 놨다. 그래서 다른 사람들이 만들어 놓은 외장 모듈을 이용해서, 이렇게 등록할 수 있는데, 이것도 결국엔 어떤 기능을 실행하고 next로 넘겨 주는 것이다. 그래서 그 대표적인 것 중 하나가 POST 방식으로 넘겨 줄 때 요청 파라미터를 확인하는 방식은 GET 방식과 다른데, 그것을 해 주는 게 body-parser라는 게 있다는 것이다. 그래서 미들웨어로 body-parser를 등록해 주면, 요청이 들어 왔을 때 그 정보를 알아서 처리해 준다. 그 다음에 req 밑의 body 객체 안에 넣어 준다는 것이다. 그거를 이제 참조를 하면, POST 방식으로 보내왔을 때도 요청 파라미터를 확인할 수가 있다. 
// 지금까지 본 이 미들웨어는 기본적으로 웹 구성할 때 이렇게 여러 개 막 쓰인다. 이것보다 더 많이 쓰이게 된다. 그러다 보니까, 미들웨어는 클라이언트가 요청했을 때, 요청이 들어 왔을 때, 중간에 가로채서 필요한 기능을 수행해 주는 것이다. 이것을 꼭 기억해야 한다.
// 그러면 이렇게 클라이언트가 요청이 들어오면, 처리를 하고 필요하면 응답을 해 주고, 이거까지는 다 좋은데, 그러면 지금까지는 모든 요청을 다 공통으로 처리했다. 어떤 요청이 들어오든 이 안에 전부 다 첫 번째 미들웨어 앞에 있는 것을 거치고, 첫 번째 미들웨어를 거치고, 그 다음에 무조건 동일한 응답을 받았다. 그런데 실제 웹 서비스에서는 그렇지 않다. 만약 고객 리스트를 조회하고 싶다면 /list라는 요청 path를 보내고, 추가하고 싶다면 /add라는 요청 path를 보내고, 이런 식으로 다 다르다. 요청 path에 따라서, 요청 파라미터에 따라서 처리하는 방법이 다 다르다. 그러면 일단 요청 path에 따라서 달라지도록, 처리되는 함수가 달라지도록 만들고 싶다는 생각이 들 것이다. 그걸 해 주는 라우터라는 게 있다.
