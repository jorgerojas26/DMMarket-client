const BASE_URL = '/api/groups';

export const fetchGroups = async ({ filter }) => {
    const filterParam = filter ? `?filter=${filter}` : '';
    const response = await fetch(BASE_URL + filterParam);
    const groups = await response.json();
    return groups;
};

export const fetchSalesByGroup = async ({ from, to, categoryId }) => {
    const response = await fetch(`${BASE_URL}/sales/${categoryId}?from=${from}&to=${to}`);
    const report = await response.json();
    console.log('From fetchSalesByCategory', report);
    return report;
};
