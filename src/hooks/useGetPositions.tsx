import { positions } from "@/atoms/myAtoms";
import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const useGetPosition = () => {
  console.log("useGetPosition");

  // Position[]
  const pos = 2;
  return pos;
};
