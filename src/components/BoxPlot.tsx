import { useRef, useEffect } from "react";
import * as d3 from "d3";

type BoxPlotProps = {
  data: number[];
  value: number;
  width?: number;
  height?: number;
};

const BoxPlot: React.FC<BoxPlotProps> = ({
  data,
  value,
  width = 200,
  height = 60,
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const sorted = data.slice().sort(d3.ascending);
    const q1 = d3.quantile(sorted, 0.25)!;
    const median = d3.quantile(sorted, 0.5)!;
    const q3 = d3.quantile(sorted, 0.75)!;
    const iqr = q3 - q1;

    const minVal = d3.min(sorted)!;
    const maxVal = d3.max(sorted)!;

    const whiskerMin = Math.max(minVal, q1 - 1.5 * iqr);
    const whiskerMax = Math.min(maxVal, q3 + 1.5 * iqr);

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain([whiskerMin, whiskerMax])
      .range([40, width - 10]);

    const boxY = height / 3;
    const boxHeight = height / 3;

    // Box
    svg
      .append("rect")
      .attr("x", x(q1))
      .attr("y", boxY)
      .attr("width", x(q3) - x(q1))
      .attr("height", boxHeight)
      .attr("fill", "#e3f2fd")
      .attr("stroke", "steelblue");

    // Median
    svg
      .append("line")
      .attr("x1", x(median))
      .attr("x2", x(median))
      .attr("y1", boxY)
      .attr("y2", boxY + boxHeight)
      .attr("stroke", "green")
      .attr("stroke-width", 1);

    // Whiskers
    svg
      .append("line")
      .attr("x1", x(whiskerMin))
      .attr("x2", x(q1))
      .attr("y1", boxY + boxHeight / 2)
      .attr("y2", boxY + boxHeight / 2)
      .attr("stroke", "steelblue");

    svg
      .append("line")
      .attr("x1", x(q3))
      .attr("x2", x(whiskerMax))
      .attr("y1", boxY + boxHeight / 2)
      .attr("y2", boxY + boxHeight / 2)
      .attr("stroke", "steelblue");

    // Small whisker ticks
    const tickHeight = boxHeight / 2;
    svg
      .append("line")
      .attr("x1", x(whiskerMin))
      .attr("x2", x(whiskerMin))
      .attr("y1", boxY + boxHeight / 2 - tickHeight / 2)
      .attr("y2", boxY + boxHeight / 2 + tickHeight / 2)
      .attr("stroke", "steelblue");

    svg
      .append("line")
      .attr("x1", x(whiskerMax))
      .attr("x2", x(whiskerMax))
      .attr("y1", boxY + boxHeight / 2 - tickHeight / 2)
      .attr("y2", boxY + boxHeight / 2 + tickHeight / 2)
      .attr("stroke", "steelblue");

    // Red value line
    const clampedValue = Math.max(whiskerMin, Math.min(whiskerMax, value));
    svg
      .append("line")
      .attr("x1", x(clampedValue))
      .attr("x2", x(clampedValue))
      .attr("y1", boxY - 5) // 5px above box
      .attr("y2", boxY + boxHeight + 5) // 5px below box
      .attr("stroke", "red")
      .attr("stroke-width", 1);
  }, [data, value, width, height]);

  return <svg ref={ref} width={width} height={height} />;
};

export default BoxPlot;
