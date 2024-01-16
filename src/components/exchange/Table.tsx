"use strict";

import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";

import {
  AsyncTransactionsFlushed,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import { useRenderCount } from "@uidotdev/usehooks";

import { columnDefs } from "./columdefs";
import { useSetAtom } from "jotai";
import { apiAtom } from "../../atoms/myAtoms";

import { useInitialPositions } from "@/hooks/useInitialPositions";
import { NimbusTable } from "@/types";

const GridExample = () => {
  // const [pos] = useAtom(positions);
  const renderCount = useRenderCount();
  console.log("GridExample:", renderCount);
  const gridRef = useRef<AgGridReact<NimbusTable>>(null);
  const [rowData, setRowData] = useState<NimbusTable[]>([]); // Initialize rowData with an empty array

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

  const setApi = useSetAtom(apiAtom);
  const [api, setApi2] = useState<GridApi<NimbusTable>>();
  const initialPositions = useInitialPositions();
  // console.log("initialPositions:", initialPositions);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setApi(params.api as GridApi<NimbusTable>);
    // need to add
    setRowData(initialPositions);
    // Save the api when the grid is ready
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
            rowData={rowData}
            ref={gridRef}
            columnDefs={columnDefs}
            suppressAggFuncInHeader={true}
            asyncTransactionWaitMillis={1000}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            //here i want to call
            onGridReady={onGridReady}
            onAsyncTransactionsFlushed={onAsyncTransactionsFlushed}
          />
        </div>
      </div>
    </div>
  );
};

export default GridExample;
