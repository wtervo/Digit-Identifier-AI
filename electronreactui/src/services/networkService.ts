const axios = require("axios").default
import NetworkParameters from "@src/models/NetworkParameters";
import { apiRoot } from "@src/constants/ui";

export const postInitializeNetwork = async (netWorkParameters: NetworkParameters) => {
  const response = await axios.post(apiRoot + "Initialize", netWorkParameters);
  
  return response.data;
};

export const postTrainNetwork = async (networkID: string) => {
  const response = await axios.post(apiRoot + "Train", { NetworkID: networkID });

  if (response.status !== 202) throw new Error("Something went wrong while attempting to initialize network training.");
};

export const postEvaluateNetwork = async (networkID: string) => {
  const response = await axios.post(apiRoot + "Evaluate", { NetworkID: networkID });
  
  return response.data;
};

export const getNetworkCurrentStatus = async (networkID: string) => {
  const response = await axios.get(apiRoot + "CurrentStatus", { params: { networkID } });

  return response.data;
};

export const getNetworkStatusAll = async () => {
  const response = await axios.get(apiRoot + "All");
  console.log(response);
  // 503 raised only when stop operation is not yet ready. Reattempt fetch once more.
  if (response.status === 503) {
    const response = await axios.get(apiRoot + "All");
    return response.data;
  } else {
    return response.data;
  }
};

export const postStopNetwork = async (networkID: string) => {
  await axios.post(apiRoot + "Stop", { NetworkID: networkID } );
};

export const postRemoveNetwork = async (networkID: string) => {
  await axios.post(apiRoot + "Remove", { NetworkID: networkID } );
};