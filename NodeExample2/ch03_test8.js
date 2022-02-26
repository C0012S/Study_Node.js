// 자바스크립트의 객체는 중괄호로 만들고, 배열은 대괄호로 만든다. // 대괄호는 객체를 만들었을 때, 객체 안에 들어있는 각각의 속성을 접근할 때 변수 이름 뒤에서 대괄호를 붙였는데 그 대괄호와 배열을 만들 때의 대괄호와 다르다.
var names = ['소녀시대', '걸스데이', '티아라'];

var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}];

users.push({name:'티아라', age:21}); // element 원소 추가

console.log('사용자 수 : ' + users.length);
console.log('첫 번째 사용자 이름 : ' + users[0].name);
