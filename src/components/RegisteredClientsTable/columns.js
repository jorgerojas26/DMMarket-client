const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Cliente',
    accessor: 'client',
    Footer: ({ data }) => {
      return data.length;
    },
  },
  {
    Header: 'Fecha',
    accessor: 'Fecha',
  },
];

export default columns;
