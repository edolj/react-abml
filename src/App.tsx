import { useState, useEffect } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import ListGroup from "./components/ListGroup";
import PrimaryButton from "./components/PrimaryButton";
import Textfield from "./components/Textfield";
import Alert from "./components/Alert";
import RuleList from "./components/RuleList";
import CriticalExamples from "./components/CriticalExamples";

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

  const [criticalInstances, setCriticalInstances] = useState([]);
  const [userArgument, setUserArgument] = useState("");
  const [highLow, setHighLow] = useState("");
  const [criticalExampleIndex, setCriticalExampleIndex] = useState([]);
  const [counterExamples, setCounterExamples] = useState([]);

  function formatCriticalInstances(criticalInstances: any[]): string[] {
    return criticalInstances.map((instance, index) => {
      return `Credit Score: ${instance.credit_score}  |||  Activity: ${instance.activity_ime}`;
    });
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
        setCriticalInstances(response.data.critical_instances);
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
      <div style={{ marginBottom: "20px" }}>
        <ListGroup
          items={formatCriticalInstances(criticalInstances)}
          heading="Critical Examples"
          onSelectItem={(index) => setCriticalExampleIndex(index)}
        />
      </div>
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

      <div>
        <ListGroup
          items={formatCounterExamples(counterExamples)}
          heading="Counter Examples"
          onSelectItem={(index) => console.log(index)}
        />
      </div>
    </>
  );
}

export default App;
