import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Corners.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

  const columns = [
    { Header: "Attribute", accessor: "key" },
    { Header: "Value", accessor: "value" },
  ];

  const formattedData = detailData.map((detail: any, index: number) => ({
    key: detail[0],
    value: detail[1],
  }));

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

  // function formatCounterExamples(counterExamples: any[]): string[] {
  //   return counterExamples.map((example, index) => {
  //     return `Name: ${example.activity_ime}, Net Sales: ${example.net_sales}`;
  //   });
  // }

  const [userArgument, setUserArgument] = useState("");
  const [counterExamples, setCounterExamples] = useState([]);
  const [hintBestRule, setBestRule] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShowAlert = (message: any) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const showHintMessage = () => {
    showToast(hintBestRule);
  };

  const showCriticalExample = () => {
    setIsLoading(true);

    // Data to be sent in the request body
    const requestData = {
      index: criticalIndex,
      userArgument: userArgument,
    };

    fetch("http://localhost:8000/api/counter-examples/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setShowAlert(false);
            setCounterExamples(data.counterExamples);
            setBestRule(data.bestRule);
          });
        } else {
          response.json().then((error) => {
            handleShowAlert(error.error);
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        handleShowAlert("An unexpected error occurred. Please try again.");
      });
  };

  const doneWithArgumentation = () => {
    navigate(-1);
  };

  return (
    <>
      <ToastContainer />
      {showAlert && <Alert onClose={handleCloseAlert}>{alertMessage}</Alert>}
      <div className="container" style={{ marginBottom: "40px" }}>
        <div className="container">
          <div style={{ marginBottom: "20px" }}>
            <Form.Label>Input argument:</Form.Label>
            <Form.Control onChange={readUserArgument} />
            <Form.Text muted>{"Example: debt<="}</Form.Text>
          </div>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
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
                  <td key={columnIndex}>{row[column.accessor]}</td>
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
      {/*
      {!showAlert && (
        <div className="container" style={{ marginBottom: "40px" }}>
          <ListGroup
            items={formatCounterExamples(counterExamples)}
            heading="Found Counter Examples"
            onSelectItem={(index) => console.log(index)}
            isVisible={false}
          />
        </div>
      )} */}
    </>
  );
}

export default ArgumentView;
