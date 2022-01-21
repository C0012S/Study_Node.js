var path = require('path');

var directories = ['Users', 'Mars', 'docs']; // 자바스크립트 배열 객체
var dirStr = directories.join(); // join 함수 : 3 개의 정보가 같이 문자열로 붙어서 return  // join 함수 : 각각의 배열 원소가 콤마를 기준으로 합쳐져서 return
console.log('dir : ' + dirStr); // 콤마를 기준으로 해서, 붙어서 문자열이 만들어진 게 출력된다.

var dirStr2 = directories.join(path.sep); // join 함수에 구분자를 지정할 수 있다.  // /(역슬래시) : file separator  // path에서 폴더를 어떻게 구분할지 path.sep를 통해서 지정 가능
console.log('dir2 : ' + dirStr2);
// path 모듈은 file path 같은 거를 만들 때 사용될 수 있다.

var filepath = path.join('/Users/Mars', 'notepad.exe'); // path 안에 join이 따로 있다.  // path의 join : 파일 폴더의 path를, 또는 파일의 path를 구성하기 위한 각각의 요소를 서로 붙여 주는 역할을 한다. 그러면서 file separator를 중간에 넣어 준다.  // 가장 많이 쓰는 방법
console.log('filepath : ' + filepath);
// 어떤 file path를 만들 때, path 모듈의 join 함수를 사용할 수 있다.

// path가 제공하는 기능은 뭐가 있는가?
// dirStr3는 file path를 얘기하고 있다. // 그 path에서 dirname 함수를 실행  // dirStr3 -> filepath 이름 변경
var dirname = path.dirname(filepath); // dirname은 filepath의 파일 명을 제외한 폴더 path를 얘기한다.
console.log('dirname : ' + dirname);
var basename = path.basename(filepath); // basename : 파일 이름
console.log('basename : ' + basename);
var extname = path.extname(filepath); // extname : .까지 포함한 확장자
console.log('extname : ' + extname);
// 이런 식으로 path 모듈이 갖고 있는 기능들이 있다.
