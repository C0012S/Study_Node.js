// 계산기 기능 - 더하기 함수 정의
exports.add = function(a, b) { // 전역 객체 exports
    return a + b;
};

// 함수만 할당
// 객체 자체를 할당해서 사용하고 싶은 경우, exports가 아니라 module.exports를 사용하면 좀 더 편리할 수도 있다.
