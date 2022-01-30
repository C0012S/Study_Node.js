var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent'); // req 요청 객체에 header 메소드를 실행해서 헤더 정보 중 User-Agent 정보를 뽑아낸다. // 무엇을 얘기하는 거냐면, 아까 브라우저에서 왔다 갔다 하는 특정한 정보를 확인할 수가 있다고 했다. 그래서 클라이언트가, 이 웹 브라우저가 웹 서버로 요청하는 어떤 정보가 있다고 하면, 헤더 정보가 있다고 했다. Request Headers라는 게 있는데, 이게 웹 브라우저에서 요청이 들어가는 것이다. 거기 보면, 헤더 중에 User-Agent : 으로 된 정보가 있다. 이게(User-Agent) 헤더의 이름이 된다. 값이 실제 값이 된다. 헤더가 여러 가지가 있을 수 있는데, 그 중에 User-Agent를 뽑아 보는 것이다.
    var paramName = req.query.name; // req 요청 객체에서, 클라이언트가 요청한 요청 파라미터를 확인할 수가 있다. // 이전 장이나 노드에 대한 기본 기능을 알아 볼 때, 주소 표시줄에 들어가 있는 요청 파라미터를 구분하는 방법을 봤다. express나 http 이런 데에서 내부적으로 미리 처리해 주는 것이다. 그래서 요청 파라미터가 이미 구분된 것을 확인할 수가 있다. // name이라는 요청 파라미터가 있으면, 그거는 query라는 객체에 집어 넣어 주기 때문에 이렇게 확인할 수가 있다.
    
    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Name -> ' + paramName + '</h3>'); // 위에서 확인한 정보를 응답을 보낼 때 사용
});
// 경로는 상관없다. 미들웨어는 전부 받기 때문이다. 요청 path는 상관없고, 요청 파라미터를 name=mike로 해서 localhost:3000/?name=mike로 접속한다.  // 결국에는 서버 쪽에서 클라이언트가 보내온 데이터를 확인할 수도 있고, 헤더를 확인할 수도 있다는 것이다. 그 헤더에서 User-Agent는 굉장히 중요한 역할을 한다. 요즘에는 모바일 단말에서 보낼 때도 많으니까, 모바일 단말에서 보낸 것인지, PC 브라우저에서 요청을 보낸 것인지에 따라서 다른 처리를 해 주게 되는 경우가 있다. 그래서 그런 경우마다 다르게 처리해 줄 수 있다는 것을 생각하면 된다.

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
