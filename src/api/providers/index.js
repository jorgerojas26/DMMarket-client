const BASE_URL = '/api/providers';

export const fetchProvidersList = async ({ search, page = 1, limit = 20, showNoe }) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', page);
  params.append('limit', limit);
  params.append('showNoe', showNoe);
  const response = await fetch(`${BASE_URL}/list?${params.toString()}`);
  return response.json();
};

export const fetchBestProviders = async (dateRange, showNoe, mode) => {
  const response = await fetch(
    `${BASE_URL}/best?from=${dateRange.from}&to=${dateRange.to}&showNoe=${showNoe}&mode=${mode}`
  );
  return response.json();
};

export const fetchProviderSummary = async (providerId, { from, to, showNoe }) => {
  const response = await fetch(
    `${BASE_URL}/${providerId}/summary?from=${from}&to=${to}&showNoe=${showNoe}`
  );
  return response.json();
};

export const fetchProviderSales = async (providerId, { from, to, page = 1, limit = 20, showNoe }) => {
  const response = await fetch(
    `${BASE_URL}/${providerId}/sales?from=${from}&to=${to}&page=${page}&limit=${limit}&showNoe=${showNoe}`
  );
  return response.json();
};

export const fetchProviderPurchases = async (providerId, { from, to, page = 1, limit = 20 }) => {
  const response = await fetch(
    `${BASE_URL}/${providerId}/purchases?from=${from}&to=${to}&page=${page}&limit=${limit}`
  );
  return response.json();
};

export const fetchPurchaseDetail = async (providerId, invoiceId) => {
  const response = await fetch(
    `${BASE_URL}/${providerId}/purchases/${invoiceId}`
  );
  return response.json();
};

export const fetchSaleDetail = async (providerId, invoiceId, showNoe) => {
  const response = await fetch(
    `${BASE_URL}/${providerId}/sales/${invoiceId}?showNoe=${showNoe}`
  );
  return response.json();
};
