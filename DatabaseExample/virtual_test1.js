// 여기서 테스트 할 때는, 웹 서버로 동작하게 만드는 것이 아니라 데이터베이스 연결해서 virtual 기능을 테스트 해 볼 것이다. // 순수하게 데이터베이스 테스트 하는 것이므로 express를 사용하지 않을 것이다.
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function() { // open : 데이터베이스 연결되었을 때
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        createUserSchema(); // 스키마 만드는 부분을 별도의 함수로 분리
        
        doTest();
    });
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
}

function createUserSchema() {
    UserSchema = mongoose.Schema({
        id: {type:String, required:true, unique:true},
        name: {type:String, index:'hashed'},
        age: {type:Number, 'default':-1},
        created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
    });
    console.log('UserSchema 정의함.');
    
    UserSchema.virtual('info') // UserSchema에 virtual 함수를 이용해서 가상의 속성 추가
        .set(function(info) {
            var splitted = info.split(' '); // 공백으로 문자열 구분
            this.id = splitted[0]; // 첫 번째 거를 id로 넣어 준다.
            this.name = splitted[1];
            console.log('virtual로 info 속성 설정됨 : ' + this.id + ', ' + this.name);
        }) // .set : 사용자가 'info' column을 설정하면 set이 호출된다.
        .get(function() {return this.id + ' ' + this.name}); // .get : 저 속성을 조회하겠다는 경우 // return을 해 주면 그 값이 그대로 조회된다.
    
    UserModel = mongoose.model("users4", UserSchema); // UserSchema를 매핑해 준다.
    console.log('UserModel 정의함.'); // users4 컬렉션으로 만들어진다.
}

// 테스트
function doTest() {
    var user = new UserModel({"info":"test01 소녀시대"}); // user 모델 객체를 만들어서 테스트 한다. // new UserModel로 인스턴스 객체를 만든다.
    
    user.save(function(err) {
        if (err) {
            console.log('에러 발생.');
            return;
        }
        
        // 정상적인 상황이 되면
        console.log('데이터 추가함.');
    }); // 저장이 된다. insert가 된다.
} // 데이터가 추가됐는지 본다.

connectDB();

// virtual 기능 테스트
// 여기서 웹 서버를 만드는 것이 아니라 자바스크립트로 프로그램을 실행한 것이다. // 그래서 우리가 만든 함수의 이름 connectDB이 있으니까 똑같이 한 번 정의한 다음에, connectDB에서 데이터베이스 연결을 하고, 스키마를 정의하는데 virtual 속성을 한 번 넣어 봤다는 것이다. // 그래서 info 속성을 넣으면, 그 다음부터는 실제 데이터베이스의 info 속성을 이용해서 데이터를 넣는 것처럼 추가할 수 있다.
// 이렇게 해서 virtual로 가상의 속성을 정의할 수 있다.

// 이번에는 비밀번호를 암호화 해서 저장할 수 있을 것이다. 암호화를 위한 내용이 조금 더 추가되니까 좀 더 복잡해질 것이다. 그래서 암호화를 어떻게 하는지 그 내용을 같이 볼 것이고, 그 다음에 지금 본 것처럼 virtual 속성을 만들어서 password라는 이름으로 넣을 것이다. 그런데 실제 컬렉션 안에는 password라는 게 없다. 다른 이름으로 저장을 하든지 해서 암호화 된 password를 저장하겠다. 근데 실제 조회하는 속성은 그냥 password를 사용하겠다고 생각하면 된다. // 조금 이따가 비밀번호 암호화 해서 저장하고, 그 다음에 다시 인증하는 그런 코드를 만들어 보도록 하겠다.


// virtual 속성에 대해 알아봤다. // 이제 본격적으로 비밀번호를 암호화해서 저장하는 코드를 만들어 본다.
