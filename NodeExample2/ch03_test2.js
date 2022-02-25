// 자바스크립트에서 객체는 중괄호로 만든다. // 객체 안에는 속성을 추가할 수 있다.
var person = {}; // 객체를 만들어서 할당한다.

person['name'] = '소녀시대'; // . 연산자를 이용해 속성을 추가하거나, 대괄호를 넣고 그 안에 문자열로 된 속성 이름을 넣을 수 있다. // name 속성이 person 객체에 추가되면서 그 값은 '소녀시대'다.
person['age'] = 20;

console.log('이름 : ' + person.name);
console.log('나이 : ' + person['age']);
// 속성을 접근할 때는 .을 붙이거나 객체 뒤에 대괄호를 붙인다. // 대괄호는 배열에도 쓰인다. // 배열에서 쓰이는 대괄호와 다르다.

// 변수를 선언할 때 내부적으로는 변수 상자의 크기가 다르게 만들어진다. // 변수 상자의 크기가 Boolean, Number, String이 가장 기본적으로 있다. // 변수를 선언하고 값을 할당할 수 있다.
// 중괄호를 이용하여 객체를 만들 수 있다. // 중괄호를 이용해서 만든 객체 안에 속성을 넣을 수 있다. // 속성을 넣을 때는 대괄호 안에 속성 이름을 넣고 할당할 수 있고, 객체.속성으로 할당할 수도 있다.
