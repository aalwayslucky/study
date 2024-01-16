import { useRenderCount } from "@uidotdev/usehooks";
import { useUpdatePositions } from "@/hooks/useUpdatePositions";
const PositionsUpdate = () => {
  const renderCount = useRenderCount();
  console.log("PositionsUpdate:", renderCount);
  // const isupdating = useUpdatePositions();

  return <>{/* <div>{isupdating ? "Updating " : "Not Updating "}</div> */}</>;
};

export default PositionsUpdate;
