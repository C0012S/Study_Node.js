function add(a, b, callback) { // 파라미터로 함수를 전달할 수 있는 이유는 함수가 일급 객체로 다뤄지기 때문이다. // 일급 객체라고 하는 것은 변수에 할당할 수 있다는 것이다. // 파라미터로 전달돼서 그 함수 안에서 다시 파라미터로 전달된 함수를 호출하는 것을 콜백 함수라고 한다.
    var result = a + b;
    callback(result);
}

add(10, 10, function(result) {
    console.log('더하기 결과(콜백 함수 안에서) : ' + result);
});
