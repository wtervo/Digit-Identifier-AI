using AI.Models;
using MathNet.Numerics.LinearAlgebra;
using System.Diagnostics;

namespace AI
{
    /// <summary>
    /// Network training and testing
    /// </summary>
    public class Network
    {
        private List<int> Layers { get; set; }
        private int LayersAmount { get; set; }
        private List<Matrix<double>> Biases { get; set; } = new List<Matrix<double>>();
        private List<Matrix<double>> Weights { get; set; } = new List<Matrix<double>>();
        private int Epochs { get; set; }
        private int MiniBatchSize { get; set; }
        private double LearningRate { get; set; }
        private bool EvaluateAfterEachEpoch { get; set; }
        private MnistData MnistData { get; set; }
        private Calculation Calculation { get; set; }
        public string Progress { get; set; } = "";
        public NetworkCurrentStatus Status { get; set; } = NetworkCurrentStatus.Initialized;

        public Network(NetworkParameters parameters)
        {
            ValidateParameters(parameters);

            Layers = parameters.Layers; // Array of number of neurons in each layer
            LayersAmount = Layers.Count;
            Biases = Initialize.Biases(Layers);
            Weights = Initialize.Weights(Layers);
            Epochs = parameters.Epochs;
            MiniBatchSize = parameters.MiniBatchSize;
            LearningRate = parameters.LearningRate; // aka 'Eta'
            EvaluateAfterEachEpoch = parameters.EvaluateAfterEachEpoch;
            MnistData = new MnistData();
            Calculation = new Calculation(Biases, Weights, LayersAmount, LearningRate);
        }

        /// <summary>
        /// Stochastic Gradient Descent. Trains the network. If EvaluateAfterEachEpoch parameter is "true",
        /// following the advancement of the trainging process becomes much clearer, as the network
        /// performance is evaluated after each epoch. However, this makes the training process
        /// last much, much longer
        /// </summary>
        public void SGD()
        {
            Status = NetworkCurrentStatus.Training;

            for (int i = 0; i < Epochs; i++)
            {
                var trainingData = MnistData.TrainingDataShuffled();
                var miniBatches = Initialize.MiniBatches(trainingData, MiniBatchSize);

                foreach (var miniBatch in miniBatches) Calculation.UpdateMiniBatch(miniBatch);

                var progress = $"{i + 1}/{Epochs}";

                if (EvaluateAfterEachEpoch)
                {
                    EvaluateNetwork();
                    Debug.WriteLine($"Epoch {progress} done");
                }
                else
                {
                    Debug.WriteLine($"Epoch {progress} done");
                }

                Progress = progress;
            }

            var trainingResults = Calculation.GetTrainingData();
            Biases = trainingResults.Item1;
            Weights = trainingResults.Item2;

            Status = NetworkCurrentStatus.TrainingDone;
        }

        /// <summary>
        /// Test network's performance against a separate dataset that has not been used in the training.
        /// This does not affect the network's learning in any way. Current biases and weights are used
        /// </summary>
        public void EvaluateNetwork()
        {
            Status = NetworkCurrentStatus.Evaluation;

            var testingData = MnistData.TestingDataShuffled();
            var result = Calculation.Evaluate(testingData);
            Debug.WriteLine($"Result of test data evaluation: {result} / {testingData.Count}");

            Status = NetworkCurrentStatus.EvaluationDone;
        }

        /// <summary>
        /// Validates network input parameters and raises errors when necessary
        /// </summary>
        /// <param name="parameters"></param>
        private static void ValidateParameters(NetworkParameters parameters)
        {
            if (parameters == null) throw new ArgumentNullException(nameof(parameters));
            if (parameters.Layers.Count < 3) throw new Exception("Incorrect layers: at least one hidden layer is required");
            if (parameters.Layers[0] != 784) throw new Exception($"Incorrect input layer dimension. Was: {parameters.Layers[0]}");
            if (parameters.Layers[^1] != 10) throw new Exception($"Incorrect output layer dimension. Was: {parameters.Layers[^1]}");
        }

        public NetworkStatus NetworkStatus()
        {
            var biases = new List<Matrix<double>>();
            var weights = new List<Matrix<double>>();

            if (Status == NetworkCurrentStatus.Training)
            {
                biases = Calculation.Biases;
                weights = Calculation.Weights;
            }
            else
            {
                biases = Biases;
                weights = Weights;
            }

            var status = new NetworkStatus
            {
                Status = Status,
                Progress = Progress,
                Biases = Biases,
                Weights = Biases
            };

            return status;
        }
    }
}