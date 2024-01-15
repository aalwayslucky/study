import { DevTools } from "jotai-devtools";
import SubscribtionComp from "./components/exchange/Subscribtion";
import { useAtomValue } from "jotai";
import { useRunExchange, exchangeAtom } from "./components/exchange/exchange";
function App() {
  const exchange = useRunExchange();

  return (
    <>
      <DevTools />
      <SubscribtionComp />
    </>
  );
}

export default App;
