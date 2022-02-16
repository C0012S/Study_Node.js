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

// 암호화 모듈
var crypto = require('crypto');

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
            id: {type:String, required:true, unique:true, 'default':''},
            hashed_password: {type:String, required:true, 'default':''},
            salt: {type:String, required:true}, // 필수 속성
            name: {type:String, index:'hashed', 'default':''}, // default를 문자열로 했지만 문자열이 아니라 default 속성으로 추가해도 상관없다.
            age: {type:Number, 'default':-1},
            created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
            updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
        });
        console.log('UserSchema 정의함.');
        
        // 가상 속성 추가
        UserSchema
            .virtual('password')
            .set(function(password) {
                // this._password = password // 선택사항
                this.salt = this.makeSalt();
                this.hashed_password = this.encryptPassword(password);
                console.log('virtual password 저장됨 : ' + this.hashed_password);
            })
//            .get() // this._password = password 할 때 사용
        
        UserSchema.method('encryptPassword', function(plainText, inSalt) {
            if (inSalt) {
                return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex'); // sha1 알고리즘과 digest 알고리즘을 이용해서 암호화한다.
            }
            else {
                return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex'); // crypto 암호화 모듈 // 암호화하는 방법에 sha1 알고리즘과 digest 알고리즘이 있다. // salt 값을 뭘 넣어 주든 그게 일종의 시드 같은 역할을 하는 것이다. 이 값이 달라지면 암호화된 값도 달라지는 효과를 만들어 낸다.
            }
        }); // plainText : password 가상 속성으로 던져 준 값 // salt : salt에 따라서 암호화되는 값이 달라지게 만들기 위한 것이다.
        
        
        // method 함수를 이용해서 모델 인스턴스 객체에서 사용할 수 있는 함수들을 등록
        UserSchema.method('makeSalt', function() { // makeSalt : 특정한 값을 랜덤하게 하나 만들어 낸다.
            return Math.round((new Date().valueOf() * Math.random())) + '';
        });
        
        UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) { // hashed_password : 암호화되어서 저장된 값
            if (inSalt) {
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText, inSalt) === hashed_password;
            }
            else { // salt 값이 넘어오지 않은 경우, 데이터베이스에 저장된 salt 값을 쓴다.
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText) === hashed_password;
            }
        });
        
        UserSchema.static('findById', function(id, callback) { // findById 함수 등록 // 모델 객체에서 이 메소드 사용 가능
            return this.find({id:id}, callback); // UserScehma의 this. 실제로는 UserModel에서 사용된다.
        });
        
        /* 이렇게 사용할 수도 있다.
        UserSchema.statics.findById = function(id, callback) {
            return this.find({id:id}, callback); // this : 내부적으로 모델 객체를 참조한다고 볼 수 있다.
        }
        */
        
        UserSchema.static('findAll', function(callback) { // findAll 함수 등록 // 모델 객체에서 이 메소드 사용 가능
            return this.find({}, callback);
        });
        
        UserModel = mongoose.model('users3', UserSchema);
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

router.route('/process/listuser').post(function(req, res) {
    console.log('/process/listuser 라우팅 함수 호출됨.');
    
    if (database) {
        UserModel.findAll(function(err, results) {
            if (err) {
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (results) {
                console.dir(results);
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h3>사용자 리스트</h3>");
                res.write("<div><ul>");
                
                for (var i = 0; i < results.length; i++) {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("    <li>#" + i + " -> " + curId + ", " + curName + "</li>");
                }
                
                res.write("</ul></div>");
                res.end();
            }
            else {
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
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
});

app.use('/', router);

// Node.js는 비동기 방식 선호 // 함수로 분리하면 깊이가 깊어지는 코드 형태가 단순해진다.
var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨. : ' + id + ', ' + password);
    
    UserModel.findById(id, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0) {
            var user = new UserModel({id:id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password); // authenticated : 인증되었는지 True, False
            
            if (authenticated) {
                console.log('비밀번호 일치함.');
                callback(null, results);
            }
            else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        }
        else { // 아이디를 못 찾는 경우
            console.log('아이디 일치하는 사용자 없음.');
            callback(null, null);
        }
    });
}; // 별도의 함수를 정의해 데이터베이스를 다룬다.

var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨. : ' + id + ', ' + password + ', ' + name);
    
    var user = new UserModel({"id":id, "password":password, "name":name}); // 객체 생성 방식을 이용 // new 사용 : UserModel이 프로토타입으로 동작 // 한 명의 user 정보를 가진 객체를 만든 것이다.  // password가 가상 속성으로 추가되어 있기 때문에 그대로 사용할 수 있다.
    
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


// ch06-10
// 몽구스의 스키마 정의 // 모델 객체에서 find, 조회, 저장, update, 수정, 삭제가 가능하다.
// 그거를 실제 라우팅 함수에서 받으면, 데이터베이스 조작하는 함수를 별도로 분리해서 처리를 많이 했다. // 근데 그거를 static이라는 것으로 Schema를 정의할 때 추가하면 별도의 데이터베이스 처리하는 함수 없이 라우팅 함수에서 바로 처리할 수 있다. // 그래서 자주 사용하는 데이터베이스 조작 함수 같은 경우 static으로 등록하면 편리하게 사용할 수 있다.
// static으로 정의한 것 말고, 모델 인스턴스 객체에서 사용할 수 있는 방법도 있다. 메소드로 추가하면 된다.
// 모델 객체를 가지고 대부분 데이터 조작을 한다면, Schema에 static을 이용해서 메소드를 추가하는 게 훨씬 유용하다.
// Schema에 static으로 메소드 추가하는 방법을 봤다.
