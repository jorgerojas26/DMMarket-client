import { useState, useEffect } from 'react';
import ProductSearch from 'components/ProductSearch';
import { ResponsiveLine } from '@nivo/line';
import { fetchCostFluctuation } from 'api/products';

const CostFluctuation = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      const fetch_product_report = async () => {
        setLoading(true);
        const report_data = await fetchCostFluctuation(selectedProduct.IdProducto);
        if (Object.keys(report_data).length > 0) {
          setData([report_data]);
        }
        setLoading(false);
      };

      fetch_product_report();
    } else if (!selectedProduct) {
      setData([]);
    }
  }, [selectedProduct]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Promedio mensual costo</h3>
      </div>
      <div className='card-body'>
        <ProductSearch onSelect={setSelectedProduct} />
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 30, bottom: 80, left: 40 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            legend: 'Precio',
            legendPosition: 'middle',
            legendOffset: -30,
          }}
          axisBottom={{
            legend: 'Meses',
            legendPosition: 'middle',
            legendOffset: 30,
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
        />
      </div>
      {loading && (
        <div className='position-absolute top-50 start-50 translate-middle'>
          <span className='spinner-border spinner-border-md' role='status' aria-hidden='true' />
        </div>
      )}
    </div>
  );
};

export default CostFluctuation;
