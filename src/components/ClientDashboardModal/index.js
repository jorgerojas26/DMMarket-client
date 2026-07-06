import { useState, useEffect, useContext } from 'react';
import { Modal, Card, Spinner } from 'react-bootstrap';
import { DateTime } from 'luxon';
import DateRangePicker from 'components/DateRangePicker';
import { fetchClientSales, fetchClientSummary } from 'api/clients';
import { ShowNoeContext } from 'context/show_noe';

const LIMIT = 20;

const ClientDashboardModal = ({ show, onClose, client }) => {
  const { showNoe } = useContext(ShowNoeContext);

  const today = DateTime.now().toISODate();
  const oneYearAgo = DateTime.now().minus({ years: 1 }).toISODate();

  const [dateRange, setDateRange] = useState({ from: oneYearAgo, to: today });
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalCount: 0,
    avgTicket: null,
    avgDaysBetweenSales: null,
  });
  const [salesData, setSalesData] = useState({ data: [], total: 0 });
  const [salesPage, setSalesPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setDateRange({ from: oneYearAgo, to: today });
      setSalesPage(1);
      setSummary({ totalAmount: 0, totalCount: 0, avgTicket: null, avgDaysBetweenSales: null });
      setSalesData({ data: [], total: 0 });
    }
  }, [show]);

  // Fetch summary
  useEffect(() => {
    if (!show || !client?.IdCliente) return;

    const doFetch = async () => {
      setLoading(true);
      try {
        const result = await fetchClientSummary(client.IdCliente, {
          from: dateRange.from,
          to: dateRange.to,
          showNoe,
        });
        setSummary({
          totalAmount: result.totalAmount ?? 0,
          totalCount: result.totalCount ?? 0,
          avgTicket: result.avgTicket ?? null,
          avgDaysBetweenSales: result.avgDaysBetweenSales ?? null,
        });
      } catch (err) {
        console.error('Failed to fetch client summary:', err);
        setSummary({ totalAmount: 0, totalCount: 0, avgTicket: null, avgDaysBetweenSales: null });
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, [show, client?.IdCliente, dateRange, showNoe]);

  // Fetch sales (paginated)
  useEffect(() => {
    if (!show || !client?.IdCliente) return;

    const doFetch = async () => {
      setSalesLoading(true);
      try {
        const result = await fetchClientSales(client.IdCliente, {
          from: dateRange.from,
          to: dateRange.to,
          page: salesPage,
          limit: LIMIT,
          showNoe,
        });
        setSalesData({
          data: result.data || [],
          total: result.total || 0,
        });
      } catch (err) {
        console.error('Failed to fetch client sales:', err);
        setSalesData({ data: [], total: 0 });
      } finally {
        setSalesLoading(false);
      }
    };

    doFetch();
  }, [show, client?.IdCliente, dateRange, salesPage, showNoe]);

  const handleDateRangeChange = ({ from, to }) => {
    setDateRange({ from, to });
    setSalesPage(1);
  };

  const totalPages = Math.ceil(salesData.total / LIMIT);

  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Modal show={show} size='lg' onHide={onClose} backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>Dashboard: {client?.Empresa}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <DateRangePicker
            key={client?.IdCliente || 'picker'}
            initialFrom={oneYearAgo}
            initialTo={today}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className='d-flex flex-wrap gap-2 mb-3'>
          <Card bg='dark' text='light' className='flex-fill' style={{ minWidth: 120 }}>
            <Card.Body className='text-center p-2'>
              <div className='small'>Total Ventas</div>
              <div className='fs-5'>
                {loading ? <Spinner animation='border' size='sm' /> : formatCurrency(summary.totalAmount)}
              </div>
            </Card.Body>
          </Card>
          <Card bg='dark' text='light' className='flex-fill' style={{ minWidth: 120 }}>
            <Card.Body className='text-center p-2'>
              <div className='small'># Ventas</div>
              <div className='fs-5'>
                {loading ? <Spinner animation='border' size='sm' /> : String(summary.totalCount || '0')}
              </div>
            </Card.Body>
          </Card>
          <Card bg='dark' text='light' className='flex-fill' style={{ minWidth: 120 }}>
            <Card.Body className='text-center p-2'>
              <div className='small'>Promedio Ticket</div>
              <div className='fs-5'>
                {loading ? (
                  <Spinner animation='border' size='sm' />
                ) : summary.avgTicket !== null ? (
                  formatCurrency(summary.avgTicket)
                ) : (
                  'N/A'
                )}
              </div>
            </Card.Body>
          </Card>
          <Card bg='dark' text='light' className='flex-fill' style={{ minWidth: 120 }}>
            <Card.Body className='text-center p-2'>
              <div className='small'>Promedio Días</div>
              <div className='fs-5'>
                {loading ? (
                  <Spinner animation='border' size='sm' />
                ) : summary.avgDaysBetweenSales !== null ? (
                  `${summary.avgDaysBetweenSales} días`
                ) : (
                  'N/A'
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='card'>
          <div className='card-header'>
            <h5 className='mb-0'>Ventas</h5>
          </div>
          <div className='card-body' style={{ position: 'relative', minHeight: 150 }}>
            <div className='table-container' style={{ maxHeight: 300, overflow: 'auto' }}>
              <table className='table table-sm mb-0'>
                <thead>
                  <tr>
                    <th>Vendedor</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.data.length > 0 ? (
                      salesData.data.map((sale, index) => (
                      <tr key={index}>
                        <td>{sale.vendedor}</td>
                        <td>{DateTime.fromISO(sale.fecha).toISODate()}</td>
                        <td>{formatCurrency(sale.monto)}</td>
                      </tr>
                    ))
                  ) : (
                    !salesLoading && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                          Sin ventas
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            {salesLoading && (
              <div
                className='d-flex justify-content-center align-items-center'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                <Spinner animation='border' variant='dark' />
              </div>
            )}
            {totalPages > 1 && (
              <div className='d-flex justify-content-center align-items-center gap-3 p-2 border-top'>
                <button
                  className='btn btn-sm btn-outline-secondary'
                  disabled={salesPage <= 1}
                  onClick={() => setSalesPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span>
                  Página {salesPage} de {totalPages}
                </span>
                <button
                  className='btn btn-sm btn-outline-secondary'
                  disabled={salesPage >= totalPages}
                  onClick={() => setSalesPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClientDashboardModal;
