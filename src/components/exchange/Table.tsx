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
import { positions } from "../../atoms/myAtoms";
import "./styles.css";
import {
  AsyncTransactionsFlushed,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
} from "ag-grid-community";

const UPDATE_COUNT = 20;
import { columnDefs } from "./columdefs";
import { atom, useAtom, useAtomValue } from "jotai";
import { Position } from "safe-cex/dist/types";
import { NimbusTable } from "@/types";
import { useUpdatePositions } from "@/hooks/useUpdatePositions";
function numberCellFormatter(params: ValueFormatterParams) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function onUpdateSafeCex(api: GridApi, pos: Position[]) {
  const updateRecords: NimbusTable[] = [];
  api.forEachNode((node) => {
    const position = node.data;
    const symbol = position.symbol;
    const newPosition = pos.find((p: Position) => p.symbol === symbol);

    if (newPosition) {
      updateRecords.push({
        ...position,
        side: newPosition.side,
        entryPrice: newPosition.entryPrice,
        notional: Number(newPosition.notional.toFixed(0)),
        leverage: newPosition.leverage,
        unrealizedPnl: Number(newPosition.unrealizedPnl.toFixed(0)),
        contracts: newPosition.contracts,
        liquidationPrice: newPosition.liquidationPrice,
      });
    }
  });

  api.applyTransactionAsync({ update: updateRecords });
}

function startFeed(api: GridApi) {}

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

const GridExample = () => {
  const pos = useAtomValue(positions);

  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(
    () => ({ width: "1000px", height: "700px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.symbol;
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
    params.api.setGridOption("rowData", pos);
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
            suppressAggFuncInHeader={true}
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
