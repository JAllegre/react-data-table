import React, { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import './ReactDataTable.less';
import { matchSearch } from './utils';

function __(s: string) {
  return s;
}

type ReactDataTableColumn = {
  title?: string;
  name: string;
  sortable?: boolean;
  visible?: boolean;
  searchable?: boolean;
  render?: (cellData: any, rowData: any) => ReactNode;
};

type ReactDataTableSelectFilter = {
  colName: string;
  options: { value: string | boolean; label: string }[];
};

type ReactDataTableOptions = {
  title?: string;
  paginationLength?: number;
  paginationMenu?: number[];
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
};

type ReactDataTableProps = {
  columns: ReactDataTableColumn[];
  data: any[];
  options: ReactDataTableOptions;
  selectFilters?: ReactDataTableSelectFilter[];
};

const ReactDataTable: React.FC<ReactDataTableProps> = ({
  columns,
  data,
  options,
  selectFilters = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(
    options.sortColumn || null
  );
  const [sortOrder, setSortOrder] = useState<
    ReactDataTableOptions['sortOrder']
  >(options.sortOrder || 'asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.paginationLength || 50);
  const [filters, setFilters] = useState<{ [key: string]: string | boolean }>(
    {}
  );

  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        const passFilters = Object.keys(filters).every(
          (key) =>
            filters[key] === '' ||
            row[key].toString() === filters[key].toString()
        );

        if (!passFilters) {
          return false;
        }

        if (!searchTerm) {
          return true;
        }

        return columns.some((col) =>
          col.searchable !== false
            ? matchSearch(searchTerm, String(row[col.name]))
            : false
        );
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, sortColumn, sortOrder, filters, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (colName: string) => {
    setSortOrder(
      sortColumn === colName && sortOrder === 'asc' ? 'desc' : 'asc'
    );
    setSortColumn(colName);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleFiltersChange =
    (filter: ReactDataTableSelectFilter) =>
    (e: ChangeEvent<HTMLSelectElement>) =>
      setFilters({ ...filters, [filter.colName]: e.target.value });

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    setPageSize(Number(e.target.value));
  };
  return (
    <div className="react-data-table panel panel-default">
      <div className="rdt-header panel-heading">
        {options.title && <h3>{options.title}</h3>}

        {selectFilters.map((filter) => (
          <div className="rdt-filter">
            <span className="material-symbols-outlined rdt-filter-icon">
              filter_alt
            </span>
            <select
              key={filter.colName}
              className="rdt-filter-select form-control"
              onChange={handleFiltersChange(filter)}
            >
              {filter.options.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <input
          className="rdt-search-input form-control"
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className="rdt-pagination-select form-control"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {options?.paginationMenu?.map((size) => (
            <option key={String(size)} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <table className="rdt-table panel-body">
        <thead className="rdt-table-head">
          <tr className="rdt-table-head-row">
            {columns.map(
              (col) =>
                col.visible !== false && (
                  <th
                    className="rdt-table-head-cell"
                    key={col.name}
                    onClick={() =>
                      col.sortable !== false && handleSort(col.name)
                    }
                  >
                    <span>{col.title || col.name} </span>
                    <span>
                      {sortColumn === col.name
                        ? sortOrder === 'asc'
                          ? '▲'
                          : '▼'
                        : ''}
                    </span>
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="rdt-table-body">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr className="rdt-table-body-row" key={rowIndex}>
                {columns.map(
                  (col) =>
                    col.visible !== false && (
                      <td key={col.name} className="rdt-table-body-cell">
                        {col.render
                          ? col.render(row[col.name], row)
                          : row[col.name] || '-'}
                      </td>
                    )
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                {__('Aucune donnée à afficher')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="rdt-footer panel-footer">
        <div className="rdt-pagination-nav">
          <button
            className="rdt-pagination-button btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="rdt-pagination-button btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(Math.ceil(filteredData.length / pageSize)).keys()].map(
            (num) => (
              <button
                className={`rdt-pagination-button btn  ${
                  currentPage === num + 1 ? 'active' : ''
                }`}
                key={num}
                onClick={() => setCurrentPage(num + 1)}
              >
                {num + 1}
              </button>
            )
          )}
          <button
            className="rdt-pagination-button btn"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(filteredData.length / pageSize))
              )
            }
            disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          >
            Next
          </button>
          <button
            className="rdt-pagination-button btn"
            onClick={() =>
              setCurrentPage(Math.ceil(filteredData.length / pageSize))
            }
            disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactDataTable;
