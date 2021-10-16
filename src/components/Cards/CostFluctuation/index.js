import { useState, useEffect } from 'react';
import ProductSearch from '../../ProductSearch';
import { ResponsiveLine } from '@nivo/line';
import { fetchProductReports } from '../../../api/products';

const CostFluctuation = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedProduct) {
      const fetch_product_report = async () => {
        const report_data = await fetchProductReports(selectedProduct.idProducto);
        console.log(report_data);

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
        <h2>Promedio mensual costo</h2>
      </div>
      <div className='card-body'></div>
      <ProductSearch onSelect={setSelectedProduct} />
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
    </div>
  );
};

export default CostFluctuation;
