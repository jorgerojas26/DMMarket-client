import { useMemo } from 'react';
import Table from '../Table';
import columns from './columns';

const PriceListTable = ({ data }) => {
  const memoizedColumns = useMemo(() => columns);

  return <Table data={data} columns={memoizedColumns} />;
};

export default PriceListTable;
