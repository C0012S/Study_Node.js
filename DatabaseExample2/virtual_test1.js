var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://127.0.0.1:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl); // 연결
    database = mongoose.connection;
    
    // 이벤트로 언제 연결되었는지 확인
    database.on('open', function() {
        console.log('데이터베이스에 연결됨. : ' + databaseUrl);
        
        createUserSchema(); // 다른 함수에서 실행하도록 만듦
        
        doTest();
    }); // open 이벤트 발생했을 때 연결된다.
    
    database.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.'); // 데이터베이스 연결이 끊어졌을 때 5 초 후에 다시 연결할 수도 있다.
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
} // connectDB를 mongoose를 사용하는 방식으로 변경
// mongoose를 사용할 때 이벤트를 가지고 on 메소드를 써서 open 이벤트가 발생했을 때 연결이 되었는지 확인하고, 스키마와 모델 객체를 만들어 준다.

function createUserSchema() {
    // 데이터베이스가 연결되었다면 Schema 정의
    UserSchema = mongoose.Schema({
        id: {type:String, required:true, unique:true},
        name: {type:String, index:'hashed'},
        age: {type:Number, 'default':-1},
        created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
    });
    console.log('UserSchema 정의함.');
    
    UserSchema.virtual('info') // virtual : 가상의 속성 추가
        .set(function(info) { // 안에서 info를 받으면 어떻게 할 건지 정의
            var splitted = info.split(' ');
            this.id = splitted[0];
            this.name = splitted[1];
            console.log('virtual info 속성 설정됨. : ' + this.id + ', ' + this.name);
        }) // .set : 사용자가 info column을 설정하게 되면 set이 호출된다. 
        .get(function() {return this.id + ' ' + this.name});
    
    UserModel = mongoose.model("users4", UserSchema);
    console.log('UserModel 정의함.');
}

function doTest() {
    var user = new UserModel({"info":"retest01 소녀시대"});
    
    user.save(function(err) {
        if (err) {
            console.log('에러 발생');
            return;
        }
        
        console.log('데이터 추가함.');
    }); // 저장된다. // insert가 된다.
}

connectDB();

// connectDB에서 데이터베이스를 연결하고 스키마를 정의하는데 virtual 속성을 넣어봤다.
// info 속성을 넣으면 그 다음부터는 실제 데이터베이스에 info라고 하는 속성을 이용해서 데이터를 넣는 것처럼 추가할 수 있다.
// virtual로 가상의 속성을 정의할 수 있다.
