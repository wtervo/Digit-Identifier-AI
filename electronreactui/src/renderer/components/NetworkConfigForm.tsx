import React, { useState } from "react";
import NetworkParameters from "@src/models/NetworkParameters";
import { getNetworkCurrentStatus, postInitializeNetwork } from "../../services/networkService";
import { useGridContext } from "@src/context/GridContext";
import { minHiddenLayers,
  maxHiddenLayers,
  minHiddenLayerNeurons,
  maxHiddenLayerNeurons,
  minMinibatchSize,
  maxMinibatchSize,
  minEpochs,
  maxEpochs,
  minLearningRate,
  maxLearningRate } from "@src/constants/network";
import { maxLoadedNetworks } from "@src/constants/ui";
import Network from "@src/models/Network";

const defaultValues: NetworkParameters = {
  layers: [],
  minibatchSize: 0,
  epochs: 0,
  learningRate: 0,
  evaluateAfterEachEpoch: false
}

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
}

const NetworkConfigForm = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
  const [networkParameters, setNetworkParameters] = useState<NetworkParameters>(defaultValues);
  const gridContext = useGridContext();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    gridContext.setIsLoading(true);
    postInitializeNetwork(networkParameters).then((networkId: string) => {
      getNetworkCurrentStatus(networkId).then((data: Network) => {
        gridContext.setCurrentNetwork(data);
        gridContext.setLoadedNetworks([...gridContext.loadedNetworks, data]);
        if (gridContext.loadedNetworks.length < maxLoadedNetworks) gridContext.setIsLoading(false);
      })
    });
  };
  
  const onInputChange = (event: { target: HTMLInputElement; }) => {
    const {name, value} = event.target;

    if (name.includes("layerNeurons")) {
      const index = parseInt(name.slice(-1));
      const newArr = networkParameters.layers;
      newArr[index] = parseInt(value);
      setNetworkParameters({...networkParameters, layers: newArr});
    } else if (name === "layers") {
      const intValue = parseInt(value);
      const layerArray = new Array<number>(intValue).fill(1);
      setNetworkParameters({...networkParameters, layers: layerArray});
    } else if (name === "evaluateAfterEachEpoch") {
      setNetworkParameters({...networkParameters, evaluateAfterEachEpoch: !networkParameters.evaluateAfterEachEpoch});
    } else {
      setNetworkParameters({...networkParameters, [name]: value});
    }
  };

  const hiddenLayerNeurons = () => {
    const inputArray = [];

    for (let i = 0; i < networkParameters.layers.length; i++) {
      inputArray.push(
        <div key={i}>
          <label>{"HL " + (i + 1) + ": "}</label>
          <input type="number" name={"layerNeurons" + i} value={networkParameters.layers[i]}
            min={minHiddenLayerNeurons} max={maxHiddenLayerNeurons} onChange={onInputChange} />
          <br />
        </div>)
    }

    return inputArray;
  };

  return (
    <div
      style={{ ...style }}
      // className={["classes you wish to apply", className].join(' ')}
      key={key}
      {...restOfProps}
      ref={ref}
    >
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Hidden Layers: </label>
          <input type="number" name="layers" value={networkParameters.layers.length} min={minHiddenLayers}
            max={maxHiddenLayers} onChange={onInputChange} />
          {networkParameters.layers.length > 0 && 
            <>
              <br /><br />
              <label>Hidden Layer Neurons:</label><br />
              {hiddenLayerNeurons()}
            </>
          }
        </fieldset>
        <fieldset>
          <label>Minibatches: </label>
          <input type="number" name="minibatchSize" value={networkParameters.minibatchSize} min={minMinibatchSize}
            max={maxMinibatchSize} onChange={onInputChange} />
        </fieldset>
        <fieldset>
          <label>Epochs: </label>
          <input type="number" name="epochs" value={networkParameters.epochs} min={minEpochs}
            max={maxEpochs} onChange={onInputChange} />
        </fieldset>
        <fieldset>
          <label>Learning Rate: </label>
          <input type="number" step="0.1" name="learningRate" value={networkParameters.learningRate} min={minLearningRate}
            max={maxLearningRate} onChange={onInputChange} />
        </fieldset>
        <fieldset>
          <label>Evaluate After Each Epoch</label>
          <input type="checkbox" name="evaluateAfterEachEpoch" checked={networkParameters.evaluateAfterEachEpoch}
            onChange={onInputChange}/><br />
          <label><b>Note: This will make the training last much longer</b></label>
        </fieldset>
        <button type="submit" disabled={gridContext.isLoading || gridContext.loadedNetworks.length === maxLoadedNetworks}>Submit</button>
        <button onClick={() => setNetworkParameters(defaultValues)}>Reset</button><br />
      </form>
      {gridContext.loadedNetworks.length === maxLoadedNetworks && <p>Maximum amount of networks loaded. Up to {maxLoadedNetworks} can be loaded at a time.</p>}
    </div>
  );
});

export default NetworkConfigForm;