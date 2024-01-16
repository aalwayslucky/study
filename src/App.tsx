import { DevTools } from "jotai-devtools";
import SubscribtionComp from "./components/exchange/Subscribtion";
import { useAtomValue } from "jotai";
import { useRenderCount } from "@uidotdev/usehooks";
import { useRunExchange, exchangeAtom } from "./components/exchange/exchange";
function App() {
  const renderCount = useRenderCount();
  console.log("App is running", renderCount);
  const exchange = useRunExchange();

  return (
    <>
      <DevTools />
      <SubscribtionComp />
    </>
  );
}

export default App;
