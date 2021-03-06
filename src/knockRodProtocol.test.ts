import {
  alarmDetailDescriptionReading,
  CTLF,
  decelerationStopCommand,
  DSS1,
  enumBitSetFromNumber,
  homeReturn,
  numberFromEnumBitSet,
  numericalValueMovementCommand, parseAlarmDetailDescriptionReadingResponse,
  parseException, parsePresentAlarmCodeResponse,
  pioModbusOnCommand,
  positionCommand,
  positionVelocityAndAccelerationCommand,
  queryDeviceMovementHistory, queryStatusRegisters,
  resetAlarm,
  servoOnCommand,
} from "./knockRodProtocol";


function buf2hex(buffer:ArrayBuffer) : string {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hex2Buf(hex:string) : Uint8Array {
  return new Uint8Array((hex.match(/[\da-f]{2}/gi) || []).map(function (h) {
    return parseInt(h, 16)
  }));
}

describe('TrusterProtocol', () => {

  it('can calculate bitsets', () => {
    expect(enumBitSetFromNumber(24, DSS1)).toEqual(new Set([DSS1.PEND, DSS1.HEND]));
  });

  it('positionCommandRtu works according to spec', () => {
    expect(buf2hex(positionCommand(5000))).toEqual("011099000002040000138838AF");
  });

  it('velocityAndAccelerationCommandRtu works according to spec', () => {
    expect(buf2hex(positionVelocityAndAccelerationCommand(5000, 10000, 30, 10))).toEqual("0110990000070E000013880000000A00002710001E50CF");
  });

  it('numericalValueMovementCommand works according to spec', () => {
    expect(buf2hex(numericalValueMovementCommand(5000, 2000, 10000, 30, 178,[CTLF.PUSH, CTLF.DIR]))).toEqual("0110990000091200001388000007D000002710001E00B20006C377");
  });

  it('queryStatusRegisterRtu works according to spec', () => {
    expect(buf2hex(queryStatusRegisters)).toEqual("01039000000AE8CD");
  });

  it('homeReturn works according to spec', () => {
    expect(buf2hex(homeReturn[0])).toEqual("0105040B0000BD38");
    expect(buf2hex(homeReturn[1])).toEqual("0105040BFF00FCC8");
  });

  it('resetAlarmRtu works according to spec', () => {
    expect(buf2hex(resetAlarm[0])).toEqual("01050407FF003CCB");
    expect(buf2hex(resetAlarm[1])).toEqual("0105040700007D3B");
  });

  it('pioModbusOnCommand works according to spec', () => {
    expect(buf2hex(pioModbusOnCommand)).toEqual("01050427FF003D01");
  });

  it('servoOnCommand works according to spec', () => {
    expect(buf2hex(servoOnCommand(true))).toEqual("01050403FF007D0A");
  });

  it('queryDeviceMovementHistory works according to spec', () => {
    expect(buf2hex(queryDeviceMovementHistory())).toEqual("0103840000046CF9");
  });

  it('decelerationStopCommand works according to spec', () => {
    expect(buf2hex(decelerationStopCommand)).toEqual("0105042CFF004CC3");
  });

  it('alarmDetailDescriptionReading works according to spec', () => {
    expect(buf2hex(alarmDetailDescriptionReading)).toEqual("010305000006C504");
  });

  it('parseException works according to spec', () => {
    expect(parseException(hex2Buf("03820260A1"))).toEqual({ originalFunctionCode: 0x02, exceptionCode: 2,  exceptionMessage: 'Illegal Data Address'});
  });

  it('parseAlarmDetailDescriptionReadingResponse works according to spec', () => {
    expect(parseAlarmDetailDescriptionReadingResponse(hex2Buf("01030C0000FFFF000000E8172C643F2DCD"))).toEqual({ detailCode: 0x0000, address: 0xFFFF,  code: 0x000000E8, occurrenceTime: 0x172C643F});
  });

  it('parsePresentAlarmCodeResponse works according to spec', () => {
    expect(parsePresentAlarmCodeResponse(hex2Buf("01030200E8B80A"))).toEqual(0x00E8);
  });

  it('numberFromEnumBitSet works by summing up its values', () => {
    expect(numberFromEnumBitSet([CTLF.PUSH, CTLF.INC])).toEqual(0x0A);
  });

});
