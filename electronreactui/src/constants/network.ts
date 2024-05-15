import Network from "@src/models/Network";
import { NetworkCurrentStatus } from "@src/models/enums";

export const MIN_HIDDEN_LAYERS = 1;
export const MAX_HIDDEN_LAYERS = 10;
export const MIN_HIDDEN_LAYER_NEURONS = 1;
export const MAX_HIDDEN_LAYER_NEURONS = 25;
export const MIN_MINIBATCH_SIZE = 1;
export const MAX_MINIBATCH_SIZE = 50;
export const MIN_EPOCHS = 1;
export const MAX_EPOCHS = 50;
export const MIN_LEARNING_RATE = 0.1;
export const MAX_LEARNING_RATE = 30;

export const DUMMY_NETWORK: Network = {
  id: "",
  layers: [],
  epochs: 0,
  minibatchSize: 0,
  learningRate: 0,
  evaluateAfterEachEpoch: false,
  status: NetworkCurrentStatus.Initialized,
  progress: "",
  biases: [],
  weights: [],
  evaluationResult: undefined,
  evaluationHistory: []
};