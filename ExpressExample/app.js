var express = require('express'); // express 모듈 - 미리 설치된 것은 아니므로 npm install을 이용해서 express를 설치해야 한다. // express 외장 모듈에서 로딩되면서 return 하는 객체가 있다. 그걸 express로 받아 본다. // express는 http 모듈을 내부적으로 사용하게 된다.
var http = require('http');

// http를 가지고 바로 실행하는 형태는 아니다.
var app = express(); // express 모듈을 로딩해서 나오는 객체를 함수로 실행한다. express를 함수로 실행한다. // app는 express 객체가 된다. express 서버 객체라고 할 수 있다.

app.set('port', process.env.PORT || 3000); // express 서버 객체에 포트를 설정한다. // port 속성을 설정한다. 이는 express에서 미리 정해 놓은 것이다. 웹 서버가 실행될 때 포트를 어디로 할 건지 정해 놓은 것이다. // process.env.PORT - 환경 변수의 PORT를 설정했다면 그걸 사용하고, 그렇지 않으면(앞의 값이 undefined나 값이 없다고 하면) 뒤에 있는 걸(3000) 사용하게 된다. // 즉, PORT라는 환경 변수, 시스템 환경 변수 말고 그냥 환경 변수가 될 것이다. 그러면 그 환경 변수에 들어간 포트 정보를 이용해서 실행이 될 것이다. 그렇지 않으면 3000이라는 포트를 사용한다. 지금은 3000이 사용될 것이다. // 포트 정보를 설정하는 방법에 차이가 있다.  // port가 미리 정해졌다고 했는데, 미리 정해진 게 아니라 속성을 정하는 것이다. → set 메소드를 사용하면서 port라는 속성을 설정한 것이다. // 미리 정해진 속성이 아니라 지정한 속성이다.

var server = http.createServer(app).listen(app.get('port'), function() { // 콜백 함수는 웹 서버가 실행됐을 때 호출된다. // 위에서 설정한 port 속성을 가져온다.
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
}); // createServer 함수를 실행해서 서버 객체 생성 // createServer로 만들 때, app 객체를 파라미터로 넘겨 주면 express를 이용해서 웹 서버를 만드는 게 된다. 그리고 listen은 동일하게 해 준다.
// 실행하기 전 프롬프트에서 npm install express --save로 외장 모듈을 설치한다.
// 이렇게 하고 웹 브라우저를 실행해서 접속해 보면 반응이 없다. // 반응이 없는 이유는, 이 응답을 보내 주는 코드가 들어가 있지 않기 때문이다. // http를 이용해서 웹 서버를 만들었을 때와 별반 차이가 없다. 그리고 코드의 양도 그렇게 많이 늘어나지 않았다.
// 이 상태에서 express라는 걸 이용해서 다양한 기능을 붙일 수 있다고 생각하면 된다.
// 여기까지 보니까, express를 이용해서 웹 서버를 실행하는 것도 http를 이용해서 하는 것과 크게 다르지 않다는 걸 이해할 수 있다.
