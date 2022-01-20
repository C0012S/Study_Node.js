console.log('안녕하세요.');

console.log('숫자입니다. %d', 10);
console.log('문자열입니다. %s', '안녕');

var person = { // 직접 만든 자바스크립트 객체 // 다른 사람이 만든 객체를 쓰는 경우가 있다. - 라이브러리 # 다른 사람이 만든 라이브러리를 쓰는 경우에는, 객체를 라이브러리에서 만들어 주는 경우가 있고, 프로그램이 실행되는 중간에 만들어지는 경우도 있다.
    name:'소녀시대',
    age:20
};

console.log('자바스크립트 객체입니다. %j', person);

console.dir(person); // 객체가 갖고 있는 속성을 알고 싶다면 dir로 속성을 확인할 수 있다. // 객체가 갖고 있는 속성을 다 파악하지 못한 경우, 확인할 때 유용하게 사용할 수 있다.


console.time('duration_time'); // 키 값 : duration_time

var result = 0; // 숫자 자료형
for (var i = 0; i < 10000; i++) {
    result += i;
}

console.timeEnd('duration_time') // 동일한 키 값을 넣어 줌으로써, 사이의 코드가 걸린 시간을 체크해 준다.
// console이라는 객체를 자주 사용한다.


// 자주 사용하는 변수 : __filename, __dirname - 전역 변수
console.log('파일 이름 : %s', __filename); // __filename : test1.js라는 파일이 어떤 파일이다, 라고 하는 걸 패스로 알려 주는 것
console.log('패스 : %s', __dirname); // __dirname : test1.js라는 실행된 파일이 어떤 폴더에 있는지 패스로 알려 주는 것 
// 어떤 파일을 읽어들이겠다고 하는 경우, 어떤 폴더에 있는지 지정해 줘야 한다. // 어떤 파일이 어디에 있다, 라는 정보를 확인하기 위해 __filename과 __dirname이 사용된다. // 이를 전역 변수라고 한다.


// 여기까지 console 객체가 갖고 있는 대표적인 메소드들이다.
// 전역 객체 - 어디서든 사용할 수 있는 객체이며 대표적인 객체는 console이다.
// 그리고 또 다른 것으로 프로세스라고 하는 객체를 볼 수 있다.
