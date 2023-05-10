import { useMemo } from "react";
import {
  usePagination,
  useTable,
  useSortBy,
  useGlobalFilter,
} from "react-table";

function TablaCursos({ excel, customHeader }) {
  const data = useMemo(() => excel, [excel]);

  const columns = useMemo(() => {
    return customHeader.map((header) => {
      return {
        Header: header,
        accessor: header,
      };
    });
  }, [customHeader]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const totalPages = data ? Math.ceil(data.length / 10) : 0;
  const pageNumbers = getPageNumbers(totalPages, pageIndex + 1);

  return (
    <div>
      <div className=" d-flex flex-column align-items-center">
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Filtral</label>
          <div className="col-sm-10">
            <input
              type="text"
              value={globalFilter || ""}
              className="form-control"
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar..."
            />
          </div>
        </div>
        <ul className="pagination">
          <li className={`page-item ${!canPreviousPage ? "disabled" : ""}`}>
            <a className="page-link" onClick={() => previousPage()}>
              Previous
            </a>
          </li>
          {pageNumbers.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${
                pageNumber === pageIndex + 1 ? "active" : ""
              }`}
            >
              <a
                className="page-link"
                onClick={() => {
                  const pageIndex = pageNumber - 1;
                  gotoPage(pageIndex);
                }}
              >
                {pageNumber}
              </a>
            </li>
          ))}
          <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </li>
        </ul>
      </div>

      <table
        className="table text-white table-hover table-responsive"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getPageNumbers(totalPages, currentPage) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (pageNumbers.length <= 5) {
    return pageNumbers;
  }

  const startPage = Math.max(currentPage - 2, 2);
  const endPage = Math.min(currentPage + 2, pageNumbers.length - 1);

  let pages = [1];

  if (startPage > 2) {
    pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < pageNumbers.length - 1) {
    pages.push("...");
  }

  pages.push(pageNumbers.length);

  return pages;
}

export default TablaCursos;
