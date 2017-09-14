module.exports = {

  // web3.toAscii results in some padding \u0000 at the end,
  // this function fixes this problem
  // link to issue: https://github.com/ethereum/web3.js/issues/337
  myToAscii(input) {
    return web3.toAscii(input).replace(/\u0000/g, '');
  },
  bN: web3.toBigNumber,
  testAddress: '0xe76aC07465f353FF8De7C8450C39E936c85FA283',
  moreTestAddresses: [
    '0x817229b2d1cb37bf23b20185d59aff8595e52401',
    '0x249b1bf054d2b2643a0e38948aa92ccb6c2ccd7e',
    '0x54e3872db39fc3a1fa018688bff59dd6409b0a23',
    '0x4db089d50f72996895dc4224c8c6fae0f104bc1d',
    '0x74cd5f20ee949189bdc83f7f6088063eb7fdcc86',
    '0xa1fada6e4f11770a672ca678d6290b311f53c256',
  ],
};
