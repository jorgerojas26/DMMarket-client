const BASE_URL = '/api/groups';

export const fetchGroups = async ({ filter, showNoe }) => {
  const filterParam = filter ? `?filter=${filter}&showNoe=${showNoe}` : '';
  const response = await fetch(BASE_URL + filterParam);
  const groups = await response.json();
  return groups;
};
