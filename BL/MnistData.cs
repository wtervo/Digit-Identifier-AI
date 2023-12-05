using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Accord.DataSets;
using Accord.Math;
using MathNet.Numerics.LinearAlgebra;

namespace BL
{
    /// <summary>
    /// Retrieval and handling of MNIST data
    /// </summary>
    public class MnistData
    {
        private List<Tuple<Matrix<double>, int>> Training { get; set; }
        private List<Tuple<Matrix<double>, int>> Testing { get; set; }

        public MnistData()
        {
            var data = new MNIST(); // This initialization downloads the data
            
            Training = DataToList(data.Training);
            Testing = DataToList(data.Testing);
        }

        /// <summary>
        /// Transforms MNIST data to MathNet matrix format for more convenient handling
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        private static List<Tuple<Matrix<double>, int>> DataToList(Tuple<Sparse<double>[], double[]> data)
        {
            var dataList = new List<Tuple<Matrix<double>, int>>();
            var imageVectorsSparse = data.Item1;
            var actualValues = data.Item2;

            for ( var i = 0; i < imageVectorsSparse.Length; i++)
            {
                var imageArray = imageVectorsSparse[i].ToDense(784); // 784 equals to 28x28 pixels
                var imageVectorDense = Vector<double>.Build.Dense(imageArray).ToColumnMatrix(); // To matrix. Also, getting rid of Accord.Math ASAP
                dataList.Add(new Tuple<Matrix<double>, int>(imageVectorDense ?? Matrix<double>.Build.Dense(784, 0), (int)actualValues[i]));
            }

            return dataList;
        }

        /// <summary>
        /// Unshuffled training data
        /// </summary>
        /// <returns></returns>
        public List<Tuple<Matrix<double>, int>> TrainingData()
        {
            return Training;
        }

        /// <summary>
        /// Training data shuffled with Fisher-Yates
        /// </summary>
        /// <returns></returns>
        public List<Tuple<Matrix<double>, int>> TrainingDataShuffled()
        {
            return ShuffleList(Training);
        }

        /// <summary>
        /// Unshuffled testing data
        /// </summary>
        /// <returns></returns>
        public List<Tuple<Matrix<double>, int>> TestingData()
        {
            return Testing;
        }

        /// <summary>
        /// Testing data shuffled with Fisher-Yates
        /// </summary>
        /// <returns></returns>
        public List<Tuple<Matrix<double>, int>> TestingDataShuffled()
        {
            return ShuffleList(Testing);
        }

        private static readonly Random rng = new();

        /// <summary>
        /// Fisher-Yates. Modified from https://code-maze.com/csharp-randomize-list/
        /// Inputs should always be column matrices, i.e. vectors
        /// </summary>
        /// <param name="listToShuffle"></param>
        /// <returns></returns>
        public static List<Tuple<Matrix<double>, int>> ShuffleList(List<Tuple<Matrix<double>, int>> listToShuffle)
        {
            var listCopy = listToShuffle.ConvertAll(tuple => tuple); ; ; // Don't want to alter the original

            for (int i = listCopy.Count - 1; i > 0; i--)
            {
                var k = rng.Next(i + 1);
                (listCopy[i], listCopy[k]) = (listCopy[k], listCopy[i]);
            }
            return listCopy;
        }
    }
}
