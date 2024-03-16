const BASE_URL = '/api/groups';

export const fetchGroups = async ({ filter, showNoe }) => {
    const filterParam = filter ? `?filter=${filter}&showNoe=${showNoe}` : '';
    const response = await fetch(BASE_URL + filterParam);
    const groups = await response.json();
    return groups;
};

export const fetchSalesByGroup = async ({ from, to, categoryId, showNoe }) => {
    const response = await fetch(`${BASE_URL}/sales/${categoryId}?from=${from}&to=${to}&showNoe=${showNoe}`);
    const report = await response.json();
    console.log('From fetchSalesByCategory', report);
    return report;
};
