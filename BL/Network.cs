using MathNet.Numerics.LinearAlgebra;
using System.Diagnostics;

namespace BL
{
    public class Network
    {
        public List<int> Sizes { get; set; }
        public int LayersAmount { get; set; }
        public List<Matrix<double>> Biases { get; set; } = new List<Matrix<double>>();
        public List<Matrix<double>> Weights { get; set; } = new List<Matrix<double>>();
        public int Epochs { get; set; }
        public int MiniBatchSize { get; set; }
        public double LearningRate { get; set; }
        public MnistData MnistData { get; set; }

        public Network(NetworkParameters parameters)
        {
            Sizes = parameters.Sizes; // Array of number of neurons in each layer
            LayersAmount = Sizes.Count;
            Biases = Initialize.Biases(Sizes);
            Weights = Initialize.Weights(Sizes);
            Epochs = parameters.Epochs;
            MiniBatchSize = parameters.MiniBatchSize;
            LearningRate = parameters.LearningRate; // aka Eta
            MnistData = new MnistData();

            SGD();
        }

        /// <summary>
        /// Stochastic Gradient Descent. Trains the network
        /// </summary>
        public void SGD()
        {
            for (int i = 0; i < Epochs; i++)
            {
                var data = MnistData.TrainingData();
                var trainingData = MnistData.TrainingDataShuffled();
                var miniBatches = Initialize.MiniBatches(trainingData, MiniBatchSize);

                foreach (var miniBatch in miniBatches) Calculation.UpdateMiniBatch(miniBatch, Biases, Weights, LearningRate);

            }
        }
    }
}