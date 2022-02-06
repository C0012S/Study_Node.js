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

function connectDB() { // connectDB는 mongoDB를 얘기한다.  // mongoDB 연결 오류로 인해 코드 수정
//    var databaseUrl = 'mongodb://localhost:27017/local'; // 27017 포트로 대기 // local : local database로 접속하기 위한 URL 정보
//    var databaseUrl = 'mongodb://localhost:27017';
//    var databaseUrl = 'mongodb://127.0.0.1:27017';
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
//    MongoClient.connect(databaseUrl, function(err, db) {
    MongoClient.connect(databaseUrl, {useNewUrlParser:true}, function(err, client) {
        if (err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.log(err);  // 에러 출력
            return;
        }
        
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
//        database = db;
        database = client.db("local");
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


router.route('/process/login').post(function(req, res) {
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
    // 이 정보를 가지고 사용자가 데이터베이스의 users 컬랙션(테이블) 안에 들어가 있는지 확인
    if (database) { // 데이터베이스가 있다면
        authUser(database, paramId, paramPassword, function(err, docs) {
            if (err) {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (docs) {
                console.dir(docs);
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>')
                res.end();
            }
            else { // docs가 null 값일 때 = 데이터가 하나도 없다는 뜻이다.
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안 됨.</h1>');
                res.end();
            }
        });
    }
    else { // connect가 안 된 경우
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
});


app.use('/', router);


var authUser = function(db, id, password, callback) { // 별도의 함수를 정의해서 데이터베이스를 다루도록 했다. // 사용자가 브라우저에서 요청하는 브라우저 요청 정보를 파라미터로 받아서 처리하는 라우팅 함수가 필요한데, 거기서 authUser를 쓸 것이다.
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    var users = db.collection('users'); // 명령 프롬프트에서 users 컬랙션을 만들었다. collection 함수로 그 컬랙션을 참조할 수 있게 된다.
    
    users.find({"id":id, "password":password}).toArray(function(err, docs) { // docs : 결과 문서 객체 // document : 하나의 레코드와 같다.
        if (err) {
            callback(err, null); // err : 에러 객체 // null : 정상일 경우 데이터를 넘기기 위한 목적
            return;
        }
        
        // 에러가 발생하지 않았다면
        if (docs.length > 0) { // 문서 객체가 여러 개인 경우
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        }
        else { // 못 찾았을 때
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null); // 첫 번째 파라미터에 에러 객체를 직접 만들어서 넣어 줄 수도 있다. // 첫 번째 파라미터가 null이면 에러가 아님을 볼 수 있다. // 에러가 아니지만 docs의 내용이 없다.
        }
    }); // find 안에 객체를, 객체 안에 찾고자 하는 정보를 넣어 준다. // toArray : 검색한 결과가 나오면 배열로 바꿔 준다.
};


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
