function add(a, b, callback) {
    var result = a + b;
    callback(result);
    
    // history라는 기록이 몇 개가 남아 있는지?
    var count = 0; // count 변수 : 몇 번 실행했는지
    var history = function() {
        count += 1; // history라고 하는 게 남을 때마다, 계산될 때마다 count가 하나씩 올라간다.
        return count + ' : ' + a + ' + ' + b + ' = ' + result; // 몇 번째 history인지 기록을 남긴다.
    };
    
    return history;
};

var add_history = add(20, 20, function(result) {
    console.log('더하기 결과 : ' + result);
});

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과 값으로 받은 함수 실행 : ' + add_history());
console.log('결과 값으로 받은 함수 실행 : ' + add_history());
console.log('결과 값으로 받은 함수 실행 : ' + add_history()); // 3 번 실행

// 내부 함수에서 외부 함수(history가 들어 있는 함수)의 변수를 접근했을 때 그 변수가 유지되는 것을 클로저(closure)라고 한다.
// 유지되는 상태를 만드는 함수가 클로저(closure)이다.
// 목적이 무엇인지 이해하는 게 중요하다.
// 내부 함수가 자신을 만들어 준 외부 함수 안에 있는 변수의 값을 그대로 유지하면서 참조할 수 있다.
// 함수라고 하는 게 다른 함수의 파라미터로 전달되거나 다른 함수에서 return 되는 경우, 반환되는 경우에 어떻게 실행할 수 있는지를 봤다.
