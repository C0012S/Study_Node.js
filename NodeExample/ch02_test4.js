// 계산기 기능 - 더하기 함수  // 계산기 객체를 만들고 그 안에 (더하기 함수를) 속성으로 넣을 것
// calc 객체를 만들고, add 함수를 넣었다. // 더하기 함수를 여기서 만들었다.
var calc = {}; // 변수를 선언하고 객체 할당

calc.add = function(a, b) { // 함수를 바로 할당하는 경우, 변수에 직접 할당하는 경우, 선언하면서 할당하는 경우에는 이름이 필요 없어 익명 함수를 만들게 된다.
    return a + b;
}; // 할당

console.log('모듈로 분리하기 전 - calc.add : ' + calc.add(10, 10));

// 속성으로 여러 함수를 넣을 수 있다. -> 그렇게 하면 calc 객체 안에 여러 개의 함수가 들어 있게 된다.
