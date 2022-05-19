import { Card, Button } from 'react-bootstrap';
import Table from 'components/Table';
import { useMemo } from 'react';
import columns from './columns';
import pdf from './pdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ProductsTable = ({ data }) => {
  const memoizedColumns = useMemo(() => columns, []);

  const exportToPDF = () => {
    const pdfData = pdf(data);

    pdfMake.createPdf(pdfData).open();
  };

  return (
    <Card>
      <Card.Header>
        <div className='d-flex w-100 justify-content-between'>
          <h3>Productos</h3>
          <Button onClick={exportToPDF}>Imprimir</Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table data={data} columns={memoizedColumns} />
      </Card.Body>
    </Card>
  );
};

export default ProductsTable;
