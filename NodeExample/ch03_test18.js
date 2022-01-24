var person1 = {name:'소녀시대', age:20};
var person2 = {name:'걸스데이', age:21};

function Person(name, age) { // name과 age라는 속성이 정의되고, 그 속성에 파라미터로 받은 값을 할당한다.
    this.name = name;
    this.age = age;
} // 함수처럼 보이는데, Person이라는 함수를 실행할 수 있고 붕어빵 틀로 사용할 수도 있다.

// 붕어빵 틀로 쓰려면, 속성에 일반 데이터가 들어 가는 게 아니라 함수를 속성으로 추가할 수도 있다.
Person.prototype.walk = function(speed) { // Person을 프로토타입 객체로 본다면(붕어빵 틀로 본다면), 그 안에 프로토타입이라는 속성이 들어가 있고, 그 안에 walk라는 속성을 추가할 수 있다. 그리고 여기에 함수를 할당할 수 있다.
    // 걸어간다는 기능
    console.log(speed + 'km 속도로 걸어갑니다.');
}; // Person은 붕어빵 틀

var person3 = new Person('소녀시대', 20); // 위에서 만든 객체(person1, person2)와 별반 차이가 없지만, person3에는 walk 함수가 같이 들어가 있다. name, age 속성과 walk라는 함수가 정의되어 있는 것이다.
var person4 = new Person('걸스데이', 22); // new : 객체 지향 언어에서 사용하는 연산자

person3.walk(10); // person3 안에 추가되어 있는 함수를 실행할 수도 있다.

// 붕어빵 틀에서 붕어빵 객체를 만들어 낼 때, 이렇게 사용한다.
// 인스턴스 객체 즉, 프로토타입이라고 하는 틀을 만들고 거기서 실제 붕어빵을 만들어 낼 수 있다.
// function Person과 Person.prototype.walk가 붕어빵 틀에 해당된다. // person3이 붕어빵에 해당된다.
// 속성을 추가할 수 있고, 그 속성에는 함수가 할당될 수 있다.

// Node.js 즉, 자바스크립트를 가지고 프로그램 형태로 만들 수 있고 웹 서버를 만들 수 있다는 것을 본격적으로 알게 될 것이다. // 알게 되면, 자바스크립트를 가지고 서버 쪽에서 또는 PC에서 만드는 게 상당히 쉽고 어렵지 않다는 것을 알 수 있을 것이다.
