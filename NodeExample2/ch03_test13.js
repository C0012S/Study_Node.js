var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}, {name:'티아라', age:21}];

delete users[1]; // users 배열의 두 번째 원소 삭제

console.dir(users); // 배열의 개수는 3 개로 인식되어 바뀌지 않는다. - 값이 없다고 나온다. // length를 하면 3 개가 나온다.

users.forEach(function(elem, index) {
    console.log('원소 #' + index); // 두 번째 원소의 값은 출력되지 않는다.
    console.dir(elem);
});
// 배열 원소 안의 중간에 있는 것들을 삭제하려면 delete를 쓰지 않는다. // 대신 splice를 사용한다.
// splice : 중간에 있는 것을 삭제할 때 사용한다. 또는 중간에 원소를 추가할 때 사용한다. // 그래서 splice의 파라미터가 중요하다. // splice의 첫 번째 파라미터 : 중간의 index // splice의 두 번째 파라미터 : 몇 개를 삭제하는지 - 0은 추가하는 경우, 개수가 나오면 삭제하는 경우

users.splice(1, 0, {name:'애프터스쿨', age:24}); // 두 번째 원소 자리에 추가
console.dir(users);

users.splice(2, 1); // index 2부터 시작해서 하나를 삭제한다.
console.dir(users);

// splice : 중간에 있는 원소를 추가하거나 삭제한다. 파라미터에 따라서 달라진다.
