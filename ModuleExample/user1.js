// 모듈 파일 - 사용할 기능 중의 또는 코드 중의 일부를 만든다. // exports 전역 객체가 사용됐다.
exports.getUser = function() {
    return {id:'test01', name:'소녀시대'};
}; // exports : 전역 객체. 어디서든 사용할 수 있다. 모듈 파일에서 설정하고, 속성으로 추가하고, 그 다음에 메인 파일에서 모듈을 읽어들인 다음에, 그 속성으로 추가한 것을 사용할 수 있다. // getUser 속성 추가 // getUser : 사용자 정보를 return 받는 함수 // getUser에 함수를 할당하면 getUser라는 함수를 바로 실행할 수 있다.

exports.group = {id:'group01', name:'친구'}; // 객체를 바로 할당하면 group 속성을 통해 객체를 참조할 수 있다.
