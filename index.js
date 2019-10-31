const Blowfish = require('egoroof-blowfish');
const assert = require('assert');

const CIPHER_MODE_LIST = new Map([
  ['ECB', Blowfish.MODE.ECB],
  ['CBC', Blowfish.MODE.CBC]
]);
const PADDING_LIST = new Map([
  ['PKCS5', Blowfish.PADDING.PKCS5],
  ['ONE_AND_ZEROS', Blowfish.PADDING.ONE_AND_ZEROS],
  ['LAST_BYTE', Blowfish.PADDING.LAST_BYTE],
  ['PADDING_NULL', Blowfish.PADDING.NULL],
  ['SPACES', Blowfish.PADDING.SPACES]
]);
const TIMES = 1000;
const KEY = 'blowfish';
const TEXT = `
リーマンのゼータ関数の偶数 2n (n > 0) における特殊値はベルヌーイ数を用いて表すことができ、したがって無理数であることが分かるのだが、奇数 2n + 1 (n > 0) において一般に有理数であるのか無理数であるのかは、無理数であると予想されてはいるが、未解決のままである。
`;

function doPerformanceTest({ key, mode, padding, times, text, iv }) {
  const bf = new Blowfish(key, mode, padding);
  if (iv) {
    bf.setIv(iv);
  }

  // エンコードした文字列を作成
  const encodedText = bf.encode(text);

  // デコードした文字列を保存する
  const decodedTextList = [];
  decodedTextList.length = times;

  const startTime = +new Date();
  for (let i = 0; i < times; i++) {
    decodedTextList[i] = bf.decode(encodedText);
  }
  const endTime = +new Date();

  // デコード文字のチェック
  decodedTextList.forEach(t => {
    assert.equal(t, text);
  });

  return endTime - startTime;
}

console.log(`**text(${TEXT.length})="${TEXT}"**\n**key="${KEY}**`);
for (const [modeName, mode] of CIPHER_MODE_LIST) {
  for (const [paddingName, padding] of PADDING_LIST) {
    console.log(`- cipher Mode=${modeName}; padding=${paddingName}; times=${TIMES};`);
    const result = doPerformanceTest({
      key: KEY,
      mode: mode,
      padding,
      times: TIMES,
      text: TEXT,
      iv: 'abcdefgh'
    });
    console.log(`  - ${result} msec`);
  }
}
