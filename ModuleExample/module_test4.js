var user = require('./user4'); // user에는 user4.js의 함수가 할당되어 있다.

function showUser() {
    return user().name + ', ' + 'No Group'; // user 함수를 실행하면 user 객체가 return 된다.
}

console.log('사용자 정보 : ' + showUser());

// 중요한 점 : user 모듈이 함수로 return 되니까, 함수는 소괄호로 실행하므로 user() 이렇게 된다.
