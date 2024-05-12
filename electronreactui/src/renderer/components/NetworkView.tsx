import { useGridContext } from "@src/context/GridContext";
import React from "react";
import NetworkInfoGrid from "./NetworkInfoGrid";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
};

/**
 * Parent component for everything that displays network's data
 */
const NetworkView = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const gridContext = useGridContext();
    const currentNetwork = gridContext.currentNetwork;
    
    return (
      <div
        style={{ ...style }}
        // className={["classes you wish to apply", className].join(' ')}
        key={key}
        {...restOfProps}
        ref={ref}
      >
        {currentNetwork.id !== "" &&
          <NetworkInfoGrid key={key} />
        }
      </div>
    );
  }
);

export default NetworkView;