using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using BL;

namespace Digit_Identifier_AI
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        // TODO: POISTA TÄMÄ PASKA VITTUUN MYÖHEMMIN
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            Debug.WriteLine("vittu");
            var parameters = new NetworkParameters
            {
                Sizes = new List<int> { 2, 3, 1 },
                MiniBatchSize = 1000,
                Epochs = 3,
            };
            var test = new Network(parameters);
        }
    }
}
