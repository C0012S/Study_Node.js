// ch06-01 MongoDB 설치 & 실행
// mongod --dbpath /Users/user/database/local
// mongo  // use local

// ch06-02 익스프레스에서 몽고디비 사용하기
// 모듈 설치 - npm init으로 설정 후, express, http, path, body-parser, cookie-parser, express-session, express-error-handler 설치
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser'); // body-parser : POST 방식으로 요청할 때 요청 파라미터를 처리하기 위한 모듈
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 예외(Exception, Error) 처리를 위한 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongodb 모듈 사용
var MongoClient = require('mongodb').MongoClient;

var database;

// connectDB : MongoDB
function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    MongoClient.connect(databaseUrl, function(err, client) {
        if (err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.log(err); // 에러 출력
            return;
        }
        
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        database = client.db("local"); // 정상적으로 연결되었다면 database 변수에 파라미터로 전달받은 db 객체를 할당
    });
} // connectDB 메소드를 호출하면 MongoDB 쪽에 연결된다.

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false})); // use 메소드를 이용해서 미들웨어 등록
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
    
    if (database) { // database가 있다면
        authUser(database, paramId, paramPassword, function(err, docs) {
            if (err) {
                console.log('에러 발생');
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
            else {
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안 됨.</h1>');
                res.end();
            }
        });
    }
    else { // connect가 안 된 경우
        console.log('에러 발생');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    // 데이터베이스 처리
    if (database) {
        addUser(database, paramId, paramPassword, paramName, function(err, result) {
            if (err) {
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (result) {
                console.dir(result);
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' + paramName + '</p></div>');
                res.end();
            }
            else {
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안 됨.</h1>');
                res.end();
            }
        });
    }
    
    else {
        console.log('에러 발생');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
}); // POST 방식으로 처리

app.use('/', router);

// Node.js는 비동기 방식 선호 // 함수로 분리하면 깊이가 깊어지는 코드 형태가 단순해진다.
var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨. : ' + id + ', ' + password);
    
    var users = db.collection('users');
    
    users.find({"id":id, "password":password}).toArray(function(err, docs) { // docs : 결과 문서 객체 - 하나의 레코드와 같다.
        if (err) {
            callback(err, null); // 두 번째 파라미터는 정상일 경우 데이터를 넘기기 위한 목적
            return;
        }
        
        if (docs.length > 0) { // 문서 객체가 여러 개인 경우
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs); // docs : 결과 값
        }
        else {
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null); // 에러가 아니지만 docs의 내용이 없다.
        }
    }); // 검색한 결과를 찾아서 배열로 바꾼다.
}; // 별도의 함수를 정의해 데이터베이스를 다룬다.

var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨. : ' + id + ', ' + password + ', ' + name);
    
    var users = db.collection('users'); // users collection 참조
    
    users.insertMany([{"id":id, "password":password, "name":name}], function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        
        if (result.insertedCount > 0) {
            console.log('사용자 추가됨. : ' + result.insertedCount);
            callback(null, result);
        }
        else {
            console.log('추가된 레코드가 없음.'); // = 문서 객체가 없다.
            callback(null, null);
        }
    });
};

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
    
    connectDB(); // 데이터베이스 연결
});

// Robomongo 다운로드 및 설치 - 데이터를 UI로 보여 준다.
// Document를 수정할 수도 있고, 테이블 형태와 텍스트 형태로 볼 수도 있고, 로그를 볼 수도 있다.
