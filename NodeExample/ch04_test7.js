var fs = require('fs');

fs.writeFile('./output.txt', 'Hello.', function(err) { // output.txt에 Hello 내용을 쓴다. // function은 콜백 함수다. - 정상적으로 잘 쓰여졌는지를 알려 준다.
    if (err) { // 에러 객체가 발생했으면 // 에러를 먼저 확인 // 코드를 만들 때 에러 객체가 나오면 에러를 먼저 확인한다고 생각하면 된다.
        console.log('에러 발생.');
        console.dir(err);
        return; // 에러가 발생하면 그 밑의 코드로 넘어가지 않게 만들어 준다.
    }
    
    console.log('output.txt 파일에 데이터 쓰기 완료함.'); // 에러가 발생하지 않으면 실행 // 정상적인 처리
});
// 파일에 쓰는 과정 // 이렇게 파일에 쓸 수 있다.
// writeFileSync도 필요할 때 사용할 수 있다.
// 파일을 읽고 쓰는 가장 기본적인 기능을 이렇게 할 수 있다.

// writeFile, readFile은 가장 간단하게 하는 거고, 파일을 open 한 다음에 필요한 것을 write 하고 close 하는 경우도 있다. 그렇게 해야 파일을 좀 미세하게 다룰 수 있다. 다른 언어에도 대부분 지원되는 기능이다.
