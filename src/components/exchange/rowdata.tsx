import { useAtomValue } from "jotai";
import { apiAtom } from "../../atoms/myAtoms";
import { useRenderCount } from "@uidotdev/usehooks";
import { Button } from "../ui/button";

// OrdersLenght is a functional component that displays the number of orders.
const ApiComp = () => {
  // Log a message to the console for debugging purposes.
  const renderCount = useRenderCount();
  console.log("OrdersLenght:", renderCount);

  // Use the useAtomValue hook to get the current value of the orders.
  const api = useAtomValue(apiAtom);

  // Return a JSX element that displays the number of orders.
  return (
    <div>
      <Button
        onClick={() => {
          console.log(api);
        }}
      >
        Log Api
      </Button>
    </div>
  );
};

export default ApiComp;
