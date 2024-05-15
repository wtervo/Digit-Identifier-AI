import { Matrix } from "ts-matrix";
import { NetworkCurrentStatus } from "./enums";
import NetworkCreation from "./NetworkCreation";
import EvaluationResult from "./EvaluationResult";

/**
 * A single network's full parameters
 */
export default interface Network extends NetworkCreation {
    id: string,
    status: NetworkCurrentStatus,
    progress: string,
    biases: Array<Matrix>,
    weights: Array<Matrix>,
    evaluationResult: EvaluationResult,
    evaluationHistory: Array<number>
};