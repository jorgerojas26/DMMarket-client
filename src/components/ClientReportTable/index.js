import { useMemo } from 'react';
import Table from '../Table';
import columns from './columns';

const ClientReportTable = ({ data }) => {
  const memoizedColumns = useMemo(() => columns);

  return <Table data={data} columns={memoizedColumns} />;
};

export default ClientReportTable;
