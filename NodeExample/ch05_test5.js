var http = require('http');
var fs = require('fs'); // fs : file system 모듈

var server = http.createServer();

var host = '192.168.0.107';
var port = 3000;
server.listen(port, host, 50000, function() {
    console.log('웹 서버 실행됨.');
});

server.on('connection', function(socket) {
    console.log('클라이언트가 접속했습니다.')
});

server.on('request', function(req, res) {
    console.log('클라이언트 요청이 들어왔습니다.'); // request라고 하는 게 넘어와서 client 요청이 들어왔는데, writeHead, write 이런 걸 이용해서 보냈다. // 그러면 이거를 그냥 보내는 게 아니라, 파일을 읽어서 보내자는 것이다. // 파일을 읽어야 하므로 request 안에서 파일을 읽어 본다. → fs 모듈 사용
    
    var filename = 'house.png';
    fs.readFile(filename, function(err, data) { // 함수에 err(에러) 객체와 data라고 해서 파일의 내용이 파라미터로 전달될 수 있다.
        // 파일을 읽어 들인 게 된다. // 파일을 읽어 들였다고 하면, 클라이언트를 전송할 것이다.
        res.writeHead(200, {"Content-Type":"image/png"}); // mine type : 웹의 응답을 mine type으로 지정해서 보내 주게 된다.
        res.write(data); // 응답의 body에 해당하는 것 // 즉, write를 이용해서 보내는 건 이미지를 보낼 것이다. // 파일을 읽은 내용이 data에 들어갈 것이다. // write(data) → 이미지 파일의 내용이 그대로 write로 전송이 된다.
        res.end();
    });
    
});
// ch05_test2.js 코드가 기본적으로 웹 서버 동작되는 코드다.

// 이미지 파일을 응답을 보내 주면 웹 브라우저에 그대로 보인다.
