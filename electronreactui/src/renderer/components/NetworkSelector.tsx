// Based on: https://codesandbox.io/p/sandbox/react-dropdown-w-typescript-example-jt4dh?file=%2Fsrc%2Fcomponents%2FDropDown.tsx%3A44%2C15

import { useGridContext } from "@src/context/GridContext";
import React, { useState } from "react";
import Dropdown from "./Dropdown";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  key: string
}

const NetworkSelector = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ style, className, children, key, ...restOfProps }, ref) => {
    const gridContext = useGridContext();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
      if (event.currentTarget === event.target) {
        setShowDropdown(false);
      }
    };

    const networkSelection = (networkId: string): void => {
      const networkFullData = gridContext.loadedNetworks.find(network => network.id === networkId);
      gridContext.setCurrentNetwork(networkFullData);
    };

    return (
      <div
        style={{ ...style }}
        // className={["classes you wish to apply", className].join(' ')}
        key={key}
        {...restOfProps}
        ref={ref}
      >
        {gridContext.currentNetwork.id !== "" ? 
          <div>
            <div>Current network: </div>
            <button onClick={(): void => toggleDropdown()}
              onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                dismissHandler(e)
              }
            >
              <div>{gridContext.currentNetwork.id}</div>
              {showDropdown && (
                <Dropdown
                  showDropDown={false}
                  networkSelection={networkSelection}
                />
              )}
            </button>
          </div>
          :
          <p>Create a network</p>
        }
      </div>
    );
  }
);

export default NetworkSelector;