import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../css/PrimaryButton.css";
import "../css/Corners.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import Alert from "./Alert";

function ArgumentView() {
  const navigate = useNavigate();
  const { criticalIndex } = useParams();
  const location = useLocation();
  const detailData = location.state?.detailData || [];
  const idName = location.state?.id || "N/A";

  const [columns, setColumns] = useState([
    { Header: "Attribute Name", accessor: "key" },
    { Header: "Value", accessor: "value" },
  ]);

  const [formattedData, setFormattedData] = useState(
    detailData.map((detail: any) => ({
      key: detail[0],
      value: detail[1],
    }))
  );

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

  const readUserArgument = (event: any) => {
    setUserArgument(event.target.value);
  };

  const showHintMessage = () => {
    if (hintBestRule === "") {
      showToast("First input your arguments.");
      return;
    }
    showToast(processRule(hintBestRule));
  };

  const showCriticalExample = () => {
    if (!userArgument.trim()) {
      setAlertError("The argument input field cannot be empty!");
      return;
    }

    setAlertError(null);
    setIsLoading(true);

    // Data to be sent in the request body
    const requestData = {
      index: criticalIndex,
      userArgument: userArgument,
    };

    const csrfToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("csrftoken="))
      ?.split("=")[1];

    axios
      .post("http://localhost:8000/api/counter-examples/", requestData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      })
      .then((response) => {
        // response.data already contains parsed JSON
        const data = response.data;
        setAlertError(null);

        // Add new columns for each counter value
        const newColumns = data.counterExamples.map((_: any, idx: number) => ({
          Header: `Counter Value ${idx + 1}`,
          accessor: `counterValue${idx + 1}`,
        }));

        setColumns((prevColumns) => [
          ...prevColumns,
          ...newColumns.filter(
            (newColumn: any) =>
              !prevColumns.some((col) => col.accessor === newColumn.accessor)
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

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Argument view POST method error:", error);

        setAlertError(
          error.response?.data?.error ||
            "An unexpected error occurred. Please try again."
        );
        setIsLoading(false);
      });
  };

  const doneWithArgumentation = () => {
    if (!userArgument.trim()) {
      setAlertError("The argument input field cannot be empty!");
      return;
    }
    navigate(-1);
  };

  const processRule = (rule: string) => {
    return rule.replace(/([<>=!]+)\s*([\d.]+)/g, "$1 ");
  };

  const getAttributes = (): string[] => {
    return userArgument.match(/[a-zA-Z]+/g) || [];
  };

  const getProgressBarColor = (score: number) => {
    if (score <= 60) return "danger"; // Red
    if (score <= 90) return "warning"; // Yellow
    return "success"; // Green
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {/* Argument Input Box */}
          <div className="box-with-border card-view">
            <div style={{ marginBottom: "20px" }}>
              <Form.Label>Input argument:</Form.Label>
              <Form.Control onChange={readUserArgument} />
              <Form.Text muted>{"Example: debt<="}</Form.Text>
            </div>
            {alertError && (
              <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
            )}
            <div className="button-container">
              <div className="spacer"></div>

              <div className="center-buttons">
                <Button variant="success" onClick={showCriticalExample}>
                  Send arguments
                </Button>

                <Button onClick={showHintMessage}>
                  <FaLightbulb
                    style={{
                      marginRight: "8px",
                      marginBottom: "2px",
                      color: "white",
                    }}
                  />
                  Hint
                </Button>
              </div>

              <div className="right-button">
                <Button variant="primary" onClick={doneWithArgumentation}>
                  Next example
                  <FaArrowRight
                    style={{ marginLeft: "8px", marginBottom: "2px" }}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* M-Score Box */}
          <div className="box-with-border card-view">
            M score ({m_score / 100}):
            <ProgressBar
              now={m_score}
              label={`${m_score}`}
              variant={getProgressBarColor(m_score)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div
          className="box-with-border card-view"
          style={{ marginTop: "50px" }}
        >
          <h4 style={{ marginBottom: "20px" }}>Details for {idName}</h4>
          <table className="rounded-table">
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
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        backgroundColor:
                          colIndex > 0 && getAttributes().includes(row.key)
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      {row[column.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </>
  );
}

export default ArgumentView;
