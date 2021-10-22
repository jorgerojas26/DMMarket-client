import { useState, useEffect, useRef } from 'react';
import GroupSearch from '../../GroupSearch';
import { fetchProductPriceList } from '../../../api/products';
import PriceListTable from '../../PriceListTable';
import { useReportFilter } from '../../../hooks/useReportFilter';

const GroupStock = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [data, setData] = useState([]);
  const { filteredData, setFilteredData, onFilterDebounced } = useReportFilter(data);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedGroup) {
      const fetch_stock_by_group = async () => {
        const data = await fetchProductPriceList(selectedGroup.groupId);
        setFilteredData([]);
        inputRef.current.value = '';
        setData([...data]);
      };

      fetch_stock_by_group();
    } else if (!selectedGroup) {
      setData([]);
    }
  }, [selectedGroup]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h2>Lista de precio por categoría</h2>
      </div>
      <div className='card-body'>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40%' }}>
          <GroupSearch onSelect={setSelectedGroup} />

          <input
            ref={inputRef}
            className='input-filter'
            placeholder='Buscar...'
            type='search'
            onChange={(event) => {
              onFilterDebounced(event.target.value, 'product');
            }}
          />
        </div>
        <PriceListTable data={filteredData.length > 0 ? filteredData : data} />
      </div>
    </div>
  );
};

export default GroupStock;
