import { PositionSide } from "safe-cex/dist/types";

export interface NimbusTable {
    symbol: string;
    side: PositionSide;
    entryPrice: number;
    notional: number;
    leverage: number;
    unrealizedPnl: number;
    contracts: number;
    liquidationPrice: number;
    sl: number;
    sumbid: number;
    sumamount: number;
    loss: number;
    profit: number;
    tpPctOfPos: number;
    firstBid: number;
    firstBidpct: number;
    lastBid: number;
    lastBidpct: number;
    circsupply: number;
    liq: number;
    returnc: number;
    funding: number;
    yReturn: number;
    wReturn: number;
    dReturn: number;
    unrealizedPnlPct: number;
    firstTP: number;
    lastTP: number;
  }


  export interface CalculatedData {
    symbol: string;
    sl: number;
    firstBid: number | null;
    lastBid: number | null;
    circsupply: number;
    returnc: number;
    funding: number;
}
