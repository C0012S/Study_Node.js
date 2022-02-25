var person = {};

person.name = '소녀시대';
person['age'] = 20;
person.add = function(a, b) {
    return a + b;
}; // 객체 안에 들어가는 속성에 함수를 할당할 수 있다. // 함수를 별도의 변수에 할당한 다음에 다시 속성으로 할당할 수도 있다.

console.log('더하기 : ' + person.add(20, 20));
