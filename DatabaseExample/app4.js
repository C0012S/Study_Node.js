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
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function() {
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        UserSchema = mongoose.Schema({
            id: {type:String, required:true, unique:true}, // unique:true - id 값은 고유한 값으로 해서 반드시 들어가야 한다.
            password: {type:String, required:true},
            name: {type:String, index:'hashed'}, // index : name에 index를 추가함으로써 name으로 검색하겠다는 목적 // hashed 방식으로 index를 만든다.
            age: {type:Number, 'default':-1},
            created_at: {type:Date, index:{unique:false}, 'default':Date.now()}, // Date.now : 현재 시간을 자동으로 생성해서 넣어 준다. // created_at을 값을 안 넣어도 자동으로 만들어 준다.
            updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
        });
        console.log('UserSchema 정의함.');
        
        UserSchema.static('findById', function(id, callback) {
            return this.find({id:id}, callback); // this : UserSchema의 this // 실제로 쓰는 건 UserModel에서 사용이 된다.
        }); // findById 이름으로 함수 등록하면 모델 객체에서 사용할 수 있다.
        
        /*
        UserSchema.statics.findById = function(id, callback) {
            return this.find({id:id}, callback); // 함수를 호출한 객체가 this로 참조된다. // this가 UserSchema일 필요없다.
        }
        */ // 이런 형태로 사용할 수도 있다.
        
        UserSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });
        
        
        UserModel = mongoose.model('users2', UserSchema); // 기존의 users 컬렉션의 스키마가 달라서 users2 컬렉션이 만들어지도록 변경
        console.log('UserModel 정의함.');
    });
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
}


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
            if (results[0]._doc.password == password) {
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

// 몽구스의 스키마를 정의하고 모델 객체에서 find, 조회, 업데이트, 삭제가 가능하다. // 이거를 실제 라우팅 함수에서 받으면 데이터베이스 조작하는 함수를 별도로 분리해서 처리를 많이 했다. // 스키마를 정의할 때 static으로 추가하면 별도의 데이터베이스 처리 함수 없이 라우팅 함수에서 바로 처리할 수 있어 좀 더 편리한 방법이 될 수 있다. // 자주 사용하는 데이터베이스 조작 함수 같은 경우 static으로 등록하면 좀 더 편리하게 사용할 수 있다.
// static으로 정의한 것 말고, 모델 객체가 아니라 모델 인스턴스 객체에서 사용할 수 있는 방법도 있다. - 메소드로 추가하면 된다.
// 모델 객체에서 사용하는 것만으로 웬만큼 처리는 된다. // 모델 객체를 가지고 대부분 데이터 조작을 한다고 보면, 스키마에 static을 이용해서 메소드 추가하는 게 훨씬 유용하다고 생각할 수 있다.
// 여기까지 스키마에 static을 이용해서 메소드 추가하는 방법이다. // 조금 이따가 비밀번호를 암호화 해서 넣는 방법을 알아본다.


// static 방식으로 스키마에 메소드를 정의하면, 모델이라는 객체에서 사용할 수 있다.
