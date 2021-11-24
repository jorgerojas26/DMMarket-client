import { useMemo } from "react";
import Table from "../Table";
import columns from "./columns";

const SaleReportTable = ({ data }) => {
  const memoizedColumns = useMemo(() => columns);

  return <Table data={data} columns={memoizedColumns} showFooter />;
};

export default SaleReportTable;
