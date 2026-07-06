import Nav from 'react-bootstrap/Nav';
import ProviderReportTable from '../ProviderReportTable';

const ProviderReportCard = ({ loading, data = [], onFilter, mode, onModeChange }) => {
  return (
    <div className='card h-100'>
      <div className='card-header d-flex flex-column gap-2'>
        <h3 className='m-0'>Mejores Proveedores</h3>
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
      <div className='card-body'>
        {data.length > 0 && (
          <>
            <input
              className='input-filter'
              placeholder='Buscar...'
              type='search'
              onChange={(event) => onFilter(event.target.value)}
            />
            <ProviderReportTable data={data} loading={loading} />
          </>
        )}
        {!loading && data.length === 0 && (
          <p className='text-center text-muted my-4'>Sin datos</p>
        )}
        {loading && (
          <div className='text-center my-4'>
            <span className='spinner-border spinner-border-md' role='status' />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderReportCard;
