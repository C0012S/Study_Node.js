// 내장 모듈 사용 코드  // 내장 모듈의 os 모듈을 사용
var os = require('os'); // os : CPU, Network Interface 등의 정보를 확인

console.log('hostname : ' + os.hostname()); // + 또는 '%s', 변수 또는 함수 지정
console.log('memory : ' + os.freemem());
