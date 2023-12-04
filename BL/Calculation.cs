using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using MathNet.Numerics.LinearAlgebra;

namespace BL
{
    public static class Calculation
    {
        private static double Sigmoid(double z)
        {
            return 1.0 / (1.0 + Math.Exp(z));
        }

        private static double SigmoidDerivative(double z)
        {
            return Sigmoid(z) * (1 - Sigmoid(z));
        }

        public static void UpdateMiniBatch(List<Tuple<Vector<double>, int>> miniBatch, List<Matrix<double>> biases, List<Matrix<double>> weights, double learningRate)
        {

        }
    }
}
