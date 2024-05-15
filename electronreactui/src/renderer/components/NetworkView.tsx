import { useGridContext } from "@src/context/GridContext";
import React from "react";
import NetworkInfoGrid from "./NetworkInfoGrid";
import Results from "./Results";
import { NetworkCurrentStatus } from "@src/models/enums";

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
        {(currentNetwork.evaluationResult !== undefined && currentNetwork.status === NetworkCurrentStatus.EvaluationDone) &&
          <Results />
        }
      </div>
    );
  }
);

export default NetworkView;