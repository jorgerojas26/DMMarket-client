import { useState, useEffect } from 'react';
import ProductSearch from '../../ProductSearch';
import ClientPerProductTable from '../Table';
import { fetchBestClients } from '../../../api/products';
import { DateTime } from 'luxon';

const ClientPerProductCard = ({ dateRange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedProduct && dateRange) {
      const fetch_best_clients = async () => {
        const report_data = await fetchBestClients(selectedProduct.IdProducto, dateRange);
        setData(report_data);
      };

      fetch_best_clients();
    } else if (!selectedProduct) {
      setData([]);
    }
  }, [selectedProduct, dateRange]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h2>Mejor cliente por producto</h2>
        <div style={{ flexDirection: 'row', gap: '5px' }}>
          <label>Desde: </label>
          <strong>{DateTime.fromISO(dateRange.from).toLocaleString()} </strong>
          <label>Hasta: </label>
          <strong>{DateTime.fromISO(dateRange.to).toLocaleString()} </strong>
        </div>
      </div>
      <div className='card-body'>
        <div style={{ display: 'flex', flex: '1', justifyContent: 'space-between' }}>
          <div style={{ width: '100%' }}>
            <ProductSearch onSelect={setSelectedProduct} />
          </div>
        </div>
        {data.length > 0 && <ClientPerProductTable data={data} />}
      </div>
    </div>
  );
};

export default ClientPerProductCard;
