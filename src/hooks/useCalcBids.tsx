import { useEffect, useRef, useState } from "react";

export function useCalculateDataWithOrders(orders, positions) {
  const [newCalcdata, setNewCalcdata] = useState([]);
  const prevOrdersRef = useRef();

  useEffect(() => {
    const calculateDataWithOrders = () => {
      if (JSON.stringify(prevOrdersRef.current) === JSON.stringify(orders)) {
        console.log("same orders");
        console.log(JSON.stringify(prevOrdersRef.current));
        console.log(JSON.stringify(orders));
        return;
      }
      console.log("new orders");
      const tempData = [];
      positions.forEach((pos) => {
        const slPrice =
          orders.find(
            (order) =>
              order.symbol === pos.symbol &&
              order.type === "stop_market" &&
              order.reduceOnly
          )?.price || null;

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

        const buyOrders = orders.filter(
          (order) =>
            order.symbol === pos.symbol &&
            order.type === "limit" &&
            order.side === "buy"
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

        const tplong = orders
          .filter(
            (order) =>
              order.symbol === pos.symbol &&
              order.side === "sell" &&
              order.type === "limit" &&
              order.reduceOnly
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

        if (pos.contracts > 0) {
          data.tppercentagepos = (totalTPLongPosition / pos.contracts) * 100;
        }

        const profit =
          totalTPLongPositionNotional - totalTPLongPosition * pos.entryPrice;

        const buyOrders2 = orders
          .filter(
            (order) =>
              order.symbol === pos.symbol &&
              order.type === "limit" &&
              order.side === "buy"
          )
          .sort((a, b) => b.price - a.price);

        data.risk =
          (slPrice || 0) * pos.contracts - pos.contracts * pos.entryPrice;
        data.riskbids = data.sumAmount * (slPrice || 0) - data.sumNotional;
        data.totalrisk = data.risk + data.riskbids;
        if (buyOrders2.length > 0) {
          (data.firstBid = buyOrders2[0].price),
            (data.lastBid = buyOrders2[buyOrders2.length - 1].price);
        }

        tempData.push({
          symbol: pos.symbol,
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
      });
      console.log("tempData");
      console.log(tempData);
      return tempData;
    };

    setNewCalcdata(calculateDataWithOrders());
  }, [orders]);

  return newCalcdata;
}
