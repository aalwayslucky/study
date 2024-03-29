/* eslint-disable no-console */

import { useEffect, useState } from "react";
import { createExchange } from "safe-cex";
import type { Exchange } from "safe-cex/dist/exchanges/base";
import { atom, useSetAtom } from "jotai";
import Balance from "./OrdersLenght";
const EXCHANGE = "binance";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;
const TESTNET = false;

if (!API_KEY || !API_SECRET) {
  throw new Error(
    "Please set API_KEY and API_SECRET in `components/with-exchange.component.tsx`"
  );
}

export const exchangeAtom = atom<Exchange | null>(null);

export const useRunExchange = () => {
  console.log("useRunExchange is running");
  const setExchange = useSetAtom(exchangeAtom);
  const [exchange, setLocalExchange] = useState<Exchange | null>(null);

  useEffect(() => {
    const _exchange = createExchange(EXCHANGE, {
      key: API_KEY,
      secret: API_SECRET,
      testnet: TESTNET,
    });
    _exchange.start();

    setExchange(_exchange);
    setLocalExchange(_exchange);

    return () => {
      _exchange.dispose();
    };
  }, []);
};
