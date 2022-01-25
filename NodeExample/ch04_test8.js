var fs = require('fs');

fs.open('./output.txt', 'w', function(err, fd) { // open : 처음에 여는 단계 // 파일을 쓰려면 기본적으로 열어야 한다. // r, w : 읽기, 쓰기 모드
    if (err) {
        console.log('파일 오픈 시 에러 발생');
        console.dir(err); // 에러 객체 출력
        return;
    }
    
    // 에러가 발생하지 않았다면
    var buf = new Buffer('안녕!\n');
    fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) { // 파일에 쓸 수 있다. // fd : file descriptor. open 시 전달받은 fd 파라미터 // buf : buffer. 데이터를 넣어서 전달하게 되어 있다. // buffer 안에 들어 있는 것을 일부 출력할 수 있다. → 0 : index, buf.length : 모두 출력 // 쓰기가 정상적으로 되었을 때 호출된다.
        if (err) { // 에러가 발생했을 때
            console.log('파일 쓰기 시 에러 발생');
            console.dir(err);
            return;
        }
        
        console.log('파일 쓰기 완료함.');
        
        fs.close(fd, function() { // close : 파일을 닫는다.
            console.log('파일 닫기 완료함.');
        });
    });
}); // 정상적으로 open 하면 콜백 함수를 실행한다.
// writeFile보다 복잡하다. // 파일을 좀 더 미세하게 다룰 때는 이런 코드를 넣어서 처리할 수 있다.
// 비동기 방식 즉, 콜백 함수를 쓰는 방식으로 하게 되면, fs.open, fs.write, 이렇게 순서대로 실행할 수 있도록 기록하는 게 아니라, fs.open의 콜백 함수가 실행되었을 때 fs.write를 하고 fs.write의 콜백 함수가 실행되었을 때 fs.close를 한다.

// open, write, close 하는 단계
// 이것을 read 할 때도 마찬가지로 사용할 수 있다. // read 할 때, 동일한 형태로 읽어 들이는 것을 확인할 수 있다.

// Buffer 객체 : 어떤 문자열이나 이런 것들을 담아 두는 객체가 된다.
