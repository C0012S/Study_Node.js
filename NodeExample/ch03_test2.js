var person = {}; // 자바스크립트에서 객체를 만들어 본다.  // 자바스크립트 객체는 중괄호로 만든다.  // 객체 안에는 속성을 추가할 수 있다.

person['name'] = '소녀시대'; // 속성을 집어 넣는다.  ->  'person.' 이렇게 . 연산자를 사용하거나, 대괄호를 넣고 그 안에 문자열로 된 속성 이름을 넣을 수 있다.([''])  // name이라고 하는 속성이 person 객체에 추가되면서, 그 값은 소녀시대다.
person['age'] = 20;

console.log('이름 : ' + person.name);
console.log('나이 : ' + person['age']); // person['age'] 대신 person.age도 가능하다.
// 속성을 접근할 때는, 점을 붙이거나 또는 객체 뒤에 대괄호를 붙일 수 있다.  // 대괄호는 배열에서도 쓰였다. 배열에서 쓰이는 대괄호와 다르다.

// 변수를 선언할 때 내부적으로는 변수 상자의 크기가 다르게 만들어진다. 변수 상자의 크기가 boolean, number, string이 가장 기본적으로 있다.
// 그런 가장 기본적인 것들이 있는 상태에서 변수를 선언하고 거기에 값을 할당할 수 있다.
// 객체를 중괄호를 이용해서 만들 수 있다. // 중괄호를 이용해서 만드는 객체 안에 속성을 집어 넣을 수 있다. // 집어 넣을 때는, 대괄호 안에 속성 이름을 집어 넣고 할당할 수 있다. 그리고 객체.속성, 이렇게 해서 할당할 수도 있다.
