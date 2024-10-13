import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Corners.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "react-bootstrap/ProgressBar";

import Form from "react-bootstrap/Form";
import PrimaryButton from "./PrimaryButton";
import Table from "react-bootstrap/Table";
import Alert from "./Alert";

function ArgumentView() {
  const navigate = useNavigate();
  const { criticalIndex } = useParams();
  const location = useLocation();
  const detailData = location.state?.detailData || [];
  const idName = location.state?.id || "N/A";

  const [columns, setColumns] = useState([
    { Header: "Attribute", accessor: "key" },
    { Header: "Value", accessor: "value" },
  ]);

  const [formattedData, setFormattedData] = useState(
    detailData.map((detail: any) => ({
      key: detail[0],
      value: detail[1],
    }))
  );

  const getRowStyle = (domain: string) => {
    const cleanedText = userArgument.replace(/[<>=]/g, "");
    const args = cleanedText.split(",").map((arg) => arg.trim());

    if (args.includes(domain)) {
      return { backgroundColor: "#bbdefb" };
    }
    return {};
  };

  const readUserArgument = (event: any) => {
    setUserArgument(event.target.value);
  };

  const showToast = (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const [userArgument, setUserArgument] = useState("");
  const [m_score, setMScore] = useState(0.0);
  const [hintBestRule, setBestRule] = useState("");
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showHintMessage = () => {
    showToast(hintBestRule);
  };

  const showCriticalExample = () => {
    setAlertError(null);
    setIsLoading(true);

    // Data to be sent in the request body
    const requestData = {
      index: criticalIndex,
      userArgument: userArgument,
    };
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/counter-examples/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setAlertError(null);

            // Add new columns for each counter value
            const newColumns = data.counterExamples.map(
              (_: any, idx: number) => ({
                Header: `Counter Value ${idx + 1}`,
                accessor: `counterValue${idx + 1}`,
              })
            );

            setColumns((prevColumns) => [
              ...prevColumns,
              ...newColumns.filter(
                (newColumn: any) =>
                  !prevColumns.some(
                    (col) => col.accessor === newColumn.accessor
                  )
              ),
            ]);

            // Merge counter values into formatted data
            const newFormattedData = formattedData.map(
              (item: any, index: number) => {
                const newItem = { ...item };
                data.counterExamples.forEach(
                  (counterExample: any, counterIndex: number) => {
                    newItem[`counterValue${counterIndex + 1}`] =
                      counterExample[index] || "";
                  }
                );
                return newItem;
              }
            );

            setFormattedData(newFormattedData);
            setBestRule(data.bestRule);
            setMScore(Math.floor(data.m_score * 100));
          });
        } else {
          response.json().then((error) => {
            setAlertError(error.error);
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Argument view POST method error:", error);
        setIsLoading(false);
        setAlertError("An unexpected error occurred. Please try again.");
      });
  };

  const doneWithArgumentation = () => {
    navigate(-1);
  };

  return (
    <>
      <ToastContainer />
      <div className="container" style={{ marginBottom: "40px" }}>
        <div
          className="box-with-border"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <Form.Label>Input argument:</Form.Label>
            <Form.Control onChange={readUserArgument} />
            <Form.Text muted>{"Example: debt<="}</Form.Text>
          </div>
          {alertError && (
            <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
          )}
          <div style={{ textAlign: "center" }}>
            <PrimaryButton onClick={showCriticalExample}>
              Send arguments
            </PrimaryButton>
            <PrimaryButton
              onClick={doneWithArgumentation}
              style={{ marginLeft: "10px" }}
            >
              Done and show next example
            </PrimaryButton>
            <PrimaryButton
              onClick={showHintMessage}
              style={{ marginLeft: "10px" }}
            >
              Show hint
            </PrimaryButton>
          </div>
        </div>
        <div style={{ marginBottom: "40px" }} className="box-with-border">
          M score ({m_score / 100}):
          <ProgressBar now={m_score} label={`${m_score}`} />
        </div>
        <h3>Details for {idName}</h3>
        <Table striped bordered hover responsive className="rounded-table">
          <thead>
            <tr>
              {columns.map((column, columnIndex) => (
                <th key={columnIndex}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formattedData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} style={getRowStyle(row.key)}>
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div>
        {isLoading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
      </div>
    </>
  );
}

export default ArgumentView;
