var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Calc = function() {
    this.on('stop', function() {
        console.log('Calc에 stop 이벤트 전달됨.');
    }); // Calc가 event emiter를 상속해야 on 메소드를 사용할 수 있다.
};

util.inherits(Calc, EventEmitter); // EventEmitter를 부모로 보고 상속해서 Calc가 만들어지도록 정의한다.

Calc.prototype.add = function(a, b) {
    return a + b;
}; // 더하기 함수를 Calc 객체에 추가

module.exports = Calc;
