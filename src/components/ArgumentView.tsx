import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import { getObject } from "../api/apiHomePage";
import apiClient from "../api/apiClient";
import "react-toastify/dist/ReactToastify.css";
import "../css/PrimaryButton.css";
import "../css/Corners.css";
import Alert from "./Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "react-bootstrap/ProgressBar";
import PrimaryButton from "./PrimaryButton";
import Bubbles from "./Bubbles";
import AttributeList from "./AttributeList";
import ExpertAttributesModal from "./ExpertAttributesModal";

export type Argument = {
  key: string;
  operator?: string;
  displayName?: string;
};

type AttributeInfo = {
  name: string;
  type: "continuous" | "discrete" | "meta" | "target" | "unknown";
};

function ArgumentView() {
  const navigate = useNavigate();
  const { criticalIndex } = useParams();
  const location = useLocation();
  const detailData = location.state?.detailData || [];
  const idName = location.state?.id || "N/A";
  const targetClass = location.state.targetClass;

  const [columns, setColumns] = useState([
    { Header: "Attribute", accessor: "key" },
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

  const [mScore, setMScore] = useState(0.0);
  const [hintScore, setHintMScore] = useState(0.0);
  const [hintBestRule, setBestRule] = useState("");
  const [hasCounterExamples, setHasCounterExamples] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [argumentsSent, setArgumentsSent] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Argument[]>([]);
  const [boxplots, setBoxplots] = useState<Record<string, number[]>>({});
  const [attrTypes, setAttributeTypes] = useState<Record<string, string>>({});
  const [expertAttr, setExpertAttr] = useState<string[]>([]);
  const [display_names, setDisplayNames] = useState<Record<string, string>>({});
  const [attrDesc, setAttrDescs] = useState<Record<string, string>>({});
  const [tooltipDescs, setTooltipDescs] = useState<Record<string, string>>({});

  useEffect(() => {
    getObject()
      .then((data) => {
        setExpertAttr(data?.expert_attributes || []);
        setDisplayNames(data?.display_names || {});
        setAttrDescs(data?.attr_descriptions || {});
        setTooltipDescs(data?.attr_tooltips || {});
      })
      .catch((err) => {
        console.error("Error fetching learning object:", err);
      });
  }, []);

  // useEffect(() => {
  //   apiClient
  //     .get("/expert-attributes/")
  //     .then((response) => {
  //       setExpertAttr(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch expert attributes:", error);
  //     });
  // }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    apiClient
      .get("/get-charts-data/")
      .then((res) => {
        setBoxplots(res.data);
      })
      .catch((err) => {
        console.error("Failed to load visual representation data", err);
      });
  }, []);

  // useEffect(() => {
  //   apiClient
  //     .get("/display-names/")
  //     .then((response) => {
  //       setDisplayNames(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch display names:", error);
  //     });
  // }, []);

  const addBubble = (newBubble: Argument) => {
    setSelectedFilters((prev) => {
      return [
        // Filter out previous entries with the same key
        ...prev.filter((b) => b.key !== newBubble.key),
        newBubble,
      ];
    });
  };

  const removeBubble = (keyToRemove: string) => {
    setSelectedFilters((prev) => prev.filter((b) => b.key !== keyToRemove));
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

    const score = "m: " + hintScore / 100;
    const rule = processRule(hintBestRule);
    showToast(score, rule);
  };

  const showCriticalExample = () => {
    if (selectedFilters.length === 0) {
      setAlertError("The argument field cannot be empty!");
      return;
    }

    // const userArgument = selectedFilters.map((item) => item.value).join(",");
    const userArgument = selectedFilters
      .map((item) => (item.operator ? `${item.key}${item.operator}` : item.key))
      .join(",");

    setAlertError(null);
    setIsLoading(true);

    // Data to be sent in the request body
    const requestData = {
      index: criticalIndex,
      userArgument: userArgument,
    };

    apiClient
      .post("/counter-examples/", requestData)
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
                  counterExample[index] || "-";
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
        setArgumentsSent(true);
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
    if (!argumentsSent) {
      setAlertError("The argument field cannot be empty!");
      return;
    }

    apiClient
      .put("/update-iteration/")
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
    return rule.replace(/([<>=!]+)\s*(-?[\d.]+)/g, "$1 ");
  };

  // useEffect(() => {
  //   apiClient
  //     .get("/attributes/")
  //     .then((response) => {
  //       const attributes = response.data;

  //       let options: OptionType[] = [];
  //       attributes.forEach((attr: { name: string; type: string }) => {
  //         const displayName = attributesDisplayNames[attr.name] || attr.name;
  //         if (attr.type === "continuous") {
  //           options.push(
  //             { value: `${attr.name}<=`, label: `${displayName} is low` },
  //             { value: `${attr.name}>=`, label: `${displayName} is high` }
  //           );
  //         } else if (attr.type === "discrete") {
  //           options.push({ value: attr.name, label: displayName });
  //         }
  //       });

  //       setAttributeOptions(options);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching attributes:", error);
  //     });
  // }, []);

  // type OptionType = {
  //   value: string;
  //   label: string;
  // };

  // const customStyles: StylesConfig<OptionType, true, GroupBase<OptionType>> = {
  //   multiValue: (base) => ({
  //     ...base,
  //     backgroundColor: "#607ad1",
  //     color: "white",
  //     borderRadius: "16px",
  //     padding: "0 10px",
  //   }),
  //   multiValueLabel: (base) => ({
  //     ...base,
  //     color: "white",
  //   }),
  //   multiValueRemove: (base) => ({
  //     ...base,
  //     color: "white",
  //     ":hover": { backgroundColor: "darkblue" },
  //   }),
  // };

  // const [attributeOptions, setAttributeOptions] = useState<OptionType[]>([]);
  // const [selectedFilters, setSelectedFilters] = useState<OptionType[]>([]);

  // const handleChange = (
  //   selectedOptions: MultiValue<OptionType>,
  //   actionMeta: ActionMeta<OptionType>
  // ) => {
  //   setSelectedFilters([...selectedOptions]);
  // };

  return (
    <>
      <ToastContainer />
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          className="box-with-border card-view"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h4>Details about: {idName}</h4>
            <span>
              Class: <b style={{ color: "green" }}>{targetClass}</b>
            </span>
          </div>
          {argumentsSent && !hasCounterExamples && (
            <Button variant="link" onClick={doneWithArgumentation}>
              Next Example
              <FaArrowRight
                style={{ marginLeft: "8px", marginBottom: "2px" }}
              />
            </Button>
          )}
        </div>

        {/* Argument Input Box */}
        {/* <div className="box-with-border card-view">
          <div style={{ marginBottom: "20px" }}>
            <Form.Label>Input argument:</Form.Label>
            <Select
              options={attributeOptions}
              isMulti
              value={selectedFilters}
              onChange={handleChange}
              placeholder="Select"
              styles={customStyles}
            />
          </div>
        </div> */}

        {/* M-Score Box */}
        {argumentsSent && (
          <div className="box-with-border card-view">
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              M-score for chosen arguments: {mScore / 100}
              <PrimaryButton onClick={showHintMessage}>
                <FaLightbulb
                  style={{
                    marginRight: "8px",
                    marginBottom: "2px",
                    color: "white",
                  }}
                />
                Hint
              </PrimaryButton>
            </div>
            <ProgressBar>
              <ProgressBar now={mScore} label={mScore} variant="primary" />
              <ProgressBar
                now={hintScore - mScore}
                label={hintScore - mScore}
                variant="success"
              />
            </ProgressBar>
          </div>
        )}

        <div className="box-with-border card-view">
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "0.5rem",
              marginBottom: 8,
              background: "white",
              width: "80%",
              margin: "0 auto",
            }}
          >
            {selectedFilters.length === 0 ? (
              <div style={{ color: "#888", fontStyle: "italic" }}>
                Select arguments from list
              </div>
            ) : (
              <Bubbles bubbles={selectedFilters} onRemove={removeBubble} />
            )}
          </div>
          <div style={{ width: "80%", margin: "0 auto", paddingTop: "10px" }}>
            {alertError && (
              <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
            )}
          </div>
          <div
            style={{
              marginTop: 16,
              marginBottom: 24,
              display: "flex",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <ExpertAttributesModal
              displayNames={display_names}
              descriptions={attrDesc}
            />
            <Button
              variant="success"
              onClick={showCriticalExample}
              className="custom-primary-button"
            >
              Send arguments
            </Button>
          </div>

          <div
            style={{
              width: hasCounterExamples ? "100%" : "80%",
              margin: "0 auto",
              marginTop: "40px",
            }}
          >
            <AttributeList
              attributes={formattedData}
              hasCounterExamples={hasCounterExamples}
              boxplots={boxplots}
              attrTypes={attrTypes}
              selectedFilters={selectedFilters}
              expertAttr={expertAttr}
              displayNames={display_names}
              tooltipDescriptions={tooltipDescs}
              onHighClick={(key) =>
                addBubble({
                  key,
                  operator: ">=",
                  displayName: display_names[key] + " is high",
                })
              }
              onLowClick={(key) =>
                addBubble({
                  key,
                  operator: "<=",
                  displayName: display_names[key] + " is low",
                })
              }
              onCategoryAddClick={(key) =>
                addBubble({ key, displayName: display_names[key] })
              }
              onCategoryDeleteClick={(key) => removeBubble(key)}
            />
          </div>
        </div>

        {/* <div className="box-with-border card-view">
          <Tabs
            defaultActiveKey={Object.keys(attributeGroups)[0]}
            id="attribute-groups-tabs"
            className="mb-3"
          >
            {Object.entries(attributeGroups).map(([groupName, attributes]) => {
              const groupRows = formattedData.filter((item: any) =>
                attributes.includes(item.key)
              );

              if (groupRows.length === 0) return null;

              return (
                <Tab eventKey={groupName} title={groupName} key={groupName}>
                  <div style={{ overflowX: "auto" }}>
                    <table className="rounded-table">
                      <thead>
                        <tr>
                          {columns.map((column, columnIndex) => (
                            <th key={columnIndex}>{column.Header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupRows.map((row: any, rowIndex: number) => {
                          return (
                            <tr key={rowIndex}>
                              {columns.map((column, colIndex) => {
                                const cellValue =
                                  column.accessor === "key"
                                    ? attributesDisplayNames[row.key] || row.key
                                    : row[column.accessor] || "-";

                                const formattedValue =
                                  column.accessor !== "key" && cellValue !== "-"
                                    ? eurAttr.includes(row.key)
                                      ? `${Number(cellValue).toLocaleString(
                                          "sl-SI",
                                          {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          }
                                        )} €`
                                      : ratioAttr.includes(row.key)
                                      ? Number(cellValue).toLocaleString(
                                          "sl-SI",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )
                                      : cellValue
                                    : cellValue;

                                const tooltipText =
                                  tooltipDescriptions[row.key] || "";
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign:
                                        colIndex > 0 ? "right" : "left",
                                    }}
                                  >
                                    <Tooltip title={tooltipText} arrow>
                                      {formattedValue}
                                    </Tooltip>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Tab>
              );
            })}
          </Tabs>
        </div>*/}

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
