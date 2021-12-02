import React from 'react';
import { useTable, useRowSelect } from 'react-table';

import debounce from 'lodash.debounce';

const Table = ({
  data = [],
  loading,
  columns = [],
  filterPlaceholder,
  onFilter,
  maxHeight = 350,
  showFooter = false,
  onRowSelect,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, selectedFlatRows } = useTable(
    {
      columns,
      data,
    },
    useRowSelect
  );

  const onFilterDebounced = debounce((value) => {
    onFilter(value);
  }, 500);

  const MemoizedRow = React.memo(
    ({ row }) => {
      return (
        <tr
          {...row.getRowProps({
            onClick: onRowSelect
              ? () => {
                  row.toggleRowSelected();
                  onRowSelect(!row.isSelected ? row.original : null);
                }
              : null,
          })}
          {...row.getToggleRowSelectedProps({})}
        >
          {row.cells.map((cell, index) => {
            return (
              <td
                title={cell.value}
                {...cell.getCellProps()}
                style={{
                  background: row.isSelected ? 'lightblue' : 'white',
                  color: row.isSelected ? 'white' : 'black',
                }}
              >
                {cell.render('Cell')}
              </td>
            );
          })}
        </tr>
      );
    },
    [data]
  );

  return (
    <div>
      {onFilter && (
        <div className='table-filter-container'>
          <input
            className='table-filter-input'
            onChange={(event) => onFilterDebounced(event.target.value)}
            placeholder={filterPlaceholder}
            autoFocus
          />
        </div>
      )}
      <div className='table-container' style={{ maxHeight }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return <MemoizedRow row={row} />;
            })}
          </tbody>
          {showFooter && data.length > 0 && (
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
        {loading && (
          <div className='position-absolute top-50 start-50 translate-middle'>
            <span className='spinner-border spinner-border-md' role='status' aria-hidden='true' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
