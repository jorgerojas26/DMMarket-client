import { useState, useEffect, useContext, useCallback } from 'react';
import { ShowNoeContext } from 'context/show_noe';
import { fetchClientsList } from 'api/clients';

const LIMIT = 20;

const ClientsTable = ({ onRowSelect }) => {
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
      const result = await fetchClientsList({ search, page, limit: LIMIT, showNoe });
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

  const handleRowClick = (client) => {
    setSelectedId(client.IdCliente);
    if (onRowSelect) onRowSelect(client);
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Clientes</h3>
        <input
          className='input-filter'
          placeholder='Buscar por empresa...'
          type='search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className='card-body' style={{ position: 'relative', height: 'auto', minHeight: 200 }}>
        <div className='table-container' style={{ maxHeight: 350, overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>IdCliente</th>
                <th>Empresa</th>
                <th>Total Ventas</th>
                <th># Ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((client) => (
                  <tr
                    key={client.IdCliente}
                    onClick={() => handleRowClick(client)}
                    style={{
                      cursor: 'pointer',
                      background: selectedId === client.IdCliente ? 'lightblue' : undefined,
                    }}
                  >
                    <td>{client.IdCliente}</td>
                    <td>{client.Empresa}</td>
                    <td>{formatCurrency(client.total_ventas)}</td>
                    <td>{client.num_ventas}</td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                      Sin datos
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {loading && (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)' }}
          >
            <span className='spinner-border spinner-border-md' role='status' aria-hidden='true' />
          </div>
        )}
        {totalPages > 1 && (
          <div className='d-flex justify-content-center align-items-center gap-3 p-2 border-top'>
            <button
              className='btn btn-sm btn-outline-secondary'
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              className='btn btn-sm btn-outline-secondary'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
