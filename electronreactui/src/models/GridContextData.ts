import Network from "./Network";

/**
 * Context data about the state of currently chosen network, all loaded networks
 * and the status of running operation(s)
 */
export default interface GridContextData {
    currentNetwork: Network,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Network>>,
    loadedNetworks: Array<Network>,
    setLoadedNetworks: React.Dispatch<React.SetStateAction<Array<Network>>>
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}