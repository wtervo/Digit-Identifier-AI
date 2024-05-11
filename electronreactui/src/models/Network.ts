import { Matrix } from "ts-matrix";
import { NetworkCurrentStatus } from "./enums";
import NetworkCreation from "./NetworkCreation";

/**
 * A single network's full parameters
 */
export default interface Network extends NetworkCreation {
    id: string,
    status: NetworkCurrentStatus,
    progress: string,
    biases: Array<Matrix>,
    weights: Array<Matrix>
}