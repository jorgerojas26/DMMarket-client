import { useState } from 'react';
import debounce from 'lodash.debounce';

export const useReportFilter = (data_to_filter, initial_state = []) => {
  const [filteredData, setFilteredData] = useState(initial_state);

  const onFilterDebounced = debounce((filterValue, report, filterKey) => {
    filter(filterValue, report, filterKey);
  }, 500);

  const filter = (filterValue, report, filterKey) => {
    const filtered = data_to_filter[report].filter((r) => r[filterKey].toLowerCase().includes(filterValue.toLowerCase()));
    setFilteredData({ ...filteredData, [report]: filtered });
  };

  return {
    filteredData,
    setFilteredData,
    onFilterDebounced,
  };
};
