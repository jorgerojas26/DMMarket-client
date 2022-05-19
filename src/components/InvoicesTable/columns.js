import dayjs from 'dayjs';

const columns = [
  {
    Header: 'ID',
    accessor: 'invoiceId',
  },
  {
    Header: 'Cliente',
    accessor: 'client',
  },
  {
    Header: 'RIF',
    accessor: 'rif',
  },
  {
    Header: 'TOTAL',
    accessor: 'total',
    Cell: ({ value }) => `$${value ? value.toFixed(2) : ''}`,
  },
  {
    Header: 'Fecha',
    accessor: 'createdAt',
    Cell: ({ value }) => {
      return dayjs(value).format('MMM DD, YYYY');
    },
  },
];

export default columns;
