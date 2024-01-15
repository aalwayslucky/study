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
    lastBid: number;
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