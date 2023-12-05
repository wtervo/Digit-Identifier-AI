using MathNet.Numerics.LinearAlgebra;
using System.Diagnostics;

namespace BL
{
    /// <summary>
    /// Network training and testing
    /// </summary>
    public class Network
    {
        private List<int> Sizes { get; set; }
        private int LayersAmount { get; set; }
        private List<Matrix<double>> Biases { get; set; } = new List<Matrix<double>>();
        private List<Matrix<double>> Weights { get; set; } = new List<Matrix<double>>();
        private int Epochs { get; set; }
        private int MiniBatchSize { get; set; }
        private double LearningRate { get; set; }
        private MnistData MnistData { get; set; }

        public Network(NetworkParameters parameters)
        {
            ValidateParameters(parameters);

            Sizes = parameters.Sizes; // Array of number of neurons in each layer
            LayersAmount = Sizes.Count;
            Biases = Initialize.Biases(Sizes);
            Weights = Initialize.Weights(Sizes);
            Epochs = parameters.Epochs;
            MiniBatchSize = parameters.MiniBatchSize;
            LearningRate = parameters.LearningRate; // aka 'Eta'
            MnistData = new MnistData();

            SGD();
        }

        /// <summary>
        /// Stochastic Gradient Descent. Trains the network
        /// </summary>
        public void SGD()
        {
            var calculation = new Calculation(Biases, Weights, LayersAmount, LearningRate);

            for (int i = 0; i < Epochs; i++)
            {
                var trainingData = MnistData.TrainingDataShuffled();
                var miniBatches = Initialize.MiniBatches(trainingData, MiniBatchSize);

                foreach (var miniBatch in miniBatches) calculation.UpdateMiniBatch(miniBatch);
            }
        }

        /// <summary>
        /// Validates network input parameters and raises errors when necessary
        /// </summary>
        /// <param name="parameters"></param>
        private static void ValidateParameters(NetworkParameters parameters)
        {
            if (parameters == null) throw new ArgumentNullException(nameof(parameters));
            if (parameters.Sizes.Count < 3) throw new Exception("Incorrect layers: at least one hidden layer is required");
            if (parameters.Sizes[0] != 728) throw new Exception($"Incorrect input layer dimension. Was: {parameters.Sizes[0]}");
            if (parameters.Sizes[^1] != 10) throw new Exception($"Incorrect output layer dimension. Was: {parameters.Sizes[^1]}");
        }
    }
}