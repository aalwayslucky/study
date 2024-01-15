import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { positions } from "../atoms/myAtoms";
import { GridApi } from "ag-grid-community";
import { NimbusTable } from "@/types";
import { Position } from "safe-cex/dist/types";

export function useUpdatePositions(api: GridApi) {
  const pos = useAtomValue(positions);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updateRecords: NimbusTable[] = [];
      api.forEachNode((node) => {
        const position = node.data;
        const symbol = position.symbol;
        const newPosition = pos.find((p: Position) => p.symbol === symbol);

        if (newPosition) {
          updateRecords.push({
            ...position,
            side: newPosition.side,
            entryPrice: newPosition.entryPrice,
            notional: Number(newPosition.notional.toFixed(0)),
            leverage: newPosition.leverage,
            unrealizedPnl: Number(newPosition.unrealizedPnl.toFixed(0)),
            contracts: newPosition.contracts,
            liquidationPrice: newPosition.liquidationPrice,
          });
        }
      });

      api.applyTransactionAsync({ update: updateRecords });
    }, 500);

    // Clean up the interval when the component unmounts or when api or positions changes
    return () => clearInterval(intervalId);
  }, [api]);
}
