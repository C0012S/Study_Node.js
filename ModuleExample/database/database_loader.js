// 데이터베이스 스키마를 로딩하는 별도의 파일이다.

var database = {};

database.init = function(app, config) {
    console.log('init 호출됨.');
    
    connect(app, config); // connect 메소드 안에서 어떤 작업을 하냐면, app2.js 안에 있던 코드를 이쪽으로 옮겨 와서 그 코드 안에서 하던 일을 하도록 만들 것이다.
};

function connect(app, config) {
    console.log('connect 호출됨.');
    
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection; // 위에 database 동일한 이름을 지정했으니까 database.db 쪽으로 할당되도록 바꿔 본다.
    
    database.db.on('open', function() {
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        createSchema(app, config); // createUserSchema(database) - UserSchema 말고 모든 스키마, 정의된 거를 다 사용해 보겠다고 하면 createSchema로 바꾸고, 파라미터로 app, config를 전달해 준다. // 그러면 밑에 createSchema가 함수로 만들어질 수 있다. // createSchema 함수에서는 config 설정 파일에 정의된 db_schemas라고 넣어 둔 게 있는데 이 정보를 이용해서 스키마를 로딩하도록 할 것이다.
    });
    
    database.db.on('disconnected', function() {
        console.log('데이터베이스 연결 끊어짐.');
    });
    
    database.db.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
}

function createSchema(app, config) {
    console.log('설정의 DB 스키마 수 : ' + config.db_schemas.length); // config.db_schemas.length : 배열이므로 몇 개가 들어있는지 나온다.
    
    // 설정에 있는 DB 스키마가 있으면, C style for 문을 해 본다.
    for (var i = 0; i < config.db_schemas.length; i++) {
        var curItem = config.db_schemas[i]; // 배열이므로 config.db_schemas의 i 번째 요소를 보게 되면, curItem으로 받아올 수가 있다. 그 안에 속성들이 들어있다. 그 속성들을 이용해서 require로 모듈을 불러올 것이다.
        
        var curSchema = require(curItem.file).createSchema(mongoose); // curItem.file을 지정하면, require 안에 들어가는 정보가 있다. file이 뭐였냐면, config.js에 가보면 file은 user_schema다. require로 불러오는 정보를 그대로 넣어 놨다. 이렇게 하면 user_schema.js 파일을 그대로 가져오게 된다. // 그 다음에 바로 .createSchema()라고 하면, 모든 스키마, DB 스키마 파일을 정의할 때는 createSchema 함수를 넣어 놔야 한다는 얘기가 된다. 그걸 넣어 놨다고 하면 이렇게 하고, 여기에 mongoose를 전달할 수가 있을 것이다. // 그러면 여기에 스키마 객체가 만들어질 것이다. - curSchema 변수를 만들어 할당한다.
        console.log('%s 모듈을 이용해 스키마 생성함.', curItem.file); // 그 파일(curItem.file)을 require로 읽어들였다는 것을 로그로 찍는다.
        
        var curModel = mongoose.model(curItem.collection, curSchema); // 모델 객체를 만든다. curItem.collection이라고 하면 몽고디비의 어떤 collection을 이용해서 만들 것이라는 게 지정이 되고, curSchema라고 하면 이 스키마를 이용해 만들겠다는 게 될 것이다. 그러면 이게 var curModel이라는 것으로 참조할 수가 있을 것이다.
        console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);
        
        database[curItem.schemaName] = curSchema; // 이렇게 확인한 것들을 이제 위에 객체로 만든 database라고 하는 모듈 객체에 넣어 준다. curItem.schemaName 속성으로 curSchema를 할당한다.
        database[curItem.modelName] = curModel; // database의 curItem.modelName이라고 하는 거, 이 이름으로 해서 curModel을 속성으로 추가한다.
        // 그러면 database 모듈 객체의 속성으로 이제 스키마와 모델을 참조할 수 있을 것이다.
        console.log('스키마 [%s], 모델 [%s] 생성됨.', curItem.schemaName, curItem.modelName); // 이게 참조할 수 있는 상태가 됐다는 것이다. // curItem.schemaName으로 참조하면 된다. 그 다음에 curItem.modelName으로 참조할 수 있다.
    } // 이렇게 해서 for 문으로 모든 정의된 것들을 이렇게 require로 불러들인 다음에, 스키마와 모델 객체를 만들어 놓았다.
    
    app.set('database', database); // 여기에 app.set이라고 해서 'database'에 database 객체를 그대로 넣을 수 있다. // 그러면 이 모델이라고 하는, 데이터베이스라고 하는 데에 이렇게 해 놨으니까 이 모듈을 불러들여서 init만 하면 app 안에 얘가 들어간다는 것이다.
}

module.exports = database; // module.exports에 database를 할당한다. 그러면 app2.js에서 할 일이 확 줄어들었다. 나머지는 database_loader라고 하는, (책에서는 database라고 되어 있다.) database_loader라고 하는 데에서 대부분의 일을 해 주기 때문이다.
