function add(a, b, callback) {
    var result = a + b;
    callback(result); // callback에 a와 b를 더해 준 값을 넣어 준다. callback 함수를 실행해 준다.
    
    // 이 함수에 history 기능(어떻게 연산이 되었는지 기록)을 남겨 주고 싶다면? → 이것을 내부 함수로 만들 수 있다. 함수 안에서 만들어진 함수를 내부 함수라고 부른다.
    var history = function() {
        return a + ' + ' + b + ' = ' + result; // 문자열로 어떤 게 실행되었는지, 결과 값이 무엇인지를 알려 준다.
    };
    
    return history; // history를 return 해 줄 수 있다.
};

var add_history = add(20, 20, function(result) { // add 함수에서 return도 해 줘서 변수로 받을 수 있다. // add_history 변수는, add 함수가 함수를 return 했으므로 실제로는 함수가 되는 것이다. // 자바스크립트에서는 변수에 일반 값이 들어 있는지, 함수가 들어 있는지 그냥 코드만 봐서는 알 수 없다. → typeof를 이용해서 자료형을 보면 일반 데이터인지, 함수인지 구분할 수 있다.
    console.log('더하기 결과 : ' + result); // 더하기 결과는 result 변수에 들어 있다.
});

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과 값으로 받은 함수 실행 : ' + add_history()); // 함수면 함수를 실행할 수 있다.

// 함수 안에서 함수를 다시 return 해 준 것이다. 내부 함수를 만든 다음에 그 값을 return 해 준 것이다.

// → 그 다음에 나오는 내용 : 이(함수) 안에서, 내부 함수에서 어떤 변수를 참조했을 경우, 그 변수의 값이 메모리에 계속 유지된다. 그것을 클로저라고 한다.
