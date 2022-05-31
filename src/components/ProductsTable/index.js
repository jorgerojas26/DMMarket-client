import { Card, Button } from 'react-bootstrap';
import Table from 'components/Table';
import { useMemo } from 'react';
import pdf from './pdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ProductsTable = ({ data, totalSummary }) => {
  const quantityTotal = useMemo(() => {
    if (!data) return 0;

    return data.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }, [data]);

  const memoizedColumns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'productId',
      },
      {
        Header: 'Producto',
        accessor: 'product',
      },
      {
        Header: 'Cantidad',
        accessor: 'quantity',
        Footer: () => {
          return <span>{quantityTotal.toFixed(2)}</span>;
        },
      },
      {
        Header: 'Total',
        accessor: 'total',
        Footer: () => {
          return <span>${totalSummary.toFixed(2)}</span>;
        },
      },
    ],
    [totalSummary, quantityTotal]
  );

  const exportToPDF = () => {
    const pdfData = pdf(data, quantityTotal, totalSummary);

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
        <Table data={data} columns={memoizedColumns} showFooter />
      </Card.Body>
    </Card>
  );
};

export default ProductsTable;
