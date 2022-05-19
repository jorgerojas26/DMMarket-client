import { DateTime } from 'luxon';

const pdfschema = (productList) => ({
  content: [
    { text: 'ALIMENTOS DM MARKET, C.A.', style: 'header' },
    {
      text: 'CALLE ILUSTRES PROCERES LOCAL NRO S/N SECTOR CENTRO ALTAGRACIA DE ORITUCO DE ORITUCO ZONA POSTAL 2320.',
      style: 'header',
    },
    { text: 'R.I.F.: J-41270446-0', style: 'header' },
    {
      style: 'table',
      table: {
        widths: ['*', '*'],
        body: [['PRODUCTO', 'CANTIDAD'], ...productList.map(({ product, quantity }) => [product, quantity])],
      },
    },
  ],
  styles: {
    header: {
      alignment: 'center',
    },
    table: {
      margin: [0, 20, 0, 0],
    },
  },

  pageMargins: 40,
  pageSize: 'LETTER',
});

export default pdfschema;
