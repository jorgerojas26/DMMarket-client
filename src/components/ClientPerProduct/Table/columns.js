const columns = [
  {
    Header: 'Cliente',
    accessor: 'client',
  },
  {
    Header: 'Cantidad',
    accessor: 'quantity_total',
  },
  {
    Header: 'Total',
    accessor: 'total_USD',
    Cell: ({ value }) => {
      return value ? '$' + value.toLocaleString() : '';
    },
  },
  {
    Header: 'Utilidad',
    accessor: 'utilidad',
    Cell: ({ value }) => {
      return value ? '$' + value.toLocaleString() : 0;
    },
  },
];

export default columns;
