export default interface NetworkParameters {
    layers: Array<number>,
    minibatchSize: number,
    epochs: number,
    learningRate: number,
    evaluateAfterEachEpoch: boolean
}