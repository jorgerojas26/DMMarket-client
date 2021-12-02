import { useMemo } from 'react';
import Table from 'components/Table';
import columns from './columns';
import { Button } from 'react-bootstrap';
import CommissionModal from 'employees/Modal/Commission';

const EmployeeSales = ({ data, loading, selectedEmployee, onRowSelect }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <>
      <div className='card'>
        <div className='card-header'>
          <h2>Vendedores</h2>
        </div>
        <div className='card-body'>
          <Table data={data} columns={memoizedColumns} loading={loading} onRowSelect={onRowSelect} />
        </div>
      </div>
    </>
  );
};

export default EmployeeSales;
