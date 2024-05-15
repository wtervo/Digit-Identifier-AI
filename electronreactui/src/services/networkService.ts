const axios = require("axios").default;
import NetworkCreation from "@src/models/NetworkCreation";
import { API_ROOT } from "@src/constants/ui";

export const postInitializeNetwork = async (netWorkParameters: NetworkCreation) => {
  const response = await axios.post(API_ROOT + "Initialize", netWorkParameters);
  
  return response.data;
};

export const postTrainNetwork = async (networkID: string) => {
  const response = await axios.post(API_ROOT + "Train", { NetworkID: networkID });

  if (response.status !== 202) throw new Error("Something went wrong while attempting to initialize network training.");
};

export const postEvaluateNetwork = async (networkID: string) => {
  await axios.post(API_ROOT + "Evaluate", { NetworkID: networkID });
};

export const getNetworkCurrentStatus = async (networkID: string) => {
  const response = await axios.get(API_ROOT + "CurrentStatus", { params: { networkID } });

  return response.data;
};

export const getNetworkStatusAll = async () => {
  const response = await axios.get(API_ROOT + "All");

  return response.data; 
};

export const postStopNetwork = async (networkID: string) => {
  await axios.post(API_ROOT + "Stop", { NetworkID: networkID } );
};

export const postRemoveNetwork = async (networkID: string) => {
  await axios.post(API_ROOT + "Remove", { NetworkID: networkID } );
};