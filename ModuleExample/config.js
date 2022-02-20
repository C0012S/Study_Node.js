// config.js 안에 속성으로 설정에 해당하는 정보들을 넣어 본다.
// 먼저 config.js 안에 객체를 만들고, 그 객체를 module.exports에 할당할 수 있다.
/*
var config = {}; // config 객체를 하나 만들고, 이 안에 속성을 넣는다.

module.exports = config; // module.exports에 config 객체를 그대로 할당할 수 있다. // 그러면 이 모듈을 require로 불러오는 쪽에서는 이 config 안에 들어있는 속성을 참조할 수가 있겠다.
*/
// 위처럼이 아니면 책에 해 놓은 것처럼 바로 module.exports에 객체를 만들면서 할당할 수 있다.
module.exports = {
    // 중괄호 안에 속성을 바로 정의할 수가 있다.
    server_port:3000, // 포트 번호 // config.js 파일 안에 있는, 이 모듈 파일 안에 있는 서버 포트라고 하는 속성을 이용해서 app2.js에서 서버를 실행할 때 3000 번 포트로 대기하도록 만들 수가 있다.
    db_url:'mongodb://127.0.0.1:27017/local', // 데이터베이스 연결할 때 사용하는 db_url 속성
    // 데이터베이스 스키마를 로딩하는 별도의 파일을 하나 만들 것이다. // 먼저 config.js에서 데이터베이스 스키마가 파일로 만들어졌다면 그 정보를 설정하도록 한 번 해 본다.
    db_schemas: [
        // 우리가 만든 user schema 정보를 넣을 텐데, 그러면 여러 개의 정보가 필요할 것이다.
        {file:'./user_schema', collection:'users3', schemaName:'UserSchema', modelName:'UserModel'} // user_schema가 database 폴더 안에 정의되어 있다. 이거는 require로 불러들일 그 정보를 지정한 것이다. // collection은 스키마를 정의하고 나서 모델 객체를 만들 때 collection을 지정한다. //schemaName 속성 - 속성 이름을 마음대로 정할 수 있다. 여기서 정한 거는 데이터베이스 스키마를 로딩하는 그 파일에서 이 속성 이름 그대로 사용해야 한다. UserSchema 이름으로 스키마를 만들었다.
    ] // 데이터베이스 스키마 파일이 여러 개일 수 있으므로 배열로 한 번 정의해 본다.
};
// 이 config.js 정보를 이용해서 우리가 필요한 작업을 한다고 생각하면 된다.
