/**
 * A single network's creation parameters
 */
export default interface NetworkCreation {
    layers: Array<number>,
    minibatchSize: number,
    epochs: number,
    learningRate: number,
    evaluateAfterEachEpoch: boolean
}