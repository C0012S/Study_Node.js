process.on('tick', function(count) {
    console.log('tick 이벤트 발생함 : ' + count);
});

setTimeout(function() {
    console.log('2 초 후에 실행되었음.');
    
    process.emit('tick', '2'); // 이벤트를 emit으로 보내고 on으로 받는다.
}, 2000);
