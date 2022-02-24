// 계산기 기능의 더하기 함수 정의
exports.add = function(a, b) {
    return a + b;
}; // exports 안에 속성 add가 들어 있다.

// exports : 전역 객체 - 어디서든 사용할 수 있는 객체
// exports 안에 add 속성을 추가하고, 그 속성에 함수를 할당했다.
// 여기서는 함수만 할당했다. 객체 자체를 할당하고 싶으면 exports가 아니라 module.exports를 쓰는 게 좀 더 편리할 수 있다.
