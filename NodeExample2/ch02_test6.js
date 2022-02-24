var calc2 = require('./calc2'); // calc2.js의 calc 객체가 return 되어서 calc2에 할당된다.

console.log('모듈로 분리한 후 - calc2.add : ' + calc2.add(30, 30));

// 메인이 되는 자바스크립트 파일이 있으면 그 안에 들어있는 자바스크립트의 일부를 별도의 파일로 분리한 다음에 불러와서 사용하는 방법을 같이 봤다. - exports, module.exports를 사용할 수 있다.
// 미리 다른 사람들이 만들어 놓은 모듈을 가져와 사용할 수도 있다.

var nconf = require('nconf'); // 외장 모듈 // nconf를 이용해서 시스템 환경 변수를 확인할 수 있다.
nconf.env(); // 시스템 환경 변수를 확인한다.
var value = nconf.get('OS'); // 시스템 환경 변수 값 확인
console.log('OS 환경변수의 값 : ' + value);
