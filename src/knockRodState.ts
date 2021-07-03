import {DSS1, DSS2, DSSE, STAT} from "./knockRodProtocol";

export interface KnockRodState {

    deviceStatusRegister1: Set<DSS1>
    deviceStatusRegister2: Set<DSS2>
    expansionDeviceStatus: Set<DSSE>
    systemStatusRegister: Set<STAT>
    currentPosition: number
    input: number

}
