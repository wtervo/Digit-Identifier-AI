import { Matrix } from 'ts-matrix';
import { NetworkCurrentStatus } from './enums';

export default interface Network {
    id: string,
    layers: Array<number>,
    epochs: number,
    miniBatchSize: number,
    learningRate: number,
    evaluateAfterEachEpoch: boolean,
    status: NetworkCurrentStatus,
    progress: string,
    biases: Array<Matrix>,
    weights: Array<Matrix>
}