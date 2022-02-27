// 클로저 : 내부 함수에서 어떤 변수를 참조했을 경우 그 변수의 값이 계속 메모리에 유지된다.
function add(a, b, callback) {
    var result = a + b;
    callback(result);
    
    // history 기록이 몇 개 남았는지 알고 싶다.
    var count = 0;
    var history = function() {
        count += 1;
        return count + ' : ' + a + ' + ' + b + ' = ' + result;
    };
    
    return history;
}

var add_history = add(20, 20, function(result) {
    console.log('더하기 결과 : ' + result);
})

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과 값으로 받은 함수 실행 : ' + add_history());
console.log('결과 값으로 받은 함수 실행 : ' + add_history());
console.log('결과 값으로 받은 함수 실행 : ' + add_history());

// 내부 함수(history)에서 외부 함수(history가 들어있는 함수)의 변수를 접근했을 때, 그 변수가 그대로 유지되는 것을 클로저라고 한다.
// 유지가 되는 그 상태를 만드는 함수가 클로저라고 할 수 있다.
// 내부 함수가 자신을 만들어 준 외부 함수 안에 있는 변수의 값을 그대로 유지하면서 참조할 수 있다.
// 함수가 다른 함수의 파라미터로 전달되거나 다른 함수에서 return(반환) 되는 경우 어떻게 실행할 수 있는지 같이 봤다.
// 콜백 함수 꼭 기억해야 한다.
