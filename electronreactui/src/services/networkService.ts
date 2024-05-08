const axios = require("axios").default
import NetworkParameters from "@src/models/NetworkParameters";
import { apiRoot } from "@src/constants/ui";

export const postInitializeNetwork = async (netWorkParameters: NetworkParameters) => {
  const response = await axios.post(apiRoot + "InitializeNetwork", netWorkParameters);
  
  return response.data;
};

export const postTrainNetwork = async (networkID: string) => {
  const response = await axios.post(apiRoot + "TrainNetwork", { networkID });
  
  if (response.statusCode === 202) return response.data;
  else throw new Error("Something went wrong while attempting to initialize network training.");
};

export const postEvaluateNetwork = async (networkID: string) => {
  const response = await axios.post(apiRoot + "EvaluateNetwork", { networkID });
  
  return response.data;
};

export const getNetworkCurrentStatus = async (networkID: string) => {
  const response = await axios.get(apiRoot + "NetworkCurrentStatus", { params: { networkID } });

  return response.data;
};

export const deleteRemoveNetwork = async (networkID: string) => {
  const response = await axios.delete(apiRoot + "RemoveNetwork", { networkID });

  return response.data;
}