const BASE_URL = '/api/reports/invoice';

export const fetchInvoiceReport = async ({ from, to }) => {
  const response = await fetch(`${BASE_URL}?from=${from}&to=${to}`);
  const report = await response.json();
  console.log('From fetchInvoiceReport: ', report);
  return report;
};
