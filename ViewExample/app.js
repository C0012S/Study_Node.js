var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


// user 모듈 사용
var user = require('./routes/user');


// config.js 모듈 파일을 불러온다.
var config = require('./config');

var database_loader = require('./database/database_loader');
var route_loader = require('./routes/route_loader');


// 암호화 모듈
var crypto = require('crypto');


var app = express();

app.engine('ejs', require('ejs').__express); // Brackets에서는 실행되나 프롬프트나 VS Code의 터미널에서는 ejs 모듈을 설치해도 Error: Cannot find module 'ejs'가 떠서 추가 → 추가하니 실행 잘 된다.
app.set('views', __dirname + '/views'); // __dirname : 현재 폴더 // views 폴더를 만든다면 views 폴더가 뷰 템플레이트를 저장할 폴더로 지정된다.
app.set('view engine', 'ejs'); // ejs 타입의 뷰 템플레이트들을 만들겠다.  // npm install ejs --save 명령으로 ejs 외장 모듈 설치
// views 폴더 안에 로그인 했을 때의 결과 값을 보여 줄 정보를 넣어 보도록 한다.


console.log('config.server_port -> ' + config.server_port);
app.set('port', config.server_port || 3000);

app.use('/public', static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


route_loader.init(app, express.Router());


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


var server = http.createServer(app).listen(app.get('port'), function() { 
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
    
    database_loader.init(app, config);
});
