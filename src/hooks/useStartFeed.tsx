import { positions } from "../atoms/myAtoms";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { GridReadyEvent } from "ag-grid-community";

// custom hook that get AG Grid api and set the gridOption

// function useStartFeed() first get api from atom (that state is probably updating very often)
// then get position from atom
// then set position to gridOption
// i want to avoid re-rendering of this hook
// only

export const useStartFeed = () => {
  console.log("useStartFeed");

  const pos = useGetPosition();

  const callback = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("rowData", pos);
  }, []);

  return callback; // return the callback
};
const useGetPosition = () => {
  console.log("useGetPosition");

  // Position[]
  const [pos] = useAtom(
    useMemo(
      // This is also fine
      () => atom((get) => get(positions)),
      []
    )
  );
  return pos;
};
