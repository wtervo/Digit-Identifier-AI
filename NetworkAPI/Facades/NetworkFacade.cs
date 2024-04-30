using AI;
using AI.Models;
using System.Diagnostics;

namespace NetworkAPI.Facades
{
    public class NetworkFacade
    {
        private Network Network { get; set; }
        public Guid NetworkID { get; set; }

        public NetworkFacade(NetworkParameters parameters)
        {
            // Add input and output layer dimensions
            parameters.Layers = parameters.Layers.Prepend(784).Append(10).ToList();
            Network = new Network(parameters);
            Debug.WriteLine(Network);
        }

        public void TrainNetwork()
        {
            Network.SGD();
        }

        public void EvaluateNetwork()
        {
            Network.EvaluateNetwork();
        }

        public NetworkStatus NetworkCurrentStatus()
        {
            return Network.NetworkStatus();
        }
    }
}
