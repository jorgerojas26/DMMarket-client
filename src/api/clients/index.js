const BASE_URL = '/api/clients';

export const fetchClients = async ({ filter }) => {
  const filterParam = filter ? `?filter=${filter}` : '';
  const response = await fetch(`${BASE_URL}${filterParam}`);
  const clients = response.json();
  return clients;
};
export const fetchBestClients = async (dateRange, showNoe) => {
  const response = await fetch(`${BASE_URL}/best/?from=${dateRange.from}&to=${dateRange.to}&showNoe=${showNoe}`);
  const report = response.json();
  return report;
};

export const fetchBestClientsPerProduct = async (productId, dateRange, showNoe) => {
  const response = await fetch(
    `${BASE_URL}/best/product/${productId}?from=${dateRange.from}&to=${dateRange.to}&showNoe=${showNoe}`
  );
  const report = response.json();
  return report;
};

export const fetchMonthlyAverage = async (clientId, showNoe) => {
  const response = await fetch(`${BASE_URL}/average/month/${clientId}?showNoe=${showNoe}`);
  const report = response.json();
  return report;
};
