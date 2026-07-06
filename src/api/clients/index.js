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

export const fetchClientSales = async (clientId, { from, to, page = 1, limit = 20, showNoe }) => {
  const response = await fetch(
    `${BASE_URL}/${clientId}/sales?from=${from}&to=${to}&page=${page}&limit=${limit}&showNoe=${showNoe}`
  );
  return response.json();
};

export const fetchClientSummary = async (clientId, { from, to, showNoe }) => {
  const response = await fetch(
    `${BASE_URL}/${clientId}/summary?from=${from}&to=${to}&showNoe=${showNoe}`
  );
  return response.json();
};

export const fetchClientsList = async ({ search, page = 1, limit = 20, showNoe }) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', page);
  params.append('limit', limit);
  params.append('showNoe', showNoe);
  const response = await fetch(`${BASE_URL}/list?${params.toString()}`);
  return response.json();
};
