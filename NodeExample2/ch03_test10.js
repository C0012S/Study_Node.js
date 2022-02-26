var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}, {name:'티아라', age:21}]; // 배열 할당

// C style for 문
for (var i = 0; i < users.length; i++) {
    console.log('배열 원소 #' + i + ' : ' + users[i].name);
} // 성능 면에서 C style for 문보다 forEach 사용을 권장한다.

users.forEach(function(elem, index) {
    console.log('배열 원소 #' + index + ' : ' + elem.name);
});

// 배열 안의 원소를 확인하는 방법이다.
