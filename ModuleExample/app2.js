// app.js를 복사해서 가져온다. // app2.js에서 설정 정보를 분리한다. 
// 설정이 들어가는 파일의 이름은 config.js라고 하는 이름으로 만들 것이다. // config.js는 책에 있는 것처럼 그냥 메인 파일, app2.js와 동일한 폴더 안에 넣어도 되고, config 폴더를 만들고 그 안에 넣어도 된다. 왜냐하면 설정이 지금 만들고자 하는 app.js를 위한 설정이 있을 수도 있고, 그 다음에 데이터베이스를 위한 설정을 별도 파일로 또 분리할 수도 있다. 그래서 설정 정보를 담아두는 폴더를 별도로 만들 수 있다고 생각하면 된다.
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


// user 모듈 사용
var user = require('./routes/user');


// config.js 모듈 파일을 불러온다.
var config = require('./config'); // config.js 파일에 있는 설정 객체가 그대로 이 config 변수에 할당된다.
// config 안에 server_port가 있었다. 그 서버 포트 정보를 이용해서 웹 서버를 실행하도록 만들어 볼 수 있다.


// 암호화 모듈
var crypto = require('crypto');


// mongoose 모듈 사용
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;


var app = express();

console.log('config.server_port -> ' + config.server_port); // 책에서는 %d를 이용했다.
// app.set('port', process.env.PORT || 3000); // 포트 정보를 app에 set 해서 밑에 가서 get 해서 뽑아내게 되는데, 그때 보면 process.env.PORT를 참조하고 있다. 이걸 변경해 본다. // port 속성을 app 객체에 설정하는데, process.env.PORT를 이제 사용하지 않겠다는 것이다. 또는 이게 아니라 3000 번을 바꿔도 된다. process.env.PORT를 써도 되고, 이렇게 써도 되는데, 일단은 이거를 config.server_port 이렇게 바꿔도 된다. 그리고 정 그렇다 싶으면 여기에 || 3000 이라고 해서, 설정이 안 되어 있으면 3000 번 포트를 기본으로 쓰라고 만들 수가 있을 것이다.
app.set('port', config.server_port || 3000); // 그러면 이제 config.server_port라고 하는 데 설정된 정보가 3001 번이라고 하면, 3001 번으로 시작이 될 것이다. // 이런 식으로 모듈에 설정한 정보를 가지고 와서, 이 정보(server_port)를 이렇게 참조해서 사용한다.
app.use('/public', static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


function connectDB() {
    // var databaseUrl = 'mongodb://127.0.0.1:27017/local'; // config 모듈을 불러오면, config 객체가 반환되고, 그 다음에 그거를 config 변수를 만들어서 할당했는데, 그걸 이용해서 데이터베이스 연결을 위한 url로 사용할 수 있다고 생각하면 된다.
    
    mongoose.Promise = global.Promise;
    // mongoose.connect(databaseUrl); // 데이터베이스 연결을 위한 url이 여기 있다. // url 연결한 이 부분이다. // 이 부분이 databaseUrl을 사용하는 게 아니라 config.db_url 정보가 사용된다.
    mongoose.connect(config.db_url); // 이렇게까지만 해도 모듈이라는 게 어떤 건지, 어떻게 정의하고 어떻게 불러와서 사용하는지 알고 있기 때문에 이 두 가지는 그렇게 어렵지 않게 바꿀 수 있을 것이다. // 여기까지 바꿨다면, 조금 더 나아가서 데이터베이스 스키마라고 하는 걸 정의해 놨잖아요? 근데 얘기한 것처럼 user schema를 정의한 다음에 app.js라고 하는 메인 파일에서 user schema를 로딩하기 위해서 이렇게 직접 user_schema를 require로 불러오고 그 다음에 모델 객체를 만드는 과정을 하잖아요? 근데 이게 스키마 객체가 계속 정의가 되면, app2.js 파일은 계속 수정되어야 한다. 그 다음에 라우팅 함수 같은 경우도 여기에 이렇게 해 놓으니까 새로 추가되면 app2.js도 계속 바뀌어야 된다는 것이다. 그러니까 app2.js도 메인 파일인데, 이 메인 파일이 필요에 따라서 계속 수정되는 거는 그렇게 좋진 않다. 왜냐하면 이제 실무에서 실제로 Node.js를 이용해서 실제 웹 서버를 만들어서 실행하고 이제 그 다음에 유지관리를 하기 시작하면 필요할 때 모듈을 추가하게 된다. 라우팅 함수도 추가하고 데이터베이스 접근하는 것도 필요하면 추가하거나 수정하게 될 텐데, 그때마다 메인 파일이 바뀌게 되면 오류가 생길 확률이 훨씬 높아진다. 그래서 이 각각의 기능들을 추가되거나 수정된다고 하더라도 메인 파일이 바뀌지 않도록 이렇게 만드는 게 필요하게 된다. 그래서 user schema라고 해서 우리가 스키마를 만들어서 로딩하도록 했던 그 파일이 있으면 그거를 로딩하는 별도의 파일을 만들고, 그 파일에서 로딩하도록 이렇게 만드는 게 좋은 방법일 것이다. 조금 이따가 그 방법 같이 한 번 해 보도록 하겠다.
    database = mongoose.connection;
    
    database.on('open', function() {
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        createUserSchema(database);
    });
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
    
    app.set('database', database);
}


function createUserSchema(database) {
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);
    
    database.UserModel = mongoose.model('users3', database.UserSchema);
    console.log('UserModel 정의함.');
}


var router = express.Router();


router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);


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
    
    connectDB();
});
