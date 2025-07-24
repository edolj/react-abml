import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import { getObject } from "../api/apiHomePage";
import apiClient from "../api/apiClient";
import "react-toastify/dist/ReactToastify.css";
import "../css/PrimaryButton.css";
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

export type AttributeInfo = {
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
  const targetClassName = location.state.targetClassName;
  const iterationNumber = location.state.iterationNumber;

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
  const [chosenArguments, setSentArguments] = useState<string[]>([]);

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

        const argumentsArray = selectedFilters.map((item) =>
          item.operator ? `${item.key}${item.operator}` : item.key
        );
        setSentArguments(argumentsArray);
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
      setAlertError("The argument field cannot be empty!");
      return;
    }

    try {
      await apiClient.post("/post-data-iterations/", {
        iteration_number: iterationNumber,
        chosen_arguments: chosenArguments,
        mScore: mScore,
      });
      console.log("Success with saving argumentation data.");

      await apiClient.put("/update-iteration/");
      console.log("Iteration updated successfully.");

      navigate(-1);
    } catch (error) {
      console.error("Error during argumentation submission:", error);
      setAlertError("Failed to submit data. Please try again.");
    }
  };

  const processRule = (rule: string) => {
    const [ifPart, thenPart] = rule.split(" THEN ");
    const conditionStr = ifPart.replace(/^IF\s*/i, "");

    const conditions = conditionStr.split(" AND ").map((cond) => {
      const match = cond.match(/^(.+?)([<>=!]=|==)(.+)$/);
      if (!match) return cond;

      const [, rawAttr, op, value] = match;
      const attr = rawAttr.trim();
      const type = attrTypes[attr] || "continuous";
      const displayName = display_names[attr] || attr;

      let opText = "";
      if (op === ">=") opText = "is high";
      else if (op === "<=") opText = "is low";
      else if (op === "==") opText = "equals";
      else opText = op;

      if (type === "discrete") {
        return `${displayName} ${opText} ${value.trim()}`;
      } else {
        return `${displayName} ${opText}`;
      }
    });

    let transformedThen = thenPart.trim();
    const thenMatch = transformedThen.match(/^(.+?)(==|=|[<>!]=)(.+)$/);
    if (thenMatch) {
      const [, thenAttr, thenOp, thenValue] = thenMatch;
      const thenDisplayName = display_names[thenAttr.trim()] || thenAttr.trim();
      transformedThen = `${thenDisplayName} ${thenOp} ${thenValue.trim()}`;
    }

    return `IF ${conditions.join(" AND ")} THEN ${transformedThen}`;
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
              {targetClassName}: <b style={{ color: "green" }}>{targetClass}</b>
            </span>
          </div>
          {argumentsSent && (
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
