import { useMemo } from 'react';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

const ProviderReportTable = ({ data }) => {
  const maxMonto = useMemo(
    () => Math.max(...data.map((row) => row.monto || 0), 0),
    [data]
  );

  return (
    <ul className='provider-report__list'>
      {data.map((row, index) => {
        const percentage = maxMonto > 0 ? ((row.monto || 0) / maxMonto) * 100 : 0;
        const rankClass =
          index === 0
            ? 'provider-report__rank--1'
            : index === 1
            ? 'provider-report__rank--2'
            : index === 2
            ? 'provider-report__rank--3'
            : '';

        return (
          <li key={`${row.proveedor}-${index}`} className='provider-report__item'>
            <div className='provider-report__row'>
              <span className={`provider-report__rank ${rankClass}`}>
                {index + 1}
              </span>
              <div className='provider-report__info'>
                <span className='provider-report__name'>{row.proveedor}</span>
                <div className='provider-report__bar-bg'>
                  <div
                    className='provider-report__bar'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className='provider-report__amount'>
                {formatCurrency(row.monto)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ProviderReportTable;
