import { useState, useEffect } from 'react';
import { fetchMonthlyAverage } from 'api/clients';
import ClientSearch from 'components/ClientSearch';
import { ResponsiveLine } from '@nivo/line';

const MonthlyAverageClient = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setLoading(true);
      fetchMonthlyAverage(selectedClient.IdCliente).then((response) => {
        setData([response]);
        setLoading(false);
      });
    } else {
      setData([]);
    }
  }, [selectedClient]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Promedio mensual</h3>
      </div>
      <div className='card-body'>
        <ClientSearch onSelect={setSelectedClient} />
        {data && (
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
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        )}
        {loading && (
          <div className='position-absolute top-50 start-50 translate-middle'>
            <span className='spinner-border spinner-border-md' role='status' aria-hidden='true' />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyAverageClient;
