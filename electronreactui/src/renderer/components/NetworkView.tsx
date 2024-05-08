import { dummyNetwork } from "@src/constants/network";
import { useGridContext } from "@src/context/GridContext";
import { deleteRemoveNetwork } from "@src/services/networkService";
import React from "react";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
}

const NetworkView = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const gridContext = useGridContext();

    const trainingOnClick = () => {
      console.log("testing");
    };

    const removeNetwork = () => {
      deleteRemoveNetwork(gridContext.currentNetwork.id).then(data => {
        console.log(data);
      });
      const remainingNetworks = gridContext.loadedNetworks.filter(network => network !== gridContext.currentNetwork);
      if (remainingNetworks.length === 0) {
        gridContext.setCurrentNetwork(dummyNetwork);
        gridContext.setLoadedNetworks([]);
      } else {
        gridContext.setCurrentNetwork(remainingNetworks[0]);
      }
    };

    return (
      <div
        style={{ ...style }}
        // className={["classes you wish to apply", className].join(' ')}
        key={key}
        {...restOfProps}
        ref={ref}
      >
        <button onClick={trainingOnClick}>Start training</button>
        <p>{gridContext.currentNetwork.id}</p><br />
        <p>{gridContext.currentNetwork.layers.length}</p><br />
        <p>{gridContext.currentNetwork.learningRate}</p><br />
        <button onClick={removeNetwork}>Delete</button>
      </div>
    );
  }
);

export default NetworkView;