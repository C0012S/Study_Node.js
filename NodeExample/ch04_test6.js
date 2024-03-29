var fs = require('fs');

fs.readFile('./package.json', 'utf8', function(err, data) { // readFile은 비동기 방식이다. 즉, 사용하는 방법이 약간 다르다. // 첫 번째 파라미터로 '.package.json' 입력한다. // 두 번째 파라미터 'utf8' // 세 번째 파라미터로 함수를 넣어 준다. // 함수를 호출할 때 함수를 넣어 주면, 일반적으로는 콜백 함수다. // 어떤 상황이 되었을 때 함수가 호출된다. → 어떤 상황? 파일을 다 읽었을 때 호출된다. // 결국, readFile 메소드를 호출했을 때, return 되는 값은 없고 함수 상자의 위쪽 구멍으로 데이터, 결과를 던져 준다고 생각하면 된다. 다시 말해서, 콜백 함수 쪽으로 데이터를 던져 주는 것이다.
    console.log(data);
});
// 아주 큰 차이가 있다. // 결과는 동일하지만 test5와 test6 사이에는, 코드의 형태도 약간 다르고 실행되는 방식이 다르다.
// ch04_test5(readFileSync)는 파일을 다 읽을 때까지 대기하는 것이다.
// ch04_test6(readFile)은 파일을 읽을 때까지 대기하지 않고, 읽을 때 무슨 코드가 있다면 그냥 넘어간다. 넘어가고, 파일을 다 읽었을 때 이 함수(function)가 실행되는 것이다.
// 그래서 파일을 읽어 들일 때는, 그런 차이를 생각할 수 있다.
