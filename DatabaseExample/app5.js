var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


// 암호화 모듈 // 암호화를 위한 가장 기본적인 기능이 외장 모듈로 만들어져 있다.
var crypto = require('crypto'); // crypto : 암호화를 도와 주는 모듈


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
            id: {type:String, required:true, unique:true, 'default':''},
            hashed_password: {type:String, required:true, 'default':''},
            salt: {type:String, required:true},
            name: {type:String, index:'hashed', 'default':''}, // default를 문자열이 아니라 그냥 default 속성으로 추가해도 상관없다.
            age: {type:Number, 'default':-1},
            created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
            updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
        });
        console.log('UserSchema 정의함.');
        
        UserSchema
            .virtual('password') // password 속성 사용 // 실제 데이터베이스에 저장되는 것은 아니다.
            .set(function(password) {
                // this._password = password // hashed_password를 써서 return 할 수 있으면 되는데, password라는 것을 그대로 get이라는 게 호출되었을 때 원래의 password를 그대로 던져 주겠다고 하면 _password를 추가할 수 있다. // 이것은 선택적인 것이다. // 단방향 암호화를 사용하는 경우, 원본 password를 남겨 둘 이유가 없다. // 이런 식으로 password를 저장해 뒀다가 다시 빼는 거는 실제로는 안 해도 상관없다. // get을 쓸 경우, get에 줄 게 없기 때문에 그런 게 되겠다. // get을 아예 빼고 password 저장 식을 빼도 된다.
                this.salt = this.makeSalt();
                this.hashed_password = this.encryptPassword(password); // encryptPassword 메소드 : 암호화를 하는 메소드
                console.log('virtual password 저장됨 : ' + this.hashed_password);
            })
            // .get() // password를 저장하는 코드를 빼면 .get() 코드도 같이 뺄 수 있다.
        
        // method 함수를 사용하면 모델 인스턴스 객체에서 사용할 수 있다. // 위의 UserSchema에서 encryptPassword, makeSalt를 사용하고(정의되어) 있으므로 이를 모델 인스턴스 객체에서 쓸 수 있는 method로 추가해 본다. // method 함수 또는 method 객체의 속성으로 추가하면 된다.
        UserSchema.method('encryptPassword', function(plainText, inSalt) {
            if (inSalt) {
                return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex'); // sha1 : encrypt 방법 // sha1 알고리즘과 digest 알고리즘을 이용해서 암호화를 하겠다.  // crypto 암호화 모듈이 있고, 암호화하는 방법에서 sha1 알고리즘과 digest 알고리즘이 있다. 그것을 지금 구현하는 것이다.
            }
            else {
                return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex'); // salt 값에 무엇을 넣어 주든, 그게 일종의 시드 같은 역할을 한다. 이 값을 이용해서 이 값이 달라지면, 암호화 된 값도 달라지는 효과를 만들어 낸다.
            }
        }); // plainText : password 가상 속성으로 던져 준 값이다. // salt라는 값을 받으면 salt에 따라서 암호화 되는 값이 달라지게 만들기 위한 것이다.
        
        UserSchema.method('makeSalt', function() {
            return Math.round((new Date().valueOf() * Math.random())) + ''; // Math.round에 문자열로 변환하기 위해서 ''를 붙여 준다.
        }); // makeSalt : 특정한 값을 랜덤하게 하나 만들어 내겠다는 것이다. 그래서 결국에는 매번 이 salt를 사용하게 되면, 매번 그 값이 새로운 값으로 만들어진다. // makeSalt를 하게 되면, salt가 계속 바뀌어서 만들어지므로 다른 값들이 계속 나오겠다는 것을 알 수 있다. // salt를 처음에 주지 않으면 makeSalt를 해서 전해 주면 그걸 가지고 처리할 것이고, DB에 저장된 salt를 가지고 사용하는 형태가 될 것이다.
        
        UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) { // plainText, inSalt, hashed_password 값을 가지고 비교한다. // hashed_password : 암호화 되어서 저장된 값
            if (inSalt) { // salt 값이 넘어온 경우
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText, inSalt) === hashed_password // 암호화를 한 게 실제 데이터베이스에 저장된 hashed_password와 같은지를 비교한다.
            }
            else { // salt 값이 넘어오지 않은 경우 → 데이터베이스에 저장된 salt 값을 쓰겠다. 그러면 한 번 암호화 되어서 저장되면서 salt 값을 같이 넣은 경우, 그거를 가지고 비교할 수 있다.
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText) === hashed_password;
            }
        });
        // 이렇게 하면, method 함수를 이용해서 모델 인스턴스 객체에서 사용할 수 있는 함수들을 등록한 게 된다.
        // id, name 값이 빈 경우가 있으면 문제가 생긴다. → pass 함수를 이용하고 validate 함수를 이용해서 값이 없는지, 있는지, 값의 유효성 검사 작업을 한다.
        // virtual로 가상 속성을 추가했고, 모델 인스턴스 객체에서 사용할 수 있는 authenticate 메소드를 추가했다.
        
        
        UserSchema.static('findById', function(id, callback) {
            return this.find({id:id}, callback);
        });
        
        /*
        UserSchema.statics.findById = function(id, callback) {
            return this.find({id:id}, callback);
        }
        */ // 이런 형태로 사용할 수도 있다.
        
        UserSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });
        
        
        UserModel = mongoose.model('users3', UserSchema);
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
    
    UserModel.findById(id, function(err, results) { // 사용자 정보(id, password)를 가지고 인증하는 코드가 들어가 있다. // 인증하는 코드에서 먼저 id를 가지고 찾는다.
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0) {
            var user = new UserModel({id:id}); // 모델 인스턴스 객체에서 사용할 수 있는 authenticate 메소드를 스키마 정의 후 추가했으므로, 인스턴스 객체를 하나 만들어 본다.
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password); // authenticate 메소드가 정의되어 있으므로 호출할 수 있다. // results 안의 _doc 안에 속성이 들어가 있다. salt 안에 저장된 salt 정보가 있다. // hashed_password(데이터베이스에 저장된 암호화 된 password)를 넘겨 주면, 사용자가 입력한 password가 일치하는지를 가지고 authenticated를 넘겨 준다.  // authenticated는 값이 인증됐다, 아니다로 true, false가 될 것이다. → 비밀번호 일치하거나 일치하지 않는 상황들을 구분할 수 있다.
            
            
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


var addUser = function(db, id, password, name, callback) { // password가 virtual 속성으로 추가되어 있기 때문에 여기서 쓸 때는 전혀 문제가 없다.
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
        
    
    var user = new UserModel({"id":id, "password":password, "name":name}); // id, password, name 그대로 적용된다. 근데 실제 있는 속성은 아니다. 그래서 실제 데이터베이스의 속성이 있어서 이런 게 아니라, 가상 속성으로 추가되어 있기 때문에 그대로 사용할 수 있다.
    
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

// 이런 방법을 통해서 비밀번호를 암호화해서 집어 넣고, 로그인 할 때 입력된 패스워드를 가지고 암호화해서 비교하는 방법을 같이 봤다.
// 그래서 virtual를 사용하지 않고 암호화만 정상적으로 하면 상관없다. 정상적으로 해서 실행이 되게 만들어 주면 된다. 그러다 보니까 virtual 가상 속성을 안 만들어도 상관없다. 이렇게 만들 수도 있다 정도를 생각하면 된다.
// 일단 암호화를 통해서 비밀번호를 암호화한 다음에 저장할 수도 있다.
// 이렇게 virtual 함수를 사용하는 방법을 같이 봤고, crypto 모듈을 이용해서 암호화하는 과정도 같이 봤다.
// 여기까지 몽고디비를 사용하는 방법 즉, 몽구스 모듈을 이용해서 사용하는 방법까지 같이 봤다. // 이렇게 하면 몽고디비를 어느 정도는 조작할 수 있다. 웹 서버에서 데이터베이스에 저장, 조회, 그 다음에 필요하면 업데이트를 할 수도 있고, 삭제할 수도 있다. 근데 실제 실무에서는, 클라우드에 올리는 경우 몽고디비를 사용하는 경우가 많이 있고, 그렇지 않다고 하면 국내에서는 mySQL이나 오라클이나 이런 관계형 데이터베이스를 바로 연결하는 경우가 상당히 많다. 그래서 그게 훨씬 더 많다고 할 수 있다. 왜냐하면 기존에 그렇게 만들어져 있으니까. 그래서 이미 만들어져 있는 관계형 데이터베이스를 연결하는 방법을 같이 볼 것이다.


// virtual 메소드를 이용해서 가상 속성 password를 정의하고, 실제 데이터베이스에서는 hashed_password column으로 저장되도록 했다.
