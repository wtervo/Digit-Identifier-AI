import { useGridContext } from "@src/context/GridContext";
import React from "react";

const Results = () => {
  const gridContext = useGridContext();
  const currentNetworkEval = gridContext.currentNetwork.evaluation;

  return(
    <div>
      <p>Network's performance: {currentNetworkEval.correctResults}/{currentNetworkEval.actualResults.length}</p>
    </div>
  );
};

export default Results;