import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import ClientReportCard from 'components/Cards/ClientReport';
import ClientPerProductCard from 'components/ClientPerProduct/Card';
import MonthlyAverageClientCard from 'components/MonthlyAverageClient/Card';
import DatePicker from 'components/DatePicker';
import { fetchBestClients } from 'api/clients';
import { DateTime } from 'luxon';
import debounce from 'lodash.debounce';

const ClientesPage = () => {
  const [data, setData] = useState({
    filtered_best_clients: [],
    best_clients: [],
    group_sales_chart: [],
  });
  const [dateRange, setDateRange] = useState({
    from: DateTime.now().toISODate(),
    to: DateTime.now().toISODate(),
  });
  const [loading, setLoading] = useState(false);

  const onFilter = debounce((searchTerm) => {
    const filteredData = data.best_clients.filter((f) => f.client.toLowerCase().includes(searchTerm.toLowerCase()));
    setData({ ...data, filtered_best_clients: filteredData });
  }, 500);

  const onSubmit = async (event, dateRange) => {
    event.preventDefault();

    setLoading(true);
    const response = await fetchBestClients(dateRange);
    setDateRange(dateRange);
    setData({ ...data, best_clients: response });
    setLoading(false);
  };

  return (
    <Container fluid>
      <DatePicker onSubmit={onSubmit} loading={loading} />
      <div className='d-flex flex-column flex-xl-row justify-content-center gap-3'>
        <div className='col-12 col-xl-4'>
          <ClientReportCard
            data={data.filtered_best_clients.length > 0 ? data.filtered_best_clients : data.best_clients}
            onFilter={onFilter}
            loading={loading}
          />
        </div>
        <div className='col-12 col-xl-4'>
          <ClientPerProductCard dateRange={dateRange} />
        </div>
        <div className='col-12 col-xl-4'>
          <MonthlyAverageClientCard />
        </div>
      </div>
    </Container>
  );
};

export default ClientesPage;
