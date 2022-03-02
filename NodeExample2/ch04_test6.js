var fs = require('fs');

fs.readFile('./package.json', 'utf8', function(err, data) {
    console.log(data);
}); // readFile 메소드를 호출했을 때 return 되는 값은 없고, 콜백 함수 쪽으로 데이터를 준다. // 파일을 읽을 때까지 대기하지 않고 이 밑에 무슨 코드가 있다면 그냥 넘어간다. // 파일을 다 읽었을 때 함수가 실행된다.
// test5와 test6 결과는 동일하지만, 코드의 형태도 약간 다르고 실행되는 방식이 다르다.
