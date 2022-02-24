console.log('argv 속성의 파라미터 수 : ' + process.argv.length);
console.dir(process.argv); // argv는 배열이다. // 명령 프롬프트에서 실행할 때 node ch02_02.js가 되는데, 그 두 개의 전체 경로가 들어가 있다는 것을 알 수 있다. // 어떤 자바스크립트 파일을 노드 실행 파일을 이용해서 실행했을 때 그때 두 개의 파라미터가 사용된다는 것을 알 수 있도록 해 준다.
// process도 대표적인 전역 객체 중 하나다. 어디서든 접근해서 사용할 수 있다.
// process.argv는 객체고 배열이다.
// 객체 자체를 그대로 dir로 출력했다.

process.argv.forEach(function(item, index) { // argv 안의 배열의 원소 개수만큼 함수를 실행해 준다.
    console.log(index + ' : ' + item);
}); // 각각을 접근해서 출력했다.

// process 객체의 env 속성을 이용해서 환경 변수를 확인할 수 있다.
// 전역 변수 또는 전역 객체가 어떤 것인지 대표적으로 console과 process가 갖고 있는 가장 간단한 속성과 또는 그 속성의 일부로 들어간 함수를 사용하는 방법에 대해서 살펴 봤다.
