import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BoxPlot from "./BoxPlot";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IconButton } from "@mui/material";

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
  onHighClick?: (key: string) => void;
  onLowClick?: (key: string) => void;
};

const AttributeList: React.FC<Props> = ({
  attributes,
  hasCounterExamples,
  boxplots,
  onHighClick,
  onLowClick,
}) => {
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
                padding: "0.5rem 1rem",
              }}
            >
              <Box display="flex" justifyContent="space-around">
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  style={{ flexGrow: 1, textAlign: "right" }}
                >
                  Counter Value 1
                </Typography>
                <Typography
                  variant="caption"
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
              padding: "0.5rem",
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
            }}
          >
            <Grid container alignItems="center">
              <Grid item md={hasCounterExamples ? 8 : 12}>
                <Box display="flex" alignItems="center" height="100%">
                  {/* Label */}
                  <Box flex={1}>
                    <Typography variant="subtitle1">{attr.key}</Typography>
                  </Box>

                  {/* Value */}
                  <Box flex={1} display="flex" justifyContent="flex-end">
                    <Typography variant="body2" fontWeight="bold">
                      {attr.value}
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

                  <Grid item md={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1}
                      height="100%"
                    >
                      {boxplots?.[attr.key] ? (
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
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => onLowClick?.(attr.key)}
                        >
                          <input type="checkbox" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Box>
              </Grid>

              {hasCounterExamples && (
                <>
                  <Grid item md={2}>
                    <Typography variant="body2" align="right" fontWeight="bold">
                      {attr.counterValue1 ?? "-"}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="body2" align="right" fontWeight="bold">
                      {attr.counterValue2 ?? "-"}
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
