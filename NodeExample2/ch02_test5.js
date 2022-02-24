var calc = require('./calc');
console.log('모듈로 분리한 후 - calc.add : ' + calc.add(20, 20));

// 별도의 파일로 분리된 모듈이 있을 경우 require로 불러올 수 있다.
