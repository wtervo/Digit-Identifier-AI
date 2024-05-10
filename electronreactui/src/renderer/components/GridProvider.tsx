import React, { useEffect, useState } from "react";
import { GridContext } from "@src/context/GridContext";
import GridContextData from "@src/models/GridContextData";
import { dummyNetwork } from "@src/constants/network";
import { getNetworkStatusAll } from "@src/services/networkService";
import Network from "@src/models/Network";

interface Props {
  children: React.ReactNode
};

const GridProvider: React.FC<Props> = ({children}) => {  
  const [currentNetwork, setCurrentNetwork] = useState(dummyNetwork);
  const [loadedNetworks, setLoadedNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Failsafe sync in case frontend crashes, reloads, etc. and backend still has networks in memory
  const getNetworks = async () => {
    const networks: Array<Network> = await getNetworkStatusAll();
    if (networks) {
      setCurrentNetwork(networks[0]);
      setLoadedNetworks(networks);
    };
  };

  useEffect(() => {
    getNetworks();
  }, []);

  const contextValue: GridContextData = {
    currentNetwork,
    loadedNetworks,
    setCurrentNetwork,
    setLoadedNetworks,
    isLoading,
    setIsLoading
  };

  return (
    <GridContext.Provider value={contextValue}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;