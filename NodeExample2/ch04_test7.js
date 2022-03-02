var fs = require('fs');

fs.writeFile('./output.txt', 'Hello.', function(err) {
    if (err) {
        console.log('에러 발생.');
        console.dir(err);
        return; // 에러가 발생하면 그 밑의 코드로 넘어가지 않게 만든다.
    }
    
    console.log('output.txt 파일에 데이터 쓰기 완료함.'); // 에러가 발생하지 않는 경우 실행된다.
});

// 파일에 쓰는 과정
// writeFileSync도 쓸 수 있다.

// writeFile, readFile은 가장 간단하게 하는 거고, 파일을 open 한 다음에 필요한 거를 write를 하고 close 하는 경우 파일을 미세하게 다룰 수 있다.
