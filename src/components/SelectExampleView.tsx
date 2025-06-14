import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainTable from "./MainTable";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "./Alert";
import apiClient from "../api/apiClient";

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
    { Header: "Class", accessor: "column3" },
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
      const targetClass = criticalInstances[index].target_class;
      navigate(`/selectExample/${criticalIndex}`, {
        state: {
          detailData: detailData[index],
          id: idName,
          targetClass: targetClass,
        },
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
    const isNewSession = localStorage.getItem("mode") === "new";

    setIsLoading(true);
    if (isNewSession) {
      setIterationNumber(0);
    } else {
      apiClient
        .get("/get-iteration/")
        .then((response) => {
          setIterationNumber(response.data.iterationNumber);
        })
        .catch((error) => {
          console.error("Error fetching iteration number:", error);
        });
    }

    apiClient
      .post("/critical-instances/", {
        domain: selectedDomain,
        startNew: isNewSession,
      })
      .then((response) => {
        setCriticalInstances(response.data.critical_instances[0]);
        setDetailData(response.data.critical_instances[1]);
        setIsLoading(false);
        setAlertError(null);

        localStorage.setItem("mode", "continue");
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
        <div
          className="box-with-border card-view"
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>Select critical example</h2>
            {false && <div>Iteration {iterationNumber}</div>}
          </div>
        </div>
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
      </div>
    </>
  );
}

export default SelectExampleView;
