import SaleReportTable from '../../SaleReportTable';

const SaleReportCard = ({ data = [], onFilter }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h2>Ventas</h2>
      </div>
      <div className='card-body'>
        {data.length > 0 && (
          <>
            <input
              className='input-filter'
              placeholder='Buscar...'
              type='search'
              onChange={(event) => onFilter(event.target.value, 'sale_report', 'product')}
            />
            <SaleReportTable data={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReportCard;
