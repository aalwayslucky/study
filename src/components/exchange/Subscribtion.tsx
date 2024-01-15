import { useAtom, useAtomValue } from "jotai";
import OrdersLenght from "./OrdersLenght";
import GridExample from "./Table";
import { subscribeAtomEffect } from "../../atoms/myAtoms";
import { isLoaded } from "../../atoms/myAtoms";

const SubscribtionComp = () => {
  useAtom(subscribeAtomEffect);
  const loaded = useAtomValue(isLoaded);

  if (!loaded) {
    return <div>loading...</div>;
  }
  return (
    <>
      <OrdersLenght />
      <GridExample />
    </>
  );
};

export default SubscribtionComp;
