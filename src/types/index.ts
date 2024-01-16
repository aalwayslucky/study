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
    slpct: number;
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
    dPrice: number;
    wPrice: number;
    yPrice: number;
        lastTP: number;
  }

  export interface YWDReturns {
    symbol: string;
    wPrice: number;
    wReturn?: number;
    dPrice: number;
    dReturn?: number;
    yPrice: number;
    yReturn?: number;
  }
