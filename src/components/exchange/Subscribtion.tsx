import { useAtom, useAtomValue } from "jotai";
import OrdersLenght from "./OrdersLenght";
import { subscribeAtomEffect } from "../../atoms/myAtoms";
import { isLoaded } from "../../atoms/myAtoms";
import { useRenderCount } from "@uidotdev/usehooks";
import GridExample from "./Table";
import { useUpdateOrders } from "@/hooks/useUpdateOrders";
import { useUpdatePositions } from "@/hooks/useUpdatePositions";
import PositionsUpdate from "./PositionsUpdate";
import ApiComp from "./apicomp";
import { useUpdateOrdersCalc } from "@/hooks/useUpdateOrdersCalc";
import Fetcher from "./Fetcher";
import { useUpdateReturns } from "@/hooks/useUpdatePositions copy";
const SubscribtionComp = () => {
  const renderCount = useRenderCount();
  console.log("SubscribtionComp:", renderCount);
  useAtom(subscribeAtomEffect);
  const loaded = useAtomValue(isLoaded);
  const isupdatingOrders = useUpdateOrders();
  const isupdatingPositions = useUpdatePositions();
  const isupdatingOrdersCalc = useUpdateOrdersCalc();
  const isupdatingReturns = useUpdateReturns();

  if (!loaded) {
    return <div>loading...</div>;
  }

  return (
    <>
      <OrdersLenght />
      <ApiComp />
      <Fetcher />
      {/* <UpdateTable /> */}
      <div>{isupdatingOrders ? "Updating Orders" : "Not Updating Orders"}</div>
      <GridExample />
    </>
  );
};

export default SubscribtionComp;
