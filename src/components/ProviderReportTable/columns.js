const columns = [
  {
    Header: 'Proveedor',
    accessor: 'proveedor',
  },
  {
    Header: 'Total',
    accessor: 'monto',
    Cell: ({ value }) => {
      return '$' + Number(value).toLocaleString();
    },
  },
];

export default columns;
