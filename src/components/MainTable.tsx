import React from "react";
import "../css/Corners.css";

interface Props {
  columns: any;
  data: any;
  onRowClick: (rowIndex: number) => void;
}

function MainTable({ columns, data, onRowClick }: Props) {
  const handleRowClick = (rowIndex: any) => {
    onRowClick(rowIndex);
  };

  return (
    <table className="rounded-table">
      <thead>
        <tr>
          {columns.map((column: any, columnIndex: number) => (
            <th
              key={columnIndex}
              className={columnIndex >= columns.length - 2 ? "center-text" : ""}
            >
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, rowIndex: number) => (
          <React.Fragment key={rowIndex}>
            <tr onClick={() => handleRowClick(rowIndex)}>
              {columns.map((column: any, columnIndex: number) => (
                <td
                  key={columnIndex}
                  className={
                    columnIndex >= columns.length - 2 ? "center-text" : ""
                  }
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default MainTable;
