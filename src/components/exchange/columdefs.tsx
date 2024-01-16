import { ColDef, ValueFormatterParams } from "ag-grid-community";
import "./ag.css";

export const columnDefs: ColDef[] = [
  {
    headerName: "Symbol",
    field: "symbol",
    width: 80,
    minWidth: 80,
    pinned: "left",
    lockPinned: true,
    filter: true,
    filterParams: {},
  },
  {
    headerName: "Side",
    field: "side",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: false,
  },
  {
    headerName: "$uPNL",
    cellDataType: "number",
    minWidth: 75,
    field: "unrealizedPnl",
    filter: "agNumberColumnFilter",
    filterParams: {},
  },

  {
    headerName: "%uPNL",
    cellDataType: "number",
    minWidth: 75,
    field: "unrealizedPnlPct",
    filter: "agNumberColumnFilter",

    filterParams: {},
  },
  {
    headerName: "Liq",
    field: "liquidationPrice",
    cellStyle: { textAlign: "right" },

    hide: false,
  },
  {
    field: "entryPrice",
    headerName: "Entry",
    cellStyle: { textAlign: "right" },

    hide: false,
  },
  {
    headerName: "Size",
    cellStyle: { textAlign: "right" },
    field: "notional",
    filter: "agNumberColumnFilter",
    filterParams: {},
    minWidth: 75,
  },
  {
    field: "leverage",
    headerName: "Lvg",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: false,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "contracts",
    headerName: "Qty",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: false,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "sl",
    headerName: "SL",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: true,

    minWidth: 75,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "sumbid",
    headerName: "Bids",
    filter: "agTextColumnFilter",
    filterParams: {},
    minWidth: 75,
  },
  {
    field: "loss",
    headerName: "Risk",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: true,

    minWidth: 75,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "profit",
    headerName: "Profit",
    filter: "agTextColumnFilter",
    filterParams: {},
    hide: true,

    minWidth: 75,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "tpPctOfPos",
    filter: "agTextColumnFilter",
    filterParams: {},
    headerName: "TP %",
    minWidth: 75,
  },
  {
    field: "firstBid",
    filter: "agTextColumnFilter",
    filterParams: {},
    headerName: "FBid",
    minWidth: 75,
  },
  {
    field: "firstBidpct",
    filter: "agTextColumnFilter",
    filterParams: {},
    headerName: "FBid%",
    minWidth: 75,
  },
  {
    field: "lastBid",
    filter: "agTextColumnFilter",
    filterParams: {},
    headerName: "LBid",
    minWidth: 75,
  },
  {
    field: "lastBidpct",
    filter: "agTextColumnFilter",
    filterParams: {},
    headerName: "LBid%",
    minWidth: 75,
  },
  {
    field: "circsupply",
    filter: "agNumberColumnFilter",
    filterParams: {},
    headerName: "MC",
    minWidth: 75,

    cellStyle: { textAlign: "right" },
  },
  {
    field: "returnc",

    headerName: "24h%",
    minWidth: 75,
    filter: "agNumberColumnFilter",
    filterParams: {},
  },
  {
    field: "wReturn",

    headerName: "w%",
    minWidth: 75,
    filter: "agNumberColumnFilter",
    filterParams: {},
  },
  {
    field: "dReturn",

    headerName: "d%",
    minWidth: 75,
    filter: "agNumberColumnFilter",
    filterParams: {},
  },
  {
    field: "yReturn",

    headerName: "y%",
    minWidth: 75,
    filter: "agNumberColumnFilter",
    filterParams: {},
  },

  {
    field: "funding",
    headerName: "F",
    filter: "agNumberColumnFilter",
    filterParams: {},
    minWidth: 75,
  },
];
