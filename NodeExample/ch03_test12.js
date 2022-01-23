// ch03_test11.js에서 push와 pop을 썼을 때와 배열 원소가 들어가는 위치만 달라진다.
var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:'22'}];
console.log('배열 원소의 개수 : ' + users.length);

users.unshift({name:'티아라', age:21}); // unshift : 배열의 맨 앞쪽에 집어 넣는다.
console.log('배열 원소의 개수 : ' + users.length);

console.dir(users); // unshift 한 다음에 users 객체 확인

var elem = users.shift();
console.log('배열 원소의 개수 : ' + users.length);

console.log('shift로 꺼낸 원소');
console.dir(elem);

// unshift와 shift 메소드

// → 그 다음은 delete 메소드
// delete : 어떤 것을 삭제한다. 배열 원소에도 delete가 적용될 수 있다.
