const expect = require("chai").expect;
const testFile = require('../app/index')

describe('Index file', () => {
  it('should add Q value and return', (done) => {
    const inputValue = [
      {},
      {
        TYPE: '0',
        M: 'Coinbase',
        FSYM: 'BTC',
        TSYM: 'USD',
        F: '1',
        ID: '182235989',
        TS: 1622637609,
        Q: 11.0582,
        P: 37326.75,
        TOTAL: 2172.41685,
        RTS: 1622637609,
        TSNS: 206000000,
        RTSNS: 858000000
      },
      {
        TYPE: '0',
        M: 'Coinbase',
        FSYM: 'BTC',
        TSYM: 'USD',
        F: '1',
        ID: '182235989',
        TS: 1622637609,
        Q: 10.0582,
        P: 37326.75,
        TOTAL: 2172.41685,
        RTS: 1622637609,
        TSNS: 206000000,
        RTSNS: 858000000
      }
    ];
    const expectResult = testFile.getWebSocketVolume(inputValue, 40);
    expect(expectResult).equals(21.1164);
    done();
  })
})