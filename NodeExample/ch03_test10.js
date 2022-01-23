var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}, {name:'티아라', age:21}];

for (var i = 0; i < users.length; i++) {
    console.log('배열 원소 #' + i + ' : ' + users[i].name);
}

users.forEach(function(elem, index) { // forEach 함수 안에 function(함수)을 전달해 달라고 한다. 이거는 콜백 함수가 된다.
    console.log('배열 원소 #' + index + ' : ' + elem.name);
});

// 배열 안에 들어가 있는 원소를 확인하는 방법
