var url = require('url'); // url 모듈에서 불러온 객체를 url 변수에 할당한다.

var urlStr = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=Popcorn'; // 클라이언트에서 웹 서버로 요청한 정보
// path name : /search.naver  // query : ? 뒤의 요청 파라미터

var curUrl = url.parse(urlStr); // 현재의 url 객체
console.dir(curUrl);

console.log('query -> ' + curUrl.query);

var curStr = url.format(curUrl);
console.log('url -> ' + curStr);

var querystring = require('querystring');
var params = querystring.parse(curUrl.query);
console.log('검색어 : ' + params.query);

// url 모듈과 querystring 모듈 모두 웹 서버 쪽으로 웹 브라우저에서 요청할 때, 요청 path, 요청 parameter를 어떻게 분리해서 확인할 수 있는지 그 방법을 제공한다.
