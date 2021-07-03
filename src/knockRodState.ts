import {DSS1, DSS2, DSSE} from "./knockRodProtocol";

export interface KnockRodState {

    deviceStatusRegister1: Set<DSS1>
    deviceStatusRegister2: Set<DSS2>
    expansionDeviceStatus: Set<DSSE>
    currentPosition: number

}
