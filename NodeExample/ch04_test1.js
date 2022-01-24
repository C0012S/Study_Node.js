// url 모듈을 사용하겠다 → require라고 하는 함수를 사용한다.
var url = require('url'); // url 모듈을 불러온다. // url 모듈에서 불러온 객체를 url 변수에 할당한다.

var urlStr = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=Popcorn'; // 네이버에서 Popcorn 검색한 주소 // 클라이언트에서 웹 서버로 요청한 정보

var curUrl = url.parse(urlStr); // 현재의 url 객체 // 원래는 문자열이었던 게 parse로 객체가 만들어진다.
console.dir(curUrl) // host나 hostname으로 정보(search.naver.com)를 확인할 수 있다. // pathname : 요청 path로 붙는 것을 얘기한다.(/search.naver) // query : ? 뒤에 있는 요청 파라미터들을 얘기한다. // 이렇게 객체로 다 분리되어 있다.

console.log('query -> ' + curUrl.query); // curUrl 객체의 query 속성
 
// 다른 사람이 parsing 해 놓은 객체가 있을 수도 있다. // 객체로 만들어서 정보들을 속성으로 넣어 놨을 수도 있다. // 다시 문자열로 만들고 싶은 경우?
var curStr = url.format(curUrl);
console.log('url -> ' + curStr); // 정보들을 다시 결합해서 새로운 문자열을 만들어 낸다. // 결국 원본과 같아지는 상황이 된다.

// url 객체가 사용되는 방법이다.

// 웹 서버를 만들게 되면, 웹 서버 쪽으로 요청하면 웹 서버에서 클라이언트가 요청한 이 url을 직접 처리해야 할 경우가 있다.
// 나중에는 직접 처리 안 해도 이 중에 요청 파라미터가 무엇인지를 다 처리해서 넘겨 준다. 굳이 이거를 직접 처리해야 할 경우는 많지 않을 수 있다. 하지만 직접 처리하는 경우도 있으니 참고로 알아 두면 좋다.

// query String 문자열 안에서 검색어만 뽑아내고 싶다면?
var querystring = require('querystring'); // querystring이라는 모듈이 있다.
var params = querystring.parse(curUrl.query); // curUrl.query : 요청 파라미터가 분리되어 있는 게 들어 있다.
console.log('검색어 : ' + params.query);

// url 모듈과 querystring 모듈 : 웹 서버 쪽으로 웹 브라우저에서 요청할 때, 요청 path와 요청 파라미터라는 것을 어떻게 분리해서 확인할 수 있는지 그 방법을 제공한다.
// 웹 서버를 만들기 위한 도구들이 이런 것들을 자동으로 해 주게 되는데, 직접 처리하는 경우도 생길 수 있다.
