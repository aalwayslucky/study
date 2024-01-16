import { atom } from "jotai";
import { Order, StoreData } from "safe-cex/dist/types";
import { exchangeAtom } from "../components/exchange/exchange";
import { atomEffect } from 'jotai-effect'
import {

  GridApi

} from "ag-grid-community";
import { NimbusTable } from "@/types";



export const exchangeDataAtom = atom<StoreData | null>(null);

export const subscribeAtomEffect = atomEffect((get, set) => {
  console.log("subscribeAtomEffect is running");
  if (!exchangeDataAtom) {
    return;
  }
  const exchange = get(exchangeAtom);
  if (exchange?.store) {
    const unsubscribe = exchange.store.subscribe((newState: StoreData) => {
      set(exchangeDataAtom, (prevData) => {
        if (prevData === null) {
          return newState;
        } else {
          return { ...prevData, ...newState };
        }
      });
    });

    return () => {
      if (unsubscribe) {
        console.log("Unsubscribing");
        unsubscribe();
      }
    };
  } else {
    console.log("exchange.store does not exist");
  }
});
export const ordersAtom = atom<Order[]>((get) => {
  const exchangeData = get(exchangeDataAtom);
  if (exchangeData) {
    return exchangeData.orders;
  }
  return [];
});



export const apiAtom = atom<GridApi<NimbusTable> | null>(null);

export const isLoaded = atom((get) => {
    const exchangeData = get(exchangeDataAtom);
    if (exchangeData) {
      return exchangeData.loaded.positions;
    }
    return false;
  });
  
// atom for positions
export const positions = atom((get) => {
  const exchangeData = get(exchangeDataAtom);
  if (exchangeData) {
    return exchangeData.positions;
  }
  return [];
});

// create atom for positionsStable that will be copy of positions and will not update on change


export const positionsStable = atom((get) => {
  const exchangeData = get(exchangeDataAtom);
  if (exchangeData) {
    return exchangeData.positions;
  }
  return [];
});

