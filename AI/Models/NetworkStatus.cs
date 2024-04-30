using MathNet.Numerics.LinearAlgebra;

namespace AI.Models
{
    public class NetworkStatus
    {
        public NetworkCurrentStatus Status { get; set; }
        public string Progress { get; set; }
        public List<Matrix<double>> Biases { get; set; }
        public List<Matrix<double>> Weights { get; set; }
    }
}
