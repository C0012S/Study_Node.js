// 자바스크립트의 객체는 중괄호로 만들고, 배열은 대괄호로 만든다.  // 객체를 만들었을 때 객체 안에 들어가 있는 각각의 속성을 접근할 때, 변수 이름 뒤에 대괄호를 붙였다. 그 대괄호와는 다르다.  // 대괄호만 하나 붙이면 배열이 된다.
// var users = []; // 대괄호로 만든 배열이 users라는 변수에 할당된다.
var names = ['소녀시대', '걸스데이', '티아라']; // 배열 안에 무언가를 넣을 수 있는데, 처음부터 그 안에 원소(element)를 넣을 수 있다.  // 3 개의 원소가 들어가는 배열 하나

var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}]; // 배열 안에 객체를 넣을 수 있다. // 객체 안에는 속성이 들어갈 수 있다.
// 배열을 만들면서 처음에 초기화를 같이 한 것이다.

// 이미 초기화되어 있는, 이미 만들어져 있는 배열 객체에 원소(element)를 추가하고 싶다면 배열객체.push로 추가할 수 있다. // push 메소드로 원소를 집어 넣을 수 있다.
users.push({name:'티아라', age:21}); // 객체 원소 하나 추가

console.log('사용자 수 : ' + users.length); // 배열 객체가 만들어지면, length라고 하는 속성이 만들어진다. - 몇 개가 그 안에 들어있는지를 알 수 있게 해 준다.
console.log('첫 번째 사용자 이름 : ' + users[0].name); // 각각의 원소를 직접 접근할 수 있다.
