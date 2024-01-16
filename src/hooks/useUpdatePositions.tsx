import { exchangeAtom } from "@/components/exchange/exchange";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { apiAtom } from "@/atoms/myAtoms";
import { NimbusTable } from "@/types";
import { useEffect, useState } from "react";
import { Position } from "safe-cex/dist/types";
import { GridApi } from "ag-grid-community";

// hook that will update the orders in AgGridReact based on the ordersAtom state
export const useUpdatePositions = () => {
  console.log("useUpdatePositions");
  const [exchange, setExchange] = useAtom(exchangeAtom);
  const api = useAtomValue(apiAtom);
  const onPositionUpdate = (api: GridApi<NimbusTable>) => {
    console.log("onOrdersUpdate");
    console.log("api", api);
    if (!api) {
      return;
    }

    if (exchange?.store.positions) {
      const updateRecords: NimbusTable[] = [];

      api.forEachNode((node) => {
        if (node.data) {
          const position = node.data;
          let symbol = position.symbol;
          const newPosition = exchange.store.positions.find(
            (p: Position) => p.symbol === symbol
          );
          if (!newPosition) {
            return;
          }

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

      const response = api.applyTransactionAsync({
        update: updateRecords,
      });
      console.log("response", response);
    }
  };
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    console.log("useEffect positions");
    const interval = setInterval(() => {
      console.log("setInterval");
      if (!api) {
        console.log("api is undefined, not calling onPositionUpdate");
        return;
      }
      onPositionUpdate(api);
      setIsUpdating(true);
    }, 1000);

    return () => {
      console.log("useEffect return");
      clearInterval(interval);
      setIsUpdating(false);
    };
  }, [api]);
  return isUpdating;
};
