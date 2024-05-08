import React, { useState } from "react";
import { GridContext } from "@src/context/GridContext";
import GridContextData from "@src/models/GridContextData";
import { dummyNetwork } from "@src/constants/network";

interface Props {
  children: React.ReactNode
}

const GridProvider: React.FC<Props> = ({children}) => {  
  const [currentNetwork, setCurrentNetwork] = useState(dummyNetwork);
  const [loadedNetworks, setLoadedNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const contextValue: GridContextData = {
    currentNetwork,
    loadedNetworks,
    setCurrentNetwork,
    setLoadedNetworks,
    isLoading,
    setIsLoading
  }
  console.log(currentNetwork);
  console.log(loadedNetworks);
  return (
    <GridContext.Provider value={contextValue}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;