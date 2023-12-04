using System;
using System.Collections.Generic;
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
    public class MnistData
    {
        private List<Tuple<Vector<double>, int>> Training { get; set; }
        private List<Tuple<Vector<double>, int>> Testing { get; set; }

        public MnistData()
        {
            var data = new MNIST(); // This initialization downloads the data
            var trainingData = data.Training;
            var testingData = data.Testing;
            
            Training = DataToList(trainingData);
            Testing = DataToList(testingData);
        }

        private static List<Tuple<Vector<double>, int>> DataToList(Tuple<Sparse<double>[], double[]> data)
        {
            var dataList = new List<Tuple<Vector<double>, int>>();
            var imageVectorsSparse = data.Item1;
            var actualValues = data.Item2;

            for ( var i = 0; i < imageVectorsSparse.Length; i++)
            {
                var imageArray = imageVectorsSparse[i].ToDense(784); // 784 equals to 28x28 pixels
                var imageVectorDense = Vector<double>.Build.Dense(imageArray); // To vector. Also, getting rid of Accord.Math ASAP
                dataList.Add(new Tuple<Vector<double>, int>(imageVectorDense ?? Vector<double>.Build.Dense(784), (int)actualValues[i]));
            }

            return dataList;
        }

        public List<Tuple<Vector<double>, int>> TrainingData()
        {
            return Training;
        }

        public List<Tuple<Vector<double>, int>> TrainingDataShuffled()
        {
            return ShuffleList(Training);
        }

        public List<Tuple<Vector<double>, int>> TestingData()
        {
            return Testing;
        }

        public List<Tuple<Vector<double>, int>> TestingDataShuffled()
        {
            return ShuffleList(Testing);
        }

        private static readonly Random rng = new();

        // Fisher-Yates. Modified from https://code-maze.com/csharp-randomize-list/
        public static List<Tuple<Vector<double>, int>> ShuffleList(List<Tuple<Vector<double>, int>> listToShuffle)
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
