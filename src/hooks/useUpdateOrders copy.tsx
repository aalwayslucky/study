import { ordersAtom } from "@/atoms/myAtoms";
import { useAtom, useAtomValue } from "jotai";
import { apiAtom } from "@/atoms/myAtoms";
import { NimbusTable } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Order } from "safe-cex/dist/types";
import { GridApi } from "ag-grid-community";
import { set } from "lodash";
import { ordersLenghtAtom } from "@/atoms/myAtoms";

// hook that will update the orders in AgGridReact based on the ordersAtom state
export const useUpdateOrders = () => {
  console.log("useUpdateOrders");

  const orders = useAtomValue(ordersAtom);
  const api = useAtomValue(apiAtom);
  const ordersLenght = useAtomValue(ordersLenghtAtom);
  const onOrdersUpdate = () => {
    if (!api) {
      return;
    }
    const updateRecords: NimbusTable[] = [];

    const newData = calculateDataWithOrders(orders, api);

    api.forEachNode((node) => {
      if (node.data) {
        const position = node.data;
        let symbol = position.symbol;
        updateRecords.push({
          ...position,
          sumbid: newData.find((pos) => pos.symbol === symbol)?.sumbid ?? 0,
        });
      }
    });
    const response = api.applyTransactionAsync({
      update: updateRecords,
    });
    console.log("response", response);
  };
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    console.log("useEffect");
    onOrdersUpdate();
    setIsUpdating(true);
    return () => {
      console.log("useEffect return");
      setIsUpdating(false);
    };
  }, [ordersLenght, api]);

  return isUpdating;
};

const calculateDataWithOrders = (
  orders: Order[],
  api: GridApi<NimbusTable> | null
) => {
  console.log("new orders");
  const startTime = performance.now();

  let tempData: NimbusTable[] = [];

  // Create a map of orders by symbol
  const ordersBySymbol = orders.reduce((acc, order) => {
    if (!acc[order.symbol]) {
      acc[order.symbol] = [];
    }
    acc[order.symbol].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  api?.forEachNode((pos) => {
    if (pos.data) {
      const positionNodeData = pos.data;
      const ordersForSymbol = ordersBySymbol[positionNodeData.symbol] || [];

      const slPrice =
        ordersForSymbol.find(
          (order) => order.type === "stop_market" && order.reduceOnly
        )?.price || 0;

      const data = {
        risk: 0,
        firstBid: 0,
        lastBid: 0,
        return24h: 0,
        lastPrice: 0,
        distancePercentage: 0,
        distanceslPercentage: 0,
        lastdistancePercentage: 0,
        sumNotional: 0,
        sumAmount: 0,
        totalrisk: 0,
        riskbids: 0,
        tppercentagepos: 0,
        firstTP: 0,
        lastTP: 0,
      };

      const buyOrders = ordersForSymbol.filter(
        (order) => order.type === "limit" && order.side === "buy"
      );

      const result = buyOrders.reduce(
        (accumulator, order) => {
          accumulator.sumNotional += order.price * order.amount;
          accumulator.sumAmount += order.amount;
          return accumulator;
        },
        { sumNotional: 0, sumAmount: 0 }
      );

      data.sumNotional = result.sumNotional;
      data.sumAmount = result.sumAmount;

      const tplong = ordersForSymbol
        .filter(
          (order) =>
            order.side === "sell" && order.type === "limit" && order.reduceOnly
        )
        .sort((a, b) => b.price - a.price);

      if (tplong.length > 0) {
        (data.firstTP = tplong[0].price),
          (data.lastTP = tplong[tplong.length - 1].price);
      }

      const totalTPLongPosition = tplong.reduce(
        (total, order) => total + order.amount,
        0
      );
      const totalTPLongPositionNotional = tplong.reduce(
        (total, order) => total + order.amount * order.price,
        0
      );

      if (pos.data.contracts > 0) {
        data.tppercentagepos =
          (totalTPLongPosition / positionNodeData.contracts) * 100;
      }

      const profit =
        totalTPLongPositionNotional -
        totalTPLongPosition * positionNodeData.entryPrice;

      const buyOrders2 = buyOrders.sort((a, b) => b.price - a.price);

      data.risk =
        (slPrice || 0) * positionNodeData.contracts -
        positionNodeData.contracts * positionNodeData.entryPrice;
      data.riskbids = data.sumAmount * (slPrice || 0) - data.sumNotional;
      data.totalrisk = data.risk + data.riskbids;
      if (buyOrders2.length > 0) {
        (data.firstBid = buyOrders2[0].price),
          (data.lastBid = buyOrders2[buyOrders2.length - 1].price);
      }

      tempData.push({
        ...positionNodeData,
        symbol: positionNodeData.symbol,
        sl: slPrice,
        sumbid: parseFloat(data.sumNotional.toFixed(0)),
        sumamount: parseFloat(data.sumAmount.toFixed(0)),
        loss: parseFloat(data.totalrisk.toFixed(0)),
        profit: parseFloat(profit.toFixed(0)),
        tpPctOfPos: parseFloat(data.tppercentagepos.toFixed(0)),
        firstBid: data.firstBid,
        lastBid: data.lastBid,
        firstTP: data.firstTP,
        lastTP: data.lastTP,
      });
    }
  });
  console.log("tempData");
  console.log(tempData);
  const endTime = performance.now();
  console.log(`Execution time: ${endTime - startTime} milliseconds`);

  return tempData;
};
