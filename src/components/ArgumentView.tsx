import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Placeholder } from "react-bootstrap";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import { getObject } from "../api/apiHomePage";
import apiClient from "../api/apiClient";
import "react-toastify/dist/ReactToastify.css";
import "../css/PrimaryButton.css";
import Alert from "./Alert";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "react-bootstrap/ProgressBar";
import PrimaryButton from "./PrimaryButton";
import Bubbles from "./Bubbles";
import AttributeList from "./AttributeList";
import ExpertAttributesModal from "./ExpertAttributesModal";

export type Argument = {
  key: string;
  value?: number | string;
  operator?: string;
  displayName?: string;
};

export type AttributeInfo = {
  name: string;
  type: "continuous" | "discrete" | "meta" | "target" | "unknown";
};

type SkillType = {
  attribute: string;
  P_L: number;
};

const loadingMessages = [
  "Processing arguments...",
  "Searching for possible counter examples...",
  "Double-checking everything...",
  "Still working... hang tight!",
];

function ArgumentView() {
  const navigate = useNavigate();
  const { criticalIndex } = useParams();
  const location = useLocation();
  const detailData = location.state?.detailData || [];
  const idName = location.state?.id || "N/A";
  const targetClass = location.state.targetClass;
  const targetClassName = location.state.targetClassName;
  const iterationNumber = location.state.iterationNumber;
  const domainName = location.state.domainName;

  const [formattedData, setFormattedData] = useState(
    detailData.map((detail: any) => ({
      key: detail[0],
      value: detail[1],
    }))
  );

  const showToast = (score: string, rule: string) => {
    const lines = rule.split("\n");
    const listItems = lines.filter((line) => line.startsWith("- "));
    const normalLines = lines.filter((line) => !line.startsWith("- "));

    toast.info(
      <>
        {score && <div>{score}</div>}
        {normalLines.map((line, idx) => (
          <div key={`normal-${idx}`}>{line}</div>
        ))}

        {listItems.length > 0 && (
          <ul>
            {listItems.map((line, idx) => {
              const attrName = line.slice(2).trim();
              return (
                <li key={`list-${idx}`}>
                  <strong>{attrName}</strong>
                </li>
              );
            })}
          </ul>
        )}
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

  const [alertError, setAlertError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const [mScore, setMScore] = useState(0.0);
  const [hintScore, setHintMScore] = useState(0.0);
  const [hintBestRule, setBestRule] = useState("");
  const [hasCounterExamples, setHasCounterExamples] = useState(false);
  const [counterExampleIds, setCounterExampleIds] = useState<string[]>([]);
  const [argumentsSent, setArgumentsSent] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Argument[]>([]);
  const [boxplots, setBoxplots] = useState<Record<string, number[]>>({});
  const [attrTypes, setAttributeTypes] = useState<Record<string, string>>({});
  const [expertAttr, setExpertAttr] = useState<string[]>([]);
  const [display_names, setDisplayNames] = useState<Record<string, string>>({});
  const [attrDesc, setAttrDescs] = useState<Record<string, string>>({});
  const [tooltipDescs, setTooltipDescs] = useState<Record<string, string>>({});
  const [chosenArguments, setSentArguments] = useState<string[]>([]);
  const [skills, setSkills] = useState<Record<string, number>>({});

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  useEffect(() => {
    getObject()
      .then((data) => {
        setExpertAttr(data?.expert_attributes || []);
        setDisplayNames(data?.display_names || {});
        setAttrDescs(data?.attr_descriptions || {});
        setTooltipDescs(data?.attr_tooltips || {});
        fetchSkills();
      })
      .catch((err) => {
        console.error("Error fetching learning object:", err);
      });
  }, []);

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
      showToast("", "Good job! No hints needed. 👍");
      return;
    }

    const cleanedChosenArguments = chosenArguments.map((arg) => {
      const match = arg.match(/^([a-zA-Z0-9_./]+)\s*(==|<=|>=|<|>|!=)?/);
      return match ? match[1] : arg;
    });

    const attributeRegex = /\b([a-zA-Z0-9_./]+)\s*(==|<=|>=|<|>|!=)/g;
    const attributes = new Set<string>();

    const [ifPart] = hintBestRule.split(" THEN ");

    let match;
    while ((match = attributeRegex.exec(ifPart)) !== null) {
      attributes.add(match[1]);
    }

    const missingAttributes = Array.from(attributes).filter(
      (attr) => !cleanedChosenArguments.includes(attr)
    );

    const attrList = missingAttributes.map(
      (attr) => `- ${display_names[attr] || attr}`
    );

    const message = attrList.length
      ? `Argument can be improved with:\n${attrList.join("\n")}`
      : `Argument can be improved by removing one of selected.`;
    const score = ""; // "Quality: " + hintScore / 100;
    showToast(score, message);
  };

  const showCriticalExample = () => {
    if (selectedFilters.length === 0) {
      setAlertError("No arguments selected. Choose from the list below.");
      return;
    }

    // const userArgument = selectedFilters.map((item) => item.value).join(",");
    const userArgument = selectedFilters
      .map((item) =>
        item.operator ? `${item.key}${item.operator}${item.value}` : item.key
      )
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
        setCounterExampleIds(limitedCounterExamples.map((c: any) => c.id));
        setHasCounterExamples(limitedCounterExamples.length > 0);

        // Merge counter values into formatted data
        const newFormattedData = formattedData.map(
          (item: any, index: number) => {
            const newItem = { ...item };

            Object.keys(newItem).forEach((key) => {
              if (key.startsWith("counterValue")) {
                delete newItem[key];
              }
            });

            limitedCounterExamples.forEach(
              (counterExample: any, counterIndex: number) => {
                newItem[`counterValue${counterIndex + 1}`] =
                  counterExample.values[index] || "-";
              }
            );
            return newItem;
          }
        );

        setFormattedData(newFormattedData);
        setBestRule(data.bestRule);
        if (data.arg_m_score >= data.best_m_score) {
          setBestRule("No hints");
        }
        setMScore(Math.floor(data.arg_m_score * 100));
        setHintMScore(Math.floor(data.best_m_score * 100));

        setIsLoading(false);
        setArgumentsSent(true);

        const argumentsArray = selectedFilters.map((item) =>
          item.operator ? `${item.key}${item.operator}${item.value}` : item.key
        );
        setSentArguments(argumentsArray);
        fetchSkills();

        if (limitedCounterExamples.length === 0) {
          const summaryData = {
            domainName: domainName,
            details: detailData,
            displayNames: display_names,
            targetClass: targetClass,
            iteration_number: iterationNumber,
            user_arguments: selectedFilters,
            argRule: data.argRule,
            mScore: mScore,
          };
          getSummary(summaryData);
        } else {
          setSummaryText(null);
        }
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

  const doneWithArgumentation = async () => {
    if (!argumentsSent) {
      setAlertError("No arguments selected. Choose from the list below.");
      return;
    }

    setSelectedFilters([]);

    // Data to be sent in the request body
    const requestData = {
      selectedExampleId: idName,
      iteration_number: iterationNumber,
      chosen_arguments: chosenArguments,
      mScore: mScore,
      index: criticalIndex,
    };

    try {
      await apiClient.post("/post-data-iterations/", requestData);
      console.log("Success with saving argumentation data.");

      await apiClient.put("/update-iteration/");
      console.log("Iteration updated successfully.");

      navigate(-1);
    } catch (error) {
      console.error("Error during argumentation submission:", error);
      setAlertError("Failed to submit data. Please try again.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2000);
    } else {
      setLoadingMessage(loadingMessages[0]);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  const filteredDisplayNames = Object.fromEntries(
    Object.entries(display_names).filter(([key]) => expertAttr.includes(key))
  );

  const filteredAttrDescs = Object.fromEntries(
    Object.entries(attrDesc).filter(([key]) => expertAttr.includes(key))
  );

  const fetchSkills = () => {
    apiClient
      .get("/get-skills/")
      .then((res) => {
        const map: Record<string, number> = {};
        res.data.forEach((skill: SkillType) => {
          map[skill.attribute] = skill.P_L;
        });
        setSkills(map);
      })
      .catch((err) => {
        console.error("Failed to fetch skills", err);
      });
  };

  const getSummary = (summaryData: any) => {
    setSummaryLoading(true);
    apiClient
      .post("/get-summary/", summaryData)
      .then((response) => {
        setSummaryText(response.data.summary);
      })
      .catch((error) => {
        console.log("Summary generation failed:", error);
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  };

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
              {targetClassName}: <b style={{ color: "green" }}>{targetClass}</b>
            </span>
          </div>
          {argumentsSent && !hasCounterExamples && (
            <Button variant="outline-success" onClick={doneWithArgumentation}>
              Next Example
              <FaArrowRight
                style={{ marginLeft: "8px", marginBottom: "2px" }}
              />
            </Button>
          )}
        </div>

        {/* M-Score Box */}
        {argumentsSent && (
          <div className="box-with-border card-view">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <strong>Quality of selected arguments</strong>
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
            <ProgressBar style={{ height: "18px" }}>
              <ProgressBar
                now={mScore}
                label={`${mScore}%`}
                variant="success"
              />
              <Tooltip title="How much the argument can be improved" arrow>
                <ProgressBar
                  now={hintScore - mScore}
                  label={`${hintScore - mScore}%`}
                  variant="warning"
                  striped
                />
              </Tooltip>
            </ProgressBar>
          </div>
        )}

        {summaryLoading && (
          <div className="box-with-border card-view custom-summary-bg">
            <div className="card-header mb-2">
              <strong>Key Takeaways</strong>
            </div>
            <div className="card-body">
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={8} />
              </Placeholder>
            </div>
          </div>
        )}

        {summaryText && !summaryLoading && (
          <div className="box-with-border card-view custom-summary-bg">
            <div className="card-header d-flex justify-content-between align-items-center mb-2">
              <strong>Key Takeaways</strong>
              <button
                className="btn-close"
                onClick={() => setSummaryText(null)}
                aria-label="Close"
              />
            </div>
            <div className="card-body">
              <p className="card-text">{summaryText}</p>
            </div>
          </div>
        )}

        <div className="box-with-border card-view">
          <h6
            style={{
              width: "80%",
              margin: "0 auto 4px auto",
            }}
          >
            Select arguments from list
          </h6>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "0.5rem",
              marginBottom: 8,
              background: "white",
              width: "80%",
              margin: "0 auto",
              minHeight: "48px",
            }}
          >
            <Bubbles bubbles={selectedFilters} onRemove={removeBubble} />
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
              displayNames={filteredDisplayNames}
              descriptions={filteredAttrDescs}
            />
            <Button
              variant="success"
              onClick={showCriticalExample}
              className="custom-primary-button"
            >
              Send arguments
            </Button>
            {argumentsSent && !hasCounterExamples && (
              <Button variant="outline-success" onClick={doneWithArgumentation}>
                Next Example
                <FaArrowRight
                  style={{ marginLeft: "8px", marginBottom: "2px" }}
                />
              </Button>
            )}
          </div>

          <div
            style={{
              width: "100%",
              margin: "0 auto",
              marginTop: "40px",
            }}
          >
            <AttributeList
              attributes={formattedData}
              hasCounterExamples={hasCounterExamples}
              counterExampleIds={counterExampleIds}
              boxplots={boxplots}
              attrTypes={attrTypes}
              selectedFilters={selectedFilters}
              expertAttr={expertAttr}
              displayNames={display_names}
              tooltipDescriptions={tooltipDescs}
              skills={skills}
              onHighClick={(key, value) =>
                addBubble({
                  key,
                  value,
                  operator: ">=",
                  displayName: display_names[key] + " is high",
                })
              }
              onLowClick={(key, value) =>
                addBubble({
                  key,
                  value,
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

        {/* Loading Indicator */}
        {isLoading && (
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
        )}
      </div>
    </>
  );
}

export default ArgumentView;
