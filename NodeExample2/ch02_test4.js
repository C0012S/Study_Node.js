// 계산기 기능 - 계산기 객체를 만들고 그 안에 속성을 넣는다.
var calc = {};

calc.add = function(a, b) {
    return a + b;
}; // calc 객체의 속성을 정의

console.log('모듈로 분리하기 전 - calc.add : ' + calc.add(10, 10));

// calc 객체를 만들고 그 안에 속성으로 add 함수를 추가했다.
