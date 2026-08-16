import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, Stack } from "@mui/material";
import { Typography, Popover, TextField } from "@mui/material";
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
  bound?: string;
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
  const [bktCorrect, setBktCorrect] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<Argument | null>(null);

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
      // Filter out previous entries with the same key
      const filtered = prev.filter((b) => b.key !== newBubble.key);

      if (filtered.length >= 3) {
        toast.warn("You can select up to 3 arguments only.", {
          position: "top-right",
          autoClose: 3000,
        });
        return filtered;
      }

      return [...filtered, newBubble];
    });
  };

  const removeBubble = (keyToRemove: string) => {
    setSelectedFilters((prev) => prev.filter((b) => b.key !== keyToRemove));
  };

  const handleBubbleClick = (
    event: React.MouseEvent<HTMLElement>,
    bubble: Argument
  ) => {
    if (!bubble.operator) { 
      return;
    }

    setAnchorEl(event.currentTarget);
    setSelectedBubble(bubble);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleBoundChange = (value: string) => {
    if (!selectedBubble) return;

    setSelectedFilters((prev) =>
      prev.map((bubble) =>
        bubble.key === selectedBubble.key
          ? { ...bubble, bound: value }
          : bubble
      )
    );

    setSelectedBubble((prev) =>
      prev ? { ...prev, bound: value } : null
    );
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

    const attributes = new Set<string>();
    const [ifPart] = hintBestRule.split(" THEN ");
    const conditions = ifPart.replace(/^IF\s+/i, "").split(/\s+AND\s+/i);

    conditions.forEach((condition) => {
      const match = condition.match(/^([a-zA-Z0-9_./]+)\s*(?:==|<=|>=|!=|<|>)/);

      if (match) {
        attributes.add(match[1]);
      }
    });

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
      toast.warn("Please select at least one argument.");
      return;
    }

    for (const item of selectedFilters) {
      if (item.bound && item.bound.trim() !== "") {
        const boundValue = Number(item.bound);

        if (Number.isNaN(boundValue)) {
          toast.error(
            `Bound for "${item.displayName}" must be a valid number.`
          );
          return;
        }

        const currentValue = Number(item.value);

        if (item.operator === "<=" && boundValue < currentValue) {
          toast.error(
            `Bound for "${item.displayName}" must be greater than or equal to ${item.value}.`
          );
          return;
        }

        if (item.operator === ">=" && boundValue > currentValue) {
          toast.error(
            `Bound for "${item.displayName}" must be less than or equal to ${item.value}.`
          );
          return;
        }
      }
    }

    const userArgument = selectedFilters.map((item) => {
        if (!item.operator) {
          return item.key;
        }

        if (item.bound && item.bound.trim() !== "") {
          return `${item.key}${item.operator}${item.bound}`;
        }

        return `${item.key}${item.operator}`;
      })
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

        const argumentsArray = selectedFilters.map((item) => {
          if (!item.operator) {
            return item.key;
          }

          if (item.bound && item.bound.trim() !== "") {
            return `${item.key}${item.operator}${item.bound}`;
          }

          return `${item.key}${item.operator}`;
        });
        
        setSentArguments(argumentsArray);
        fetchSkills();
        setBktCorrect(data.bkt_correct);

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
        setSummaryData(summaryData);
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
      toast.warn("Please send your arguments first.");
      return;
    }

    // setSelectedFilters([]);

    setShowTransition(true);
    getSummary(summaryData);
  };

  const endIteration = async () => {
    // Data to be sent in the request body
    const requestData = {
      selectedExampleId: idName,
      iteration_number: iterationNumber,
      chosen_arguments: chosenArguments,
      mScore: mScore,
      index: criticalIndex,
      bkt_correct: bktCorrect,
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
    let interval: ReturnType<typeof setInterval>;

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
          {/* {argumentsSent && (
            <Button variant="outline-success" onClick={doneWithArgumentation}>
              Next Example
              <FaArrowRight
                style={{ marginLeft: "8px", marginBottom: "2px" }}
              />
            </Button>
          )} */}
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
              <strong>Quality of arguments</strong>
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

        <div className="box-with-border card-view">
          <h6> Select arguments from list </h6>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "0.5rem",
                marginBottom: 8,
                background: "white",
                width: "100%",
                margin: "0 auto",
                minHeight: "48px",
              }}
            >
              <Bubbles bubbles={selectedFilters} onRemove={removeBubble} onBubbleClick={handleBubbleClick} />
            </div>
            <ExpertAttributesModal
              displayNames={filteredDisplayNames}
              descriptions={filteredAttrDescs}
            />
          </div>
          <div style={{ paddingTop: "10px" }}>
            {alertError && (
              <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
            )}
          </div>
          <div
            style={{
              marginTop: 16,
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <Button
                variant="success"
                onClick={showCriticalExample}
                className="custom-primary-button"
              >
                Send arguments
              </Button>

              {argumentsSent && (
                <Button variant="outline-success" onClick={doneWithArgumentation}>
                  Next Example
                  <FaArrowRight style={{ marginLeft: "8px", marginBottom: "2px" }} />
                </Button>
              )}
            </div>

            {argumentsSent && mScore < 50 && (
              <p
                style={{
                  color: "#6c757d",
                  textAlign: "center",
                  margin: 0,
                  fontSize: "0.95rem",
                }}
              >
                Nice — try using a hint to make your argument even stronger.
              </p>
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

        <Dialog
          open={showTransition}
          onClose={() => setShowTransition(false)}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              borderRadius: 3,
              textAlign: "center",
              py: 3,
              backgroundColor: "#f8f8f8",
            },
          }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(2px)",
              },
            },
          }}
        >
          <DialogContent>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tutor Feedback
              </Typography>
              {summaryLoading && (
                <div
                  className="box-with-border card-view custom-summary-bg"
                  style={{
                    width: "100%",
                    textAlign: "left",
                  }}
                >
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
                    {/* <button
                      className="btn-close"
                      onClick={() => setSummaryText(null)}
                      aria-label="Close"
                    /> */}
                  </div>
                  <div className="card-body">
                    <p className="card-text text-start">{summaryText}</p>
                  </div>
                </div>
              )}
              <Button
                variant="success"
                color="primary"
                onClick={() => endIteration()}
              >
                Continue
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div style={{ padding: 12 }}>
            <TextField
              size="small"
              placeholder="Bound (optional)"
              autoFocus
              value={selectedBubble?.bound ?? ""}
              onChange={(e) => handleBoundChange(e.target.value)}
            />
          </div>
        </Popover>

      </div>
    </>
  );
}

export default ArgumentView;
