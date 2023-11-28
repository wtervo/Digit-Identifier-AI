using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public static class Helpers
    {
        public static double Sigmoid(double z)
        {
            return 1.0 / (1.0 + Math.Exp(z));
        }

        public static double SigmoidDerivative(double z)
        {
            return Sigmoid(z) * (1 - Sigmoid(z));
        }
    }
}
