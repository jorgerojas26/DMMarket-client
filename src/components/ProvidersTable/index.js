import { useState, useEffect, useContext, useCallback } from 'react';
import { ShowNoeContext } from 'context/show_noe';
import { fetchProvidersList } from 'api/providers';
import './styles.css';

const LIMIT = 20;

const ProvidersTable = ({ onRowSelect }) => {
  const { showNoe } = useContext(ShowNoeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  // Debounce searchInput -> search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchProvidersList({ search, page, limit: LIMIT, showNoe });
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error(err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, page, showNoe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleRowClick = (provider) => {
    setSelectedId(provider.IdProveedor);
    if (onRowSelect) onRowSelect(provider);
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return `$${num.toFixed(2)}`;
  };

  return (
    <section className='providers-table-panel'>
      <header className='providers-table__header'>
        <h3>Proveedores</h3>
        <div className='providers-table__search'>
          <svg
            className='providers-table__search-icon'
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
            className='providers-table__input'
            placeholder='Buscar por empresa...'
            type='search'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </header>
      <div className='providers-table__body'>
        <div className='providers-table__scroll'>
          <table className='providers-table'>
            <thead>
              <tr>
                <th>IdProveedor</th>
                <th>Empresa</th>
                <th>Total Compras</th>
                <th># Compras</th>
                <th>Total Ventas</th>
                <th># Ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((provider) => (
                  <tr
                    key={provider.IdProveedor}
                    className={
                      selectedId === provider.IdProveedor
                        ? 'providers-table__row--selected'
                        : undefined
                    }
                    onClick={() => handleRowClick(provider)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{provider.IdProveedor}</td>
                    <td>{provider.Empresa}</td>
                    <td>{formatCurrency(provider.total_compras)}</td>
                    <td>{provider.num_compras}</td>
                    <td>{formatCurrency(provider.total_ventas)}</td>
                    <td>{provider.num_ventas}</td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan={6} className='providers-table__empty'>
                      Sin datos
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className='providers-table__loader'>
            <span className='spinner-border spinner-border-md' role='status' />
          </div>
        )}
        {totalPages > 1 && (
          <div className='providers-table__footer'>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvidersTable;
