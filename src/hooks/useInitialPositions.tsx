import { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { positions } from "@/atoms/myAtoms";
import { Position } from "safe-cex/dist/types";
import { exchangeAtom } from "@/components/exchange/exchange";

export const useInitialPositions = () => {
  console.log("useInitialPositions");
  const exchange = useAtomValue(exchangeAtom);
  const positions = exchange?.store.positions;

  return positions;
};
