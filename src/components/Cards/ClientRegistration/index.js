import ClientReportTable from 'components/ClientReportTable';

const ClientRegistration = ({ data = [], onFilter = () => {} }) => {
    return (
        <div className='card'>
            <div className='card-header'>
                <h2>Nuevos clientes</h2>
            </div>
            <div className='card-body'>
                {data.length > 0 && (
                    <>
                        <input
                            className='input-filter'
                            placeholder='Buscar...'
                            type='search'
                            onChange={(event) => onFilter(event.target.value, 'client_report', 'client')}
                        />
                        <ClientReportTable data={data} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientRegistration;
