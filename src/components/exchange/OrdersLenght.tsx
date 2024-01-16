import { useAtomValue } from "jotai";
import { ordersAtom } from "../../atoms/myAtoms";
import { useRenderCount } from "@uidotdev/usehooks";

// OrdersLenght is a functional component that displays the number of orders.
const OrdersLenght = () => {
  // Log a message to the console for debugging purposes.
  const renderCount = useRenderCount();
  console.log("OrdersLenght:", renderCount);

  // Use the useAtomValue hook to get the current value of the orders.
  const ordersCount = useAtomValue(ordersAtom);

  // Return a JSX element that displays the number of orders.
  return <div>Orders:{ordersCount}</div>;
};

export default OrdersLenght;
