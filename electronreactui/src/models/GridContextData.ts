import Network from "./Network";

export default interface GridContextData {
    currentNetwork: Network,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Network>>,
    loadedNetworks: Array<Network>,
    setLoadedNetworks: React.Dispatch<React.SetStateAction<Array<Network>>>
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
};