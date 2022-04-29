import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";

function getTable(instance, table): ReactNode {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = instance;

  // Render the UI for your tab0l

  return createPortal(
    <div style={{ position: "fixed", zIndex: -99, opacity: 0 }}>
      <table ref={table} {...getTableProps()}>
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
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>,
    document.body
  );
}
function reducer(state, _a, _b, instance) {
  console.log(state, "reducer");
  let table = React.createRef();
  return {
    ...state,
    mountRef(ref) {
      // createPortal(getTable(instance, ref));
      return getTable(instance, table);
    },
    getExportData: (option: { name: string; type: string }) => {
      console.log(table);
      const table_elt = table.current;
      const workbook = XLSX.utils.table_to_book(table_elt);
      const ws = workbook.Sheets["Sheet1"];
      XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toISOString()]], {
        origin: -1
      });
      XLSX.writeFile(workbook, `${option.name || Date.now()}.xlsx`);
    }
  };
}

export default function useExportData(hooks) {
  console.log(hooks, "useExportData");
  hooks.stateReducers.push(reducer);
}
