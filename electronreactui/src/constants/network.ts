import Network from "@src/models/Network";
import { NetworkCurrentStatus } from "@src/models/enums";

export const minHiddenLayers = 1;
export const maxHiddenLayers = 10;
export const minHiddenLayerNeurons = 1;
export const maxHiddenLayerNeurons = 25;
export const minMinibatchSize = 1;
export const maxMinibatchSize = 50;
export const minEpochs = 1;
export const maxEpochs = 50;
export const minLearningRate = 0.1;
export const maxLearningRate = 30;

export const dummyNetwork: Network = {
  id: "",
  layers: [],
  epochs: 0,
  miniBatchSize: 0,
  learningRate: 0,
  evaluateAfterEachEpoch: false,
  status: NetworkCurrentStatus.Initialized,
  progress: "",
  biases: [],
  weights: []
};