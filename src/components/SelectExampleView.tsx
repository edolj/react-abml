import { useState, useEffect } from "react";
import MainTable from "./MainTable";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CriticalInstance {
  critical_index: string;
  problematic: string;
  target_class: string;
  id: string;
}

function SelectExampleView() {
  const navigate = useNavigate();

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
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/critical-instances/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setCriticalInstances(response.data.critical_instances[0]);
        setDetailData(response.data.critical_instances[1]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching critical instances:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h4>Select critical example from:</h4>
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
  );
}

export default SelectExampleView;
