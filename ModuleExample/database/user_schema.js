// 스키마와 관련된 코드를 넣는다.

var crypto = require('crypto');

// app.js 안에 있는 동일한 코드가 별도의 파일로 분리되었다.
// 이 코드가 결국에는 module.exports 안에 등록되어야 하는데, 코드 양이 많다. 별도의 함수를 만들든지, 객체를 정의한 다음에 module.exports에 할당하면 모듈 파일이 구성된다.
var Schema = {}; // Schema 객체 정의

Schema.createSchema = function(mongoose) { // Schema 안에 속성으로 함수 할당 // 모듈 파일을 require로 읽어들인 다음에 createSchema 함수를 호출하면 이 코드가 실행된다.
    console.log('createSchema 호출됨.'); // 마지막 이 함수를 호출한, return 하기 바로 전 마지막 코드에서 console.log를 통해서 로그를 출력해 줘도 되고, 여기에 출력해도 된다.
    var UserSchema = mongoose.Schema({ // UserSchema를 만들 때 사용하는 mongoose는 단순 require로 불러온 mongoose가 아니다. // 위에 뭔가 설정을 하고 있다. - mongoose를 이용해서 connect도 하고 있고, 이런 과정들이 있다. // 이런 과정들을 app.js에서 한다면, mongoose를 이 모듈 안에서 단순 require로 불러와서는 안 된다. // mongoose를 위한 코드를 app.js에서 실행했다면, 이 실행한 mongoose 객체를 user_schema.js에서 전달받아야 한다. → createSchema 함수를 실행할 때, function에 mongoose 객체를 전달받을 수 있다. // 그러면 app.js에서 createSchema를 호출할 때 mongoose 객체를 전달하면서 호출하면 된다. 파라미터로 전달하면 된다. // createSchema를 호출할 때 전달할 수도 있고, 아니면 Schema.init이라는 초기화 관련된 함수를 별도로 하나 정의해서 파라미터로 전달받아서 변수에 할당해 줄 수도 있다.
        id: {type:String, required:true, unique:true, 'default':''},
        hashed_password: {type:String, required:true, 'default':''},
        salt: {type:String, required:true},
        name: {type:String, index:'hashed', 'default':''},
        age: {type:Number, 'default':-1},
        created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
    });
    console.log('UserSchema 정의함.');

    UserSchema
        .virtual('password')
        .set(function(password) {
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 저장됨 : ' + this.hashed_password);
        })

    UserSchema.method('encryptPassword', function(plainText, inSalt) {
        if (inSalt) {
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }
        else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
        if (inSalt) {
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText, inSalt) === hashed_password
        }
        else {
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText) === hashed_password;
        }
    });


    UserSchema.static('findById', function(id, callback) {
        return this.find({id:id}, callback);
    });

    UserSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });
    
    return UserSchema; // UserSchema를 다 만들었으므로 return 하게 만들 수 있다. // 이렇게 하면 이 함수를 호출했을 때 UserSchema 객체를 만들고 그 다음에 return 하게 만들 수 있다. 그러면 app.js 같이 이 모듈을 불러와서 사용하는 쪽에서 이 함수를 호출한 다음에 return(반환)받은 UserSchema 객체를 UserSchema 같은 변수에 할당할 수 있다.
    // 이렇게 하면 UserSchema 객체를 만드는 것을 user_schema.js라는 별도의 파일에서 진행하도록 분리시켜 본 것이다. 코드 분리를 시켰고, 이게 이제 모듈 파일이 되는 것이다.
}

module.exports = Schema; // module.exports에는 객체 할당이 가능하다.
