const columns = [
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
    Footer: (row) => {
      const data = row.data || [];

      const quantityTotal = data.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0);

      return <span>{quantityTotal}</span>;
    },
  },
  {
    Header: 'Total',
    Footer: (row) => {
      const data = row.data || [];

      const invoiceTotals = data.reduce((acc, cur) => {
        return acc + cur.total;
      }, 0);

      return <span>{invoiceTotals}</span>;
    },
  },
];

export default columns;
