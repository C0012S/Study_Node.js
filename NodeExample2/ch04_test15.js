// 3 개의 외장 모듈 사용
var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var moment = require('moment');

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

var logger = winston.createLogger({ // new (winston.Logger)({ // 오류로 인해 수정
    transports: [
        new (winstonDaily)({ // 파일로 출력되기 위한 정보를 설정한 것이기 때문에 파일로도 저장할 수 있다.
            name:'info-file', // 로그 설정의 이름
            filename:'./log/server', // 로그 파일
            datePattern:'YYYY-MM-DD', // '_yyyy-MM-dd.log', // 오류로 인해 수정
            colorize:false,
            maxsize:50000000, // 50 메가
            maxFiles:1000, // 파일의 개수를 몇 개까지 되게 만들 것인지 // 분리된 파일이 몇 개까지 만들어지도록 할 것인지
            level:'info',
            showLevel:true,
            json:false, // JSON format으로 출력할 것인지, 일반 한 줄로 문자열으로 출력할 것인지
            timestamp:timeStampFormat
        }),
        new (winston.transports.Console)({ // 명령 프롬프트나 콘솔 창에 뿌려지는 것이다.
            name:'debug-console',
            colorize:true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        })
    ]
});

logger.debug('디버깅 메시지입니다.');
logger.error('에러 메시지입니다.');
