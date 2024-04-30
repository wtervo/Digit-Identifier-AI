using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using MathNet.Numerics.LinearAlgebra;

namespace AI
{
    /// <summary>
    /// Network training calculations mostly involving stochastic gradient descent and backpropagation
    /// </summary>
    public class Calculation
    {
        public List<Matrix<double>> Biases { get; set; }
        public List<Matrix<double>> Weights { get; set; }
        private int LayersAmount { get; set; }
        private double LearningRate { get; set; }

        public Calculation(List<Matrix<double>> biases, List<Matrix<double>> weights, int layersAmount, double learningRate)
        {
            Biases = biases;
            Weights = weights;
            LayersAmount = layersAmount;
            LearningRate = learningRate;
        }

        /// <summary>
        /// Return network's (updated) biases and weights
        /// </summary>
        /// <returns></returns>
        public Tuple<List<Matrix<double>>, List<Matrix<double>>> GetTrainingData()
        {
            return Tuple.Create(Biases, Weights);
        }

        /// <summary>
        /// Transforms a numeric value between 0-9 to a matrix that the network can properly utilize when learning.
        /// For example, number "5" is transformed into column matrix [0,0,0,0,0,1,0,0,0,0]
        /// </summary>
        /// <param name="actualValue"></param>
        /// <returns></returns>
        private static Matrix<double> ActualValueToMatrix(int actualValue)
        {
            var returnMatrix = Matrix<double>.Build.Dense(10, 1);
            returnMatrix[actualValue, 0] = 1;

            return returnMatrix;
        }

        /// <summary>
        /// Update weights and biases of the input mini batch with the help of backpropagation
        /// </summary>
        /// <param name="miniBatch"></param>
        public void UpdateMiniBatch(List<Tuple<Matrix<double>, int>> miniBatch)
        {
            // Initialized as zeroes. Updates as the batch's backpropagation progresses
            var nablaB = Initialize.ZeroMatrices(Biases);
            var nablaW = Initialize.ZeroMatrices(Weights);

            for (var i = 0; i < miniBatch.Count;  i++)
            {
                var nablas = BackPropagation(miniBatch[i].Item1, ActualValueToMatrix(miniBatch[i].Item2));

                var deltaNablaB = nablas.Item1;
                var deltaNablaW = nablas.Item2;

                var newNablaB = new List<Matrix<double>>();
                var newNablaW = new List<Matrix<double>>();

                // nablaB, nablaW, deltaNablaB, deltaNablaW lenghts are all equal
                for (var j = 0; j < nablaB.Count; j++)
                {
                    newNablaB.Add(nablaB[j] + deltaNablaB[j]);
                    newNablaW.Add(nablaW[j] + deltaNablaW[j]);
                }

                nablaB = newNablaB;
                nablaW = newNablaW;
            }

            var newBiases = new List<Matrix<double>>();
            var newWeights = new List<Matrix<double>>();

            for (var i = 0; i < Biases.Count; i++)
            {
                newBiases.Add(Biases[i] - (LearningRate / miniBatch.Count) * nablaB[i]);
            }

            for (var i = 0; i < Weights.Count; i++)
            {
                newWeights.Add(Weights[i] - (LearningRate / miniBatch.Count) * nablaW[i]);
            }

            Biases = newBiases;
            Weights = newWeights;
        }

        /// <summary>
        /// Calculate gradients with backpropagation method
        /// </summary>
        /// <param name="dataPoints"></param>
        /// <param name="actualValue"></param>
        /// <returns></returns>
        private Tuple<List<Matrix<double>>, List<Matrix<double>>> BackPropagation(Matrix<double> dataPoints, Matrix<double> actualValue)
        {
            var activation = dataPoints / 255;
            var activations = new List<Matrix<double>> { activation };
            var nablaB = Initialize.ZeroMatrices(Biases);
            var nablaW = Initialize.ZeroMatrices(Weights);

            var zVectors = new List<Matrix<double>>();

            for (var i = 0; i < Biases.Count; i++)
            {
                var z = Weights[i] * activation + Biases[i];
                zVectors.Add(z);
                activation = z.Map(Sigmoid);
                activations.Add(activation);
            }

            var deltaFactor1 = activations[^1] - actualValue;
            var deltaFactor2 = zVectors[^1].Map(SigmoidDerivative);
            var delta = HadamardProduct(deltaFactor1, deltaFactor2); // BP1
            nablaB[^1] = delta;
            nablaW[^1] = delta * activations[^2].Transpose();

            for (var i = 2; i < LayersAmount; i++)
            {
                var z = zVectors[^i];
                deltaFactor1 = Weights[^(i - 1)].Transpose() * delta;
                deltaFactor2 = z.Map(SigmoidDerivative);
                delta = HadamardProduct(deltaFactor1, deltaFactor2); // BP2
                nablaB[^i] = delta; // BP3
                nablaW[^i] = delta * activations[^(i + 1)].Transpose(); // BP4
            }

            return Tuple.Create(nablaB, nablaW);
        }

        /// <summary>
        /// Sigmoid function used in neuron's activation outputs
        /// </summary>
        /// <param name="z"></param>
        /// <returns></returns>
        private static double Sigmoid(double z)
        {
            return 1.0 / (1.0 + Math.Exp(-z));
        }

        /// <summary>
        /// First derivative of the sigmoid function
        /// </summary>
        /// <param name="z"></param>
        /// <returns></returns>
        private static double SigmoidDerivative(double z)
        {
            return Sigmoid(z) * (1.0 - Sigmoid(z));
        }

        /// <summary>
        /// Calculate Hadamard product for two matrices. Matrices must be column matrices, i.e. vectors
        /// </summary>
        /// <param name="matrix1"></param>
        /// <param name="matrix2"></param>
        /// <returns></returns>
        private static Matrix<double> HadamardProduct(Matrix<double> matrix1,  Matrix<double> matrix2)
        {
            if (matrix1.ColumnCount > 1 || matrix2.ColumnCount > 1) throw new Exception("Hadamard product: Column matrix dimensions incorrect");

            var productList = new List<double>();

            for (var i = 0; i < matrix1.RowCount; i++)
            {
                productList.Add(matrix1[i, 0] * matrix2[i, 0]);
            }

            var returnMatrix = Matrix<double>.Build;
            return returnMatrix.Dense(productList.Count, 1, productList.ToArray());
        }

        /// <summary>
        /// Calculate network's performance against the test data set
        /// </summary>
        public int Evaluate(List<Tuple<Matrix<double>, int>> testData)
        {
            var activationPairList = new List<Tuple<int, int>>();

            for (var i = 0; i < testData.Count; i++)
            {
                var activations = FindActivations(testData[i].Item1).ToColumnArrays();
                var chosenOutput = Array.IndexOf(activations[0], activations[0].Max());
                activationPairList.Add(Tuple.Create(chosenOutput, testData[i].Item2));
            }

            var correctActivations = 0;

            foreach (var pair in activationPairList)
            {
                if (pair.Item1 == pair.Item2) correctActivations++;
            }

            return correctActivations;
        }

        /// <summary>
        /// Find neuron activations for each layer, starting from input layer
        /// </summary>
        /// <param name="imageActivations"></param>
        /// <returns></returns>
        private Matrix<double> FindActivations(Matrix<double> imageActivations)
        {
            var activations = imageActivations;

            for (var i = 0; i < Biases.Count; i++)
            {
                activations = (Weights[i] * activations + Biases[i]).Map(Sigmoid);
            }

            // Output layer activations
            return activations;
        }
    }
}
