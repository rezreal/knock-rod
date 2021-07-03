/** Bit-set of the STAT system status registers (Address = 0x9008) **/
import {crc16modbus} from "crc";

export enum STAT {
    /**
     * Drive source ON
     * 0: Drive source cut off
     * 1: Normal
     * This bit will turn 0 when the motor drive-source cutoff terminal is released.
     */
    MPOW = 1 << 0,

    /**
     * Servo command status
     * 0: Servo OFF
     * 1: Servo ON
     * This bit indicates the servo ON/OFF command status.
     * This bit will turn 1 when the following conditions are met:
     * • The EMG status bit in device status register 1 is 0.
     * • The major failure status bit in device status register 1 is 0.
     * • The enable status bit in device status register 2 is 1.
     * • The auto servo OFF status in the system status register is 0.
     */
    SON = 1 << 1,

    /** Servo status
     * 0: Servo OFF
     * 1: Servo ON
     * The servo ON status is indicated. After a servo ON command is issued, this bit will remain 0 until the servo ON delay time set by a parameter elapses.
     * If the servo cannot be turned ON for some reason even after a servo ON command is received, this bit will remain 0.
     * The RC controller does not accept any movement command while this bit is 0.
     *
     * */
    SV = 1 << 2,

    /**
     * Home return completion status.
     * 0: Home return not yet complete
     * 1: Home return completion
     * This bit will become 1 when home return is completed. In case the
     * absolute specification is set, the bit is set to 1 from the startup if absolute
     * reset has been completed.
     * If a movement command is issued while this bit is 0, an alarm will
     * generate.
     */
    HEND = 1 << 3,

    /**
     * Operation mode status
     * 0: AUTO mode
     * 1: MANU mode
     * This bit becomes 1 when the RC controller is in the MANU mode.
     * Note that the controller is always in the MANU mode in cases of models
     * not equipped with an operation mode switch (ERC2, PCON-SE/CY and
     * ACON-SE/CY).
     */
    RMDS = 1 << 4

}

/** Bit-set of the DSSE expansion device status register (Address = 0x9007) */
export enum DSSE {
    /**
     * Moving signal
     * 0: Stopped
     * 1: Moving
     * This bit indicates whether or not the actuator is moving (conditions during
     * home return and push-motion operation included). This bit remains 0 while
     * the actuator is paused.
     */
    MOVE = 1 << 5,
    /**
     * PIO/Modbus switching status
     * 0: PIO commands enabled
     * 1: PIO command disabled
     */
    PMSS = 1 << 8,
    /**
     * Excitation detection status
     * 0: Excitation detection not yet complete
     * 1: Excitation detection complete
     * PCON/ERC2, ERC3 Series controllers perform excitation detection at the
     * first servo ON command received after the controller has started. This bit
     * becomes 1 when excitation detection is completed.
     * This bit remains 0 if the excitation detection has failed. Even after a
     * successful detection, the bit will return to 0 when a software reset is
     * performed.
     * This bit becomes 1 if pole sensing is performed with the first servo ON
     * command after startup and the operation is completed in case of ACON
     * series controllers
     */
    PSNS = 1 << 9,

    /**
     * Push-motion operation in progress
     * 0: Normal
     * 1: Push-motion operation in progress
     * This bit remains 1 while the actuator is performing a push-motion operation
     * (excluding an approach operation. It will turn 0 under the following
     * conditions:
     * 1. The actuator has missed the push motion operation.
     * 2. The actuator has paused.
     * 3. The next movement command has been issued.
     * 4. The servo has turned OFF.
     */
    PUSH = 1 << 10,

    /**
     * Home return status
     * 0: Normal
     * 1: Home return
     * This bit remains 1 for as long as home return is in progress. This bit will be 0 in other cases.
     */
    GHMS = 1 << 11,

    /**
     * Operation mode status
     * 0: AUTO mode
     * 1: MANU mode
     * This bit becomes 1 when the RC controller is in the MANU mode.
     * Note that the controller is always in the MANU mode in cases of models not
     * equipped with an operation mode switch (ERC2, PCON-SE, ACON-SE, PCON-CY and ACON-CY).
     */
    RMDS = 1 << 13,

    /**
     * Motor voltage low status
     * 0: Normal
     * 1: Motor drive source cut off
     * This bit becomes 1 if there is no input from the motor drive power supply.
     */
    MPUV = 1 << 14,

    /**
     * Emergency stop status
     * 0: Emergency stop input OFF
     * 1: Emergency stop input ON
     * This bit indicates the status of the emergency stop input port.
     */
    EMGP = 1 << 15,

}

/**
 * Control Flag Specification Register (CTLF) bit set
 */
export enum CTLF {

    /**
     * 0: Normal operation (default)
     * 1: Push-motion operation
     */
    PUSH = 1 << 1,
    /**
     * 0: The direction of push-motion operation after completion of approach is defined as the forward direction (default).
     * 1: The direction of push-motion operation after completion of approach is defined as the reverse direction
     *
     * This bit is used to calculate the direction of final stop position from PCMD. If this bit is
     * set incorrectly, therefore, the target position will deviate from the specified position by a
     * distance corresponding to “2 × INP, ” as shown in Fig. 5.3 below.
     * If bit 1 is set to 0, the setting of this bit is invalid.
     */
    DIR = 1 << 2,
    /**
     * 0: Normal operation (default)
     * 1: Incremental operation (pitch feed)
     * Setting this bit to 1 will enable the actuator to operate relative to the current position.
     * In this operation, the actuator behaves differently between normal operation and pushmotion operation (CTLF bit 1).
     * While the travel is calculated with respect to the target position (PCMD) in normal operation,
     * it is calculated relative to the current position in push-motion operation (when bit 1 = 1).
     */
    INC = 1 << 3,

    /**
     * Bit 6 (MOD0), 7 (MOD1)
     * Refer to the table below. These bits cannot be set on PCON-* andERC2 controllers.)
     * @example
     * MOD1 MOD0 Function
     * 0    0    Trapezoid pattern (default)
     * 0    1    S-motion
     * 1    0    Primary delay filter
     * 1    1    Cannot be used.
     */
    MOD0 = 1 << 6,
    /**
     * See MOD0.
     */
    MOD1 = 1 << 7,
}

export function enumBitSetFromNumber(bitset: number, allValues: any): ReadonlySet<number> {
    const flags = new Set<number>();
    Object.keys(allValues).forEach(v => {
        const vNum = Number(v);
        if (!isNaN(vNum) && ((bitset & vNum) === vNum)) {
            flags.add(vNum);
        }
    });
    return flags;
}

export function numberFromEnumBitSet(values: readonly number[]): number {
    let i: number = 0;
    values.forEach(v => i |= v)
    return i;
}

export function enumNumberToString(allValues: any): ((n: number) => string) {
    return (index) => allValues[index.toString()];
}

/**
 *  device status register 2 (0x9005)
 */
export enum DSS1 {

    /**
     * Position complete status
     * 0: Positioning not yet complete
     * 1: Position complete
     * This bit turns 1 when the actuator has moved close enough the target position and entered
     * the positioning band. It also turns 1 when the servo turns on after the actuator has started,
     * because the controller recognizes that the actuator has completed a positioning to the current
     * position.
     * This bit will also become 1 during the push-motion operation as well as at the completion.
     */
    PEND = 1 << 3,

    /**
     * 0: Home return not yet complete
     * 1: Home return complete
     * This bit will become 1 when home return is completed. In case the absolute specification is
     * set, the bit is set to 1 from the startup if absolute reset has been completed.
     * If a movement command is issued while this bit is 0, an alarm will generate.
     */
    HEND = 1 << 4,

    /**
     * Pause status
     * 0: Normal
     * 1: Pause command active
     * This bit remains 1 while a pause command is input.
     * If the PIO/Modbus Switch Setting (5.4.16 or 6.5.16) is PIO enabled, paused PIO signals are
     * monitored (set the switch to AUTO in case of RC controllers with a mode toggle switch). If
     * Modbus is enabled, the Pause Commands (5.4.6 or 6.5.6) are monitored.
     */
    STP = 1 << 5,

    /**
     * Brake forced-release status
     * 0: Brake actuated
     * 1: Brake released
     * This bit indicates the status of brake operation. Normally the bit remains 1 while the servo is
     * ON. Even when the servo is OFF, changing the “brake forced-release command bit” in device
     * control register 1 to 1 will change this bit to 1.
     */
    BKRL = 1 << 7,

    /**
     * Absolute error status
     * 0: Normal
     * 1: Absolute error present
     * This bit will turn 1 if an absolute error occurs in case the absolute specification is set.
     */
    ABER = 1 << 8,

    /**
     * Minor failure status
     * 0: Normal
     * 1: Minor failure alarm present
     * This bit will turn 1 when a message level alarm is generated.
     */
    ALML = 1 << 9,

    /**
     * 0: Normal
     * 1: Major failure alarm present
     * This bit will turn 1 if any alarm at the cold start level or operation cancellation level is generated.
     * Alarms at the operation cancellation level can be reset by using an alarm reset command,
     * but resetting alarms at the cold start level requires turning the power supply off and then on again.
     */
    ALMH = 1 << 10,


    /**
     * Missed work part in push-motion operation
     * This bit turns 1 when the actuator has moved to the end of the push band without contacting the work part
     * 0: Normal
     * 1: Missed work part in push-motion operation
     * This bit turns 1 when the actuator has moved to the end of the push band without contacting the work part (= the actuator has missed the work part) according to a push-motion operation command. Operation commands other than push-motion do not change this bit.
     */
    PSFL = 1 << 10,

    /**
     * Servo ON status
     * 0: Servo OFF
     * 1: Servo ON
     * The servo ON status is indicated. After a servo ON command is issued, this bit will remain 0 until the servo ON delay time set by a parameter elapses.
     * If the servo cannot be turned ON for some reason even after a servo ON command is received, this bit will remain 0.
     * The RC controller does not accept any movement command while this bit is 0.
     */
    SV = 1 << 12,

    /**
     * Controller ready status
     *  0: Controller busy
     *  1: Controller ready
     *  This bit indicates whether or not the controller can be controlled externally.
     *  Normally this bit does not become 0 (busy).
     */
    PWR = 1 << 13,

    /**
     * Safety speed enabled status
     * 0: Safety status disabled
     * 1: Safety status enabled
     * Enable/disable the safety speed of the controller using the “safety speed command bit” of device control register 1.
     */
    SFTY = 1 << 14,

    /**
     * EMG status
     * 0: Emergency stop not actuated
     * 1: Emergency stop actuated
     * This bit indicates whether or not the controller is currently in the emergency stop mode due to
     * an emergency stop input, cutoff of the drive source, etc.
     */
    EMGS = 1 << 15,

}

/**
 *  device status register 2 (0x9006)
 */
export enum DSS2 {
    /**
     * These bits output a position complete number as a binary value in PIO
     pattern 4 or 5 (solenoid valve mode).
     Each of these bits turns 1 when the actuator has completed a position
     movement and become close enough to the target position by entering the
     positioning band according to a position movement command (ST0 to ST7
     in device control register 2).
     Although the bit turns 0 once the servo is turned OFF, when the servo is
     turned ON again the bit will turn 1 if the actuator is still within the positioning
     band of the specified command position data.
     Moreover, they will become 1 when push-motion is completed or missed in
     push-motion operation.
     */
    PE0 = 1 << 0,
    PE1 = 1 << 1,
    PE2 = 1 << 2,
    PE3 = 1 << 3,
    PE4 = 1 << 4,
    PE5 = 1 << 5,
    PE6 = 1 << 6,
    PE7 = 1 << 7,
    JOGNegative = 1 << 8,
    /**
     * Jog+ status
     * 0: Normal
     * 1: “Jog+” command active
     * This bit becomes 1 while the “jog+ command bit” of device control register 2 is selected.
     */
    JOGPositive = 1 << 9,
    /**
     * Position-data load command status
     * 0: Normal
     * 1: Position data load complete
     * Setting the “position-data load command bit” in device control register 2 to 1
     * will change this bit to 0. This bit will turn 1 once position data has been
     * written to the EEPROM successfully.
     */
    TEAC = 1 << 10,

    /**
     * Teaching mode status
     * 0: Normal operation mode
     * 1: Teaching mode
     * This bit becomes 1 when the teaching mode is selected by the “teach mode
     * command bit” of device control register 2.
     */
    MODS = 1 << 11,

    /**
     * Torque level status
     * 0: Normal
     * 1: Torque level achieved
     * This bit turns 1 when the current has reached a level corresponding to the
     * specified push torque during a push-motion operation.
     * Since this bit indicates a level, its status will change when the current level changes.
     */
    TRQS = 1 << 12,

    /**
     * Load output judgment status
     * 0: Normal
     * 1: Load output judgment
     * If a load current threshold or check range (individual zone boundaries: only supported by PCON-CF) is set when a movement command is issued, this bit indicates whether or not the motor current has reached the threshold inside the check range.
     * This bit maintains the current value until the next position command is received.
     */
    LOAD = 1 << 12,

    /**
     * Enable
     * 0: Disable condition(Operation Stop, Servo OFF)
     * 1: Enable condition (normal operation)
     * It shows the condition of the enable switch when a teaching tool that is equipped with an enable switch (dead man’s switch) is connected to a model that has the enable function equipped.
     * (Note) It is fixed to 1 when in AUTO Mode or for a model without the enable function being equipped.
     */
    ENBS = 1 << 15,
}

export enum FunctionCode {
    ReadCoilStatus = 0x01,
    ReadInputStatus = 0x02,
    ReadHoldingRegisters = 0x03,
    ReadInputRegisters = 0x04,
    ForceSingleCoil = 0x05,
    PresetSingleRegister = 0x06,
    ReadExceptionStatus = 0x07,
    ForceMultipleCoils = 0x0F,
    PresetMultipleRegisters = 0x10,
    ReportSlaveId = 0x11,
    ReadWriteRegister = 0x17
}

/**
 * Queries the first 10 Status registers.
 */
export const queryStatusRegisters = queryHoldingRegisters(0x9000, 10);


export function parseQueryStatusRegisterResponse(response: Uint8Array): { pnow: number, almc: number, dipm:number, dipo:number, dss1: Set<DSS1>, dss2: Set<DSS2>, dsse: Set<DSSE>, stat: Set<STAT> } {
    const responseData = parseQueryHoldingRegistersResponse(response);
    const view = new DataView(responseData);

    const pnow = view.getInt32(0);
    const almc = view.getInt16(4);
    const dipm = view.getInt16(6);
    const dipo = view.getInt16(8);
    const dss1 = enumBitSetFromNumber(view.getUint16(10), DSS1) as any as Set<DSS1>
    const dss2 = enumBitSetFromNumber(view.getUint16(12), DSS2) as any as Set<DSS2>;
    const dsse = enumBitSetFromNumber(view.getUint16(14), DSSE) as any as Set<DSSE>;
    const stat = enumBitSetFromNumber(view.getUint32(16), STAT) as any as Set<STAT>;
    return {pnow, almc, dipm, dipo, dss1, dss2, dsse, stat}
}



function buildResetAlarm(reset: boolean) {
    return forceSingleCoil(0x0407, reset ? 0xFF00 : 0x00);
}

/**
 * ALRS
 * When the alarm reset edge is turned on (the data is first set to FF00 and then changed to 0000),
 * alarms will be reset.
 * Requires both commands to be sent.
 */
export const resetAlarm: Readonly<[ArrayBuffer, ArrayBuffer]> = [buildResetAlarm(true), buildResetAlarm(false)]

/**
 * Brake Forced Release BKRL TODO: test
 */
export function forceReleaseBreak(release: boolean): ArrayBuffer {
    return forceSingleCoil(0x0408, release ? 0xFF00 : 0x0000)
}



export const pioModbusOnCommand = pioModbusSwitch(true);


export function servoOnCommand(on: boolean): ArrayBuffer {
    return forceSingleCoil(0x0403, on ? 0xFF00 : 0x0000)
}

/**
 * Direct writing of positioning Data Target position coordinate specification register PCMD 9900 Register size 2 register 4 bytes (Unit 0.01 mm)
 */
export function positionCommand(targetPosition: number): ArrayBuffer {
    const buffer = new ArrayBuffer(13);
    writeHeader(FunctionCode.PresetMultipleRegisters, buffer)
    const v = new DataView(buffer);
    v.setInt16(2, 0x9900) //target position specification register
    v.setInt16(4, 0x0002) // register count
    v.setInt8(6, 0x04) // byteCount
    v.setInt32(7, targetPosition) // unsigned might be used for relative offsets
    v.setUint16(11, crc16modbus(Buffer.from(buffer, 0, 11) as Buffer), true)
    return buffer;
}

function pioModbusSwitch(modbus: boolean): ArrayBuffer {
    return forceSingleCoil(0x0427, modbus ? 0xFF00 : 0x0000)
}

function buildHomeReturn(ret: boolean): ArrayBuffer {
    const buffer = new ArrayBuffer(8);
    writeHeader(FunctionCode.ForceSingleCoil, buffer)
    const d1 = new DataView(buffer);
    d1.setUint16(2, 0x040B);
    d1.setUint16(4, ret ? 0xFF00 : 0x0000);
    d1.setUint16(6, crc16modbus(Buffer.from(buffer, 0, 6)), true);
    return buffer;
}

/**
 * Two commands to initiate a homing operation.
 */
export const homeReturn: Readonly<[ArrayBuffer, ArrayBuffer]> = [buildHomeReturn(false), buildHomeReturn(true)]


export function positionVelocityAndAccelerationCommand(targetPosition: number, velocity: number, acceleration: number, targetPositionBand: number = 10): ArrayBuffer {
    const buffer = new ArrayBuffer(23);
    writeHeader(FunctionCode.PresetMultipleRegisters, buffer)
    const v = new DataView(buffer);
    v.setInt16(2, 0x9900); //target position specification register
    v.setInt16(4, 0x0007); // register count
    v.setInt8(6, 0x0E); // byteCount
    v.setInt32(7, targetPosition); // unsigned might be used for relative offsets
    v.setUint32(11, targetPositionBand);
    v.setUint32(15, velocity);
    v.setUint16(19, acceleration);
    v.setUint16(21, crc16modbus(Buffer.from(buffer, 0, 21)), true);
    return buffer;
}

/**
 * Positioning Data Direct Writing (Queries Using Code 10))
 * Produces a reponse of size 8 bytes;
 * VCMD Speed specification register (2 byte in 0.01 mm/sec) Writing 3 registers, each 2 bytes
 * ACMD Acceleration/deceleration specification register (1 byte in 0.01 G)
 * @param targetPosition target position in mm/100
 * @param targetPositionBand in mm/100 (default is 0.1 mm)
 * @param velocity in mm/100 (good value is 10 000)
 * @param acceleration in g/100 (valid is [1, 300], good value is 30)
 * @param pushCurrentLimitingValue Set the current limit during push-motion operation in PPOW. Range: [51-178] (equiv of 20% to 70% of 255). 0 means no limit.
 * @param controlFlags
 */
export function numericalValueMovementCommand(
    targetPosition: number,
    targetPositionBand: number = 10,
    velocity: number,
    acceleration: number,
    pushCurrentLimitingValue: number,
    controlFlags: readonly CTLF[]): ArrayBuffer {

    const buffer = new ArrayBuffer(27);
    writeHeader(FunctionCode.PresetMultipleRegisters, buffer);
    const view = new DataView(buffer);
    view.setUint16(2, 0x9900);
    view.setUint16(4, 0x0009);
    view.setUint8(6, 0x12);
    view.setInt32(7, targetPosition); // unsigned might be used for relative offsets
    view.setInt32(11, targetPositionBand);
    view.setUint32(15, velocity);
    view.setUint16(19, acceleration);
    view.setUint16(21, pushCurrentLimitingValue);
    view.setUint16(23, numberFromEnumBitSet(controlFlags));
    view.setUint16(25, crc16modbus(Buffer.from(buffer, 0, 25)), true);
    return buffer;
}

/**
 * Parses a response if it is an exception.
 */
export function parseException(response: Uint8Array): { originalFunctionCode: number, exceptionCode: number, exceptionMessage: string } {
    crcCheck(response);
    const view = new DataView(response.buffer);
    const functionCode = view.getUint8(1);
    if ((functionCode & 0x80) !== 0x80) {
        throw new Error("Response is not an exception (Function Code MSB is not set to 1).")
    }
    const originalFunctionCode = functionCode ^ 0x80;
    const exceptionCode = view.getUint8(2);
    const exceptionMessage = exceptionMap[exceptionCode - 1] || 'Unknown Exception Code';
    return {originalFunctionCode, exceptionCode, exceptionMessage}
}

const exceptionMap = [
    'Illegal Function',
    'Illegal Data Address',
    'Illegal Data Value',
    'Slave Device Failure'
];


/**
 * DSS1/2 Controller Status Signal Reading 1 (reading two registers DSS1 and DSS2)
 */
/**
export const queryDeviceStatusCommand =  queryHoldingRegisters(0x9005, 2);

export function parseDeviceStatusResponse(response: Uint8Array): { dss1: Set<DSS1>, dss2: Set<DSS2> } {
    const responseData = parseQueryHoldingRegistersResponse(response);
    const view = new DataView(responseData);
    const dss1 = enumBitSetFromNumber(view.getUint16(0), DSS1) as any as Set<DSS1>
    const dss2 = enumBitSetFromNumber(view.getUint16(2), DSS2) as any as Set<DSS2>;
    //console.info(`Parsed parseDeviceStatusResponse from response: ${response} dss1: ${Array.from(dss1)} (${Array.from(dss1).map(enumNumberToString(DSS1))})  dss2:${Array.from(dss2).map(enumNumberToString(DSS2))}`)
    return {dss1, dss2}
}
 **/

/**
 * Queries: TODO: check if shockspot hardware supports this at all
 * - Total moving count (TLMC) 2Registers, 4bytes
 * - Total moving distance (ODOM) 2Registers, 4bytes (unit of 1m)
 */
export function queryDeviceMovementHistory(): ArrayBuffer {
    return queryHoldingRegisters(0x8400, 4);
}

export function parseDeviceMovementHistory(response: Uint8Array): { totalMovingCount: number, totalMovingDistance: number } {
    const data = parseQueryHoldingRegistersResponse(response);
    const view = new DataView(data);
    return {totalMovingCount: view.getUint32(0), totalMovingDistance: view.getUint32(4)}
}

/**
 * Queries: TODO: check if force feedback is supported at all
 * - Force Feedback Data Reading (FBFC) 2 registers, 4bytes (unit 0.01 N.)
 */
export function queryForceFeedback(): ArrayBuffer {
    return queryHoldingRegisters(0x901E, 2);
}


/**
 *  Deceleration Stop <<STOP>>
 * The actuator will start decelerating to a stop when the deceleration stop command edge (write FF00H) is turned on.
 */
export const decelerationStopCommand = forceSingleCoil(0x042C, 0xFF00);



/**
 * Register reading DIPM Input port query  Input port monitor register (9003), 2 registers,
 * Used to determine if the hand switch is pressed.
 * TODO: Why are two registers read?
 */
export const queryInputSignalStatus = queryHoldingRegisters(0x9003, 2);

export function parseInputSignalStatusResponse(response: Uint8Array): { inputStatus: number } {
    crcCheck(response);
    const buffer = response.buffer;
    const view = new DataView(buffer);
    return {inputStatus: view.getUint16(7)};
    // Data of Register Read (03) starts at character 7
}

function forceSingleCoil(address: number, data: number): ArrayBuffer {
    const buffer = new ArrayBuffer(8);
    writeHeader(FunctionCode.ForceSingleCoil, buffer);
    const view = new DataView(buffer);
    view.setUint16(2, address);
    view.setUint16(4, data);
    view.setUint16(6, crc16modbus(Buffer.from(buffer, 0, 6) as Buffer), true);
    return buffer;
}

function writeHeader(functionCode: number, buffer: ArrayBuffer) {
    const v = new DataView(buffer);
    v.setInt8(0, 0x01);
    v.setInt8(1, functionCode);
}

function queryHoldingRegisters(address: number, registers: number) {
    const buffer = new ArrayBuffer(8);
    writeHeader(FunctionCode.ReadHoldingRegisters, buffer);
    const view = new DataView(buffer);
    view.setUint16(2, address);
    view.setUint16(4, registers);
    view.setUint16(6, crc16modbus(Buffer.from(buffer, 0, 6)), true);
    return buffer;
}

function parseQueryHoldingRegistersResponse(response: Uint8Array): ArrayBufferLike {
    crcCheck(response);
    const view = new DataView(response.buffer);
    const numberOfDataBytes = view.getUint8(2);
    return view.buffer.slice(3, 3 + numberOfDataBytes);
}

/**
 * This query reads the code indicating the normal status or alarm status (cold start level, operation cancellation level and message level) of the controller.
 * In the normal status, 0x00 is stored.
 */
export const presentAlarmCodeReading = queryHoldingRegisters(0x9002, 1);

export function parsePresentAlarmCodeResponse(response: Uint8Array) {
    const data = parseQueryHoldingRegistersResponse(response);
    if (data.byteLength !== 2) {
        throw new Error("Expected a 2 byte response but got " + data.byteLength);
    }
    return new DataView(data).getUint16(0);
}

export const alarmDetailDescriptionReading = queryHoldingRegisters(0x0500, 6);

export function parseAlarmDetailDescriptionReadingResponse(response: Uint8Array) {
    const data = parseQueryHoldingRegistersResponse(response);
    if (data.byteLength !== 12) {
        throw new Error("Expected a 12 byte response but got " + data.byteLength);
    }
    const view = new DataView(data);
    const detailCode = view.getUint16(0);
    const address = view.getUint16(2);
    const code = view.getUint32(4);
    const occurrenceTime = view.getUint32(8);

    return {
        detailCode,
        address,
        code,
        occurrenceTime
    }
}

function crcCheck(response: Uint8Array): void {
    if (response.length < 4) {
        throw new Error("Response must be at least 4 bytes long.");
    }
    const dataView = new DataView(response.buffer);
    const expectedCrc = crc16modbus(Buffer.from(response.buffer, 0, response.length - 2) as Buffer);
    const presentedCrc = dataView.getUint16(response.length - 2, true);
    if (expectedCrc !== presentedCrc) {
        throw new Error(`CRC missmatch: Expected ${presentedCrc} but received ${expectedCrc}`);
    }
}