using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AI.Models
{
    public class NetworkParameters
    {
        public List<int> Layers { get; set; } = new List<int>();
        public int Epochs { get; set; }
        public int MinibatchSize { get; set; }
        public double LearningRate { get; set; }
        public bool EvaluateAfterEachEpoch { get; set; }
    }
}
