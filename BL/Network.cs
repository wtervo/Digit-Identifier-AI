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
        private Calculation Calculation { get; set; }

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
            Calculation = new Calculation(Biases, Weights, LayersAmount, LearningRate);
        }

        /// <summary>
        /// Stochastic Gradient Descent. Trains the network. If the optional parameter is "true",
        /// following the advancement of the trainging process becomes much clearer, as the network
        /// performance is evaluated after each epoch. However, this makes the training process
        /// last much, much longer
        /// </summary>
        /// /// <param name="evaluateAfterEachEpoch"></param>
        public void SGD(bool evaluateAfterEachEpoch = false)
        {
            for (int i = 0; i < Epochs; i++)
            {
                var trainingData = MnistData.TrainingDataShuffled();
                var miniBatches = Initialize.MiniBatches(trainingData, MiniBatchSize);

                foreach (var miniBatch in miniBatches) Calculation.UpdateMiniBatch(miniBatch);

                if (evaluateAfterEachEpoch)
                {
                    EvaluateNetwork();
                    Debug.WriteLine($"Epoch {i + 1} / {Epochs} done");
                }
                else
                {
                    Debug.WriteLine($"Epoch {i + 1} / {Epochs} done");
                }
            }

            var trainingResults = Calculation.GetTrainingData();
            Biases = trainingResults.Item1;
            Weights = trainingResults.Item2;
        }

        /// <summary>
        /// Test network's performance against a separate dataset that has not been used in the training.
        /// This does not affect the network's learning in any way. Current biases and weights are used
        /// </summary>
        public void EvaluateNetwork()
        {
            var testingData = MnistData.TestingDataShuffled();
            var result = Calculation.Evaluate(testingData);
            Debug.WriteLine($"Result of test data evaluation: {result} / {testingData.Count}");
        }

        /// <summary>
        /// Validates network input parameters and raises errors when necessary
        /// </summary>
        /// <param name="parameters"></param>
        private static void ValidateParameters(NetworkParameters parameters)
        {
            if (parameters == null) throw new ArgumentNullException(nameof(parameters));
            if (parameters.Sizes.Count < 3) throw new Exception("Incorrect layers: at least one hidden layer is required");
            if (parameters.Sizes[0] != 784) throw new Exception($"Incorrect input layer dimension. Was: {parameters.Sizes[0]}");
            if (parameters.Sizes[^1] != 10) throw new Exception($"Incorrect output layer dimension. Was: {parameters.Sizes[^1]}");
        }
    }
}