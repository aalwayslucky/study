import { atomEffect } from "jotai-effect";
import { atom } from "jotai";
import { StoreData } from "safe-cex/dist/types";
import { useAtom } from "jotai";
import { exchangeAtom } from "./exchange";
import OrdersLenght from "./OrdersLenght";
import { Grid } from "lucide-react";
import GridExample from "./Table";
const exchangeDataAtom = atom<StoreData | null>(null);

const subscribeAtomEffect = atomEffect((get, set) => {
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

const SubscribtionComp = () => {
  useAtom(subscribeAtomEffect);

  return (
    <>
      <OrdersLenght />
      <GridExample />
    </>
  );
};

export default SubscribtionComp;
