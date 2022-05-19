import Table from 'components/Table';
import { Card } from 'react-bootstrap';
import { useMemo } from 'react';
import columns from './columns';

const InvoicesTable = ({ data, loading, onRowSelect }) => {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <Card className='noselect'>
      <Card.Header>
        <h3>Facturas</h3>
      </Card.Header>
      <Card.Body>
        <Table data={data} columns={memoizedColumns} loading={loading} onRowSelect={onRowSelect} multiSelect />
      </Card.Body>
    </Card>
  );
};

export default InvoicesTable;
