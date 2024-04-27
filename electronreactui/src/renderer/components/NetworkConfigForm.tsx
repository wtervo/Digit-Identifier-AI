import React, {FormEventHandler, useState} from "react";
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

interface FormData {
  layers: number,
  layerNeurons: Array<number>,
  minibatchSize: number,
  epochs: number,
  learningRate: number
}

const defaultValues: FormData = {
  layers: 0,
  layerNeurons: [],
  minibatchSize: 0,
  epochs: 0,
  learningRate: 0
}

const NetworkConfigForm = () => {
  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [erros, setErrors] = useState({});
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };
  
  const onInputChange = (event: { target: HTMLInputElement; }) => {
    const {name, value} = event.target;

    if (name.includes("layerNeurons")) {
      const index = parseInt(name.slice(-1));
      const newArr = formData.layerNeurons;
      newArr[index] = parseInt(value);
      setFormData({...formData, layerNeurons: newArr});
    } else if (name === "layers") {
      const intValue = parseInt(value);
      const zeroArray = new Array<number>(intValue).fill(1);
      setFormData({...formData, layerNeurons: zeroArray, layers: intValue});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const hiddenLayerNeurons = () => {
    const inputArray = [];

    for (let i = 0; i < formData.layers; i++) {
      inputArray.push(
        <>
          <label>{"Layer " + (i + 1) + ": "}</label>
          <input key={i} type="number" name={"layerNeurons" + i} value={formData.layerNeurons[i]}
            min={minHiddenLayerNeurons} max={maxHiddenLayerNeurons} onChange={onInputChange} />
          <br />
        </>)
    }

    return inputArray;
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Layers: </label>
          <input type="number" name="layers" value={formData.layers} min={minHiddenLayers}
            max={maxHiddenLayers} onChange={onInputChange} />
          {formData.layers > 0 && 
            <>
              <br /><br />
              <label>Hidden layer neurons:</label><br />
              {hiddenLayerNeurons()}
            </>
          }
        </fieldset>
        <fieldset>
          <label>Minibatches: </label>
          <input type="number" name="minibatchSize" value={formData.minibatchSize} min={minMinibatchSize}
            max={maxMinibatchSize} onChange={onInputChange} />
        </fieldset>
        <fieldset>
          <label>Epochs: </label>
          <input type="number" name="epochs" value={formData.epochs} min={minEpochs}
            max={maxEpochs} onChange={onInputChange} />
        </fieldset>
        <fieldset>
          <label>Learning rate: </label>
          <input type="number" step="0.1" name="learningRate" value={formData.learningRate} min={minLearningRate}
            max={maxLearningRate} onChange={onInputChange} />
        </fieldset>
        <button type="submit">Submit</button>
        <button onClick={() => setFormData(defaultValues)}>Reset</button>
      </form>
      <p>{formData.layers}</p>
      <p>{...formData.layerNeurons}</p>
    </>
  )
}

export default NetworkConfigForm;