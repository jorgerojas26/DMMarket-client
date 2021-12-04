import { useMemo } from 'react';
import Table from 'components/Table';
import columns from './columns';

const PriceListTable = ({ data, loading }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return <Table data={data} columns={memoizedColumns} loading={loading} />;
};

export default PriceListTable;
