var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


var mysql = require('mysql'); // mysql 외장 모듈

// mysql의 connection, 데이터베이스 연결을 만들어서 할 수도 있는데, 실제로 실무에서 쓰려고 하면 풀링을 한다. 풀링은 연결을 계속 만들게 되면 만들고 닫고, 만들고 닫고, open 하고 다 쓰고 나면 close를 꼭 해 줘야 한다. 왜냐하면 connection 수는 리소스를 많이 사용하기 때문에 제한이 많다. 그래서 connection은 한정되어 있어 풀을 만들어서 그 풀 안에 10 개면 10 개만 넣어 놓는다. 내가 갖다 쓰고, 다시 풀에 넣어 주면 재사용이 된다. 성능 면에서도 좋고 여러 가지 장점이 있어 대부분 풀을 사용한다.
var pool = mysql.createPool({
    // 설정 정보
    connectionLimit:10, // 10 개가 만들어지면 더 이상 만들어지지 않고 재사용한다.
    host:'localhost',
    user:'root',
    password:'',
    database:'test',
    debug:false
}); // pool 객체를 이용해서 데이터베이스를 연결하고 SQL 문을 실행할 수 있게 된다. // pool 객체를 만들었고, 데이터베이스를 연결해서 처리하는 과정은 addUser와 authUser가 있었다. 그런 과정은 MySQL의 pool 객체를 이용해서 처리할 것이다.


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


app.use('/', router);


var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    var users = db.collection('users');
    
    users.find({"id":id, "password":password}).toArray(function(err, docs) {
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
