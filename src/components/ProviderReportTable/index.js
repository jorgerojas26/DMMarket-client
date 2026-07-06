import { useMemo } from 'react';
import Table from '../Table';
import columns from './columns';

const ProviderReportTable = ({ data, loading }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return <Table data={data} columns={memoizedColumns} loading={loading} />;
};

export default ProviderReportTable;
