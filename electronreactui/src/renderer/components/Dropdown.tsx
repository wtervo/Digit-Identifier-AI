// Based on: https://codesandbox.io/p/sandbox/react-dropdown-w-typescript-example-jt4dh?file=%2Fsrc%2Fcomponents%2FDropDown.tsx%3A44%2C15

import { useGridContext } from '@src/context/GridContext';
import Network from '@src/models/Network';
import React, { useEffect, useState } from 'react';

type DropDownProps = {
  showDropDown: boolean;
  networkSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({ networkSelection }: DropDownProps): JSX.Element => {
  const gridContext = useGridContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const onClickHandler = (networkId: string): void => {
    networkSelection(networkId);
  };

  useEffect(() => {
    setShowDropdown(showDropdown);
  }, [showDropdown]);

  return (
    <div className="dropdown">
      {gridContext.loadedNetworks.map(
        (network: Network, index: number): JSX.Element => {
          return (
            <p key={index} onClick={(): void => { onClickHandler(network.id);}} >
              {network.id}
            </p>
          );
        }
      )}
    </div>
  );
};

export default DropDown;