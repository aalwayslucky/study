import React from "react";
import { useStartFeed } from "@/hooks/useStartFeed";
import { useRenderCount } from "@uidotdev/usehooks";
import { positions } from "@/atoms/myAtoms";

const StartFeed: React.FC = () => {
  console.log("StartFeed:");
  // useStartFeed();

  return (
    <>
      <h1>StartFeed</h1>
    </>
  );
};

export default StartFeed;
