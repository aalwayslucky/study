import { exchangeAtom } from "@/components/exchange/exchange";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { apiAtom } from "@/atoms/myAtoms";
import { CalculatedData, NimbusTable } from "@/types";
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
    const newData: NimbusTable[] = calculateDataWithTickers();
    if (exchange?.store.tickers) {
      let updateRecords = newData.map((data) => {
        return {
          ...data,
          sumamount: parseFloat(data.sumamount.toFixed(0)) ?? 0,
          loss: parseFloat(data.loss.toFixed(0)) ?? 0,
          profit: parseFloat(data.profit.toFixed(0)) ?? 0,
          tpPctOfPos: parseFloat(data.tpPctOfPos.toFixed(0)) ?? 0,
          firstBid: data.firstBid ?? 0,
          lastBid: data.lastBid ?? 0,
          firstTP: data.firstTP ?? 0,
          lastTP: data.lastTP ?? 0,
        };
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

const calculateDataWithTickers = () => {
  const newCalcdata: NimbusTable[] = [];

  calcdata.forEach((pos) => {
    let symbolStartsWith1000 = false;
    let circsupply = 0;
    let funding = 0;
    const data = {
      firstBid: 0,
      lastBid: 0,
      return24h: 0,
      lastPrice: 0,
      distancePercentage: null,
      distanceslPercentage: 0,
      lastdistancePercentage: null,
      totalrisk: 0,
      riskbids: 0,
      tppercentagepos: 0,
    };

    data.lastBid = pos.lastBid;
    const ticker = tickers.find((ticker) => ticker.symbol === pos.symbol);

    if (ticker) {
      data.lastPrice = ticker.last;

      if (pos.firstBid !== 0) {
        data.distancePercentage = (pos.firstBid / ticker.last - 1) * 100;
      }

      if (pos.lastBid !== 0) {
        data.lastdistancePercentage = (pos.lastBid / ticker.last - 1) * 100;
      }
      if (pos.sl !== null) {
        data.distanceslPercentage = (pos.sl / data.lastPrice - 1) * 100;
      }
    }

    if (ticker) {
      data.lastPrice = ticker.last;

      symbolStartsWith1000 = pos.symbol.startsWith("1000");

      circsupply =
        (symbolInfo[pos.symbol as keyof typeof symbolInfo]?.["circ-supply"] *
          data.lastPrice) /
          (symbolStartsWith1000 ? 1000 : 1) || 0;
      circsupply = circsupply / 1000000000;
      funding = ticker.fundingRate * 100;
      data.return24h = ticker.percentage;
    }

    newCalcdata.push({
      symbol: pos.symbol,
      sl: parseFloat(data.distanceslPercentage.toFixed(0)),
      firstBid:
        data.distancePercentage !== null
          ? parseFloat(data.distancePercentage.toFixed(1))
          : null,
      lastBid:
        data.lastdistancePercentage !== null
          ? parseFloat(data.lastdistancePercentage.toFixed(1))
          : null,
      circsupply: parseFloat(circsupply.toFixed(2)),
      returnc: parseFloat(data.return24h.toFixed(1)),
      funding: parseFloat(funding.toFixed(4)),
    });
  });

  return newCalcdata;
};
