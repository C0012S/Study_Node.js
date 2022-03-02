process.on('exit', function() {
    console.log('exit 이벤트 발생함.');
}); // exit 이벤트 처리할 방법을 마련

setTimeout(function() {
    console.log('2 초 후에 실행되었음.');
    
    process.exit(); // 내부적으로 emit을 보내는 과정이 발생한다.
}, 2000); // 2 초 후에 함수 실행

console.log('2 초 후에 실행될 것임.');
