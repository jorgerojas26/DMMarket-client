import { useMemo } from 'react';
import Table from '../Table';
import columns from './columns';

const ClientReportTable = ({ data, loading }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return <Table data={data} columns={memoizedColumns} loading={loading} />;
};

export default ClientReportTable;
