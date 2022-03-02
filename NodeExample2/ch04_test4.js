var Calc = require('./calc3');

var calc1 = new Calc();
calc1.emit('stop');

console.log('Calc에 stop 이벤트 전달함.');

// 이벤트는 emit으로 보내고 on으로 받는다.
// 우리가 만든 모듈에서도 사용할 수 있다.
