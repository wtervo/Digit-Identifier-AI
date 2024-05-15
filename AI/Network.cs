using AI.Models;
using MathNet.Numerics.LinearAlgebra;
using System.Diagnostics;

namespace AI
{
    /// <summary>
    /// Network training and evaluation
    /// </summary>
    public class Network : NetworkInfo
    {
        private int LayersAmount { get; set; }
        private MnistData MnistData { get; set; }
        private Calculation Calculation { get; set; }
        public EvaluationResult EvaluationResult { get; set; } = new EvaluationResult();
        public List<int> EvaluationHistory { get; set; } = new List<int>();
        public bool Stop { get; set; } = false;

        public Network(NetworkParameters parameters)
        {
            ValidateParameters(parameters);

            ID = Guid.NewGuid();
            Layers = parameters.Layers; // Array of number of neurons in each layer
            LayersAmount = Layers.Count;
            Biases = Initialize.Biases(Layers);
            Weights = Initialize.Weights(Layers);
            Epochs = parameters.Epochs;
            MinibatchSize = parameters.MinibatchSize;
            LearningRate = parameters.LearningRate; // aka 'Eta'
            EvaluateAfterEachEpoch = parameters.EvaluateAfterEachEpoch;
            MnistData = new MnistData();
            Calculation = new Calculation(Biases, Weights, LayersAmount, LearningRate);
            Progress = "";
            Status = NetworkCurrentStatus.Initialized;
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
            Progress = $"0/{Epochs}";

            for (int i = 0; i < Epochs; i++)
            {
                var trainingData = MnistData.TrainingDataShuffled();
                var miniBatches = Initialize.Minibatches(trainingData, MinibatchSize);

                foreach (var miniBatch in miniBatches) Calculation.UpdateMiniBatch(miniBatch);
                if (Stop) break;

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

            if (Stop)
            {
                Status = NetworkCurrentStatus.Initialized;
                Progress = "";
                Stop = false;
            } else
            {
                Status = NetworkCurrentStatus.TrainingDone;
            }
        }

        /// <summary>
        /// Test network's performance against a separate dataset that has not been used in the training.
        /// This does not affect the network's learning in any way. Current biases and weights are used
        /// </summary>
        public void EvaluateNetwork()
        {
            if (!EvaluateAfterEachEpoch || EvaluationHistory.Count >= Epochs) Status = NetworkCurrentStatus.Evaluation;

            var testingData = MnistData.TestingDataShuffled();
            EvaluationResult = Calculation.Evaluate(testingData);
            EvaluationHistory.Add(EvaluationResult.CorrectResults);

            Debug.WriteLine($"Result of test data evaluation: {EvaluationResult.CorrectResults} / {testingData.Count}");

            if (!EvaluateAfterEachEpoch || EvaluationHistory.Count >= Epochs) Status = NetworkCurrentStatus.EvaluationDone;
        }

        /// <summary>
        /// Checks network's current status and returns relevant, involving data
        /// </summary>
        /// <returns></returns>
        public NetworkInfo NetworkStatus()
        {
            List<Matrix<double>> biases;
            List<Matrix<double>> weights;

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

            var status = new NetworkInfo
            {
                ID = ID,
                Layers = Layers,
                Epochs = Epochs,
                MinibatchSize = MinibatchSize,
                LearningRate = LearningRate,
                EvaluateAfterEachEpoch = EvaluateAfterEachEpoch,
                Status = Status,
                Progress = Progress,
                Biases = biases,
                Weights = weights,
                EvaluationResult = EvaluationResult,
                EvaluationHistory = EvaluationHistory
            };

            return status;
        }

        /// <summary>
        /// Stops the training of a network
        /// </summary>
        public void StopExecution()
        {
            Stop = true;
            Calculation.Stop = true;
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
    }
}