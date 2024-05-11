/**
 * All potential statuses a network can have. Equivalent to the enums used in backend.
 */
export enum NetworkCurrentStatus {
    Initialized = 0,
    Training = 1,
    TrainingDone = 2,
    Evaluation = 3,
    EvaluationDone = 4
}