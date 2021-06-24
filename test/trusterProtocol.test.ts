import {calculateLRC, DSS1, enumBitSetFromNumber} from "../src/trusterProtocol";


describe('TrusterProtocol', () => {
  it('can calculate LRCs', () => {
    expect(calculateLRC("01039000000A")).toEqual("62");
  });


  it('can calculate bitsets', () => {
    expect(enumBitSetFromNumber(1, DSS1)).toEqual([DSS1.CLBS]);
  });

});
