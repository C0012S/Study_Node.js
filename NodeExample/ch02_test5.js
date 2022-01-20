// 더하기 함수는 calc.js에 있다.
var calc = require('./calc'); // 직접 만든 모듈은 상대 path를 넣어야 한다. // calc라고 하는 게 exports를 얘기하는 거다. // exports 안에 속성 add가 들어 있다. -> add를 사용할 수 있다.
console.log('모듈로 분리한 후 - calc.add : ' + calc.add(20, 20)); // calc 안에 들어 있는 더하기 함수를 우리가 만든 게 아니다.

// calc.js에 추가한 add 함수를 여기서 불러와서 사용한 것이다.
// 모듈이라는 파일로 분리해서 실행할 수 있다.
