var output = '안녕!';
var buffer1 = new Buffer(10);
var len = buffer1.write(output, 'utf8'); // utf8 : 인코딩
console.log('버퍼에 쓰인 문자열의 길이 : ' + len);
console.log('첫 번째 버퍼에 쓰인 문자열 : ' + buffer1.toString());

console.log('버퍼 객체인지 여부 : ' + Buffer.isBuffer(buffer1));

var byteLen = Buffer.byteLength(buffer1);
console.log('byteLen : ' + byteLen);

var str1 = buffer1.toString('utf8', 0, 6);
console.log('str1 : ' + str1);

var buffer2 = Buffer.from('Hello', 'utf8');
console.log('두 번째 버퍼의 길이 : ' + Buffer.byteLength(buffer2)); // 버퍼의 길이는 한 번 만들어지면 길이 값을 변경하기 쉽지 않다.

var str2 = buffer2.toString('utf8', 0, Buffer.byteLength(buffer2));
console.log('str2 : ' + str2);
