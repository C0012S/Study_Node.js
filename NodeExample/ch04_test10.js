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
