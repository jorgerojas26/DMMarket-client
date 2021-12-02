import { useMemo } from 'react';
import Table from 'components/Table';
import columns from './columns';

const EmployeeSalesTable = ({ data, loading }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <>
      <div className='card'>
        <div className='card-header'>
          <h2>Reporte de ventas</h2>
        </div>
        <div className='card-body'>
          <Table data={data} columns={memoizedColumns} loading={loading} showFooter maxHeight={400} />
        </div>
      </div>
    </>
  );
};

export default EmployeeSalesTable;
