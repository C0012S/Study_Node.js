// 라우팅 함수를 위한 설정 정보를 config.js 안에 넣어 놓았다. 그 정보를 이용해서 로딩한다.

var route_loader = {}; // route_loader 객체 생성 // database_loader.js에서 database 객체를 하나 만들고 마지막에 module.exports에 할당했다. 그거와 동일한 방법이다.

var config = require('../config'); // config 정보를 app2.js에서 전달해 줄 수도 있고, 아니면 여기서 바로 require로 로딩할 수도 있다.

route_loader.init = function(app, router) {
    console.log('route_loader.init 호출됨.');
    
    initRoutes(app, router); // initRoutes 안에서 라우팅 함수를 등록할 텐데, 라우팅 함수를 다 등록한 다음에 필요하면 return 해 줄 수도 있을 것이다. 근데 굳이 필요없으면 책에서 있는 것처럼 return 하는 키워드는 필요없다.
}

function initRoutes(app, router) { // initRoutes 안에서 각각의 라우팅 함수를 require로 불러와서 즉, 모듈을 불러와서 라우팅 함수를 등록할 수 있을 것이다.
    console.log('initRoutes 호출됨.');
    
    // config 안에 몇 개의 라우팅 함수 정보가 설정되어 있는지 보고 로딩한다.
    for (var i = 0; i < config.route_info.length; i++) {
        var curItem = config.route_info[i]; // config.route_info의 i 번째 배열 요소를 curItem 변수를 만들어서 할당한다. 여기에 객체가 들어간다. // 그 객체를 이용해서 그 안에 있는 속성을 가지고 require 하면 된다.
        
        var curModule = require(curItem.file); // 로딩했더니 모듈이 되는 것이다. // 그대로 그 모듈을 가지고 온 것이라고 보면 된다.
        if (curItem.type == 'get' ) { // type : GET 방식인지 POST 방식인지  // 'get' 방식이라면
            router.route(curItem.path).get(curModule[curItem.method]); // router 객체에 route를 하고 curItem.path를 가지고 route 함수를 실행하면서 파라미터로 넘겨 준 다음에 get이라는 함수를 실행해야 한다. get이라는 함수를 실행하면서 curModule의 속성을 볼 건데, 대괄호는 속성을 보겠다는 것이다. curItem.method를 가지고 그 안에 있는 속성을 본다. 그러면 login이라든가 이렇게 등록된 것들을 여기서 사용할 수 있게 된다.
        }
        else if (curItem.type == 'post') { // 'post' 방식이면
            router.route(curItem.path).post(curModule[curItem.method]);
        }
        else { // type을 알 수가 없다.
            console.error('라우팅 함수의 타입을 알 수 없습니다. : ' + curItem.type); // 책에는 그래도 그냥 post 방식으로 로딩하도록 되어 있다. // 여기는 에러를 표시하도록 한다.
        }
    }
    
    app.use('/', router);
}


module.exports = route_loader;

// route_loader라는 걸 실행하기만 하면 app2.js에서 하던 일이 아주 간단한 일로 바뀌게 된다.
