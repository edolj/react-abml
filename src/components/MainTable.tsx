import React, { useState } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { eurAttr, ratioAttr } from "./BoniteteAttributes";

interface Props {
  columns: any;
  data: any;
  onRowClick: (rowIndex: number) => void;
  expandData: [string, any][][];
  dNames: Record<string, string>;
}

function MainTable({ columns, data, onRowClick, expandData, dNames }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (rowIndex: number) => {
    const newSet = new Set(expandedRows);
    newSet.has(rowIndex) ? newSet.delete(rowIndex) : newSet.add(rowIndex);
    setExpandedRows(newSet);
  };

  const handleRowClick = (rowIndex: any) => {
    onRowClick(rowIndex);
  };

  const formatValue = (key: string, value: string | number) => {
    if (value === "" || value === undefined || value === null) return "-";

    if (eurAttr.includes(key)) {
      return (
        Number(value).toLocaleString("sl-SI", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) + " €"
      );
    }

    if (ratioAttr.includes(key)) {
      return (
        Number(value).toLocaleString("sl-SI", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " %"
      );
    }

    return value;
  };

  return (
    <table className="rounded-table">
      <thead>
        <tr>
          <th></th>
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
              <td style={{ width: "60px" }}>
                <button
                  className="expand-toggle-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRow(rowIndex);
                  }}
                >
                  {expandedRows.has(rowIndex) ? (
                    <MdOutlineExpandLess size="30" color="#1976d2" />
                  ) : (
                    <MdOutlineExpandMore size="30" color="#1976d2" />
                  )}
                </button>
              </td>

              {columns.map((column: any, columnIndex: number) => (
                <td
                  key={columnIndex}
                  style={{ cursor: "pointer" }}
                  className={
                    columnIndex >= columns.length - 2 ? "center-text" : ""
                  }
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>

            {expandedRows.has(rowIndex) && (
              <tr className="expanded-row">
                <td colSpan={columns.length + 1}>
                  <div className="expand-grid">
                    {expandData[rowIndex]?.map(([key, value], i) => (
                      <div key={i} className="expand-grid-item">
                        <strong>{dNames[key] || key}:</strong>{" "}
                        {formatValue(key, value)}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default MainTable;
