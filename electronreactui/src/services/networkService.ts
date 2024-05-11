const axios = require("axios").default;
import NetworkCreation from "@src/models/NetworkCreation";
import { apiRoot } from "@src/constants/ui";

export const postInitializeNetwork = async (netWorkParameters: NetworkCreation) => {
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

  return response.data; 
};

export const postStopNetwork = async (networkID: string) => {
  await axios.post(apiRoot + "Stop", { NetworkID: networkID } );
};

export const postRemoveNetwork = async (networkID: string) => {
  await axios.post(apiRoot + "Remove", { NetworkID: networkID } );
};