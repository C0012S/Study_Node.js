var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}];
console.log('배열 원소의 개수 : ' + users.length);

users.push({name:'티아라', age:21});
console.log('배열 원소의 개수 : ' + users.length);

var elem = users.pop();
console.log('배열 원소의 개수 : ' + users.length);

console.log('pop으로 꺼낸 세 번째 원소');
console.dir(elem);

// 배열 안에 원소를 뒤쪽에 추가하려면 push 메소드 사용 // 맨 뒤쪽에 있는 원소를 꺼내려면 pop 메소드 사용
