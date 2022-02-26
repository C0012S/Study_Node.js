// push와 pop을 썼을 때와 배열 원소가 들어가는 위치만 달라진다.
var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}];
console.log('배열 원소의 개수 : ' + users.length);

users.unshift({name:'티아라', age:21}); // unshift : 배열의 맨 앞쪽에 넣는다.
console.log('배열 원소의 개수 : ' + users.length);

console.dir(users);

var elem = users.shift(); // shift 배열의 맨 앞쪽에 있는 원소를 뺀다.
console.log('배열 원소의 개수 : ' + users.length);

console.log('shift로 꺼낸 첫 번째 원소');
console.dir(elem);

// push, pop이 더 많이 쓰인다.
