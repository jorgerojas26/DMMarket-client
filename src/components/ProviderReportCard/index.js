import Nav from 'react-bootstrap/Nav';
import ProviderReportTable from '../ProviderReportTable';
import './styles.css';

const ProviderReportCard = ({ loading, data = [], onFilter, mode, onModeChange }) => {
  return (
    <section className='provider-report'>
      <header className='provider-report__header'>
        <div className='provider-report__title'>
          <h3>Mejores Proveedores</h3>
          <Nav
            variant='pills'
            className='flex-row'
            activeKey={mode}
            onSelect={onModeChange}
          >
            <Nav.Item>
              <Nav.Link eventKey='ventas'>Ventas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='compras'>Compras</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        {data.length > 0 && (
          <div className='provider-report__search'>
            <svg
              className='provider-report__search-icon'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <input
              className='provider-report__input'
              placeholder='Buscar...'
              type='search'
              onChange={(event) => onFilter(event.target.value)}
            />
          </div>
        )}
      </header>
      <div className='provider-report__body'>
        {data.length > 0 && <ProviderReportTable data={data} loading={loading} />}
        {!loading && data.length === 0 && (
          <p className='provider-report__empty'>Sin datos</p>
        )}
        {loading && (
          <div className='provider-report__loader'>
            <span className='spinner-border spinner-border-md' role='status' />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderReportCard;
