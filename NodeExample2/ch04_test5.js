var fs = require('fs'); // fs 모듈 : file system 모듈

var data = fs.readFileSync('./package.json', 'utf8'); // 파일을 다 읽을 때까지 대기한다.
console.log(data); // package.json이 그대로 읽어져서 출력되었다.
// 파일의 전체 내용을 읽어서 출력하는 방법이다.
