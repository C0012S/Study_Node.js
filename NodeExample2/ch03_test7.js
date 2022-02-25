// 객체를 만들면서 속성을 처음부터 넣는 경우
var person = {
    name:'소녀시대',
    age:20,
    add:function(a, b) {
        return a + b;
    }
};

console.log('더하기 : ' + person.add(40, 40));