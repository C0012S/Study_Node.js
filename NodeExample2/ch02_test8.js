var path = require('path'); // path 모듈 사용 // path : 파일 path를 만들 때나 파일 path 안의 특정한 정보를 확인할 때 사용된다.

var directories = ['Users', 'Mars', 'docs']; // Mars : 사용자 계정
var dirStr = directories.join(); // directories의 3 개의 정보가 문자열로 붙어서 return 된다. // join 함수 : ,를 기준으로 해서 각각의 배열 원소가 붙어서 문자열이 만들어진다.
console.log('dir : ' + dirStr);

var dirStr2 = directories.join(path.sep); // join 함수에 구분자를 지정할 수 있다. // 구분자 : file separator
console.log('dir2 : ' + dirStr2);

var filepath = path.join('/Users/Mars', 'notepad.exe'); // 파일 path를 만들 때 path 모듈의 join 함수 사용
console.log('filepath : ' + filepath);

var dirname = path.dirname(filepath); // 파일 명을 제외한 폴더 path
console.log('dirname : ' + dirname);
var basename = path.basename(filepath); // 파일 이름
console.log('basename : ' + basename);
var extname = path.extname(filepath);
console.log('extname : ' + extname); // .까지 포함한 확장자
