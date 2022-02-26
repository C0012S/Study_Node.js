var users = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}, {name:'티아라', age:21}];

var users2 = users.slice(1, 2); // 두 번째 원소부터 세 번째 원소까지 복사를 해서 잘라낸다. - 잘라낸다 : 그 전 거를 없앴다기보다는 그 부분을 잘라내서 새로 만들었다. 그래서 복제하는 데 사용된다고 보면 된다.

console.log('users 객체');
console.dir(users);

console.log('users2 객체');
console.dir(users2);

// 여러 개의 데이터가 있을 때, 여러 개의 데이터를 각각의 변수에 넣으면 변수가 많아진다. 그러므로 여러 개의 데이터를 관리할 때는 거의 배열로 처리하게 된다.
// JAVA나 C++에서는 여러 개의 데이터를 관리할 때, 자료형에 따라서 어떤 것으로 관리할 것인지, 여러 개의 데이터를 어떤 방식으로 관리할지가 많이 달라진다. // 자바스크립트는 배열 안에 String, Number, Boolean 이런 것들을 넣을 수 있고, 객체를 넣을 수 있고, 심지어는 함수까지 넣을 수 있기 때문에 배열 하나로 거의 다 처리가 된다.
