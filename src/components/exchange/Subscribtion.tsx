import { useAtom, useAtomValue } from "jotai";
import OrdersLenght from "./OrdersLenght";
import { subscribeAtomEffect } from "../../atoms/myAtoms";
import { isLoaded } from "../../atoms/myAtoms";
import { useRenderCount } from "@uidotdev/usehooks";
import GridExample from "./Table";
import UpdateTable from "../exchangeButtons/UpdateTable";
const SubscribtionComp = () => {
  const renderCount = useRenderCount();
  console.log("SubscribtionComp:", renderCount);
  useAtom(subscribeAtomEffect);
  const loaded = useAtomValue(isLoaded);

  if (!loaded) {
    return <div>loading...</div>;
  }

  return (
    <>
      {/* <OrdersLenght /> */}
      <UpdateTable />
      <GridExample />
    </>
  );
};

export default SubscribtionComp;
