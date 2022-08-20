const BASE_URL = '/api/currency_rates';

export const fetchCurrencyRates = async () => {
  const response = await fetch(`${BASE_URL}`);
  const data = await response.json();

  return { status: response.status, data };
};
