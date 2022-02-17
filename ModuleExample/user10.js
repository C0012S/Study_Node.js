function User(id, name) {
    this.id = id;
    this.name = name;
}

User.prototype.getUser = function() {
    return {id:this.id, name:this.name};
};

User.prototype.group = {id:'group01', name:'친구'};

User.prototype.printUser = function() {
    console.log('user 이름 : ' + this.name + ', group : ' + this.group.name);
};

module.exports = User; // 우리가 만든 User 프로토타입을 그대로 return // 약간의 차이가 있지만, new를 하지 않았다. // new를 하지 않았으니까 메인 파일에서 new를 해서 인스턴스 객체를 만들게 된다.
