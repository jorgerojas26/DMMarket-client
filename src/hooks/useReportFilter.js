import { useState } from 'react';
import debounce from 'lodash.debounce';

export const useReportFilter = (data_to_filter, initial_state = []) => {
  const [filteredData, setFilteredData] = useState(initial_state);

  const onFilterDebounced = debounce((filterValue, filterKey, nestedKey) => {
    if (nestedKey) {
      nestedFilter(filterValue, filterKey, nestedKey);
    } else {
      filter(filterValue, filterKey);
    }
  }, 500);

  const filter = (filterValue, filterKey) => {
    const filtered = data_to_filter.filter((r) => r[filterKey].toLowerCase().includes(filterValue.toLowerCase()));
    setFilteredData(filtered);
  };

  const nestedFilter = (filterValue, filterKey, nestedKey) => {
    console.log('nestedKLey', nestedKey);
    const filtered = data_to_filter[nestedKey].filter((r) => r[filterKey].toLowerCase().includes(filterValue.toLowerCase()));
    setFilteredData({ ...filteredData, [nestedKey]: filtered });
  };

  return {
    filteredData,
    setFilteredData,
    onFilterDebounced,
  };
};
