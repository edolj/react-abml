import { useState, useEffect } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import PrimaryButton from "./components/PrimaryButton";
import ExpandableTable from "./components/ExpandableTable";
import Textfield from "./components/Textfield";
import Alert from "./components/Alert";
import RuleList from "./components/RuleList";
import CriticalExamples from "./components/CriticalExamples";
import ListGroup from "./components/ListGroup";

function App() {
  {
    /* 
  const [rules, setRules] = useState([]);

  useEffect(() => {
    // Fetch rules data from Django API
    fetch("http://localhost:8000/api/learning-rules/")
      .then((response) => response.json())
      .then((data) => setRules(data.rules))
      .catch((error) => console.error("Error fetching rules:", error));
  }, []);
  */
  }

  const tableColumns = [
    { Header: "Ocena", accessor: "column1" },
    { Header: "ID", accessor: "column2" },
    { Header: "", accessor: "column3" },
  ];
  const [criticalInstances, setCriticalInstances] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const tableData = formatCriticalInstances(criticalInstances);

  const handleSelectedRowChange = (index) => {
    setCriticalExampleIndex(index);
  };
  const [criticalExampleIndex, setCriticalExampleIndex] = useState(null);

  const [userArgument, setUserArgument] = useState("");
  const [highLow, setHighLow] = useState("");
  const [counterExamples, setCounterExamples] = useState([]);

  function formatCriticalInstances(criticalInstances: any[]) {
    const data = criticalInstances.map((instance, index) => {
      return {
        column1: instance.credit_score,
        column2: instance.activity_ime,
      };
    });

    return data;
  }

  function formatCounterExamples(counterExamples: any[]): string[] {
    return counterExamples.map((example, index) => {
      return `Name: ${example.activity_ime}`;
    });
  }

  const handleChange = (event) => {
    setUserArgument(event.target.value);
  };

  const handleChangeHighLow = (event) => {
    setHighLow(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/critical-instances/")
      .then((response) => {
        setCriticalInstances(response.data.critical_instances[0]);
        setDetailData(response.data.critical_instances[1]);
      })
      .catch((error) => {
        console.error("Error fetching critical instances:", error);
      });
  }, []);

  const showCriticalExample = () => {
    // Data to be sent in the request body
    const requestData = {
      index: criticalExampleIndex,
      userArgument: userArgument,
      highLow: highLow,
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
            // Check if the response contains counter examples
            if (data.counterExamples) {
              console.log("Counter Examples:", data.counterExamples);
              setCounterExamples(data.counterExamples);
            } else {
              // Handle other successful responses
              console.log("Request sent successfully");
            }
          });
        } else {
          response.json().then((error) => {
            console.error("Request failed:", error.error);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div
        style={{
          marginBottom: "20px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <h2>Select Critical Example</h2>
        <ExpandableTable
          columns={tableColumns}
          data={tableData}
          detailData={detailData}
          onExpandedRowChange={handleSelectedRowChange}
        />
        <p>Selected Critical Example Number: {criticalExampleIndex}</p>
      </div>

      <div>
        {criticalExampleIndex !== null && (
          <>
            <div
              style={{
                marginBottom: "20px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <Form.Label>Enter argument:</Form.Label>
              <Form.Control onChange={handleChange} />
              <Form.Text muted>{"Example: cash<="}</Form.Text>
            </div>
            <div
              style={{
                marginBottom: "20px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <Form.Label>Enter high or low:</Form.Label>
              <Form.Control onChange={handleChangeHighLow} />
            </div>
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
              <PrimaryButton onClick={showCriticalExample}>
                GET Counter examples
              </PrimaryButton>
            </div>
          </>
        )}
      </div>

      <div>
        <ListGroup
          items={formatCounterExamples(counterExamples)}
          heading="Show Counter Examples"
          onSelectItem={(index) => console.log(index)}
          isVisible={false}
        />
      </div>
    </>
  );
}

export default App;
