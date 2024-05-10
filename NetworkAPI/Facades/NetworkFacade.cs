using AI;
using AI.Models;
using System.Diagnostics;

namespace NetworkAPI.Facades
{
    public static class NetworkFacade
    {
        private static List<Network> Networks { get; set; } = new List<Network>();
        private static int InputNeurons { get; } = 784;
        private static int OutputNeurons { get; } = 10;

        public static Guid AddNetwork(NetworkParameters parameters)
        {
            // Add input and output layer dimensions, which are constants for Digit Identifier AI
            parameters.Layers = parameters.Layers.Prepend(InputNeurons).Append(OutputNeurons).ToList();
            var newNetwork = new Network(parameters);

            // Development failsafe to prevent excess networks from hogging all the memory. Frontend
            // has similar check, but it can be bypassed by rebuilding front while backend is running.
            if (Networks.Count == 5)
            { 
                Networks = new List<Network>();
            }

            Networks.Add(newNetwork);

            return newNetwork.ID;
        }

        public static void TrainNetwork(Guid networkID)
        {
            var network = FindNetwork(networkID);
            // This operation can take an extremely long amount of time, thus the use of Task
            var t = new Task(network.SGD);
            t.Start();
        }

        public static void EvaluateNetwork(Guid networkID)
        {
            var network = FindNetwork(networkID);
            network.EvaluateNetwork();
        }

        public static NetworkInfo NetworkCurrentStatus(Guid networkID)
        {
            var network = FindNetwork(networkID);
            return network.NetworkStatus();
        }

        public static List<NetworkInfo>? NetworkStatusAll()
        {
            if (Networks.Count == 0) return null;
            else
            {
                var currentNetworks = new List<NetworkInfo>();
                foreach (var network in Networks)
                {
                    // Frontend can query current data too fast after network training has been stopped
                    if (network.Stop) throw new InvalidOperationException("Network operation is in the middle of stopping.");
                    currentNetworks.Add(network.NetworkStatus());
                }

                return currentNetworks;
            }
        }

        public static void RemoveNetwork(Guid networkID)
        {
            var network = FindNetwork(networkID);
            Networks.Remove(network);
        }

        public static void StopNetwork(Guid networkID)
        {
            var network = FindNetwork(networkID);
            network.StopExecution();
        }

        private static Network FindNetwork(Guid networkID)
        {
            var network = Networks.Find(network => network.ID == networkID);
            return network ?? throw new Exception("Network not found");
        }

    }
}
