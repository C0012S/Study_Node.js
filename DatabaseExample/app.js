// ch06-01 MongoDB 설치  // ch06-02 익스프레스에서 몽고디비 사용하기
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler'); // npm install express-error-handler --save로 외장 모듈 설치

// mongodb 모듈 사용
var MongoClient = require('mongodb').MongoClient; // npm install mongodb --save로 외장 모듈 설치

var database;

function connectDB() { // connectDB는 mongoDB를 얘기한다.
    var databaseUrl = 'mongodb://localhost:27017/local' // 27017 포트로 대기 // local : local database로 접속하기 위한 URL 정보
    
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            return;
        }
        
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        database = db;
    });
} // connectDB 메소드를 호출하면 mongoDB라는 쪽에 연결된다.


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


var router = express.Router();


app.use('/', router);

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
    
    connectDB(); // 데이터베이스 연결은 일반적으로 웹 서버 실행이 정상적으로 되면 그 다음에 데이터베이스 연결이 필요할 수 있다. // 웹 서버가 실행되기 전에 데이터베이스 먼저 연결해도 상관은 없다. // 웹 서버가 실행되는 상태를 확인하고 데이터베이스를 연결하고 싶다면, 여기서 connectDB를 호출하면 된다.
});

// 데이터베이스를 이용해서 로그인 기능을 하나 만들고 싶다면? 요청을 받는 라우팅 함수를 만든다. 그 라우팅 함수에서 호출해서 사용할 수 있는 함수를 별도로 만드는 게 좀 더 명확해진다. // Node.js가 비동기 방식을 선호한다. // 깊이가 깊어지는 일부를 함수로 분리시키면, 깊이가 깊어지는 게 코딩 형태가 좀 더 단순해진다. // 그래서 별도의 함수로 분리하는 게 좋다. // → 별도의 로그인 함수를 만들고, 그 로그인 함수를 호출하는 라우팅 함수를 만든다. // 그렇게 하면, 데이터베이스를 연결해서 웹 브라우저에서 요청한 사용자 정보가 맞는지 확인할 수가 있다.
