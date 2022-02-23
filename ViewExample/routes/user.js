var login = function(req, res) {
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
    var database = req.app.get('database');
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

                // 응답 만들기 - 뷰 템플리트 이용해서 만든다.
                var context = { // context 객체에 두 개의 속성이 들어간다.
                    userid: paramId,
                    username: docs[0].name // 사용자 이름은 결과 값에 들어있다.
                }; // 자바스크립트로 변수를 받아서 대체해야 하는데 그 변수를 req.app.render의 두 번째 파라미터에 넣어야 하므로 context 생성
                req.app.render('login_success', context, function(err, html) { // html : 뷰 템플레이트에서 필요한 변수들 또는 자바스크립트 코드를 실행한 다음에 만든 html 웹 페이지 결과 값이다.
                    if (err) {
                        console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        console.log('에러 발생.');
                        
                        // 에러 전송 - 이거를 별도의 함수로 만들어서 처리하면 이 코드는 좀 더 깔끔해질 것이다.
                        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                        res.write('<h1>뷰 렌더링 중 에러 발생.</h1>'); // 에러 페이지도 웹 페이지로 되어 있다. // 이것도 결국은 ejs 뷰 템플레이트를 만들어 놓고 거기서 읽어와서 뿌려 줄 수 있다.
                        res.write('<br><p>' + err.stack + '</p>');
                        res.end();
                        
                        return;
                    }
                    
                    // render에서 정상적으로 html 페이지가 넘어왔다면
                    res.end(html); // write를 한 다음에 end 해도 된다. // 응답이 클라이언트로 전송된다.
                }); // ejs 파일 지정 // context 안에 들어있는 객체가 login_success.ejs로 전달된다. 그럼 그 객체 안에 있는 속성을 참조할 수 있다.
                // user.js에서 응답을 보낼 때 login_success.ejs 파일의 내용을 가지고 응답을 보내는 걸 바꿔 봤다. 코드가 더 많아 보이고 복잡해 보이지만 if(err) 부분을 함수로 처리하면 된다. 그래서 send response라든가 그렇게 해서 html 페이지를 전송하는 거로 만들 수가 있을 것이다.
                // 응답을 그냥 코드에서 만들어서 보내는 게 아니라 ejs 파일에 넣어서 보냈다는 게 달라진 점이다.
                /* 위의 코드로 대체하여 필요없어져서 삭제
                // 이 부분을 뷰 템플레이트를 사용하는 방식으로 만든다. // 응답 결과
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>')
                res.end();
                */
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
};

var listuser = function(req, res) {
    console.log('/process/listuser 라우팅 함수 호출됨.');
    
    var database = req.app.get('database');
    if (database) {
        database.UserModel.findAll(function(err, results) {
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

var authUser = function(db, id, password, callback) {
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    db.UserModel.findById(id, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0) {
            var user = new db.UserModel({id:id});
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
        
    
    var user = new db.UserModel({"id":id, "password":password, "name":name});
    
    user.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
};


module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
