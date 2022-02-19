// 라우팅 함수, 어떤 요청 path로 들어왔을 때 실행될 함수를 여기에 등록한다.

// login 함수 정의
var login = function(req, res) { // 이 부분이 복잡하다. - 함수 부분이 코드가 많으므로 굉장히 복잡한 것으로 보인다. 그래서 이 함수만 별도로 분리해 보자는 것이다.
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
    var database = req.app.get('database'); // app는 어디에 들어가 있는가? - req 안에 한 번 넣어 주면 된다. // req.app라고 하는 거를 어떻게 넣어 주는지를 먼저 한 번 보면 된다.
    if (database) { // database를 사용하는데 database를 여기에서 참조한 적이 없다.
        authUser(database, paramId, paramPassword, function(err, docs) { // authUser를 호출하는데 authUser는 app.js 쪽에 있다. // addUser도 마찬가지며 UserModel이 나와있다. // 모듈 파일 쪽으로 init 함수를 만들어서 전달할 수도 있고, login 함수가 호출될 때 전달할 수도 있는데 login 함수는 우리가 호출하는 게 아니다. app.js에 있는 router라고 하는 게 내부적으로 호출해 준다. 그러니까 login에 여기 있는 데이터베이스 객체나 이걸 전달할 방법이 없다. 우리가 호출해 주는 게 아니라 파라미터로 넣어 줄 방법이 없다. 그래서 보면, req 객체를 항상 참조하고 있다. 그러니까 자바스크립트 객체에는 속성을 추가할 수 있다. 그러다 보니까 app.js에서 이런 형태의 구성을 사용할 수 있다. - createUserSchema라고 해서 database를 참조했다. 그 다음에 위에 가면 createUserSchema를 호출하고 있다. // 아래에서 사용하든 위에서 사용하든 상관이 없다.
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
};

var adduser = function(req, res) {
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    var database = req.app.get('database');
    if (database) {
        addUser(database, paramId, paramPassword, paramName, function(err, result) { // addUser나 authUser 이런 것들은 app.js에서 가져올 수가 있다.
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
};

var listuser = function(req, res) {
    console.log('/process/listuser 라우팅 함수 호출됨.');
    
    var database = req.app.get('database');
    if (database) {
        database.UserModel.findAll(function(err, results) { // UserModel은 database 안에 들어있으므로 UserModel.에서 database.UserModel로 변경한다. // 이렇게 해서 모듈 쪽으로 database 객체를 전달하는 방법을 같이 봤다.
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
};

// authUser와 addUser를 app.js에서 user.js로 옮겼다.
// authUser나 addUser 같은 함수에는 파라미터로 데이터베이스 객체를 전달한다. 파라미터가 넘어오게 되고, 데이터베이스 객체 안에 UserModel이 있으므로 UserModel에서 db.UserModel로 바꿔 준다.
var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    db.UserModel.findById(id, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0) {
//            var user = new UserModel({id:id});
            var user = new db.UserModel({id:id}); // 오류로 인해 변경
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            
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


var addUser = function(db, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
        
    
    var user = new db.UserModel({"id":id, "password":password, "name":name}); // UserModel이 데이터베이스 객체 안에 있으므로 db.UserModel로 변경해 준다.
    
    user.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
};
// 모듈 파일이 필요한 객체들을 전부 참조하는 형태가 된다.
// 그리고 변수를 정의하고, init과 같은 함수를 정의해서 그 변수에, 그 필요한 변수 객체를 또는 변수나 객체를 전달받는 그런 방법이 있는데, 책에는 init이라는 메소드를 정의해서 처리하는 방식으로 되어 있다. 그래서 책에서 얘기한 그 방식 대로도 한 번 수정해 보면 좋을 것 같다. 약간 변형시켜서 진행했다.

// 모듈 함수로 등록 - module.exports에서 함수를 할당해 주면 된다.
module.exports.login = login; // login 함수가 그대로 이 모듈을 require로 불러오는 쪽에서 호출할 수 있도록 등록이 된다.
module.exports.adduser = adduser;
module.exports.listuser = listuser;

// 3 개의 함수를 별도의 모듈 파일로 분리시켰다.
// 이런 형태로 하니까 별도의 객체를 만든 것도 아니고 이 코드를 함수로 정의하고 밑에 module.exports.속성이름 = 함수이름, 이렇게 등록한 것이다.
// 이 안에 들어가는 이 코드가 어떤 의미라는 걸 알고 있다면 어렵지 않게 구성할 수 있다.
// 단지 이 안에 보면, database니 UserModel이니, 이런 것들이 들어가 있는데, 이런 것들은 이 안에서 뭔가 참조한 게 없다. 저런 것들을 어떻게 할지 추가적으로 집어넣어야 되는, 만들어야 되는 내용이 된다.

// 설정 파일을 만드는 과정도 같이 한 번 진행해 보겠다. app.js 안에 보면 처음에 설정을 위한 코드들이 있는데, 이거를, 예를 들면 포트 정보라든가 이런 것들을 별도의 파일로 분리해 놓으면 나중에 우리가 그 부분만 포트 번호로 바꾼다든가, 이런 일이 있을 수도 있다. 그 별도의 모듈 파일만 보면 그 부분만 수정하면 되니까 그런 목적으로 해서 설정 파일을 별도로 만드는 그런 과정을 해보도록 할 것이다.
