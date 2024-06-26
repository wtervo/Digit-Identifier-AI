import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import NetworkConfigForm from "./NetworkConfigForm";
import NetworkSelector from "./NetworkSelector";
import NetworkInfoGrid from "./NetworkInfoGrid";
import { useGridContext } from "@src/context/GridContext";
import Results from "./Results";
import { NetworkCurrentStatus } from "@src/models/enums";

const ResponsiveGridLayout = WidthProvider(Responsive);

const responsiveProps = {
  className: "responsive-grid",
  breakpoints: { lg: 1200, md: 960, sm: 720, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 8, sm: 8, xs: 4, xxs: 4 },
  isDraggable: false,
  isResizable: false,
  layouts: {
    lg: [
      { i: "item1", x: 0, y: 0, w: 9, h: 1},
      { i: "item2", x: 0, y: 1, w: 9, h: 1},
      { i: "item3", x: 12, y: 0, w: 3, h: 4}
    ],
    md: [
      { i: "item1", x: 0, y: 0, w: 6, h: 1},
      { i: "item2", x: 0, y: 1, w: 6, h: 1},
      { i: "item3", x: 12, y: 0, w: 2, h: 4}
    ],
    xs: [
      { i: "item1", x: 0, y: 0, w: 3, h: 1},
      { i: "item2", x: 0, y: 1, w: 3, h: 1},
      { i: "item3", x: 12, y: 0, w: 1, h: 4}
    ],
  }
};

/**
 * Grid for ordering and displaying everything network related. The parent component
 * for all components involving networks, i.e. most of the program.
 */
const Grid = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const gridContext = useGridContext();
  const currentNetwork = gridContext.currentNetwork;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return(
    <ResponsiveGridLayout useCSSTransforms={false} {...responsiveProps}>
      <NetworkSelector key="item1" />
      <NetworkConfigForm key="item3" />
      {currentNetwork.id !== "" &&
        <NetworkInfoGrid key="item2" />
      }
      {(currentNetwork.evaluationResult !== undefined && currentNetwork.status === NetworkCurrentStatus.EvaluationDone) &&
        <Results />
      }
    </ResponsiveGridLayout>
  );
};

export default Grid;