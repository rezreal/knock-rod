

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

function enumNumberToString(allValues: any): ((n:number) => string)  {
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

export function calculateLRC(cmd: string): string {
    if (cmd.length % 2 !== 0) {
        throw new Error("Unexpected command length!")
    }
    let sum: number = 0;
    for (let i = 0; i < cmd.length; i += 2) {
        sum += parseInt(cmd.substr(i, 2), 16);
    }
    const complement = ~sum + 1 >>> 0;
    return complement.toString(16).slice(-2).toUpperCase();
}

export function buildCommand(rawCmd: string): string {
    return `:${rawCmd}${calculateLRC(rawCmd)}\r\n`;
}


/**
 * Queries the first 10 Status registers.
 */
export function queryStatusRegister(): string {
    return buildCommand("01039000000A")
}

export function queryStatusRegisterRtu(): ArrayBuffer {
    const buffer = new ArrayBuffer(8);
    writeHeader(FunctionCode.ReadHoldingRegisters, buffer);
    const v = new DataView(buffer);
    v.setUint16(2, 0x9000);
    v.setUint16(4, 0x000A);
    v.setUint16(6, crc16modbus(Buffer.from(buffer,0,6)), true);
    return buffer;
}


/**
 * ALRS
 * When the alarm reset edge is turned on (the data is first set to FF00H and then changed to 0000H),
 * alarms will be reset.
 * Requires both commands to be sent.
 */
export function resetAlarm(): [string, string] {
    return [":01050407FF00F0\r\n", ":010504070000EF\r\n"];
}

/**
 * Brake Forced Release BKRL
 *
 */
export function forceReleaseBreak(release:boolean): string
{
    return buildCommand(`01050408${release? 'FF00' : '0000'}`);
}


/**
 * Direct writing of positioning Data Target position coordinate specification register PCMD 9900 Register size 2 register 4 bytes (Unit 0.01 mm)
 */
export function positionCommand(targetPosition: number): string {
    const targetPositionString = encodeNumber(targetPosition,4);
    let cmd = `01109900000204${targetPositionString}`;
    return buildCommand(cmd);
}

export function positionCommandRtu(targetPosition: number): ArrayBuffer {
    const buffer = new ArrayBuffer(13);
    writeHeader(FunctionCode.PresetMultipleRegisters,buffer)
    const v = new DataView(buffer);
    v.setInt16(2, 0x9900) //target position specification register
    v.setInt16(4, 0x0002) // register count
    v.setInt8(6, 0x04) // byteCount
    v.setInt32(7, targetPosition) // unsigned might be used for relative offsets
    v.setUint16(11, crc16modbus(Buffer.from(buffer, 0, 11) as Buffer), true)
    return buffer;
}

function writeHeader(functionCode: number, buffer: ArrayBuffer) {
    const v = new DataView(buffer);
    v.setInt8(0, 0x01);
    v.setInt8(1, functionCode);
}



/**
 * Positioning Data Direct Writing (Queries Using Code 10))
 * VCMD Speed specification register (2 byte in 0.01 mm/sec) Writing 3 registers, 2 bytes each
 * ACMD Acceleration/deceleration specification register (1 byte in 0.01 G)
 */
export function velocityAndAccelerationCommand(velocity: number, acceleration: number): string {
    const velocityStr = encodeNumber(velocity, 4)
    const accelerationStr = encodeNumber(acceleration, 2);
    return buildCommand(`01109904000306${velocityStr}${accelerationStr}`);
}

function encodeNumber(n: number, bytes:number): string {
    return n.toString(16).toUpperCase().padStart(bytes*2, "0").slice(- (bytes*2))
}

/**
 * Positioning Data Direct Writing (Queries Using Code 10))
 * VCMD Speed specification register (2 byte in 0.01 mm/sec) Writing 3 registers, each 2 bytes
 * ACMD Acceleration/deceleration specification register (1 byte in 0.01 G)
 * @param targetPosition target position in mm/100
 * @param targetPositionBand in mm/100 (default is 0.1 mm)
 * @param velocity in mm/100 (good value is 10 000)
 * @param acceleration in g/100 (good value is 30)
 */
export function positionVelocityAndAccelerationCommand(targetPosition: number, velocity: number, acceleration: number, targetPositionBand:number = 10): string {
    const targetPositionStr = encodeNumber(targetPosition, 4);
    const targetPositionBandStr = encodeNumber(targetPositionBand, 4);
    const velocityStr = encodeNumber(velocity, 4);
    const accelerationStr = encodeNumber(acceleration, 2);
    return buildCommand(`0110990000070E${targetPositionStr}${targetPositionBandStr}${velocityStr}${accelerationStr}`);
}

export function positionVelocityAndAccelerationCommandRtu(targetPosition: number, velocity: number, acceleration: number, targetPositionBand:number = 10): ArrayBuffer {
    const buffer = new ArrayBuffer(23);
    writeHeader(FunctionCode.PresetMultipleRegisters, buffer)
    const v = new DataView(buffer);
    v.setInt16(2, 0x9900) //target position specification register
    v.setInt16(4, 0x0007) // register count
    v.setInt8(6, 0x0E) // byteCount
    v.setInt32(7, targetPosition) // unsigned might be used for relative offsets
    v.setUint32(11, targetPositionBand)
    v.setUint32(15, velocity)
    v.setUint16(19, acceleration)
    v.setUint16(21, crc16modbus(Buffer.from(buffer, 0 , 21)), true)
    return buffer;
}


/**
 * Set Push-current limiting value (PPOW)
 * Set the current limit during push-motion operation in PPOW. Set an appropriate value by referring to the table below.
 * Pushable range: 20 to 70(%) of 255
 */
export function foo() {
 // TODO
}

/**
 * Parses a response if it is an exception.
 */
export function parseException(response: string) : { exceptionCode: number, exceptionMessage: string } {
    lrcCheck(response);
    if (!response.charAt(3)) {
        throw new Error("Response is not an exception (Function Code MSB is not set to 1).")
    }

    const exceptionCode = parseInt(response.slice(5,7), 16);
    const exceptionMessage = exceptionMap[exceptionCode-1] || 'Unknown Exception Code';
    return { exceptionCode, exceptionMessage }
}

const exceptionMap = [
    'Illegal Function',
    'Illegal Data Address',
    'Illegal Data Value',
    'Slave Device Failure'
];

/**
 * DSS1 Controller Status Signal Reading 1 (reading two registers DSS1 and DSS2 ?)
 */
export function queryDeviceStatusCommand(): string {
    return buildCommand("010390050002")
}

export function parseDeviceStatusResponse(response: string): { dss1: Set<DSS1>, dss2: Set<DSS2> } {
    lrcCheck(response);
    // Data of Register Read (03) starts at character 7
    const dss1Hex = response.slice(7, 11)
    const dss2Hex = response.slice(11, 15)
    const dss1 = enumBitSetFromNumber(parseInt(dss1Hex, 16), DSS1) as any as Set<DSS1>;
    const dss2 = enumBitSetFromNumber(parseInt(dss2Hex, 16), DSS2) as any as Set<DSS2>;

    console.info(`Parsed parseDeviceStatusResponse from response: ${response} dss1: ${Array.from(dss1)} (${Array.from(dss1).map(enumNumberToString(DSS1))})  dss2:${Array.from(dss2).map(enumNumberToString(DSS2))}`)
    
    return {dss1, dss2}
}

/**
 * Queries: TODO: check if shockspot hardware supports this at all
 * - Total moving count (TLMC) 2Registers, 4bytes
 * - Total moving distance (ODOM) 2Registers, 4bytes (unit of 1m)
 */
export function queryDeviceMovementHistory(): string {
    return buildCommand("010384000004")
}

export function parseDeviceMovementHistory(response: string): {totalMovingCount: number, totalMovingDistance: number} {
    lrcCheck(response);
    // Data of Register Read (03) starts at character 7
    const tlmcHex = response.slice(7, 15);
    const odomHex = response.slice(15, 23);
    return { totalMovingCount: parseInt(tlmcHex, 16), totalMovingDistance: parseInt(odomHex, 16)}
}

/**
 * Queries: TODO: check if force feedback is supported at all
 * - Force Feedback Data Reading (FBFC) 2 registers, 4bytes (unit 0.01 N.)
 */
export function queryForceFeedback(): string {
    return buildCommand("0103901E0002")
}

/**
 *  Deceleration Stop <<STOP>>
 * The actuator will start decelerating to a stop when the deceleration stop command edge (write FF00H) is turned on.
 */
export function decelerationStopCommand(): string {
    return buildCommand("0105042CFF00");
}

/**
 * Register reading DIPM Input port query  Input port monitor register (9003), 2 registers,
 * Used to determine if the hand switch is pressed.
 * TODO: Why are two registers read?
 */
export function queryInputSignalStatus(): string {
    return buildCommand("010390030002");
}

function lrcCheck(response :string) : void {
    if (!response.startsWith(":")) {
        throw new Error("Expected response to begin with :");
    }
    if (response.length < 4) {
        throw new Error("Reponse must be at least 4 characters long.");
    }
    const data = response.slice(1,-2);
    const presendedLrc = response.slice(-2);
    const expectedLrc = calculateLRC(data)
    if (expectedLrc !== presendedLrc) {
        throw new Error(`LRC mismatch. Expected: ${expectedLrc} but received: ${presendedLrc})`);
    }
}

export function parseInputSignalStatusResponse(response: string): { inputStatus: number } {
    lrcCheck(response);
    // Data of Register Read (03) starts at character 7
    const dataHex = response.slice(7, 11);
    return { inputStatus: parseInt(dataHex, 16) }
}


