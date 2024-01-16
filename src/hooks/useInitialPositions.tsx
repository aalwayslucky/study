import { useAtomValue } from "jotai";
import { Position } from "safe-cex/dist/types";
import { exchangeAtom } from "@/components/exchange/exchange";
import { NimbusTable } from "@/types";

export const useInitialPositions = () => {
  console.log("useInitialPositions");
  const exchange = useAtomValue(exchangeAtom);
  const positions = exchange?.store.positions;

  const newpositions: NimbusTable[] =
    positions?.map((position: Position) => ({
      ...position,
      unrealizedPnl: 0,
      sl: 0,
      sumbid: 0,
      sumamount: 0,
      loss: 0,
      profit: 0,
      tpPctOfPos: 0,
      firstBid: 0,
      lastBid: 0,
      circsupply: 0,
      liq: 0,
      returnc: 0,
      funding: 0,
      yReturn: 0,
      wReturn: 0,
      dReturn: 0,
      unrealizedPnlPct: 0,
      firstTP: 0,
      lastTP: 0,
      firstBidpct: 0,
      lastBidpct: 0,
      slpct: 0, // added
      dPrice: 0, // added
      wPrice: 0, // added
      yPrice: 0, // added
    })) || [];

  return newpositions;
};
