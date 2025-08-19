import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AttributeInfo } from "./ArgumentView";
import { getObject } from "../api/apiHomePage";
import MainTable from "./MainTable";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "./Alert";
import apiClient from "../api/apiClient";
import "../css/RoundTable.css";

interface CriticalInstance {
  critical_index: string;
  problematic: string;
  target_class: string;
  id: string;
}

const loadingMessages = [
  "Learning rules...",
  "Searching for critical examples...",
  "Double-checking everything...",
  "Still working... hang tight!",
];

function SelectExampleView() {
  const navigate = useNavigate();
  const location = useLocation();
  const domainName = location.state?.selectedDomain;

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [alertError, setAlertError] = useState<string | null>(null);

  const [criticalInstances, setCriticalIns] = useState<CriticalInstance[]>([]);
  const [detailData, setDetailData] = useState<[string, any][][]>([]);
  const [iterationNumber, setIterationNumber] = useState<number | null>(null);
  const [expertAttr, setExpertAttr] = useState<string[]>([]);
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [attrTypes, setAttributeTypes] = useState<Record<string, string>>({});
  const [targetClassName, setTargetClassName] = useState("Class");

  const tableData = formatCriticalInstances(criticalInstances);

  const tableColumns = [
    { Header: "ID", accessor: "column1" },
    { Header: "Critical", accessor: "column2" },
    { Header: targetClassName, accessor: "column3" },
  ];

  const handleRowClick = (index: number) => {
    if (index >= 0 && index < criticalInstances.length) {
      const criticalIndex = criticalInstances[index].critical_index;
      const idName = criticalInstances[index].id;
      const targetClass = criticalInstances[index].target_class;
      navigate(`/selectExample/${criticalIndex}`, {
        state: {
          detailData: detailData[index],
          id: idName,
          targetClassName: targetClassName,
          targetClass: targetClass,
          iterationNumber: iterationNumber,
          domainName: domainName,
        },
      });
    }
  };

  function formatCriticalInstances(criticalInstances: CriticalInstance[]) {
    const data = criticalInstances.map((instance) => {
      return {
        column1: instance.id,
        column2: instance.problematic,
        column3: instance.target_class,
      };
    });

    return data;
  }

  function getExpandedData() {
    const classTarget = Object.keys(attrTypes).find(
      (attr) => attrTypes[attr] === "target"
    );

    return detailData.map((instance) =>
      instance.filter(
        ([attrName, _]) =>
          !expertAttr.includes(attrName) && attrName !== classTarget
      )
    );
  }

  useEffect(() => {
    const classAttr = Object.keys(attrTypes).find(
      (attr) => attrTypes[attr] === "target"
    );
    if (classAttr) setTargetClassName(displayNames[classAttr] || "Class");
  }, [attrTypes]);

  const fetchAttributeData = () => {
    getObject()
      .then((data) => {
        setExpertAttr(data?.expert_attributes || []);
        setDisplayNames(data?.display_names || {});
      })
      .catch((err) => {
        console.error("Error fetching learning object:", err);
      });

    apiClient
      .get("/attributes/")
      .then((response) => {
        const mapping: Record<string, string> = {};
        response.data.forEach((attr: AttributeInfo) => {
          mapping[attr.name] = attr.type;
        });
        setAttributeTypes(mapping);
      })
      .catch((error) => {
        console.error("Failed to fetch attribute types:", error);
      });
  };

  useEffect(() => {
    if (!domainName) return;
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
        domain: domainName,
        startNew: isNewSession,
      })
      .then((response) => {
        setCriticalIns(response.data.critical_instances[0]);
        setDetailData(response.data.critical_instances[1]);
        setIsLoading(false);
        setAlertError(null);

        localStorage.setItem("mode", "continue");

        fetchAttributeData();
      })
      .catch((error) => {
        console.error("Error fetching critical instances:", error);
        setIsLoading(false);
        setAlertError(
          "Failed to fetch critical examples. Please try again later."
        );
      });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2000);
    } else {
      // reset message
      setLoadingMessage(loadingMessages[0]);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

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
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              flexDirection: "column",
            }}
            open
          >
            <CircularProgress color="inherit" />
            <div style={{ marginTop: 16, fontSize: "1.2rem" }}>
              {loadingMessage}
            </div>
          </Backdrop>
        ) : (
          <MainTable
            columns={tableColumns}
            data={tableData}
            onRowClick={handleRowClick}
            expandData={getExpandedData()}
            dNames={displayNames}
          />
        )}
      </div>
    </>
  );
}

export default SelectExampleView;
