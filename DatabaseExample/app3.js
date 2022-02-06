var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongoose 모듈 사용
var mongoose = require('mongoose'); // npm install mongoose --save로 외장 모듈 설치

var database;
var UserSchema; // UserSchema를 다른 데에서도 쓰고 싶어 위에서 먼저 선언한다.
var UserModel;

function connectDB() { // mongoose를 사용하는 방식으로 변경
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function() { // open 이벤트가 발생했을 때, 연결이 되었는지 확인하고 스키마와 모델 객체를 만들어 준다.
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        UserSchema = mongoose.Schema({ // users 위한 테이블
            id: String,
            name: String,
            password: String
        }); // Schema 객체 return
        console.log('UserSchema 정의함.'); // 스키마를 정의했다. // 스키마 객체를 만들었다는 의미도 된다.
        
        UserModel = mongoose.model('users', UserSchema); // users : 기존의 users collection // 위에서 정의한 UserSchema와 실제 collection 이름을 users라고 해서 서로 연결해 준다. 그게 실제 모델이 된다.
        console.log('UserModel 정의함.'); // 객체를 생성했다는 얘기다.
    }); // on : 이벤트가 발생했을 때 처리할 함수를 설정 // open : 데이터베이스 연결되었을 때 호출  // open 이벤트가 발생했을 때 연결된다는 뜻이다.
    
    database.on('disconnected', function() { // 연결이 끊어졌을 때, 5 초 후에 다시 연결할 수도 있다. - 실제 실무에서 연결 끊어졌을 때 다시 시도하는 걸 볼 수 있다. // 여기서는 그냥 연결 끊어짐만 출력한다.
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
} // 연결


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


app.use('/', router);


var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    
    UserModel.find({"id":id, "password":password}, function(err, docs) {
        if (err) {
            callback(err, null);
            return;
        }
        
        if (docs.length > 0) {
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        }
        else {
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    }); // mongoDB 사용할 때와의 차이점 : users collection을 참조하는 게 아니라 UserModel에서 find를 한다.
};


var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
        
    
    var user = new UserModel({"id":id, "password":password, "name":name}); // new 객체 생성 방식을 사용해서 UserModel이 프로토타입으로 동작
    
    user.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user); // user 객체 안에 정보가 들어 있을 것이다.
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

// mongoose를 이용해서, 로그인을 위해서 해당하는 아이디와 패스워드가 정상적으로 매칭되는 게 있는지 확인하고 로그인이 정상적으로 됐는지와 안 됐는지를 구분하는 것과 데이터를 추가하는 방법을 봤다.
// UserSchema와 UserModel을 사용한다. UserSchema는 테이블을 정의하는 것과 비슷하다. UserModel에서는 데이터를 조작하는데, 새로운 객체를 추가할 때는 new UserModel을 이용해서 새로운 객체를 만든 다음에 그거로 save를 한다. // UserModel에 find를 하는 방법과 조금 다르긴 하지만, 그런 방법들을 사용할 수 있다.
// mongoose로 대체해 봤다.
// mongodb 모듈을 사용하면 그 안에 다양한 형태의 객체가 들어갈 수 있는데, 그것도 document(문서) 객체 안에 들어가는 데이터의 속성을 정해 놓고 쓰면 문제는 없다. 그런데 mongoose가 여러 가지 다양한 다른 기능을 더 추가해서 제공할 수 있으므로 mongoose를 쓰는 것도 나쁘지 않다.
// 추가로 더 스키마를 만들 때, index를 정의하거나 또는 메소드를 정의해서 편리하게 사용하는 방법을 같이 볼 것이다.
