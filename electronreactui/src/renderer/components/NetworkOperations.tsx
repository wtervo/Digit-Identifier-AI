import { DUMMY_NETWORK } from "@src/constants/network";
import { POLLING_INTERVAL } from "@src/constants/ui";
import { useGridContext } from "@src/context/GridContext";
import EvaluationResult from "@src/models/EvaluationResult";
import Network from "@src/models/Network";
import { NetworkCurrentStatus } from "@src/models/enums";
import { getNetworkCurrentStatus, getNetworkStatusAll, postEvaluateNetwork, postRemoveNetwork, postStopNetwork, postTrainNetwork } from "@src/services/networkService";
import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
};

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
      { i: "item4", x: 3, y: 0, w: 1, h: 1},
    ]
  }
};

/**
 * Buttons for network operations
 */
const NetworkOperations = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const gridContext = useGridContext();
    const currentNetwork = gridContext.currentNetwork;
    const [isTraining, setIsTraining] = useState(false);
    const canBeEvaluated =
      currentNetwork.status === NetworkCurrentStatus.TrainingDone ||
      currentNetwork.status === NetworkCurrentStatus.EvaluationDone;

    const pollData = async () => {
      try {
        const data = await getNetworkCurrentStatus(currentNetwork.id);
        gridContext.setCurrentNetwork(data);
      } catch (err) {
        console.log("Unexpected error while polling: " + err.message);
      }
    };
    
    useEffect(() => {
      let intervalId: NodeJS.Timeout;
      // Poll data when training starts, stop when training ends
      if (currentNetwork.status === NetworkCurrentStatus.TrainingDone) {
        clearInterval(intervalId);
        setIsTraining(false);
        gridContext.setIsLoading(false);
      } else if (isTraining) {
        intervalId = setInterval(pollData, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
      }
    }, [isTraining, currentNetwork.status]);

    const trainingOnClick = async () => {
      await postTrainNetwork(currentNetwork.id);
      gridContext.setIsLoading(true);
      gridContext.setCurrentNetwork({...currentNetwork,
          progress: `0/${currentNetwork.epochs}`,
          status: NetworkCurrentStatus.Training
      })
      // Start polling data during training
      setIsTraining(true);
      console.log("Training started");
    };

    const evaluateOnClick = async () => {
      await postEvaluateNetwork(currentNetwork.id);
      const networkData: Network = await getNetworkCurrentStatus(currentNetwork.id);
      gridContext.setCurrentNetwork( networkData );
      const nonAlteredNetworks = gridContext.loadedNetworks.filter(network => network.id !== networkData.id);
      gridContext.setLoadedNetworks([...nonAlteredNetworks, networkData]);
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
      setIsTraining(false); // Stop polling
      gridContext.setIsLoading(false);
      console.log("Training stopped");
    };

    const removeOnClick = async () => {
      await postRemoveNetwork(currentNetwork.id);
      const networks: Array<Network> = await getNetworkStatusAll();
      if (networks.length === 0) {
        gridContext.setCurrentNetwork(DUMMY_NETWORK);
        gridContext.setLoadedNetworks([]);
      } else {
        const remainingNetworks = networks.filter(network => network !== currentNetwork);
        gridContext.setCurrentNetwork(remainingNetworks[0]);
        gridContext.setLoadedNetworks(remainingNetworks);
      }
    };
    console.log(currentNetwork);
    return(
      <div
        style={{ ...style }}
        // className={["classes you wish to apply", className].join(' ')}
        key={key}
        {...restOfProps}
        ref={ref}
      >
        <ResponsiveGridLayout useCSSTransforms={false} {...responsiveProps}>
          <button key="item1" title="Starts training the network with the input parameters. This may take a long time."
            disabled={gridContext.isLoading} onClick={trainingOnClick}>Start Training
          </button>
          <button key="item2" title="Evaluates the performance of the network. Evaluation can be done after the network has been trained."
            disabled={gridContext.isLoading || !canBeEvaluated} onClick={evaluateOnClick}>Evaluate
          </button>
          <button key="item3" title="Removes the network. This cannot be undone." disabled={gridContext.isLoading}
            onClick={removeOnClick}>Delete
          </button>
          <button key="item4" disabled={currentNetwork.status !== NetworkCurrentStatus.Training}
            title="Stops the training of the network" onClick={stopOnClick}>Stop
          </button>
        </ResponsiveGridLayout>
      </div>
    );
  }
)

export default NetworkOperations;