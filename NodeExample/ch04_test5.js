// package.json : 어떤 모듈을 설치했는지, 이런 정보도 들어 있고 만약 파일을 실행하고 싶다면 이런 정보도 들어 있다. // package.json 파일을 한 번 읽어서 출력하는 기능
var fs = require('fs'); // 파일을 다룰 때는, fs 모듈을 사용할 수 있다. // fs : file system

var data = fs.readFileSync('./package.json', 'utf8'); // readFileSync에서 Sync만 빼도 기능이 동작한다.
console.log(data); // package.json 안에 있는 내용이 출력된다. 
// 파일의 내용을 읽어서 출력하는 프로그램을 만들게 된 것이다. // 파일의 전체 내용을 읽어서 출력하는 방법
// readFileSync도 있고 readFile도 있다.
