import React, { useState } from "react";
import NetworkCreation from "@src/models/NetworkCreation";
import { getNetworkCurrentStatus, postInitializeNetwork } from "../../services/networkService";
import { useGridContext } from "@src/context/GridContext";
import { MIN_HIDDEN_LAYERS,
  MAX_HIDDEN_LAYERS,
  MIN_HIDDEN_LAYER_NEURONS,
  MAX_HIDDEN_LAYER_NEURONS,
  MIN_MINIBATCH_SIZE,
  MAX_MINIBATCH_SIZE,
  MIN_EPOCHS,
  MAX_EPOCHS,
  MIN_LEARNING_RATE,
  MAX_LEARNING_RATE } from "@src/constants/network";
import { MAX_LOADED_NETWORKS } from "@src/constants/ui";

const defaultValues: NetworkCreation = {
  layers: [],
  minibatchSize: 0,
  epochs: 0,
  learningRate: 0,
  evaluateAfterEachEpoch: false
};

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
}

/**
 * Form to specify and create a new network
 */
const NetworkConfigForm = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const [networkParameters, setNetworkParameters] = useState<NetworkCreation>(defaultValues);
    const gridContext = useGridContext();

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      gridContext.setIsLoading(true);
      const networkId = await postInitializeNetwork(networkParameters);
      const data = await getNetworkCurrentStatus(networkId);

      gridContext.setCurrentNetwork(data);
      gridContext.setLoadedNetworks([...gridContext.loadedNetworks, data]);
      if (gridContext.loadedNetworks.length < MAX_LOADED_NETWORKS) gridContext.setIsLoading(false);
    };
  
    const onInputChange = (event: { target: HTMLInputElement; }) => {
      const {name, value} = event.target;

      if (name.includes("layerNeurons")) {
        const index = parseInt(name.slice(-1));
        const newArr = networkParameters.layers;
        newArr[index] = parseInt(value);
        setNetworkParameters({...networkParameters, layers: newArr});
      } else if (name === "layers") {
        let layerCount = parseInt(value);
        // Failsafe to prevent hiddenLayerNeurons() potentially adding hundreds of elements at once and halting the program
        if (layerCount > MAX_HIDDEN_LAYERS) layerCount = MAX_HIDDEN_LAYERS;

        const layerArray = new Array<number>(layerCount).fill(1);
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
            <label title={`Number of neurons in hidden layer ${i + 1}.`}>{"HL " + (i + 1) + ": "}</label>
            <input type="number" name={"layerNeurons" + i} value={networkParameters.layers[i]}
              min={MIN_HIDDEN_LAYER_NEURONS} max={MAX_HIDDEN_LAYER_NEURONS} onChange={onInputChange} />
            <br />
          </div>
        );
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
        {gridContext.loadedNetworks.length < MAX_LOADED_NETWORKS ?
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label title="The number of hidden layers the network should have.">Hidden Layers: </label>
              <input type="number" name="layers" value={networkParameters.layers.length} min={MIN_HIDDEN_LAYERS}
                max={MAX_HIDDEN_LAYERS} onChange={onInputChange} />
              {networkParameters.layers.length > 0 && 
              <>
                <br /><br />
                <label>Hidden Layer Neurons:</label><br />
                {hiddenLayerNeurons()}
              </>
              }
            </fieldset>
            <fieldset>
              <label title="The size of minibatches, i.e. in what sized batches is the training set split.">Minibatches: </label>
              <input type="number" name="minibatchSize" value={networkParameters.minibatchSize} min={MIN_MINIBATCH_SIZE}
                max={MAX_MINIBATCH_SIZE} onChange={onInputChange} />
            </fieldset>
            <fieldset>
              <label title="How many times should the training be iterated upon.">Epochs: </label>
              <input type="number" name="epochs" value={networkParameters.epochs} min={MIN_EPOCHS}
                max={MAX_EPOCHS} onChange={onInputChange} />
            </fieldset>
            <fieldset>
              <label title="TODO: Some reasonable explanation">Learning Rate: </label>
              <input type="number" step="0.1" name="learningRate" value={networkParameters.learningRate} min={MIN_LEARNING_RATE}
                max={MAX_LEARNING_RATE} onChange={onInputChange} />
            </fieldset>
            <fieldset>
              <label
                title="Network's performance is evaluated after each epoch is finished. This makes following the training's progression easier, but it makes the training take much longer."
              >Evaluate After Each Epoch</label>
              <input type="checkbox" name="evaluateAfterEachEpoch" checked={networkParameters.evaluateAfterEachEpoch}
                onChange={onInputChange}/><br />
              <label><b>Note: This will make the training last much longer</b></label>
            </fieldset>
            <button type="submit" disabled={gridContext.isLoading}>Create Network</button>
            <button onClick={() => setNetworkParameters(defaultValues)}>Reset</button><br />
          </form>
          :
          <p>Maximum amount of networks loaded. Up to {MAX_LOADED_NETWORKS} can be loaded at a time.</p>
        }
      </div>
    );
  });

export default NetworkConfigForm;