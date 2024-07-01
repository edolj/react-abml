import React from "react";
import Table from "react-bootstrap/Table";
import "../css/Corners.css";

function MainTable({ columns, data, onRowClick }) {
  const handleRowClick = (rowIndex: any) => {
    onRowClick(rowIndex);
  };

  return (
    <Table striped bordered hover className="rounded-table">
      <thead>
        <tr>
          {columns.map((column: any, columnIndex: number) => (
            <th key={columnIndex}>{column.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, rowIndex: number) => (
          <React.Fragment key={rowIndex}>
            <tr onClick={() => handleRowClick(rowIndex)}>
              {columns.map((column: any, columnIndex: number) => (
                <td key={columnIndex}>{row[column.accessor]}</td>
              ))}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default MainTable;
