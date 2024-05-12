using MathNet.Numerics.Distributions;
using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AI
{
    /// <summary>
    /// Initialization of various matrices and lists
    /// </summary>
    public static class Initialize
    {
        // Standard mean deviation function for random value generation
        private static Normal WeightDistribution { get; } = Normal.WithMeanStdDev(0, 0.5);
        private static Normal BiasDistribution { get; } = Normal.WithMeanStdDev(0.5, 0.5);

        /// <summary>
        /// Randomly generate initial neuron biases and insert them into required matrices
        /// </summary>
        /// <param name="sizes"></param>
        /// <returns></returns>
        public static List<Matrix<double>> Biases(List<int> sizes)
        {
            var biases = new List<Matrix<double>>();

            foreach (int size in sizes.Skip(1).Take(sizes.Count - 1))
            {
                biases.Add(Matrix<double>.Build.Random(size, 1, BiasDistribution));
            }

            return biases;
        }

        /// <summary>
        /// Randomly generate initial neuron weights and insert them into required matrices
        /// </summary>
        /// <param name="sizes"></param>
        /// <returns></returns>
        public static List<Matrix<double>> Weights(List<int> sizes)
        {
            var weights = new List<Matrix<double>>();

            for (int i = 1; i < sizes.Count; i++)
            {
                weights.Add(Matrix<double>.Build.Random(sizes[i], sizes[i - 1], WeightDistribution));
            }

            return weights;
        }

        /// <summary>
        /// Split training data into smaller, so called, mini-batches. Mini-batch size affects the speed
        /// of the learning process, with lower values being faster. Lower values, however, may not lead to
        /// better learning.
        /// </summary>
        /// <param name="trainingData"></param>
        /// <param name="minibatchSize"></param>
        /// <returns></returns>
        public static List<List<Tuple<Matrix<double>, int>>> Minibatches(List<Tuple<Matrix<double>, int>> trainingData, int minibatchSize)
        {
            var miniBatches = new List<List<Tuple<Matrix<double>, int>>>(); // Dear me...

            for (int i = 0; i < trainingData.Count; i += minibatchSize)
            {
                var endIsBeyondRange = i + minibatchSize > trainingData.Count;

                if (endIsBeyondRange) miniBatches.Add(trainingData.GetRange(i, trainingData.Count - i));
                else miniBatches.Add(trainingData.GetRange(i, minibatchSize));
            }

            return miniBatches;
        }

        /// <summary>
        /// Initialize a zero matrix with the same dimensions as the input matrix
        /// </summary>
        /// <param name="inputMatrices"></param>
        /// <returns></returns>
        public static List<Matrix<double>> ZeroMatrices(List<Matrix<double>> inputMatrices)
        {
            var zeroMatrices = new List<Matrix<double>>();

            for (var i = 0; i < inputMatrices.Count; i++)
            {
                var columns = inputMatrices[i].ColumnCount;
                var rows = inputMatrices[i].RowCount;
                var matrix = Matrix<double>.Build;
                zeroMatrices.Add(matrix.Dense(rows, columns));
            }

            return zeroMatrices;
        }
    }
}
