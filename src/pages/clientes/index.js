import { useContext, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import ClientReportCard from 'components/Cards/ClientReport';
import ClientPerProductCard from 'components/ClientPerProduct/Card';
import MonthlyAverageClientCard from 'components/MonthlyAverageClient/Card';
import ClientsTable from 'components/ClientsTable';
import ClientDashboardModal from 'components/ClientDashboardModal';
import DatePicker from 'components/DatePicker';
import { fetchBestClients } from 'api/clients';
import { DateTime } from 'luxon';
import debounce from 'lodash.debounce';
import { ShowNoeContext } from 'context/show_noe';

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
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { showNoe } = useContext(ShowNoeContext);

  const onFilter = debounce((searchTerm) => {
    const filteredData = data.best_clients.filter((f) => f.client.toLowerCase().includes(searchTerm.toLowerCase()));
    setData({ ...data, filtered_best_clients: filteredData });
  }, 500);

  const onSubmit = async (event, dateRange) => {
    event.preventDefault();

    setLoading(true);
    const response = await fetchBestClients(dateRange, showNoe);
    setDateRange(dateRange);
    setData({ ...data, best_clients: response });
    setLoading(false);
  };

  const handleRowSelect = useCallback((client) => {
    setSelectedClient(client);
    setShowModal(true);
  }, []);

  return (
    <Container fluid>
      <DatePicker onSubmit={onSubmit} loading={loading} />
      <div className='row'>
        <div className='col-12 col-xl-8 mb-3 mb-xl-0'>
          <ClientsTable onRowSelect={handleRowSelect} />
        </div>
        <div className='col-12 col-xl-4 d-flex flex-column gap-3'>
          <ClientReportCard
            data={data.filtered_best_clients.length > 0 ? data.filtered_best_clients : data.best_clients}
            onFilter={onFilter}
            loading={loading}
          />
          <ClientPerProductCard dateRange={dateRange} />
          <MonthlyAverageClientCard />
        </div>
      </div>
      <ClientDashboardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        client={selectedClient}
      />
    </Container>
  );
};

export default ClientesPage;
