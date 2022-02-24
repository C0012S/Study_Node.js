// 내장 모듈 사용
var os = require('os'); // os 모듈 사용 // os 안에는 host name, memory의 여유량을 확인하는 메소드가 있다.

console.log('hostname : ' + os.hostname());
console.log('memory : ' + os.freemem());
