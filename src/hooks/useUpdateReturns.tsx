import { exchangeAtom } from "@/components/exchange/exchange";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { apiAtom } from "@/atoms/myAtoms";
import { NimbusTable, YWDReturns } from "@/types";
import { useEffect, useState } from "react";
import { Position, Ticker } from "safe-cex/dist/types";
import { GridApi } from "ag-grid-community";

// hook that will update the orders in AgGridReact based on the ordersAtom state
export const useUpdateReturns = () => {
  // console.log("useUpdatePositions");
  const [exchange, setExchange] = useAtom(exchangeAtom);
  const api = useAtomValue(apiAtom);
  const onPositionUpdate = (api: GridApi<NimbusTable>) => {
    // console.log("onOrdersUpdate");
    // console.log("api", api);
    if (!api) {
      return;
    }

    if (exchange?.store.tickers) {
      const tickers = exchange.store.tickers;
      const updateRecords: NimbusTable[] = [];
      const data = calculateReturns(tickers);
      if (!data) return;
      api.forEachNode((node) => {
        if (node.data) {
          const position = node.data;
          let symbol = position.symbol;
          const newPosition = data.find(
            (p: NimbusTable) => p.symbol === symbol
          );
          if (!newPosition) {
            return;
          }

          updateRecords.push({
            ...position,

            dReturn: newPosition.dReturn,
            wReturn: newPosition.wReturn,
            yReturn: newPosition.yReturn,
          });
        }
      });

      const response = api.applyTransactionAsync({
        update: updateRecords,
      });
      // console.log("response", response);
    }
  };
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // console.log("useEffect positions");
    const interval = setInterval(() => {
      // console.log("setInterval");
      if (!api) {
        console.log("ERROR: api is undefined, not calling onPositionUpdate");
        return;
      }
      onPositionUpdate(api);
      setIsUpdating(true);
    }, 1000);

    return () => {
      console.log("ERROR: useEffect return - not updating positions");
      clearInterval(interval);
      setIsUpdating(false);
    };
  }, [api]);
  return isUpdating;
};

const calculateReturns = (tickers: Ticker[]) => {
  const newCalcdata: NimbusTable[] = [];
  const storedData: NimbusTable[] | null = JSON.parse(
    localStorage.getItem("priceData") || "null"
  );

  if (!storedData) {
    console.log(
      "storedData is not found in localStorage - not updating returns"
    );
    return;
  }

  storedData.forEach((item) => {
    const ticker = tickers.find((t) => t.symbol === item.symbol);
    if (!ticker) return; // if ticker not found, skip to the next item

    const dReturn = Number(
      (((ticker.last - item.dPrice) / item.dPrice) * 100).toFixed(1)
    );
    const wReturn = Number(
      (((ticker.last - item.wPrice) / item.wPrice) * 100).toFixed(1)
    );
    const yReturn = Number(
      (((ticker.last - item.yPrice) / item.yPrice) * 100).toFixed(1)
    );

    newCalcdata.push({
      ...item,
      symbol: item.symbol,
      dReturn,
      wReturn,
      yReturn,
    });
  });
  return newCalcdata;
};
