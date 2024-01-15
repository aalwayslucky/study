import { atom } from "jotai";
import { StoreData } from "safe-cex/dist/types";
import { exchangeAtom } from "../components/exchange/exchange";
import { atomEffect } from 'jotai-effect'



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
export const orders = atom((get) => {
  const exchangeData = get(exchangeDataAtom);
  if (exchangeData) {
    return exchangeData.orders.length;
  }
  return 0;
});

export const isLoaded = atom((get) => {
    const exchangeData = get(exchangeDataAtom);
    if (exchangeData) {
      return exchangeData.loaded.positions;
    }
    return false;
  });
  

export const positions = atom((get) => {
  const exchangeData = get(exchangeDataAtom);
  if (exchangeData) {
    return exchangeData.positions;
  }
  return [];
});

