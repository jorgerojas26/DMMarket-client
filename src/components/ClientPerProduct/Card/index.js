import { useState, useEffect } from 'react';
import ProductSearch from 'components/ProductSearch';
import ClientPerProductTable from 'components/ClientPerProduct/Table';
import { fetchBestClientsPerProduct } from 'api/clients';
import { DateTime } from 'luxon';

const ClientPerProductCard = ({ dateRange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct && dateRange.from && dateRange.to) {
      setLoading(true);
      fetchBestClientsPerProduct(selectedProduct.IdProducto, dateRange).then((response) => {
        setData([...response]);
        setLoading(false);
      });
    } else if (!selectedProduct) {
      setData([]);
    }
  }, [selectedProduct, dateRange]);
  console.log(data);

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Cliente por producto</h3>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <small>Desde: </small>
          <small>{DateTime.fromISO(dateRange.from).toLocaleString()} </small>
          <small>Hasta: </small>
          <small>{DateTime.fromISO(dateRange.to).toLocaleString()} </small>
        </div>
      </div>
      <div className='card-body'>
        <div
          style={{
            display: 'flex',
            flex: '1',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '100%' }}>
            <ProductSearch onSelect={setSelectedProduct} />
          </div>
        </div>
        <ClientPerProductTable data={data} loading={loading} />
      </div>
    </div>
  );
};

export default ClientPerProductCard;
