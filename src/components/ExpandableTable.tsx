import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import downArrow from "../assets/down.png";
import upArrow from "../assets/up.png";

function ExpandableTable({ columns, data, detailData, onExpandedRowChange }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    const newExpandedRow = expandedRow === index ? null : index;
    setExpandedRow(newExpandedRow);
    onExpandedRowChange(newExpandedRow);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {columns.map((column, columnIndex) => (
            <th key={columnIndex}>{column.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr onClick={() => handleRowClick(rowIndex)}>
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{ textAlign: columnIndex === 2 ? "center" : "left" }}
                >
                  {columnIndex === 2 ? (
                    <img
                      src={expandedRow === rowIndex ? upArrow : downArrow}
                      alt="Arrow"
                    />
                  ) : (
                    row[column.accessor]
                  )}
                </td>
              ))}
            </tr>
            {expandedRow === rowIndex && (
              <tr>
                <td colSpan={columns.length}>
                  <div>
                    <p>Attributes:</p>
                    <ul>
                      {detailData[rowIndex].map((detail, index) => (
                        <li key={index}>
                          {detail[0]}: {detail[1]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default ExpandableTable;
