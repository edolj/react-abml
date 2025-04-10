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

  const showToast = (score: string, rule: string) => {
    toast.info(
      <>
        {score && <div>{score}</div>}
        <div>{rule}</div>
      </>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const [userArgument, setUserArgument] = useState("");
  const [m_score, setMScore] = useState(0.0);
  const [hint_m_score, setHintMScore] = useState(0.0);
  const [hintBestRule, setBestRule] = useState("");
  const [highlightedAttr, setHighlightedAttributes] = useState<string[]>([]);
  const [hasCounterExamples, setHasCounterExamples] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const readUserArgument = (event: any) => {
    const val = event.target.value;
    setUserArgument(val);
    const extracted = extractAttributes(val);
    setHighlightedAttributes(extracted);
  };

  const showHintMessage = () => {
    if (hintBestRule === "") {
      showToast("", "First input your arguments.");
      return;
    }
    if (hintBestRule === "No hints") {
      showToast("", "No hints.");
      return;
    }

    const score = "m: " + hint_m_score / 100;
    const rule = processRule(hintBestRule);
    showToast(score, rule);
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

        // Limit to 2 counter examples to show in table
        const limitedCounterExamples = data.counterExamples.slice(0, 2);
        if (limitedCounterExamples.length > 0) {
          setHasCounterExamples(true);
        } else {
          setHasCounterExamples(false);
        }

        // Add new columns for each counter value
        const newColumns = limitedCounterExamples.map(
          (_: any, idx: number) => ({
            Header: `Counter Value ${idx + 1}`,
            accessor: `counterValue${idx + 1}`,
          })
        );

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
            limitedCounterExamples.forEach(
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
        if (data.arg_m_score > data.best_m_score) {
          setBestRule("No hints");
        }
        setMScore(Math.floor(data.arg_m_score * 100));
        setHintMScore(Math.floor(data.best_m_score * 100));

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

    const csrfToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("csrftoken="))
      ?.split("=")[1];

    axios
      .put(
        "http://localhost:8000/api/update-iteration/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Iteration updated successfully.", response);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating iteration:", error);
        setAlertError("Failed to update iteration number. Please try again.");
      });
  };

  const processRule = (rule: string) => {
    return rule.replace(/([<>=!]+)\s*([\d.]+)/g, "$1 ");
  };

  const extractAttributes = (input: string) => {
    const regex = /([\w.]+)\s*(?:<=|>=|=|<|>)/g;
    const matches = input.matchAll(regex);
    const attributes = Array.from(matches, (m) => m[1]);
    return attributes;
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

                <Button variant="primary" onClick={showHintMessage}>
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
            M-score for chosen arguments: {m_score / 100}
            <ProgressBar>
              <ProgressBar
                striped
                now={m_score}
                label={m_score}
                variant="primary"
              />
              <ProgressBar
                striped
                now={hint_m_score - m_score}
                label={hint_m_score - m_score}
                variant="success"
              />
            </ProgressBar>
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
              {formattedData.map((row: any, rowIndex: number) => {
                const isHighlighted =
                  hasCounterExamples && highlightedAttr.includes(row.key);
                return (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: isHighlighted ? "#fff3cd" : "inherit",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>{row[column.accessor] || "-"}</td>
                    ))}
                  </tr>
                );
              })}
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
