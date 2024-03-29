"use strict";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import {
  AsyncTransactionsFlushed,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { getData, globalRowData } from "./data";

var UPDATE_COUNT = 20;

function numberCellFormatter(params: ValueFormatterParams) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function startFeed(api: GridApi) {
  useStartFeed();
}

// makes a copy of the original and merges in the new values
function copyObject(object: any) {
  // start with new object
  var newObject: any = {};
  // copy in the old values
  Object.keys(object).forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}
import { useRenderCount } from "@uidotdev/usehooks";
import { useStartFeed } from "@/hooks/useStartFeed";

const GridExample = () => {
  const renderCount = useRenderCount();
  console.log("GridExample:", renderCount);
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(
    () => ({ width: "1000px", height: "700px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // these are the row groups, so they are all hidden (they are show in the group column)
    {
      headerName: "Product",
      field: "product",

      hide: true,
    },
    {
      headerName: "Portfolio",
      field: "portfolio",

      hide: true,
    },
    {
      headerName: "Book",
      field: "book",

      hide: true,
    },
    { headerName: "Trade", field: "trade", width: 100 },
    // all the other columns (visible and not grouped)
    {
      headerName: "Current",
      field: "current",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Previous",
      field: "previous",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Deal Type",
      field: "dealType",
    },
    {
      headerName: "Bid",
      field: "bidFlag",

      width: 100,
    },
    {
      headerName: "PL 1",
      field: "pl1",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "PL 2",
      field: "pl2",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Gain-DX",
      field: "gainDx",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "SX / PX",
      field: "sxPx",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "99 Out",
      field: "_99Out",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Submitter ID",
      field: "submitterID",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Submitted Deal ID",
      field: "submitterDealID",
      width: 200,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
  ]);
  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.trade;
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 120,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      width: 250,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    getData();
    params.api.setGridOption("rowData", globalRowData);
    startFeed(params.api);
  }, []);

  const onAsyncTransactionsFlushed = useCallback(
    (e: AsyncTransactionsFlushed) => {
      console.log(
        "========== onAsyncTransactionsFlushed: applied " +
          e.results.length +
          " transactions"
      );
    },
    []
  );

  const onFlushTransactions = useCallback(() => {
    gridRef.current!.api.flushAsyncTransactions();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={onFlushTransactions}>Flush Transactions</button>
          <span id="eMessage"></span>
        </div>

        <div style={gridStyle} className={"ag-theme-quartz-dark"}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowGroupPanelShow={"always"}
            pivotPanelShow={"always"}
            asyncTransactionWaitMillis={4000}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            onGridReady={onGridReady}
            onAsyncTransactionsFlushed={onAsyncTransactionsFlushed}
          />
        </div>
      </div>
    </div>
  );
};

export default GridExample;
