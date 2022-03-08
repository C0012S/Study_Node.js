var http = require('http');

var server = http.createServer();

var host = ''; // IP 정보 // Node.js command prompt에서 ipconfig /all 명령으로 IPv4 주소 확인
var port = 3000;
server.listen(port, host, 50000, function() {
    console.log('웹 서버가 실행되었습니다 → ' + host + ' : ' + port);
});
