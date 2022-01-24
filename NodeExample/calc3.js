// 상속을 해야 한다. on이라는 게 Calc에 없기 때문이다. // → EventEmitter를 상속해서 한다. // → EventEmitter를 불러와서 쓰게 된다.
var EventEmitter = require('events').EventEmitter; // events 모듈 안에 EventEmitter 객체가 들어가 있는데, 속성으로 들어가 있는데, 그거를 EventEmitter 변수로 받는다.
var util = require('util'); // util 모듈을 불러온다. // util 모듈을 사용하면, 프로토타입 객체를 쉽게 상속하도록 만들어 줄 수 있다.

// 여기에 계산기 기능을 넣는다.
var Calc = function() { // Calc라는 객체를 정의
    this.on('stop', function() { // stop이라는 이벤트가 발생했을 때, 함수를 실행해 주는 것을 등록한다. // on이라고 하는 거니까, 결국 이 Calc라고 하는 게 EventEmitter를 상속해야 on 메소드를 사용할 수 있다. // 상속한다고 전제를 두고, 밑에서 상속을 한 번 해 볼 것이다.
        console.log('Calc에 stop 이벤트 전달됨.');
    });
}; // 이 Calc는 객체로 만들어져야 한다. → 프로토타입 객체로 만들어져야 한다.

util.inherits(Calc, EventEmitter); // inherits 함수 실행 // 뒤에 있는 인자를 부모로 보고 상속해서, Calc가 만들어지도록 한다.

Calc.prototype.add = function(a, b) { // prototype : 프로토타입 객체로 사용되는 함수 // 더하기 함수 추가
    return a + b;
}; // 더하기 함수를 Calc라는 객체에 추가

module.exports = Calc; // 프로토타입 객체를 module에, module.exports로 직접 할당
