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
import { Tab, Tabs } from "react-bootstrap";

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

    return value;
  };

  const renderAttributes = (attrList: AttributeItem[]) => (
    <>
      <Grid item md={12}>
        <Paper
          elevation={0}
          style={{
            backgroundColor: "#343a40",
          }}
        >
          <Grid container alignItems="center">
            <Grid item md={12}>
              <Box display="flex" alignItems="center" height="100%">
                <Grid item md={hasCounterExamples ? 2 : 3}>
                  <Typography fontWeight="bold" sx={{ color: "white", pl: 1 }}>
                    Attribute
                  </Typography>
                </Grid>

                <Grid item md={hasCounterExamples ? 2 : 3}>
                  <Typography
                    fontWeight="bold"
                    align="right"
                    sx={{ color: "white" }}
                  >
                    Value
                  </Typography>
                </Grid>

                <Grid item md={hasCounterExamples ? 2 : 4}></Grid>

                {hasCounterExamples && (
                  <>
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
                          background: "red",
                          color: "white",
                          padding: "0.5rem 0rem",
                        }}
                      >
                        Counter Value 1
                      </Typography>
                    </Grid>

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
                          background: "red",
                          color: "white",
                          padding: "0.5rem 0rem",
                        }}
                      >
                        Counter Value 2
                      </Typography>
                    </Grid>
                  </>
                )}

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
                      Name
                    </Typography>
                  </Grid>
                  <Grid item md={4}></Grid>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />
                  <Grid item md={2}>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{
                        padding: "0.5rem 0",
                      }}
                    >
                      {counterExampleIds?.[0] ?? "-"}
                    </Typography>
                  </Grid>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />

                  <Grid item md={2}>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{
                        padding: "0.5rem 0",
                      }}
                    >
                      {counterExampleIds?.[1] ?? "-"}
                    </Typography>
                  </Grid>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />

                  <Grid item md={2}></Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}

      {attrList.map((attr, index) => (
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

                  {/* Value */}
                  <Grid item md={hasCounterExamples ? 2 : 3}>
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

                  {/*Counter example */}
                  {hasCounterExamples && (
                    <>
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
                          sx={{ pr: 1 }}
                        >
                          {formatValue(attr.key, attr.counterValue1 ?? "-")}
                        </Typography>
                      </Grid>
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
                          sx={{ pr: 1 }}
                        >
                          {formatValue(attr.key, attr.counterValue2 ?? "-")}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />

                  {/*Action */}
                  <Grid item md={2}>
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
                          >
                            <FaChevronDown />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onHighClick?.(attr.key)}
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
                              color: "#607ad1",
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
      ))}
    </>
  );

  return (
    <Tabs defaultActiveKey="expert" className="custom-tabs">
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
