import { exchangeAtom } from "@/components/exchange/exchange";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { apiAtom } from "@/atoms/myAtoms";
import { CalculatedData, NimbusTable } from "@/types";
import { useEffect, useState } from "react";
import { Position, Ticker } from "safe-cex/dist/types";
import { GridApi } from "ag-grid-community";
import symbolInfo from "./symbolData.json";

// hook that will update the orders in AgGridReact based on the ordersAtom state
export const useUpdateOrdersCalc = () => {
  console.log("useUpdatePositions");
  const [exchange, setExchange] = useAtom(exchangeAtom);
  const api = useAtomValue(apiAtom);
  const onPositionUpdate = (api: GridApi<NimbusTable>) => {
    console.log("onOrdersUpdate");
    console.log("api", api);
    if (!api) {
      return;
    }

    if (exchange?.store.tickers) {
      const updateRecords: NimbusTable[] = [];
      const tickers = exchange.store.tickers;
      const newData: NimbusTable[] = calculateDataWithTickers(tickers, api);
      api.forEachNode((node) => {
        if (node.data) {
          const position = node.data;
          let symbol = position.symbol;
          const newPosition = exchange.store.tickers.find(
            (p: Ticker) => p.symbol === symbol
          );
          if (!newPosition) {
            return;
          }

          updateRecords.push({
            ...position,
            firstBidpct:
              newData.find((d) => d.symbol === position.symbol)?.firstBidpct ||
              0,
            lastBidpct:
              newData.find((d) => d.symbol === position.symbol)?.lastBidpct ||
              0,
            circsupply:
              newData.find((d) => d.symbol === position.symbol)?.circsupply ||
              0,
            returnc:
              newData.find((d) => d.symbol === position.symbol)?.returnc || 0,
            funding:
              newData.find((d) => d.symbol === position.symbol)?.funding || 0,
          });
        }
      });
      console.log("updateRecords", updateRecords);
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
    }, 5000);

    return () => {
      console.log("useEffect return");
      clearInterval(interval);
      setIsUpdating(false);
    };
  }, [api]);
  return isUpdating;
};

const calculateDataWithTickers = (
  tickers: Ticker[],
  api: GridApi<NimbusTable>
) => {
  const newCalcdata: NimbusTable[] = [];

  api.forEachNode((pos) => {
    let symbolStartsWith1000 = false;
    let circsupply = 0;
    let funding = 0;
    const data = {
      firstBid: 0,
      lastBid: 0,
      return24h: 0,
      lastPrice: 0,
      firstBidpct: 0,
      distanceslPercentage: 0,
      lastBidpct: 0,
      totalrisk: 0,
      riskbids: 0,
      tppercentagepos: 0,
    };

    console.log("pos", pos);
    console.log("pos.data", pos.data);
    if (pos.data && pos) {
      data.lastBid = pos.data.lastBid;
      const ticker = tickers.find(
        (ticker) => ticker.symbol === pos.data?.symbol
      );
      console.log("ticker", ticker);
      if (ticker) {
        data.lastPrice = ticker.last;

        if (pos.data?.firstBid !== 0) {
          data.firstBidpct = (pos.data?.firstBid / ticker.last - 1) * 100;
        }

        if (pos.data?.lastBid !== 0) {
          data.lastBidpct = (pos.data?.lastBid / ticker.last - 1) * 100;
        }
        console.log("pos.data?.sl", pos.data?.lastBid);
        if (pos.data?.sl !== null) {
          data.distanceslPercentage = (pos.data?.sl / data.lastPrice - 1) * 100;
        }
      }

      if (ticker) {
        data.lastPrice = ticker.last;

        symbolStartsWith1000 = pos.data?.symbol.startsWith("1000");

        circsupply =
          (symbolInfo[pos.data?.symbol as keyof typeof symbolInfo]?.[
            "circ-supply"
          ] *
            data.lastPrice) /
            (symbolStartsWith1000 ? 1000 : 1) || 0;
        circsupply = circsupply / 1000000000;
        funding = ticker.fundingRate * 100;
        data.return24h = ticker.percentage;
      }

      newCalcdata.push({
        ...pos.data,
        symbol: pos.data?.symbol,
        slpct: parseFloat(data.distanceslPercentage.toFixed(0)),
        firstBidpct: data.firstBidpct !== null ? data.firstBidpct : 0,
        lastBidpct: data.lastBidpct !== null ? data.lastBidpct : 0,
        circsupply: parseFloat(circsupply.toFixed(2)),
        returnc: parseFloat(data.return24h.toFixed(1)),
        funding: parseFloat(funding.toFixed(4)),
      });
    }
  });

  return newCalcdata;
};
