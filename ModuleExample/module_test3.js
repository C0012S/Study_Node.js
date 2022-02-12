var user = require('./user3'); // module.exports가 return 된다. 즉, user 객체가 그대로 return 된다.

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log('사용자 정보 : ' + showUser());
