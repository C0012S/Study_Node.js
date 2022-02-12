var user = {
    getUser: function() {
        return {id:'test01', name:'소녀시대'};
    },
    group: {id:'group01', name:'친구'}
}; // user 객체 - getUser와 group 속성을 가진다.

module.exports = user; // exports만 썼을 때는 exports 밑에 .user라고 해서 속성을 추가했는데, module.exports는 그냥 user 할당이 가능하다.
