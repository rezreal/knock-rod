/** Bit-set of the STAT system status registers (Address = 0x9008) **/
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


export function enumBitSetFromNumber(bitset: number, allValues: any): Set<string> {
    return new Set((Object.keys(allValues)).filter(v => (bitset & allValues[v]) == allValues[v]))
}


/**
 *  device status register 2 (0x9005)
 */
export enum DSS1 {
    /**
     * Load cell calibration status
     * 0: Calibration not yet complete
     * 1: Calibration complete
     * Regardless of whether or not a load cell calibration command has been issued, this bit is 1 as
     * long as a calibration has completed in the past.
     */
    CLBS = 1 << 1,

    /**
     * Load cell calibration complete
     * 0: Calibration not yet complete
     * 1: Calibration complete
     * This bit turns 1 when the load cell calibration command (CLBR) has been successfully executed.
     */
    CEND = 1 << 2,

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
    STP = 1 << 4,

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

export function calculateLRC(cmd: string): string {
    if (cmd.length % 2 != 0) {
        throw new Error("Unexpected command length!")
    }
    let sum: number = 0;
    for (let i = 0; i < cmd.length; i += 2) {
        sum += parseInt(cmd.substr(i, 2), 16);
    }
    const complement = ~sum + 1 >>> 0;
    return complement.toString(16).slice(-2);
}

export function buildCommand(rawCmd: string): string {
    return `:${rawCmd}${calculateLRC(rawCmd)}"\r\n"`;
}


/**
 * Queries the first 10 Status registers.
 */
export function queryStatusRegister(): string {
    return buildCommand("01039000000A")
}


/**
 * Direct writing of positioning Data Target position coordinate specification register PCMD 9900 Register size 2 Byte size 4 chars (Unit 0.01 mm)
 */
export function positionCommand(targetPosition: number): string {
    const targetPositionString = targetPosition.toString(16).slice(4);
    let cmd = `011099000002040000${targetPositionString}`;
    return buildCommand(cmd);
}


/**
 * Positioning Data Direct Writing (Queries Using Code 10))
 * VCMD Speed specification register (2 byte in 0.01 mm/sec) Writing 3 registers, 2 bytes
 * ACMD Acceleration/deceleration specification register (1 byte in 0.01 G)
 */
export function velocityAndAccelerationCommand(velocity: number, acceleration: number): string {
    const velocityStr = velocity.toString(16).slice(4);
    const accelerationStr = acceleration.toString(16).slice(2);
    return buildCommand(`01109904000306${velocityStr}${accelerationStr}`);
}

/**
 * DSS1 Controller Status Signal Reading 1 (reading two registers DSS1 and DSS2 ?)
 */
export function queryDeviceStatusCommand(): string {
    return buildCommand("010390050002")
}

export function parseDeviceStatusResponse(response: string): { dss1: Set<DSS1>, dss2: Set<DSS2> } {
    // Data of Register Read (03) starts at character 7
    const dss1Hex = response.slice(7, 4)
    const dss2Hex = response.slice(11, 4)
    const dss1 = enumBitSetFromNumber(parseInt(dss1Hex, 16), DSS1) as any as Set<DSS1>;
    const dss2 = enumBitSetFromNumber(parseInt(dss2Hex, 16), DSS2) as any as Set<DSS2>;

    return {dss1, dss2}
}

/**
 * Queries: TODO: check if shockspot hardware supports this at all
 * - Total moving count (TLMC) 2Registers, 4bytes
 * - Total moving distance (ODOM) 2Registers, 4bytes (unit of 1m or mm?)
 */
export function queryDeviceMovementHistory(): string {
    return buildCommand("010384000004")
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
 */
export function queryInputSignalStatus(): string {
    return buildCommand("010390030002");
}

