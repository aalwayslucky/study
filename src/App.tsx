import { DevTools } from "jotai-devtools";
import SubscribtionComp from "./components/exchange/Subscribtion";
import { useAtomValue } from "jotai";
import { RunExchange, exchangeAtom } from "./components/exchange/exchange";
function App() {
  return (
    <>
      <RunExchange />
      <DevTools />
      <SubscribtionComp />
    </>
  );
}

export default App;
