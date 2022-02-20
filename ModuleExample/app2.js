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

var database_loader = require('./database/database_loader'); // 이 database_loader를 이용해서 그 폴더 안에 들어가 있는 데이터베이스 스키마들을 전부 다 로딩하고 싶다고 하면, 데이터베이스를 이용해서 로딩하는 포즈를 넣어 줘야 되겠다. 코드만 더 추가하면 될 것 같다. // 그러면 그 코드는 어디에 넣어야 되냐면, 밑으로 가보면 connectDB()라는 걸 썼는데, 이게 아니라 database, 책에 있는 대로 하면 database가 될 거고, 아니면 지금 약간 변형시켜서 하고 있으므로 database_loader.init으로 하고 여기에 app 객체와 config 객체를 파라미터로 전달해 주면 된다. // 이렇게 하면 데이터베이스 과정이 훨씬 단순해졌다는 걸 알 수가 있다.
var route_loader = require('./routes/route_loader'); // route_loader 모듈을 로딩한다.


// 암호화 모듈
var crypto = require('crypto');


/* 필요없는 코드라 삭제한다.
// mongoose 모듈 사용
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;
*/


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


/* connectDB는 삭제해 줄 수 있는 상태가 된다.
// 데이터베이스 관련된 작업 - connectDB // 이 부분 안을 보면, mongoose를 사용한다. Promise, mongoose.connect를 하고, database를 객체로 만들어서 할당하고 있다.
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
*/
// 여기까지 해서 데이터베이스 관련된 거를, 스키마를 각각의 모듈로 분리했다. 그거를 database_loader에서 한 번에 로딩하는 방법을 봤다. 로딩할 스키마 파일을 어떻게 설정하냐면 config.js 안에 db_schemas 배열 안에 이렇게 정의를 해서 이것들만 로딩하도록 할 수 있다는 걸 같이 봤다. // 잠깐 이따가 이제 라우팅 함수를 어떻게 분리하는지 같이 보도록 하겠다.


route_loader.init(app, express.Router()); // init 함수를 호출하고 app, router 객체를 넘겨 준다.
/* 위의 코드로 이 코드는 필요없어졌다.
var router = express.Router(); // 라우팅 함수를 처리하는 것이다. // express.Router를 이용해서 객체를 참조했다.


router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);


app.use('/', router);
*/


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
    
    database_loader.init(app, config);
});

// 이번 장에서 처음에 데이터베이스 이전 장, 그 데이터베이스 쪽에서 만들었던 app.js 파일을 복사해서 만들었다. 복사해서 만든 다음에 모듈로 다 분리하니까 엄청 간단해졌다. require를 쓰는 코드 부분을 제외하면 나머지는 상당히 간단해진 것을 알 수 있다. // 이게 모듈화의 장점이 된다. 심지어는 여기서 app라고 하는 이 express 객체를 설정하는 이것도 별도의 모듈로 분리할 수 있다. 이렇게 되면 각각의 것들이 이제 모듈로 다 분리되었으니까 필요할 때 어떤 모듈을 수정하는지만 이해하고 있으면 훨씬 구조가 간단해 보일 것이다. // 이렇게 해서 라우팅 함수를 모듈 파일로 분리해서 메인 파일, app2.js와 같은 메인 파일에서 require로 로딩하거나 사용하거나, 이 방법을 같이 한 번 봤다. // 여기까지 바꾸고 나면 이제 어떤 장점이 생기냐면, 만약에 라우팅 함수를 추가하고 싶다면 user.js라는 데에 함수를 추가로 하나 더 넣고 그 다음에 config.js에서 route_info 안에 (속성,) 배열 안에 객체 하나를 더 추가하면 된다. 그리고 user.js가 아니라 만약에 메모를 만들겠다면 memo.js 파일을 만들고 마찬가지로 config.js에 등록하면 app2.js는 전혀 수정할 필요가 없다. 그냥 라우팅 함수를 새로 만들거나 삭제하거나 하는 것을 설정과 그 모듈 파일에서 해 놓기만 하면 이 웹 서버를 실행했을 때 그대로 실행이 된다는 것이다. 그런 장점이 생긴다. // 이런 내용들, 이렇게 바꿔가는 과정을 해 봤으므로 이제 나중에는 이렇게 이미 ModuleExample에서처럼 이렇게 이미 라우팅 함수는 모듈로 분리되어 있고, 데이터베이스 관련된 스키마를 생성하는 함수도 분리되어 있는 이 구조를 사용하게 될 것이다. 그래서 나중에 게시판을 만들든, 메모를 만들든, 또는 회사에서 어떤 특정한 웹 서버를 Node.js로 만들든 그때는 이렇게 모듈 파일로 분리된 구조를 사용할 것이다. // 여기까지 해서 모듈화 하는 과정을 같이 한 번 해 봤다.
// 여기서 모듈화를 하는 건, 이전 장 데이터베이스에서 했던 것을 그대로 가지고 와서 모듈화 하는 작업을 하는 것이다. 그래서 데이터베이스 부분부터 해서 또는 그 이전 부분부터 해서 순서대로 와야 한다. 그래야 좀 더 잘 이해할 수 있다. 순서대로 오지 않고 이 부분만 보게 되면 모듈에 대한 기본 개념 이해하는 건 이해가 되겠지만, app.js를 만들거나 여기서 database_loader, route_loader, 이런 것들 만드는 이런 과정은 좀 더 어렵게 느낄 수 있다. 그래서 되도록이면 이 책은 순서대로 보기를 권장한다.
// 이제 웹 페이지에서 UI를 좀 더 예쁘게 꾸미는 그런 과정을 보도록 할 것이다.
