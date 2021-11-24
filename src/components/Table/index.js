import { useTable, useRowSelect } from "react-table";

import debounce from "lodash.debounce";

const Table = ({
  data = [],
  loading,
  columns = [],
  filterPlaceholder,
  onFilter,
  maxheight,
  showFooter = false,
  onRowSelect,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, selectedFlatRows } = useTable(
    {
      columns,
      data,
      stateReducer: (newState, action) => {
        if (action.type === "toggleRowSelected") {
          newState.selectedRowIds = {
            [action.id]: !action.isSelected,
          };
        }

        return newState;
      },
    },
    useRowSelect
  );

  const onFilterDebounced = debounce((value) => {
    onFilter(value);
  }, 500);

  return (
    <>
      {onFilter && (
        <div className="table-filter-container">
          <input
            className="table-filter-input"
            onChange={(event) => onFilterDebounced(event.target.value)}
            placeholder={filterPlaceholder}
            autoFocus
          />
        </div>
      )}
      <div className="table-container" maxheight={maxheight}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps({
                    onClick: onRowSelect
                      ? () => {
                          row.toggleRowSelected();
                          onRowSelect();
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
                          background: row.isSelected ? "lightgreen" : "white",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {showFooter && (
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>{column.render("Footer")}</td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      {loading && (
        <div className="loading-container" data={data.length ? 1 : 0}>
          Cargando...
        </div>
      )}
    </>
  );
};

export default Table;
