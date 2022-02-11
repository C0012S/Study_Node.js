var user1 = require('./user1'); // user1.js에 넣어 둔 코드를 불러온다. // 직접 만든 모듈은 상대 path를 사용한다. // 확장자는 제외

function showUser() {
    return user1.getUser().name // getUser를 하면 user 객체가 return 된다. // user 객체가 return되면 왼쪽으로 return 될 수도 있지만 바로 호출할 수도 있다. // 그 안에 name 속성이 들어있다. // .name : return 된 객체의 이름을 참조할 수 있다.
        + ', ' + user1.group.name; // user1에 group이 또 있다. 이거는 객체 자체를 가리킨다. .name을 바로 할 수 있다.
} // user1이라고 하는, 이 모듈 안에 들어가 있는, getUser 함수를 호출해서 객체를 return 받고 .name을 한다. 그 값을 + 로 붙여 본다. // 그 뒤에 group.name을 붙여 본다. 그리고 그거를 함수가 return 한다.

console.log('사용자 정보 -> ' + showUser());

// 모듈을 만드는 가장 기본적인 형태 한 가지를 봤다.
// 기본적인 형태 중에서 exports 전역 객체를 사용하는 방법을 봤다.
// exports는 한계가 한 가지 있다. // exports에 속성을 추가하는 방식으로 하니까 이렇게 처리되지만, 속성을 추가하는 게 아니라 exports에 그냥 객체를 바로 할당하면 문제가 생긴다. // exports가 전역 객체로써 모듈 파일 안에 들어있는 그런 형태, 모듈 파일 밖에서 메인 파일에서 참조할 수 있는 형태가 아니라 다른 식으로 참조된다. // 그래서 exports를 사용할 때는 꼭 속성으로 추가해야 된다.
// 이렇게 속성으로 추가해야 된다는 걸 생각하고, 그래서 나오는 게 module.exports가 나온다. module.exports는 module.exports에 그냥 객체를 바로 할당할 수 있다.
