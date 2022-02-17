function User(id, name) {
    this.id = id;
    this.name = name;
} // 프로토타입으로 사용될 수 있다.
// new 연산자를 호출하게 되면 프로토타입으로 사용돼서 프로토타입 객체를 만들어 내는 데 역할을 하게 된다. 일반적인 함수 호출과 다르다.

User.prototype.getUser = function() {
    return {id:this.id, name:this.name};
};

User.prototype.group = {id:'group01', name:'친구'};

User.prototype.printUser = function() {
    console.log('user 이름 : ' + this.name + ', group : ' + this.group.name);
};

// User가 지금 프로토타입으로 동작하고 있다.
module.exports = new User('test01', '소녀시대'); // 프로토타입에서 만들어진 프로토타입 인스턴스 객체가 된다. // 즉, 프로토타입 객체를 만들어서 return 하게 된다.
