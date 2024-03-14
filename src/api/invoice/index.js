const BASE_URL = '/api/invoices';

export const fetchInvoiceReport = async ({ from, to }, showNoe) => {
  const response = await fetch(`${BASE_URL}/sales?from=${from}&to=${to}&showNoe=${showNoe}`);
  const report = await response.json();
  console.log('From fetchInvoiceReport: ', report);
  return report;
};

export const fetchInvoiceList = async ({ from, to }, showNoe) => {
  const response = await fetch(`${BASE_URL}?from=${from}&to=${to}&showNoe=${showNoe}`);
  const invoices = await response.json();
  return invoices;
};
