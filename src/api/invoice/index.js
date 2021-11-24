const BASE_URL = "/api/invoices";

export const fetchInvoiceReport = async ({ from, to }) => {
  const response = await fetch(`${BASE_URL}/sales?from=${from}&to=${to}`);
  const report = await response.json();
  console.log("From fetchInvoiceReport: ", report);
  return report;
};
