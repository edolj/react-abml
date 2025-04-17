import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainTable from "./MainTable";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "./Alert";
import axios from "axios";

interface CriticalInstance {
  critical_index: string;
  problematic: string;
  target_class: string;
  id: string;
}

function SelectExampleView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDomain = location.state?.selectedDomain;

  const tableColumns = [
    { Header: "Name", accessor: "column1" },
    { Header: "Critical", accessor: "column2" },
    { Header: "Credit Score", accessor: "column3" },
  ];

  const [criticalInstances, setCriticalInstances] = useState<
    CriticalInstance[]
  >([]);
  const [detailData, setDetailData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [alertError, setAlertError] = useState<string | null>(null);
  const [iterationNumber, setIterationNumber] = useState<number | null>(null);
  const tableData = formatCriticalInstances(criticalInstances);

  const handleRowClick = (index: number) => {
    if (index >= 0 && index < criticalInstances.length) {
      const criticalIndex = criticalInstances[index].critical_index;
      const idName = criticalInstances[index].id;
      navigate(`/selectExample/${criticalIndex}`, {
        state: { detailData: detailData[index], id: idName },
      });
    }
  };

  function formatCriticalInstances(criticalInstances: any[]) {
    const data = criticalInstances.map((instance) => {
      return {
        column1: instance.id,
        column2: instance.problematic,
        column3: instance.target_class,
      };
    });

    return data;
  }

  useEffect(() => {
    if (!selectedDomain) return;

    setIsLoading(true);
    const csrfToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("csrftoken="))
      ?.split("=")[1];

    axios
      .get("http://localhost:8000/api/get-iteration/", {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      })
      .then((response) => {
        setIterationNumber(response.data.iterationNumber);
      })
      .catch((error) => {
        console.error("Error fetching iteration number:", error);
      });

    axios
      .post(
        "http://localhost:8000/api/critical-instances/",
        { domain: selectedDomain },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setCriticalInstances(response.data.critical_instances[0]);
        setDetailData(response.data.critical_instances[1]);
        setIsLoading(false);
        setAlertError(null);
      })
      .catch((error) => {
        console.error("Error fetching critical instances:", error);
        setIsLoading(false);
        setAlertError(
          "Failed to fetch critical examples. Please try again later."
        );
      });
  }, []);

  return (
    <>
      <div className="container">
        {alertError && (
          <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
        )}
        <div className="box-with-border card-view">
          <h2 style={{ marginBottom: "20px" }}>Select critical example</h2>
          {isLoading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <MainTable
              columns={tableColumns}
              data={tableData}
              onRowClick={handleRowClick}
            />
          )}
          <div style={{ marginTop: "20px" }}>Iteration {iterationNumber}</div>
        </div>
      </div>
    </>
  );
}

export default SelectExampleView;
