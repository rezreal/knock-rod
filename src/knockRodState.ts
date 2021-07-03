import {DSS1, DSS2, DSSE, STAT} from "./knockRodProtocol";

export interface KnockRodState {
    deviceStatusRegister1: Set<DSS1>
    deviceStatusRegister2: Set<DSS2>
    expansionDeviceStatus: Set<DSSE>
    systemStatusRegister: Set<STAT>
    currentPosition: number
    input: number
}


export interface KnockRodParams {
    /** The maximum allowed depth to travel for the rod. Unit mm/100 */
    maxDepth: number

    speed: number
}