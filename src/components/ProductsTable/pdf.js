import { DateTime } from 'luxon';

const pdfschema = (productList, quantityTotal, totalSummary) => ({
  content: [
    { text: 'ALIMENTOS DM MARKET, C.A.', style: 'header' },
    {
      text: 'CALLE ILUSTRES PROCERES LOCAL NRO S/N SECTOR CENTRO ALTAGRACIA DE ORITUCO DE ORITUCO ZONA POSTAL 2320.',
      style: 'header',
    },
    { text: 'R.I.F.: J-41270446-0', style: 'header' },
    { text: DateTime.local().toFormat('dd/MM/yyyy'), style: 'header' },
    {
      style: 'table',
      table: {
        widths: [85, '*', 'auto', 'auto'],
        body: [
          ['CATEGORÍA', 'PRODUCTO', 'CANTIDAD', 'TOTAL'],
          ...productList.map(({ group, product, quantity, total }) => [group, product, quantity, total]),
          ['', '', { text: quantityTotal, bold: true }, { text: `$${totalSummary}`, bold: true }],
        ],
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
