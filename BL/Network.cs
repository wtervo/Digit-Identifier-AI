using MathNet.Numerics.Distributions;
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

        public Network(List<int> sizes)
        {
            Sizes = sizes; // Array of number of neurons in each layer
            LayersAmount = sizes.Count;

            Biases = Initialize.Biases(sizes);
            Weights = Initialize.Weights(sizes);

            foreach (var bias in Biases) Debug.WriteLine(bias.ToString());
            foreach (var weight in Weights) Debug.WriteLine(weight.ToString());
        }
    }
}