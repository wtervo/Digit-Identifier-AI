import React from "react";
import { useGridContext } from "@src/context/GridContext";
import { NetworkCurrentStatus } from "@src/models/enums";
import { Responsive, WidthProvider } from "react-grid-layout";
import NetworkOperations from "./NetworkOperations";

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
      { i: "item1", x: 0, y: 0, w: 4, h: 1},
      { i: "item2", x: 0, y: 1, w: 3, h: 1},
      { i: "item3", x: 0, y: 2, w: 1, h: 1},
      { i: "item4", x: 1, y: 2, w: 1, h: 1},
      { i: "item5", x: 2, y: 2, w: 1, h: 1},
      { i: "item6", x: 0, y: 3, w: 1, h: 1},
      { i: "item7", x: 1, y: 3, w: 1, h: 1},
      { i: "item8", x: 0, y: 4, w: 1, h: 1},
      { i: "item9", x: 1, y: 4, w: 1, h: 1},
    ]
  }
};

/**
 * Displays basic properties of a network in a grid. Contains buttons for network operations.
 */
const NetworkInfoGrid = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const gridContext = useGridContext();
    const currentNetwork = gridContext.currentNetwork;

    return (
      <ResponsiveGridLayout useCSSTransforms={false} {...responsiveProps}>
        <NetworkOperations key="item1" />
        <p className="network-info-grid-item" key="item2">{"Name: Dummy Name"} &emsp; &emsp; {`ID: ${currentNetwork.id}`}</p>
        <p className="network-info-grid-item" key="item3">Layers: {currentNetwork.layers.join(" ")}</p>
        <p className="network-info-grid-item" key="item4">Epochs: {currentNetwork.epochs}</p>
        <p className="network-info-grid-item" key="item5">Minibatch Size: {currentNetwork.minibatchSize}</p>
        <p className="network-info-grid-item" key="item6">Learning Rate: {currentNetwork.learningRate}</p>
        <p className="network-info-grid-item" key="item7">Evaluate After Each Epoch: {currentNetwork.evaluateAfterEachEpoch.toString()}</p>
        <p className="network-info-grid-item" key="item8">Network Status: <b>{NetworkCurrentStatus[currentNetwork.status]}</b></p>
        <p className="network-info-grid-item" key="item9">Progress:
          <b> {currentNetwork.progress !== "" ? currentNetwork.progress : "Training not started"}</b>
        </p>
      </ResponsiveGridLayout>
    );
  }
);

export default NetworkInfoGrid;