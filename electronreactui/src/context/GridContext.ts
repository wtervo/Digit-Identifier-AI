// This context is probably overkill, but I don't like prop drilling and I need some
// practice with context anyway, so what the hell

import { createContext, useContext } from "react";
import GridContextData from "@src/models/GridContextData";

export const GridContext = createContext<GridContextData | undefined>(undefined);

export const useGridContext = () => {
  const gridData = useContext(GridContext);

  if (gridData === undefined) {
    throw new Error("Trying to access context outside provider's scope");
  }

  return gridData;
}