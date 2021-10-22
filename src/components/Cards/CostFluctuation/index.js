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
        const report_data = await fetchProductReports(selectedProduct.IdProducto);
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
      <div className='card-body'>
        <ProductSearch onSelect={setSelectedProduct} />
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 30, bottom: 80, left: 40 }}
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
