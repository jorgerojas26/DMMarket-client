const BASE_URL = '/api/employees';

export const getAllEmployees = async () => {
  const response = await fetch(`${BASE_URL}`);
  const employees = await response.json();
  return employees;
};

export const getComisionInfo = async (employeeId) => {
  const response = await fetch(`${BASE_URL}/commissionInfo/${employeeId}`).catch((error) => ({ error }));
  const commissionInfo = await response.json();
  return commissionInfo;
};

export const updateComisionInfo = async (employeeId, data) => {
  const res = await fetch(`${BASE_URL}/commissionInfo/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commissionInfo: data }),
  }).catch((error) => ({ error }));

  const response = await res.json();
  return response;
};

export const getEmployeeSales = async (employeeId, dateRange, showNoe) => {
  const response = await fetch(
    `${BASE_URL}/sales/${employeeId}?from=${dateRange.from}&to=${dateRange.to}&showNoe=${showNoe}`
  ).catch((error) => ({ error }));
  const sales = await response.json();
  return sales;
};
