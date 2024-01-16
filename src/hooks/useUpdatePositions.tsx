import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { positions } from "../atoms/myAtoms";
import { GridApi } from "ag-grid-community";
import { NimbusTable } from "@/types";
import { Position } from "safe-cex/dist/types";
import { apiAtom } from "../atoms/myAtoms";
export function useUpdatePositions() {
  const pos = useAtomValue(positions);
  const api = useAtomValue(apiAtom);

  if (!api) {
    return;
  }
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
}
