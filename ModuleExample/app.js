// DatabaseExample의 app5.js 코드에서 데이터베이스에 해당하는 것만 분리한다.
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


// 암호화 모듈
var crypto = require('crypto');


// mongoose 모듈 사용
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

// 데이터베이스 관련된 것 : connectDB 메소드 안에 들어 있는 부분. // 그래서 이 부분을 데이터베이스 관련된 기능이라고 보고 이 부분 코드만 분리해 볼 것이다. 그러면 이렇게 데이터베이스 관련된 기능들이 한두 가지가 아닐 것이다. 그래서 ModuleExample 폴더 안에 database 폴더를 만든다. 이 안에는 데이터베이스 관련된 모듈 파일을 저장한다.
function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    // 이 부분이 모듈 파일에 정의한 코드를 호출하는 것으로 변경되어야 한다. // 그러면 그 모듈을 위에서 읽어온 다음에 여기서 호출해도 되고, 아니면 이 부분에 해당하는 저 모듈 파일을 불러와서 처리하는 부분을 별도의 함수로 분리해 볼 수도 있다. → 별도의 함수로 분리해 본다.
    database.on('open', function() {
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        createUserSchema(database); // 데이터베이스가 open된 상태가 되면 그때 createUserSchema 함수를 호출해 준다.
    });
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
}


// 함수로 정의
function createUserSchema(database) {
/*
    var user_schema = require('./database/user_schema'); // 모듈 파일을 읽어온다.
    var UserSchema = user_schema.createSchema(); // createSchema 함수를 호출하게 되면 UserSchema라는 스키마 객체가 만들어진다. 그거를 UserSchema 변수를 만들어서 할당할 수 있다.
*/
/*    
    // 줄여서 표현할 수 있다.
    var UserSchema = require('./database/user_schema').createSchema(mongoose); // require로 불러온 모듈이 결국 객체를 return 하게 되는데, 그거 .createSchema 함수를 바로 이어서 호출하는 것이다. // 여기에 mongoose 객체를 파라미터로 전달할 수 있다. // 그리고 UserSchema로 바로 return 받아서 할당할 수 있다. // UserSchema를 만든 다음에, 필요한 다른 모듈로 전달해 줘야 하는 경우도 있다. 그러다 보니까 이거를 UserSchema 변수로 별도로 만들지 말고, 파라미터로 전달받은 database에 속성으로 넣을 수 있다.
*/
    database.UserSchema = require('./database/user_schema').createSchema(mongoose); // 이게 결국에는 모듈로 정의한 user_schema를 불러와서 UserSchema 생성하는 코드를 불러와서 UserSchema 객체를 만든 다음에 database 안에 넣어 주는 방법이다.
    
    database.UserModel = mongoose.model('users3', database.UserSchema); // database 객체의 속성으로 할당해 준다.
    console.log('UserModel 정의함.');
}
// 데이터베이스 관련된 부분을 별도의 모듈 파일로 옮겼고, 별도의 모듈 파일로 분리시켰고, 분리된 모듈 파일을 require로 불러와서 UserSchema 객체가 그대로 생성되고, 그 다음에 UserModel 만드는 코드를 createUserSchema 함수로 분리시켰으므로 connectDB의 open에서는 그 함수만 호출하면 된다. // 그러면 app.js 자체는 코드 양이 더 줄었다. // 그 다음에 만약 데이터베이스 관련된 스키마 변경을 하고 싶다면, user_schema.js에 와서 변경하기 때문에 app.js는 수정될 일이 없다. // 이게 나중에 가면 훨씬 많은 장점을 가지게 된다. // 여기서 createUserSchema의 require 부분은 이 코드의 맨 위로 올려 줄 수도 있다. 어떻게 하는지에 따라서 조금씩 달라질 것이다. // 이렇게 해서 데이터베이스 부분을 한 번 분리해 봤다. // 조금 이따가 라우팅 함수 부분을 분리해 보도록 하겠다.


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
    
    if (database) {
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
            else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안 됨.</h1>');
                res.end();
            }
        });
    }
    else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
});


router.route('/process/addUser').post(function(req, res) {
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    if (database) {
        addUser(database, paramId, paramPassword, paramName, function(err, result) {
            if (err) {
                console.log('에러 발생.');
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
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안 됨.</h1>');
                res.end();
            }
        });
    }
    else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
});

router.route('/process/listuser').post(function(req, res) {
    console.log('/process/listuser 라우팅 함수 호출됨.');
    
    if (database) {
        UserModel.findAll(function(err, results) {
            if (err) {
                console.log('에러 발생.');
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
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
                res.end();
            }
        });
    }
    else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안 됨.</h1>');
        res.end();
    }
});


app.use('/', router);


var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    UserModel.findById(id, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0) {
            var user = new UserModel({id:id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            
            if (authenticated) {
                console.log('비밀번호 일치함.');
                callback(null, results);
            }
            else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        }
        else {
            console.log('아이디 일치하는 사용자 없음.');
            callback(null, null);
        }
    });
};


var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
        
    
    var user = new UserModel({"id":id, "password":password, "name":name});
    
    user.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
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
    
    connectDB();
});
