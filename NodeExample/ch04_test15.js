// 로그 파일을 남기는 방법 // 로그 파일로 만드는 방법?
// 로그 파일로 어떻게 만들 수 있을지에 대해서 외장 모듈로 다른 사람들이 많이 만들어 놨을 것이다. // → 그 중에서 winston 모듈을 사용해서 만든다.
var winston = require('winston'); // winston이라는 외장 모듈 이름 지정
// 일반적으로 로그를 남길 때 파일 단위로 남기기는 하는데, 계속 똑같은 파일에 로그가 쌓이면 엄청 커질 것이다. // 그래서 그것을 매일 다른 파일로 생성하는 경우가 일반적이다. // 이를 위해서 만들어진 게 winston-daily-rotate-file라는 것으로 만들어져 있다.
var winstonDaily = require('winston-daily-rotate-file'); // Daily : 하루에 하나의 파일이 만들어진다는 걸 표현했다.
var moment = require('moment'); // 날짜 관련해서 처리할 수 있는 기능들 // 날짜를 현재 시각에서 연도만 빼고, 월만 빼고, 싶을 때 많이 사용되는 게 moment가 있다. // 날짜나 시간 관련해서는, 이 moment라고 하는 외장 모듈을 상당히 많이 사용한다.
// 3 개의 외장 모듈을 사용하는 형태

// 날짜를 가지고 파일 명을 만들고 싶은 경우? // → 어떤 format 정보를 만들 수가 있는데, 그것을 함수로 하나 선언한다.
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); // 지금 현재 시간을 moment를 이용해서 확인한 다음에, format 함수를 이용해서 일정 format을 만들어 준다. // 이런 format으로 지금 현재 시간의 결과를 만들어서 넘겨 준다.
}

// logger 객체를 가지고 log를 찍을 수 있도록 한다. // logger : 일종의 설정 객체
var logger = winston.createLogger({ // new (winston.Logger)({가 오류 나서 수정
    // 이 안에 설정 정보를 넣을 것이다.
    transports: [
        new (winstonDaily)({ // 이것은 파일로 출력되기 위한 정보를 설정한 것이다.
            name:'info-file', // 로그 설정의 이름
            filename:'./log/server', // 로그 파일
            datePattern: 'YYYY-MM-DD',  // '_yyyy-MM-dd.log',가 오류 나서 수정
            colorize:false, // 색상에 대한 정보를 넣을 것인지
            maxsize:50000000, // 파일의 최대 크기 // 파일 크기가 이것보다 더 커지면 파일을 분리하라는 의미 // 50 메가
            maxFiles:1000, // 파일의 개수가 몇 개까지 되게 만들 것인지 // 분리된 파일이 몇 개까지 만들어질 것인지
            level:'info', // 로그를 남길 때, error level, warning level, 이런 식으로 단계를 나눠 놓는다. // info level까지만 출력
            showlevel:true,
            json:false, // json format을 출력할 것인지, 아니면 일반 한 줄, 한 줄, 그냥 문자열로 출력할 것인지
            timestamp:timeStampFormat // 위에서 만든 함수를 전달
        }),
        new (winston.transports.Console)({ // winston.transports.Console은 콘솔로, 명령 프롬프트나 콘솔 창에 뿌려지는 것이다.
            name:'debug-console',
            colorize:true, // 색상을 표시
            level:'debug', // 디버깅 레벨까지 보라는 것이다.
            showlevel:true,
            json:false,
            timestamp:timeStampFormat
        }) // ExceptionHandler를 넣을 수도 있다.
    ]
}); // winston 모듈을 만든 사람이 이런 형태로 넣어 달라고 하기 때문에 이렇게 넣는 것이다.
// 이런 식으로 설정할 수 있다. // logger 객체가 하나 만들어진다. // logger를 이용해서 뭔가를 출력할 수 있는 상태가 되는 것이다.

// logger의 debug 메소드를 호출하게 되면, 그 정보가 출력된다.
logger.debug('디버깅 메시지입니다.');
logger.error('에러 메시지입니다.');
// 이게 파일로도 저장될 수 있다.
// 실행하려면 외장 모듈을 설치해야 한다. // 외장 모듈 설치하려면, 명령 프롬프트에서 npm install winston --save와 npm install winston-daily-rotate-file --save, npm install moment --save를 입력한다. (mkdir log, dir log)

// 에러 메시지만 출력된 이유는 level:'info'로 info level보다 더 높은 것만, 중요한 것만 출력하라고 설정했기 때문이다. // debug 메시지는 info보다 더 중요하지 않기 때문에 출력되지 않았다.
// 파일이 만들어지는데, 날짜가 붙어 있다. 날짜가 계속 바뀌면 그 바뀌는 날짜마다 별도의 파일이 생성된다.
// 로그를 남기는 방법이다. // 로그를 남기는 방법은, 외장 모듈을 다른 것을 쓰면 다른 방법으로 처리할 수 있다.

// 5 장에서는 본격적으로 웹 서버를 만들어 볼 것이다.
