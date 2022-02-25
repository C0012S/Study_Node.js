/*
function add(a, b) {
    return a + b;
}
*/

var add2 = function (a, b) {
    return a + b;
} // 익명 함수 // 함수를 변수에 할당할 수 있다. - 일급 객체라서 함수를 변수에 할당할 수 있기 때문이다.

// var result = add(10, 10);
var result = add2(10, 10);
console.log('더하기 결과 : ' + result);
