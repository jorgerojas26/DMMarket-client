import { useEffect, useState } from 'react';
import SaleReportTable from '../../SaleReportTable';

const SaleReportCard = ({ data = [], onFilter }) => {
  const [sorting, setSorting] = useState('rawProfit');
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sorted = data.sort((a, b) => {
      return b[sorting] - a[sorting];
    });
    setSortedData([...sorted]);
  }, [sorting, data]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h2>Ventas</h2>
        <div>
          <label>Ordenar: </label>
          <select onChange={(event) => setSorting(event.target.value)} value={sorting}>
            <option value='quantity'>Cantidad</option>
            <option value='rawProfit'>Bruto</option>
            <option value='netProfit'>Utilidad</option>
            <option value='averageProfitPercent'>Promedio</option>
          </select>
        </div>
      </div>
      <div className='card-body'>
        {sortedData.length > 0 && (
          <>
            <input
              className='input-filter'
              placeholder='Buscar...'
              type='search'
              onChange={(event) => onFilter(event.target.value, 'product', 'sale_report')}
            />
            <SaleReportTable data={sortedData} />
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReportCard;
