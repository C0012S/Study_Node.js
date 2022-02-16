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

// mongoose 모듈 사용
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

// connectDB : MongoDB  // mongoose를 이용한 MongoDB 데이터베이스 연결
function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl); // 연결
    database = mongoose.connection;
    
    // 이벤트로 언제 연결되었는지 확인
    database.on('open', function() {
        console.log('데이터베이스에 연결됨. : ' + databaseUrl);
        
        // 데이터베이스가 연결되었다면 Schema 정의
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        console.log('UserSchema 정의함.');
        
        UserModel = mongoose.model('users', UserSchema);
        console.log('UserModel 정의함.'); // 객체를 생성했다는 얘기
    }); // open 이벤트 발생했을 때 연결된다.
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.'); // 데이터베이스 연결이 끊어졌을 때 5 초 후에 다시 연결할 수도 있다.
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
} // connectDB를 mongoose를 사용하는 방식으로 변경
// mongoose를 사용할 때 이벤트를 가지고 on 메소드를 써서 open 이벤트가 발생했을 때 연결이 되었는지 확인하고, 스키마와 모델 객체를 만들어 준다.

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
    
    UserModel.find({"id":id, "password":password}, function(err, docs) {
        if (err) {
            callback(err, null);
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
    }); // mongodb와 mongoose는 find로 검색하는 과정이 거의 똑같다. mongoose는 users collection을 참조하는 게 아니라 UserModel에서 find를 한다.
}; // 별도의 함수를 정의해 데이터베이스를 다룬다.

var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨. : ' + id + ', ' + password + ', ' + name);
    
    var user = new UserModel({"id":id, "password":password, "name":name}); // 객체 생성 방식을 이용 // new 사용 : UserModel이 프로토타입으로 동작 // 한 명의 user 정보를 가진 객체를 만든 것이다.
    
    user.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    }); // 위에서 만든 정보를 그대로 저장 // 저장이 정상적으로 되었는지는 callback 함수로 받을 수 있다.
};
// authUser, addUser 수정 = 데이터베이스 접근하는 코드 변경

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
    
    connectDB(); // 데이터베이스 연결
});

// Robomongo 다운로드 및 설치 - 데이터를 UI로 보여 준다.
// Document를 수정할 수도 있고, 테이블 형태와 텍스트 형태로 볼 수도 있고, 로그를 볼 수도 있다.


// UserSchema와 UserModel을 사용 // UserSchema는 테이블을 정의하는 것과 비슷하다. // UserModel에서 데이터를 조작한다. // 새로운 객체를 추가할 때는 new UserModel로 해서 새로운 객체를 만든 다음에 그거로 save를 한다. 
// UserModel에 find를 하는 것과 좀 다르긴 하지만 이런 방법들을 사용하는 게 mongoose다.
// mongodb 모듈을 사용하면 그 안에 객체가 다양한 형태로 들어갈 수 있다. 그것도 document 문서 객체 안에 들어가는 데이터의 속성을 정해 놓고 쓰면 문제는 없다.
// mongoose가 여러 가지 다양한 다른 기능을 추가해서 제공할 수 있으니까 mongoose를 쓰는 것도 나쁘지 않다.
// 추가로 더 Schema를 만들 때, 인덱스를 정의하거나 또는 메소드를 정의해서 편리하게 사용하는 방법을 볼 것이다.
