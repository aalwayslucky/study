import React from "react";
import { useUpdateOrders } from "@/hooks/useUpdateOrders";
import { Button } from "../ui/button";

const UpdateTable: React.FC = () => {
  console.log("StartFeed:");
  const onOrdesUpdate = useUpdateOrders();

  return (
    <>
      <Button onClick={onOrdesUpdate}>Update Table</Button>
    </>
  );
};

export default UpdateTable;
