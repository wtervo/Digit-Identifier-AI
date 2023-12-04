using MathNet.Numerics.Distributions;
using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public static class Initialize
    {
        // Standard mean deviation function for random value generation
        private static Normal Distribution { get; } = Normal.WithMeanStdDev(0.5, 1.0);

        public static List<Matrix<double>> Biases(List<int> sizes)
        {
            var biases = new List<Matrix<double>>();

            foreach (int size in sizes.Skip(1).Take(sizes.Count - 1))
            {
                biases.Add(Matrix<double>.Build.Random(size, 1, Distribution));
            }

            return biases;
        }

        public static List<Matrix<double>> Weights(List<int> sizes)
        {
            var weights = new List<Matrix<double>>();

            for (int i = 1; i < sizes.Count; i++)
            {
                weights.Add(Matrix<double>.Build.Random(sizes[i], sizes[i - 1], Distribution));
            }

            return weights;
        }

        public static List<List<Tuple<Vector<double>, int>>> MiniBatches(List<Tuple<Vector<double>, int>> trainingData, int miniBatchSize)
        {
            var miniBatches = new List<List<Tuple<Vector<double>, int>>>(); // Dear me...

            for (int i = 0; i < trainingData.Count; i += miniBatchSize)
            {
                var endIsBeyondRange = i + miniBatchSize > trainingData.Count;

                if (endIsBeyondRange) miniBatches.Add(trainingData.GetRange(i, trainingData.Count - i));
                else miniBatches.Add(trainingData.GetRange(i, miniBatchSize));
            }

            return miniBatches;
        }
    }
}
