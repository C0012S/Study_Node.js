var person1 = {name:'소녀시대', age:20};
var person2 = {name:'걸스데이', age:21};

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed) {
    console.log(speed + 'km 속도로 걸어갑니다.');
};
// 붕어빵 틀에 해당한다.

var person3 = new Person('소녀시대', 20);
var person4 = new Person('걸스데이', 22);
// 붕어빵에 해당한다.

person3.walk(10);
