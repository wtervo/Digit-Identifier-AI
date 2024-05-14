using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AI.Models
{
    public class EvaluationResult
    {
        public int CorrectResults { get; set; }
        public List<int> NetworkResults { get; set; } = new List<int>();
        public List<int> ActualResults { get; set; } = new List<int>();
        public List<Matrix<double>> ImagePixels { get; set; } = new List<Matrix<double>> { };
    }
}
