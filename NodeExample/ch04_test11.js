var fs = require('fs');

var infile = fs.createReadStream('./output.txt', {flags:'r'}); // createReadStream : 읽어 들일 수 있다. output.txt 파일의 내용을 읽어 들인다. // flags:'r' - 읽기 권한이 있도록 부여

// 읽어 들이는 과정이 있게 되는데, 그 읽어 들이는 과정에서 이벤트가 발생한다. // 이벤트는 infile.on으로 받을 수 있다.
infile.on('data', function(data) { // 이벤트의 이름 : data
    console.log('읽어 들인 데이터 : ' + data);
});

infile.on('end', function() { // 파일 읽기가 끝난 경우 end 이벤트 발생
    console.log('읽기 종료.');
});
// 이렇게 Stream이라고 하는 것으로 만들어서 처리할 수 있다.

// 그 다음에, fs 안의 exists로 파일이 있는지 없는지를 확인하는 방법, 파일을 삭제할 때 unlink라고 하는 것(delete 이런 게 아니라 unlink라는 이름으로 된 메소드를 실행한다.), 이런 내용들이 나와 있다. 
// 폴더를 만들 때 mkdir, 삭제할 때 rmdir을 쓸 수 있다.
