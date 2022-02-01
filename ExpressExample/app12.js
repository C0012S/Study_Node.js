var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); // 세션은 쿠키를 같이 사용한다.
var expressSession = require('express-session');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({ // 객체를 넣는다. // 세션에 대한 설정 정보가 들어간다. // 세션은 서버 쪽에 저장된다. - 파일로 저장하든가 Redis(레디스) 메모리 데이터베이스에 저장할 수도 있다. 저장할 때, 만약 파일이라고 하면 저장할 파일을 미리 만들어 놓고 저장할 정보를 나중에 넣을 것인지, 저장할 정보를 아예 안 만들어 놓고 저장할 정보가 생겼을 때 파일을 만들 것인지, 이런 정보가 옵션으로 설정된다. 이 secret라는 키 정보를 이용해서 그런 정보를 관리하게 된다.
    secret:'my key',
    resave:true,
    saveUninitialized:true
})); // expressSession을 미들웨어로 등록  // 이렇게 하면 세션을 사용할 수 있는 상태가 된다.


var router = express.Router();

router.route('/process/product').get(function(req, res) {
    console.log('/process/product 라우팅 함수 호출됨.');
    
    if (req.session.user) { // 세션 정보는 쿠키를 썼던 거와 별반 다르지 않다. 그래서 세션을 설정할 수 있고, 필요하면 그 설정한 정보를 확인할 수가 있다. 그 정보들은 req의 session에 들어가 있다. 쿠키 같은 경우는 req의 요청 객체 안에 cookies 안에 들어가 있었다. 세션은 session에 들어가 있다. // 확인하는 거는 req 객체 안에서 확인한다. 근데 cookies와 session을 확인한다. // 나중에 session에 user를 넣을 것이다. - 로그인을 정상적으로 하게 되면, 그걸 한 번 확인해 볼 것이다. - 상품 페이지에서 user가 있으면 로그인이 되었다고 보자는 것이다.
        res.redirect('/public/product.html'); // 로그인이 되었다고 보면, public 안의 product.html로 이동한다.
    }
    else { // 로그인이 안 되어 있으면
        res.redirect('/public/login2.html'); // /public/login2.html로 이동
    }
}); // 상품 페이지가 로그인이 안 되어 있으면 볼 수 없게 만들겠다는 것이다. 그러면 로그인 페이지로 이동한다. 로그인이 되어 있는지, 안 되어 있는지는 어떻게 이해하냐면, session 안의 user 정보가 있는지 보겠다는 것이다.  // → 로그인 하는 과정을 조금 이따 같이 본다.


router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    
    res.cookie('user', {
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 라우팅 함수 호출됨.');
    
    res.send(req.cookies);
});


app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>');
});

var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});
