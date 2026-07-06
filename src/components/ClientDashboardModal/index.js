import { useState, useEffect, useContext, useMemo } from 'react';
import { Modal, Spinner, Badge } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { ResponsiveLine } from '@nivo/line';
import DateRangePicker from 'components/DateRangePicker';
import { fetchClientSales, fetchClientSummary } from 'api/clients';
import { ShowNoeContext } from 'context/show_noe';
import './styles.css';

const LIMIT = 20;
const CHART_LIMIT = 1000;

const IconSales = () => (
  <svg width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
    <line x1='3' y1='6' x2='21' y2='6' />
    <path d='M16 10a4 4 0 0 1-8 0' />
  </svg>
);

const IconHash = () => (
  <svg width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <line x1='4' y1='9' x2='20' y2='9' />
    <line x1='4' y1='15' x2='20' y2='15' />
    <line x1='10' y1='3' x2='8' y2='21' />
    <line x1='16' y1='3' x2='14' y2='21' />
  </svg>
);

const IconTicket = () => (
  <svg width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9' />
    <path d='M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2' />
    <line x1='12' y1='2' x2='12' y2='22' />
  </svg>
);

const IconCalendar = () => (
  <svg width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
    <line x1='16' y1='2' x2='16' y2='6' />
    <line x1='8' y1='2' x2='8' y2='6' />
    <line x1='3' y1='10' x2='21' y2='10' />
  </svg>
);

const StatCard = ({ label, value, variant, icon: Icon, loading }) => (
  <div className={`stat-card ${variant}`}>
    <div className='stat-icon'>
      <Icon />
    </div>
    <div className='stat-label'>{label}</div>
    <div className='stat-value'>
      {loading ? <Spinner animation='border' size='sm' /> : value}
    </div>
  </div>
);

const aggregateSalesByMonth = (sales) => {
  const buckets = new Map();
  sales.forEach((sale) => {
    const month = DateTime.fromISO(sale.fecha).toFormat('yyyy-MM');
    buckets.set(month, (buckets.get(month) || 0) + Number(sale.monto));
  });
  return Array.from(buckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, amount]) => ({
      x: DateTime.fromISO(`${month}-01`).toFormat('MMM yyyy', { locale: 'es' }),
      y: Number(amount.toFixed(2)),
    }));
};

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
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartTooltip, setChartTooltip] = useState({ visible: false, x: 0, y: 0, point: null });

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setDateRange({ from: oneYearAgo, to: today });
      setSalesPage(1);
      setSummary({ totalAmount: 0, totalCount: 0, avgTicket: null, avgDaysBetweenSales: null });
      setSalesData({ data: [], total: 0 });
      setChartData([]);
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

  // Fetch sales for trend chart
  useEffect(() => {
    if (!show || !client?.IdCliente || !summary.totalCount) {
      setChartData([]);
      return;
    }

    const doFetch = async () => {
      setChartLoading(true);
      try {
        const limit = Math.min(summary.totalCount, CHART_LIMIT);
        const result = await fetchClientSales(client.IdCliente, {
          from: dateRange.from,
          to: dateRange.to,
          page: 1,
          limit,
          showNoe,
        });
        const aggregated = aggregateSalesByMonth(result.data || []);
        setChartData([{ id: 'Ventas', data: aggregated }]);
      } catch (err) {
        console.error('Failed to fetch chart sales:', err);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    doFetch();
  }, [show, client?.IdCliente, dateRange, showNoe, summary.totalCount]);

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

  const stats = useMemo(
    () => [
      {
        label: 'Total Ventas',
        value: formatCurrency(summary.totalAmount),
        variant: 'primary',
        icon: IconSales,
      },
      {
        label: '# Ventas',
        value: String(summary.totalCount || '0'),
        variant: 'success',
        icon: IconHash,
      },
      {
        label: 'Promedio Ticket',
        value: summary.avgTicket !== null ? formatCurrency(summary.avgTicket) : 'N/A',
        variant: 'info',
        icon: IconTicket,
      },
      {
        label: 'Promedio Días',
        value: summary.avgDaysBetweenSales !== null ? `${summary.avgDaysBetweenSales} días` : 'N/A',
        variant: 'warning',
        icon: IconCalendar,
      },
    ],
    [summary]
  );

  const nivoTheme = {
    axis: {
      ticks: { text: { fill: '#adb5bd', fontSize: 11 }, line: { stroke: '#2f3338' } },
      domain: { line: { stroke: '#2f3338' } },
    },
    grid: { line: { stroke: '#2f3338', strokeDasharray: '4 4' } },
    crosshair: { line: { stroke: '#0d6efd', strokeWidth: 1, strokeOpacity: 0.5 } },
    tooltip: {
      background: '#1a1d21',
      color: '#e9ecef',
      border: '1px solid #2f3338',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      fontSize: '13px',
      container: {
        background: '#1a1d21',
        color: '#e9ecef',
        border: '1px solid #2f3338',
        borderRadius: '8px',
        fontSize: '13px',
      },
    },
  };

  const avatarLetter = client?.Empresa ? client.Empresa.charAt(0).toUpperCase() : 'C';

  const hasChartData = chartData.length > 0 && chartData[0].data.length > 0;

  const chartBlock = (
    <div className='chart-card'>
      <div className='chart-title'>Tendencia de ventas por mes</div>
      <div className='chart-wrapper'>
        {chartLoading ? (
          <div className='d-flex justify-content-center align-items-center h-100'>
            <Spinner animation='border' variant='primary' size='sm' />
          </div>
        ) : hasChartData ? (
          <ResponsiveLine
            data={chartData}
            theme={nivoTheme}
            margin={{ top: 10, right: 20, bottom: 35, left: 55 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            curve='monotoneX'
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -25,
              legend: '',
              legendOffset: 36,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: -40,
              format: (v) => `$${Number(v).toLocaleString('en-US')}`,
            }}
            enableGridX={false}
            colors={['#0d6efd']}
            lineWidth={3}
            pointSize={6}
            pointColor='#0d6efd'
            pointBorderWidth={2}
            pointBorderColor='#1a1d21'
            pointLabelYOffset={-12}
            useMesh
            enableArea
            areaOpacity={0.15}
            onMouseMove={(point, event) => {
              if (point) {
                setChartTooltip({ visible: true, x: event.clientX, y: event.clientY, point });
              } else {
                setChartTooltip((prev) => ({ ...prev, visible: false }));
              }
            }}
            onMouseLeave={() => setChartTooltip((prev) => ({ ...prev, visible: false }))}
          />
        ) : (
          <div className='chart-empty'>
            <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M3 3v18h18' />
              <path d='M18 17V9' />
              <path d='M13 17V5' />
              <path d='M8 17v-3' />
            </svg>
            <span>Sin datos para el período</span>
          </div>
        )}
      </div>
      {chartTooltip.visible && chartTooltip.point && (
        <div
          style={{
            position: 'fixed',
            left: chartTooltip.x + 12,
            top: chartTooltip.y - 70,
            zIndex: 9999,
            pointerEvents: 'none',
            background: '#1a1d21',
            color: '#e9ecef',
            border: '1px solid #2f3338',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            padding: '8px 10px',
            minWidth: 140,
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginBottom: 4, textTransform: 'capitalize' }}>
            {chartTooltip.point.data.x}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#20c997' }}>
            {formatCurrency(chartTooltip.point.data.y)}
          </div>
        </div>
      )}
    </div>
  );

  const salesBlock = (
    <div className='sales-card'>
      <div className='card-header'>
        <h5>Ventas</h5>
        <Badge bg='secondary' pill>
          {salesData.total} registros
        </Badge>
      </div>
      <div className='card-body'>
        <div className='table-container'>
          <table className='table'>
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th className='text-end'>Monto</th>
              </tr>
            </thead>
            <tbody>
              {salesData.data.length > 0 ? (
                salesData.data.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.vendedor}</td>
                    <td>{DateTime.fromISO(sale.fecha).toFormat('dd MMM yyyy', { locale: 'es' })}</td>
                    <td className='text-end amount'>{formatCurrency(sale.monto)}</td>
                  </tr>
                ))
              ) : (
                !salesLoading && (
                  <tr>
                    <td colSpan={3}>
                      <div className='empty-state'>
                        <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' />
                          <polyline points='13 2 13 9 20 9' />
                        </svg>
                        <span>Sin ventas en este período</span>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {salesLoading && (
          <div className='loading-overlay'>
            <Spinner animation='border' variant='light' />
          </div>
        )}
        {totalPages > 1 && (
          <div className='pagination-bar'>
            <button
              className='btn btn-sm btn-outline-light'
              disabled={salesPage <= 1}
              onClick={() => setSalesPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {salesPage} de {totalPages}
            </span>
            <button
              className='btn btn-sm btn-outline-light'
              disabled={salesPage >= totalPages}
              onClick={() => setSalesPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal show={show} size='xl' onHide={onClose} backdrop='static' scrollable className='client-dashboard-modal'>
      <Modal.Header closeButton>
        <div className='d-flex align-items-center gap-3'>
          <div className='client-avatar'>{avatarLetter}</div>
          <div>
            <Modal.Title>{client?.Empresa}</Modal.Title>
            <div className='modal-subtitle'>Cliente #{client?.IdCliente}</div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className='date-picker-card'>
          <div className='date-picker-label'>Rango de fechas</div>
          <DateRangePicker
            key={client?.IdCliente || 'picker'}
            initialFrom={oneYearAgo}
            initialTo={today}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className='stats-row'>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} loading={loading} />
          ))}
        </div>

        <div className='dashboard-grid'>
          {chartBlock}
          {salesBlock}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClientDashboardModal;
