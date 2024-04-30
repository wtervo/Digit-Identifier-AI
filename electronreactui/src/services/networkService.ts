const axios = require("axios").default
import NetworkParameters from "@src/models/NetworkParameters";
import { apiRoot } from "@src/constants/api";

export const postInitializeNetwork = async (netWorkParameters: NetworkParameters) => {
  const response = await axios.post(apiRoot + "InitializeNetwork", netWorkParameters);
  console.log(response);
}

export const postTrainNetwork = async () => {
  const dummy = "dummy" // TODO: Tähän myöhemmin tilalle joku networkin GUID tms tunniste
  const response = await axios.post(apiRoot + "TrainNetwork", dummy);
  
  if (response.statusCode === 202) return response.data;
  else return "voe saakeli";
}

export const getNetworkCurrentStatus = async () => {
  const response = await axios.get(apiRoot + "NetworkCurrentStatus");

  return response.data;
}