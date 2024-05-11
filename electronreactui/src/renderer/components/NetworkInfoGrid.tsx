import React from "react";
import { dummyNetwork } from "@src/constants/network";
import { useGridContext } from "@src/context/GridContext";
import { NetworkCurrentStatus } from "@src/models/enums";
import { getNetworkCurrentStatus, postEvaluateNetwork, postRemoveNetwork, postStopNetwork, postTrainNetwork } from "@src/services/networkService";
import { Responsive, WidthProvider } from "react-grid-layout";
import Network from "@src/models/Network";

const ResponsiveGridLayout = WidthProvider(Responsive);

const responsiveProps = {
  className: "responsive-grid",
  breakpoints: { lg: 1200 },
  cols: { lg: 4 },
  isDraggable: false,
  isResizable: false,
  rowHeight: 25,
  layouts: {
    lg: [
      { i: "item1", x: 0, y: 0, w: 1, h: 1},
      { i: "item2", x: 1, y: 0, w: 1, h: 1},
      { i: "item3", x: 2, y: 0, w: 1, h: 1},
      { i: "item4", x: 0, y: 1, w: 3, h: 1},
      { i: "item5", x: 0, y: 2, w: 1, h: 1},
      { i: "item6", x: 1, y: 2, w: 1, h: 1},
      { i: "item7", x: 2, y: 2, w: 1, h: 1},
      { i: "item8", x: 0, y: 3, w: 1, h: 1},
      { i: "item9", x: 1, y: 3, w: 1, h: 1},
      { i: "item10", x: 0, y: 4, w: 1, h: 1},
      { i: "item11", x: 1, y: 4, w: 1, h: 1},
      { i: "item12", x: 3, y: 0, w: 1, h: 1}
    ]
  }
};

/**
 * Displays basic properties of a network in a grid. Contains buttons for network operations.
 */
const NetworkInfoGrid = () => {
  const gridContext = useGridContext();
  const currentNetwork = gridContext.currentNetwork;
  const canBeEvaluated = currentNetwork.status === NetworkCurrentStatus.TrainingDone || currentNetwork.status === NetworkCurrentStatus.EvaluationDone;

  const trainingOnClick = async () => {
    await postTrainNetwork(currentNetwork.id);
    gridContext.setIsLoading(true);
    console.log("Training started");
  };

  const evaluateOnClick = async () => {
    await postEvaluateNetwork(currentNetwork.id);
    console.log("Evaluation started");
  };

  const stopOnClick = async () => {
    await postStopNetwork(currentNetwork.id);
    // Update frontend data to latest to avoid discrepancy
    // Data is fetched too quickly, when the backend is not yet fully stopped, so we need a delay
    // setTimeout is a dirty solution, but I couldn't be arsed to think of a better one ¯\_(ツ)_/¯
    setTimeout(async () => {
      const networkData: Network = await getNetworkCurrentStatus(currentNetwork.id);
      gridContext.setCurrentNetwork(networkData);
    }, 1500);
    gridContext.setIsLoading(false);
    console.log("Training stopped");
  };

  const removeNetwork = async () => {
    await postRemoveNetwork(currentNetwork.id);

    const remainingNetworks = gridContext.loadedNetworks.filter(network => network !== currentNetwork);
    if (remainingNetworks.length === 0) {
      gridContext.setCurrentNetwork(dummyNetwork);
      gridContext.setLoadedNetworks([]);
    } else {
      gridContext.setCurrentNetwork(remainingNetworks[0]);
      gridContext.setLoadedNetworks(remainingNetworks);
    }
  };

  return (
    <div>
      <ResponsiveGridLayout useCSSTransforms={false} {...responsiveProps}>
        <button key="item1" title="Starts training the network with the input parameters. This may take a long time."
          disabled={gridContext.isLoading} onClick={trainingOnClick}>Start Training
        </button>
        <button key="item2" title="Evaluates the performance of the network. Evaluation can be done after the network has been trained."
          disabled={gridContext.isLoading || !canBeEvaluated} onClick={evaluateOnClick}>Evaluate
        </button>
        <button key="item3" title="Removes the network. This cannot be undone." disabled={gridContext.isLoading}
          onClick={removeNetwork}>Delete
        </button>
        {/* {currentNetwork.status === NetworkCurrentStatus.Training && <button key="item12" title="Stops the training of the network" onClick={stopOnClick}>Stop</button>} */}
        <button key="item12" title="Stops the training of the network" onClick={stopOnClick}>Stop</button>
        <p className="network-info-grid-item" key="item4">{"Name: Dummy Name"} &emsp; &emsp; {`ID: ${currentNetwork.id}`}</p>
        <p className="network-info-grid-item" key="item5">Layers: {currentNetwork.layers.join(" ")}</p>
        <p className="network-info-grid-item" key="item6">Epochs: {currentNetwork.epochs}</p>
        <p className="network-info-grid-item" key="item7">Minibatch Size: {currentNetwork.minibatchSize}</p>
        <p className="network-info-grid-item" key="item8">Learning Rate: {currentNetwork.learningRate}</p>
        <p className="network-info-grid-item" key="item9">Evaluate After Each Epoch: {currentNetwork.evaluateAfterEachEpoch.toString()}</p>
        <p className="network-info-grid-item" key="item10">Network Status: <b>{NetworkCurrentStatus[currentNetwork.status]}</b></p>
        <p className="network-info-grid-item" key="item11">Progress:
          <b>{currentNetwork.progress !== "" ? currentNetwork.progress : "Training not started"}</b>
        </p>
      </ResponsiveGridLayout>
    </div>
  );
};

export default NetworkInfoGrid;