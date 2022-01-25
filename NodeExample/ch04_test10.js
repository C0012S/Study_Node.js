var output = '안녕!'
var buffer1 = new Buffer(10); // 길이가 10인 버퍼 객체 하나를 만든다.
var len = buffer1.write(output, 'utf8'); // 버퍼 안에 글자가 들어가게 된다. // utf8 : 인코딩 // write 할 때 return 되는 것은, 몇 개를 write 했는지 length가 나오게 된다.
console.log('버퍼에 쓰인 문자열의 길이 : ' + len);
console.log('첫 번째 버퍼에 쓰인 문자열 : ' + buffer1.toString());

// 버퍼 객체인지 아닌지를 isBuffer로 확인할 수 있다.
console.log('버퍼 객체인지 여부 : ' + Buffer.isBuffer(buffer1)); // buffer1 객체를 직접 만든 것이 아니라, 다른 사람이 만들어서 넘겨 준 것을 가지고 또는 라이브러리에서 만들어진 것을 넘겨 받아서 확인할 때 이렇게 확인할 수 있다.

// 안에 들어가 있는 글자만 따로 빼고 싶다면?
var byteLen = Buffer.byteLength(buffer1); // 길이 값이 return 된다.
console.log('byteLen : ' + byteLen); // 길이 값이 10이다. // 그 안에 글자가 어떤 게 들어가 있는지와 상관없이 10이라는 크기로 만들었기 때문이다.

// '안녕!'이 한글이므로 한글은 2 바이트씩으로, 5 바이트다. 5 바이트를 문자열로 한 번 빼 본다면?
var str1 = buffer1.toString('utf8', 0, 6); // 길이 값이 5 // 마지막 인수를 5로 하면, '안' 뒤로 잘린다. // 마지막 인수를 6으로 하면, '안녕'이 나온다. // 6 개까지 가야 '안녕'이 나온다.
console.log('str1 : ' + str1);
// 버퍼는 copy나 concat이라는 메소드가 있어서 그런 것을 가지고 복사를 하거나 두 개의 문자열을 붙일 수 있다.
// 파일을 다룰 때 이런 버퍼라는 게 사용된다.
// 문자열이든 데이터든, 이런 것들을 바이트 단위로 해서 넣었다가 뺄 수 있다.
// 인코딩이 utf인지, 다른 것인지에 따라서 실제 바이트의 길이도 조금씩 달라질 수도 있다. // 대부분 2 바이트다.
// 버퍼 객체를 사용하게 되는 경우 : open, read, write, close, 이렇게 직접 파일을 섬세하게 다루고 싶을 때 사용한다.

// 그 다음에 나오는 내용이 stream에 대한 내용이다. stream은 연속된 바이트 배열로 받아들이는 것을, 그런 통로를 stream이라고 보통 부른다. // 그래서 create read stream, create write stream을 만들어서 파일을 읽거나 쓸 수 있다.


// + 일반적으로 버퍼를 쓰는 방법
// 버퍼는 딱 정해진 크기로 처음에 만들어진다. 내부에 데이터가 들어가는 일종의 상자라고 생각하면 된다. 
// 버퍼를 문자열을 이용해서 만든다고 하면? // from이라고 하는 메소드를 쓸 수도 있다.
var buffer2 = Buffer.from('Hello', 'utf8'); // Hello를 버퍼로 만든다.
console.log('두 번째 버퍼의 길이 : ' + Buffer.byteLength(buffer2)); // buffer2에 들어 있는 버퍼의 길이 값은 byteLength를 이용한다.
// 일반적으로 버퍼는 한 번 만들어지면 그 길이 값을 변경하기가 쉽지 않다. // 배열과 비슷하다고 생각할 수 있다. // 보통 버퍼 안에 바이트로 된 데이터가 딱 고정 길이로 들어가게 만들게 된다.
// 문자열을 바이트 단위로 바꿔서 파일을 읽고 쓰고 할 때 사용이 된다면, 이런 식으로 문자열을 버퍼로 변환할 수 있다. 이런 식으로 변환해서 사용할 수 있다.

// toString으로도 사용 가능하다.
var str2 = buffer2.toString('utf8', 0, Buffer.byteLength(buffer2)); // toString : buffer2라고 하는 것을, 문자열이 그대로 버퍼로 바뀐 것이다. // Buffer.byteLength(buffer2) : 길이 값이 나온다.
console.log('str2 : ' + str2);
// 파일을 다룰 때 이렇게 버퍼를 사용할 수 있다.
