import React from "react";
import Box from "@mui/material/Box";
import BoxPlot from "./BoxPlot";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { FaChevronUp, FaChevronDown, FaExclamation } from "react-icons/fa";
import { eurAttr, ratioAttr } from "./BoniteteAttributes";
import { IconButton } from "@mui/material";
import { Argument } from "./ArgumentView";
import { ProgressBar, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";

type AttributeItem = {
  key: string;
  value: number | string;
  counterValue1?: number | string;
  counterValue2?: number | string;
};

type Props = {
  attributes: AttributeItem[];
  hasCounterExamples: boolean;
  counterExampleIds?: string[];
  boxplots?: Record<string, number[]>;
  attrTypes?: Record<string, string>;
  selectedFilters?: Argument[];
  expertAttr: string[];
  displayNames?: Record<string, string>;
  tooltipDescriptions?: Record<string, string>;
  skills?: Record<string, number>;
  onHighClick?: (key: string) => void;
  onLowClick?: (key: string) => void;
  onCategoryAddClick?: (key: string) => void;
  onCategoryDeleteClick?: (key: string) => void;
};

const AttributeList: React.FC<Props> = ({
  attributes,
  hasCounterExamples,
  counterExampleIds,
  boxplots,
  attrTypes,
  selectedFilters,
  expertAttr,
  displayNames,
  tooltipDescriptions,
  skills,
  onHighClick,
  onLowClick,
  onCategoryAddClick,
  onCategoryDeleteClick,
}) => {
  const formatValue = (key: string, value: string | number) => {
    if (value === "" || value === undefined || value === null) return "-";

    if (eurAttr.includes(key)) {
      return (
        Number(value).toLocaleString("sl-SI", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) + " €"
      );
    }

    if (ratioAttr.includes(key)) {
      return (
        Number(value).toLocaleString("sl-SI", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " %"
      );
    }

    if (attrTypes?.[key] == "continuous") {
      return Number(value).toLocaleString("sl-SI", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return value;
  };

  const [activeTab, setActiveTab] = useState("expert");

  const renderAttributes = (attrList: AttributeItem[]) => (
    <>
      <Grid item md={12}>
        <Paper elevation={0} style={{ backgroundColor: "#4e66c1" }}>
          <Grid container alignItems="center">
            <Grid item md={12}>
              <Box display="flex" alignItems="center" height="100%">
                <Grid item md={hasCounterExamples ? 2 : 3}>
                  <Typography fontWeight="bold" sx={{ color: "white", pl: 1 }}>
                    Attribute
                  </Typography>
                </Grid>

                <Grid item md={1}>
                  {activeTab === "expert" && (
                    <Tooltip title="Learning Progress" arrow>
                      <Typography align="center" variant="subtitle1">
                        🎯
                      </Typography>
                    </Tooltip>
                  )}
                </Grid>

                <Grid item md={2}>
                  <Typography
                    fontWeight="bold"
                    align="right"
                    sx={{ color: "white" }}
                  >
                    Value
                  </Typography>
                </Grid>

                <Grid item md={hasCounterExamples ? 2 : 4}></Grid>

                {hasCounterExamples &&
                  counterExampleIds?.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "lightgray" }}
                      />
                      <Grid item md={2}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          align="center"
                          sx={{
                            background: "#b33a3a",
                            color: "white",
                            padding: "0.5rem 0rem",
                          }}
                        >
                          Counter Value {idx + 1}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  ))}

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: "lightgray" }}
                />

                <Grid
                  item
                  md={
                    hasCounterExamples
                      ? 12 -
                        (2 + 1 + 2 + 2 + (counterExampleIds?.length ?? 0) * 2)
                      : 2
                  }
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    align="center"
                    sx={{
                      color: "white",
                      padding: "0.5rem 0rem",
                    }}
                  >
                    Select
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {hasCounterExamples && (
        <Grid item md={12}>
          <Paper elevation={0}>
            <Grid container alignItems="center">
              <Grid item md={12}>
                <Box display="flex" alignItems="center" height="100%">
                  <Grid item md={2}>
                    <Typography variant="subtitle1" sx={{ pl: 1 }}>
                      ID
                    </Typography>
                  </Grid>
                  <Grid item md={5}></Grid>

                  {counterExampleIds &&
                    counterExampleIds
                      .filter((v) => v !== undefined)
                      .map((val, idx) => (
                        <React.Fragment key={idx}>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ borderColor: "black" }}
                          />
                          <Grid item md={2}>
                            <Typography
                              variant="body1"
                              align="center"
                              sx={{ padding: "0.5rem" }}
                            >
                              {val}
                            </Typography>
                          </Grid>
                        </React.Fragment>
                      ))}

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />

                  {counterExampleIds && (
                    <Grid
                      item
                      md={12 - (2 + 5 + counterExampleIds.length * 2)}
                    ></Grid>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}

      {attrList.map((attr, index) => {
        const isLowActive = selectedFilters?.some(
          (f) => f.key === attr.key && f.operator === "<="
        );

        const isHighActive = selectedFilters?.some(
          (f) => f.key === attr.key && f.operator === ">="
        );

        const progress = skills?.[attr.key] ?? null;

        const counterValues = [attr.counterValue1, attr.counterValue2].filter(
          (v) => v !== undefined
        );
        const counterCount = counterValues.length;
        const selectMd = hasCounterExamples
          ? 12 - (2 + 1 + 2 + 2 + counterCount * 2)
          : 2;

        return (
          <Grid item md={12} key={attr.key}>
            <Paper
              elevation={0}
              style={{
                backgroundColor:
                  attrTypes?.[attr.key] === "target"
                    ? "#d1e7dd"
                    : index % 2 === 0
                    ? "#ececec"
                    : "#ffffff",
              }}
            >
              <Grid container alignItems="center">
                <Grid item md={12}>
                  <Box display="flex" alignItems="center" height="100%">
                    {/* Label */}
                    <Grid item md={hasCounterExamples ? 2 : 3}>
                      <Tooltip
                        title={tooltipDescriptions?.[attr.key] || ""}
                        arrow
                      >
                        <Typography variant="subtitle1" sx={{ pl: 1 }}>
                          {displayNames?.[attr.key] ?? attr.key}
                        </Typography>
                      </Tooltip>
                    </Grid>

                    {/* Skill mastery */}
                    <Grid item md={1}>
                      {progress !== null && (
                        <ProgressBar
                          now={progress * 100}
                          label={`${(progress * 100).toFixed(0)}%`}
                          variant={
                            progress < 0.4
                              ? "danger"
                              : progress < 0.6
                              ? "warning"
                              : progress < 0.8
                              ? "info"
                              : "success"
                          }
                          striped
                          style={{
                            background: "lightgray",
                            fontSize: "0.55rem",
                          }}
                        />
                      )}
                    </Grid>

                    {/* Value */}
                    <Grid item md={2}>
                      <Typography
                        variant="body2"
                        align="right"
                        fontWeight="bold"
                        sx={{ pl: 1 }}
                      >
                        {formatValue(attr.key, attr.value)}
                      </Typography>
                    </Grid>

                    {/* Boxplot */}
                    <Grid item md={hasCounterExamples ? 2 : 4}>
                      {boxplots?.[attr.key] && (
                        <Box display="flex" justifyContent="center">
                          <BoxPlot
                            data={boxplots[attr.key]}
                            value={Number(attr.value)}
                          />
                        </Box>
                      )}
                    </Grid>

                    {/* Counter example */}
                    {counterValues.map((val, idx) => (
                      <React.Fragment key={idx}>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ borderColor: "black" }}
                        />
                        <Grid item md={2}>
                          <Typography
                            variant="body2"
                            align="right"
                            fontWeight="bold"
                            sx={{
                              pr: 1,
                              color:
                                attrTypes?.[attr.key] === "target"
                                  ? "red"
                                  : "inherit",
                            }}
                          >
                            {formatValue(attr.key, val)}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}

                    {/* Divider */}
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ borderColor: "black" }}
                    />

                    {/*Action */}
                    <Grid item md={selectMd}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                        height="100%"
                      >
                        {attrTypes?.[attr.key] === "continuous" ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => onLowClick?.(attr.key)}
                              sx={{
                                color: isLowActive ? "#1976d2" : "inherit",
                              }}
                            >
                              <FaChevronDown />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onHighClick?.(attr.key)}
                              sx={{
                                color: isHighActive ? "#1976d2" : "inherit",
                              }}
                            >
                              <FaChevronUp />
                            </IconButton>
                          </>
                        ) : attrTypes?.[attr.key] === "discrete" ? (
                          <Checkbox
                            checked={selectedFilters?.some(
                              (f) => f.key === attr.key
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onCategoryAddClick?.(attr.key);
                              } else {
                                onCategoryDeleteClick?.(attr.key);
                              }
                            }}
                            sx={{
                              "&.Mui-checked": {
                                color: "#1976d2",
                              },
                            }}
                          />
                        ) : (
                          <Checkbox
                            disabled
                            checked={false}
                            sx={{ opacity: 0 }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        );
      })}
    </>
  );

  return (
    <Tabs
      defaultActiveKey="expert"
      className="custom-tabs"
      activeKey={activeTab}
      onSelect={(k) => k && setActiveTab(k)}
    >
      <Tab
        eventKey="expert"
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{ color: "red", display: "flex", alignItems: "center" }}
            >
              <FaExclamation />
            </span>
            Expert
          </span>
        }
      >
        <div className="pt-3">
          <Grid container>
            {renderAttributes(
              attributes.filter(
                (attr) =>
                  expertAttr.includes(attr.key) ||
                  attrTypes?.[attr.key] === "target"
              )
            )}
          </Grid>
        </div>
      </Tab>

      <Tab eventKey="others" title="Other">
        <div className="pt-3">
          <Grid container>
            {renderAttributes(
              attributes.filter((attr) => !expertAttr.includes(attr.key))
            )}
          </Grid>
        </div>
      </Tab>
    </Tabs>
  );
};

export default AttributeList;
