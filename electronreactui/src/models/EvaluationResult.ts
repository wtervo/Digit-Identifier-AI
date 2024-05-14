import { Matrix } from "ts-matrix";

/**
 * Data for the results of a network's performance evaluation
 */
export default interface EvaluationResult {
  correctResults: number,
  networkResults: Array<number>,
  actualResults: Array<number>,
  imagePixels: Array<Matrix>
};