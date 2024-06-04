import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";

import Form from "react-bootstrap/Form";
import PrimaryButton from "./PrimaryButton";
import Table from "react-bootstrap/Table";
import Alert from "./Alert";

function ArgumentView() {
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

  const handleChange = (event: any) => {
    setUserArgument(event.target.value);
  };

  // function formatCounterExamples(counterExamples: any[]): string[] {
  //   return counterExamples.map((example, index) => {
  //     return `Name: ${example.activity_ime}, Net Sales: ${example.net_sales}`;
  //   });
  // }

  const [userArgument, setUserArgument] = useState("");
  const [counterExamples, setCounterExamples] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message: any) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const showCriticalExample = () => {
    // Data to be sent in the request body
    const requestData = {
      index: criticalIndex,
      userArgument: userArgument,
      highLow: "highLow",
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
            // Check if the response contains counter examples
            if (data.counterExamples) {
              // console.log(data.counterExamples);
              setCounterExamples(data.counterExamples);
            } else {
              // Handle other successful responses
              console.log("Request sent successfully");
            }
          });
        } else {
          response.json().then((error) => {
            handleShowAlert(error.error);
          });
        }
      })
      .catch((error) => {
        handleShowAlert("An unexpected error occurred. Please try again.");
      });
  };

  return (
    <>
      {showAlert && <Alert onClose={handleCloseAlert}>{alertMessage}</Alert>}
      <div className="container" style={{ marginBottom: "40px" }}>
        <div className="container">
          <div style={{ marginBottom: "20px" }}>
            <Form.Label>Input argument:</Form.Label>
            <Form.Control onChange={handleChange} />
            <Form.Text muted>{"Example: cash<="}</Form.Text>
          </div>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <PrimaryButton onClick={showCriticalExample}>CONFIRM</PrimaryButton>
          </div>
        </div>
        <h3>Details for {idName}</h3>
        <Table striped bordered hover>
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
