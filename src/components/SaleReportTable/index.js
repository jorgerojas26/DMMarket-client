import { useMemo } from 'react';
import Table from 'components/Table';
import columns from './columns';

const SaleReportTable = ({ data, loading }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return <Table data={data} columns={memoizedColumns} showFooter loading={loading} />;
};

export default SaleReportTable;
