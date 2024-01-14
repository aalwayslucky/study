import { useAtomValue } from "jotai";
import { orders } from "./Subscribtion";

// OrdersLenght is a functional component that displays the number of orders.
const OrdersLenght = () => {
  // Log a message to the console for debugging purposes.
  console.log("Rendering Balance");

  // Use the useAtomValue hook to get the current value of the orders.
  const ordersCount = useAtomValue(orders);

  // Return a JSX element that displays the number of orders.
  return <div>Orders:{ordersCount}</div>;
};

export default OrdersLenght;
