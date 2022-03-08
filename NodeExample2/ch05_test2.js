var http = require('http');

var server = http.createServer();

var host = ''; // IP 정보 // Node.js command prompt에서 ipconfig /all 명령으로 IPv4 주소 확인
var port = 3000;
server.listen(port, host, 50000, function() {
    console.log('웹 서버 실행됨.');
});

server.on('connection', function(socket) {
    console.log('클라이언트가 접속했습니다.');
});

server.on('request', function(req, res) {
    console.log('클라이언트 요청이 들어왔습니다.');
    // console.dir(req);
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"})
    res.write('<h1>웹 서버로부터 받은 응답</h1>');
    res.end();
});
