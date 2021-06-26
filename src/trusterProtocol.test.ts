import {
  calculateLRC,
  DSS1,
  enumBitSetFromNumber,
  positionCommand, positionCommandRtu, positionVelocityAndAccelerationCommandRtu, queryStatusRegisterRtu,
  velocityAndAccelerationCommand
} from "./trusterProtocol";


function buf2hex(buffer:ArrayBuffer) : string {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

describe('TrusterProtocol', () => {

  it('can calculate LRCs', () => {
    expect(calculateLRC("01039000000A")).toEqual("62");
  });

  it('can calculate LRCs from examples', () => {
    expect(calculateLRC("0110990000070E000013880000000A00002710001E")).toEqual("47");
  });

  it('can calculate bitsets', () => {
    expect(enumBitSetFromNumber(24, DSS1)).toEqual(new Set([DSS1.PEND, DSS1.HEND]));
  });

  it('positionCommand works according to spec', () => {
    expect(positionCommand(5000)).toEqual(":0110990000020400001388B5\r\n");
  });

  it('positionCommandRtu works according to spec', () => {
    //expect(buf2hex(positionCommandRtu(5000))).toEqual("011099000002040000138838FF"); FIXME spec says this should end with FF
    expect(buf2hex(positionCommandRtu(5000))).toEqual("011099000002040000138838AF");
  });

  it('velocityAndAccelerationCommand works according to spec', () => {
    expect(velocityAndAccelerationCommand(5000, 30)).toEqual(":0110990400030600001388001E90\r\n");
  });

  it('velocityAndAccelerationCommandRtu works according to spec', () => {
    expect(buf2hex(positionVelocityAndAccelerationCommandRtu(5000, 10000, 30, 10))).toEqual("0110990000070E000013880000000A00002710001E50CF");
  });

  it('queryStatusRegisterRtu works according to spec', () => {
    expect(buf2hex(queryStatusRegisterRtu())).toEqual("01039000000AE8CD");
  });


});
