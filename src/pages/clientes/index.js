import { useContext, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
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
  const [activeView, setActiveView] = useState('clients');

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
    <Container fluid className='clientes-layout'>
      <div className='row clientes-row'>
        <div className='col-12 col-md-3 col-lg-2 clients-sidebar mb-3 mb-md-0'>
          <Nav variant='pills' className='flex-row flex-md-column' activeKey={activeView} onSelect={setActiveView}>
            <Nav.Item>
              <Nav.Link eventKey='clients'>Clientes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='reports'>Reportes</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className='col-12 col-md-9 col-lg-10 clientes-content'>
          <div className={activeView === 'clients' ? '' : 'd-none'}>
            <div className='clients-content-wrapper'>
              <ClientsTable onRowSelect={handleRowSelect} />
            </div>
          </div>
          <section className={activeView === 'reports' ? 'd-flex flex-column gap-3' : 'd-none'}>
            <div className='clients-content-wrapper d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3'>
              <h4 className='m-0 text-light'>Reportes de clientes</h4>
              <DatePicker onSubmit={onSubmit} loading={loading} />
            </div>
            <div className='clients-content-wrapper'>
              <div className='row justify-content-center g-3'>
                <div className='col-12 col-lg-6'>
                  <ClientReportCard
                    data={data.filtered_best_clients.length > 0 ? data.filtered_best_clients : data.best_clients}
                    onFilter={onFilter}
                    loading={loading}
                  />
                </div>
                <div className='col-12 col-lg-6'>
                  <ClientPerProductCard dateRange={dateRange} />
                </div>
              </div>
              <div className='row justify-content-center g-3 mt-0'>
                <div className='col-12 col-lg-6'>
                  <MonthlyAverageClientCard />
                </div>
              </div>
            </div>
          </section>
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
