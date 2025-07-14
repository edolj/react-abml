import Box from "@mui/material/Box";
import BoxPlot from "./BoxPlot";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { FaChevronUp, FaChevronDown, FaExclamation } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { Argument } from "./ArgumentView";
import { eurAttr, ratioAttr } from "./BoniteteAttributes";

type AttributeItem = {
  key: string;
  value: number | string;
  counterValue1?: number | string;
  counterValue2?: number | string;
};

type Props = {
  attributes: AttributeItem[];
  hasCounterExamples: boolean;
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
      return `${Number(value).toLocaleString("sl-SI", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} €`;
    }

    if (ratioAttr.includes(key)) {
      return Number(value).toLocaleString("sl-SI", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return value;
  };

  return (
    <Grid container>
      {/* Header row */}
      {hasCounterExamples && (
        <Grid container item md={12}>
          <Grid item md={8} />
          <Grid item md={4}>
            <Paper
              elevation={0}
              style={{
                padding: "1rem 1rem",
                backgroundColor: "#f8d7da",
              }}
            >
              <Box display="flex" justifyContent="space-around">
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  style={{ flexGrow: 1, textAlign: "right" }}
                >
                  Counter Value 1
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  style={{ flexGrow: 1, textAlign: "right" }}
                >
                  Counter Value 2
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {attributes.map((attr, index) => (
        <Grid item md={12} key={attr.key}>
          <Paper
            elevation={0}
            style={{
              padding: "0 0.5rem 0 1rem",
              backgroundColor:
                attrTypes?.[attr.key] === "target"
                  ? "#d1e7dd"
                  : index % 2 === 0
                  ? "#ececec"
                  : "#ffffff",
            }}
          >
            <Grid container alignItems="center">
              <Grid item md={hasCounterExamples ? 8 : 12}>
                <Box display="flex" alignItems="center" height="100%">
                  {/* Label */}
                  <Box flex={1} display="flex" alignItems="center" gap={1}>
                    {expertAttr.includes(attr.key) && (
                      <FaExclamation color="#d9534f" size={14} />
                    )}
                    <Tooltip
                      title={tooltipDescriptions?.[attr.key] || ""}
                      arrow
                    >
                      <Typography variant="subtitle1">
                        {displayNames?.[attr.key] ?? attr.key}
                      </Typography>
                    </Tooltip>
                  </Box>

                  {/* Value */}
                  <Box flex={1} display="flex" justifyContent="flex-end">
                    <Typography variant="body2" fontWeight="bold">
                      {formatValue(attr.key, attr.value)}
                    </Typography>
                  </Box>

                  {/* Boxplot */}
                  <Box flex={1}>
                    {boxplots?.[attr.key] && (
                      <BoxPlot
                        data={boxplots[attr.key]}
                        value={Number(attr.value)}
                      />
                    )}
                  </Box>

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "black" }}
                  />

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
                            onClick={() => onHighClick?.(attr.key)}
                          >
                            <FaChevronUp />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onLowClick?.(attr.key)}
                          >
                            <FaChevronDown />
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
                        <Checkbox disabled sx={{ opacity: 0 }} />
                      )}
                    </Box>
                  </Grid>

                  {hasCounterExamples && (
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ borderColor: "black" }}
                    />
                  )}
                </Box>
              </Grid>

              {hasCounterExamples && (
                <>
                  <Grid item md={2}>
                    <Typography variant="body2" align="right" fontWeight="bold">
                      {formatValue(attr.key, attr.counterValue1 ?? "-")}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="body2" align="right" fontWeight="bold">
                      {formatValue(attr.key, attr.counterValue2 ?? "-")}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AttributeList;
