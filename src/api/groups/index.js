const BASE_URL = "/api/groups";

export const fetchGroups = async ({ filter }) => {
  const filterParam = filter ? `?filter=${filter}` : "";
  const response = await fetch(BASE_URL + filterParam);
  const groups = await response.json();
  return groups;
};
