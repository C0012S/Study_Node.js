var require = function(path) {
/*    
    var exports = {
        getUser: function() {
            return {id:'test01', name:'소녀시대'};
        },
        group:{id:'group01', name:'친구'};
    };
*/    
    // 이런 형태도 가능하다. // 이렇게 하면 module 파일에서 만들었던 내용과 상당히 유사하다.
    var exports = {};
    
    exports.getUser = function() {
        return {id:'test01', name:'소녀시대'};
    };
    
    exports.group = {id:'group01', name:'친구'};
    
    return exports;
}

var user = require('...'); // user 변수로 할당받는 것은 위에서 return 한 exports다. 이 객체가 return 되고, 이 안의 속성을 사용할 수 있다.

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log('사용자 정보 : ' + showUser());

// 모듈을 분리시킨 게 아니다. // require를 썼는데, 쓰던 코드와 거의 똑같다. // 실제로 모듈 파일로 분리시켜서 처리하는 것은 Node.js에서 이런 require 함수를 내부적으로 만들어 놓은 것이다. 근데 require 함수가 동작하는 방식이 이 정도로 간단하다. 이 logic을 이런 식으로 동작한다는 걸 이해한다면 require라는 게 module 파일로 분리되어 있지만, 이 안에 require 함수가 이런 식으로 구성되어 있으니까 가져와서 이런 식으로 쓸 수 있다는 것을 이해할 수 있다.
