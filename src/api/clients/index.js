const BASE_URL = '/api/clients';

export const fetchClients = async ({ filter }) => {
  const filterParam = filter ? `?filter=${filter}` : '';
  const response = await fetch(`${BASE_URL}${filterParam}`);
  const clients = response.json();
  return clients;
};
export const fetchBestClients = async (dateRange) => {
  const response = await fetch(`${BASE_URL}/best/?from=${dateRange.from}&to=${dateRange.to}`);
  const report = response.json();
  return report;
};

export const fetchBestClientsPerProduct = async (productId, dateRange) => {
  const response = await fetch(`${BASE_URL}/best/product/${productId}?from=${dateRange.from}&to=${dateRange.to}`);
  const report = response.json();
  return report;
};

export const fetchMonthlyAverage = async (clientId) => {
  const response = await fetch(`${BASE_URL}/average/month/${clientId}`);
  const report = response.json();
  return report;
};
