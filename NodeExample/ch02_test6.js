var calc2 = require('./calc2'); // calc2.js에서 module.exports에 할당한 calc 객체가 calc2 객체에 그대로 return 된다. (= 똑같다.)

console.log('모듈로 분리한 후 - calc2.add : ' + calc2.add(30, 30));


// 다른 사람이 만든 모듈을 사용할 수도 있다.  
// 전역 객체 중에 환경 변수를 확인할 수 있는 것들이 있지만, 사용자 변수 위주로 확인이 된다. // 시스템 변수를 확인할 수 있는 방법을 별도로 만들어 놓은 모듈이 있다.
var nconf = require('nconf'); // nconf : 외장 모듈로 만들어 놓은 것  // 직접 만든 게 아닌 제공되는 모듈인 경우, 상대 path가 아니라 이름만 붙여 주면 된다.  // nconf를 이용해서 시스템 환경 변수를 확인할 수 있다.
nconf.env(); // nconf.get('OS')가 undefined로 나와서 추가 -> 해결  // 시스템 환경 변수를 확인
var value = nconf.get('OS'); // get에 OS라는 시스템 환경 변수를 지정하면 값을 확인할 수 있다.
console.log('OS 환경 변수의 값 : ' + value);

// cmd에서 npm install nconf
// 이 파일을 다른 PC에서 실행하고 싶을 때 가져가면 또 설치해야 한다. 설치하는 걸 편리하게 해 주기 위해 npm init을 먼저 실행
// npm init 실행 후 이름(name)은 nodeexample, 나머지는 모두 기본으로 설정(Enter로 넘어간다.)한다.
// dir 하면 package.json이 만들어진 것을 확인할 수 있다. - package.json은 설정 파일이다. 자바스크립트 객체처럼 만들어 놓은 것이다.
// package.json의 dependencies 안에 외장 모듈을 설치하면 어떤 것을 설치했는지 나온다.
// 이 파일과 package.json, 소스 파일을 다른 PC로 가지고 갔을 경우, 어떤 특정 폴더로 옮겨 놓은 다음 npm install을 실행한다. -> 그 안에 외장 모듈을 설치했던 정보(package.json 파일)를 가지고 있기 때문에 알아서 설치한다. 일일이 설치할 필요가 없다.
// npm install nconf --save로 설치하면 package.json 안에 그 정보가 자동으로 들어간다. -> npm install로 나중에 다른 PC로 옮긴 다음에도 사용할 수 있다.
