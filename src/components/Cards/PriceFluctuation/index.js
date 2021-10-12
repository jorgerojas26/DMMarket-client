import { useState, useEffect } from 'react';
import ProductSearch from '../../ProductSearch';
import { ResponsiveLine } from '@nivo/line';
import { fetchProductReports } from '../../../api/products';

const PrriceFluctuation = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedProduct) {
      const fetch_product_report = async () => {
        const report_data = await fetchProductReports(selectedProduct.idProducto);

        setData([report_data]);
      };

      fetch_product_report();
    } else if (!selectedProduct) {
      setData([]);
    }
  }, [selectedProduct]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h2>Fluctuación de precio de compra</h2>
      </div>
      <div className='card-body'></div>
      <ProductSearch onSelect={setSelectedProduct} />
      {data.length > 0 && (
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        </div>
      )}
    </div>
  );
};

export default PrriceFluctuation;
