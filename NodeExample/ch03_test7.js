// 객체를 만들면서 속성을 처음부터 집어 넣는 경우
var person = {
    name:'소녀시대',
    age:20,
    add:function(a, b) { // 더하기 함수를 function이라고 하는 익명 함수로 할당
        return a + b;
    }
};

console.log('더하기 : ' + person.add(40, 40));
