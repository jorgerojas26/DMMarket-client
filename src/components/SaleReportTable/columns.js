const columns = [
  {
    Header: 'Producto',
    accessor: 'product',
  },
  {
    Header: 'Cantidad',
    accessor: 'quantity',
  },
  {
    Header: 'Bruto',
    accessor: 'rawProfit',
    Cell: ({ value }) => {
      return value ? '$' + value.toLocaleString() : '';
    },
    Footer: ({ data }) => {
      const total = data.reduce((acc, current) => {
        return acc + current.rawProfit;
      }, 0);
      return '$' + Number(total.toFixed(2)).toLocaleString();
    },
  },
  {
    Header: 'Utilidad',
    accessor: 'netProfit',
    Cell: ({ value }) => {
      return value ? '$' + value.toLocaleString() : '';
    },
    Footer: ({ data }) => {
      const total = data.reduce((acc, current) => {
        return acc + current.netProfit;
      }, 0);
      return '$' + Number(total.toFixed(2)).toLocaleString();
    },
  },
];

export default columns;
