import { useEffect } from 'react';
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
  multiSelect = false,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, state } = useTable(
    {
      columns,
      data,
    },
    useRowSelect
  );

  const onFilterDebounced = debounce((value) => {
    onFilter(value);
  }, 500);

  useEffect(() => {
    if (multiSelect) {
      const selectedRows = rows.filter((row) => row.isSelected);
      onRowSelect(selectedRows.map((row) => row.original));
    } else {
      onRowSelect && onRowSelect(rows.find((row) => row.isSelected)?.original);
    }
  }, [state, multiSelect, onRowSelect]);

  const MemoizedRow = React.memo(
    ({ row }) => {
      return (
        <tr
          {...row.getRowProps({
            onClick: onRowSelect
              ? (e) => {
                  const lastSelectedRowIndex = Object.keys(state.selectedRowIds)[
                    Object.keys(state.selectedRowIds).length - 1
                  ];
                  const newSelectedRowIndex = row.index;

                  if (e.ctrlKey && !e.shiftKey) {
                    row.toggleRowSelected();
                  } else if (e.shiftKey && !e.ctrlKey) {
                    if (multiSelect) {
                      if (newSelectedRowIndex >= lastSelectedRowIndex) {
                        for (let i = lastSelectedRowIndex; i <= newSelectedRowIndex; i++) {
                          if (i !== lastSelectedRowIndex) {
                            rows[i].toggleRowSelected();
                          }
                        }
                      } else {
                        for (let i = lastSelectedRowIndex; i >= newSelectedRowIndex; i--) {
                          if (i !== lastSelectedRowIndex) {
                            rows[i].toggleRowSelected();
                          }
                        }
                      }
                    }
                  } else {
                    if (row.isSelected) {
                      row.toggleRowSelected();
                    } else {
                      state.selectedRowIds = {};
                      row.toggleRowSelected();
                    }
                  }
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
