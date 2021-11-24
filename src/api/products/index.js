const BASE_URL = "/api/products";
const REPORTS_BASE_URL = "/api/reports/products";

export const fetchProducts = async ({ filter }) => {
  const filterParam = filter ? `?filter=${filter}` : "";
  const response = await fetch(BASE_URL + filterParam);
  const products = await response.json();
  return products;
};

export const fetchCostFluctuation = async (productId) => {
  const response = await fetch(`${BASE_URL}/cost-fluctuation/${productId}`);
  const report = await response.json();
  return report;
};

export const fetchCostPerGroup = async () => {
  const response = await fetch(`${BASE_URL}/cost/group`);
  const report = await response.json();
  return report;
};

export const fetchProductsByGroup = async () => {
  const response = await fetch(`${BASE_URL}/group`);
  const products = await response.json();
  return products;
};

export const fetchProductPriceList = async (groupId) => {
  const response = await fetch(`${BASE_URL}/price-list/${groupId}`);
  const report = response.json();
  return report;
};

export const fetchProductReports = async (productId) => {
  const response = await fetch(`${REPORTS_BASE_URL}/cost-fluctuation/${productId}`);
  const report = response.json();
  return report;
};

export const fetchBestClients = async (productId, dateRange) => {
  const response = await fetch(
    `${REPORTS_BASE_URL}/best-clients/${productId}?from=${dateRange.from}&to=${dateRange.to}`
  );
  const report = response.json();
  return report;
};
