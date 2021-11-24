const columns = [
  {
    Header: 'Cliente',
    accessor: 'client',
  },
  {
    Header: 'Total',
    accessor: 'total_USD',
    Cell: ({ value }) => {
      return '$' + value.toLocaleString();
    },
  },
];

export default columns;
