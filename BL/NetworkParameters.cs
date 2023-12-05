using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class NetworkParameters
    {
        public List<int> Sizes { get; set; } = new List<int>();
        public int Epochs { get; set; }
        public int MiniBatchSize { get; set; }
        public double LearningRate { get; set; }
    }
}
