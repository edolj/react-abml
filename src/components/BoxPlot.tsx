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
  height = 80,
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Compute boxplot stats
    const sorted = data.slice().sort(d3.ascending);
    const q1 = d3.quantile(sorted, 0.25)!;
    const median = d3.quantile(sorted, 0.5)!;
    const q3 = d3.quantile(sorted, 0.75)!;
    const min = d3.min(sorted)!;
    const max = d3.max(sorted)!;

    // Clear previous drawing
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Scales
    const x = d3
      .scaleLinear()
      .domain([min, max])
      .range([60, width - 10]);

    // Draw box
    svg
      .append("rect")
      .attr("x", x(q1))
      .attr("y", height / 3)
      .attr("width", x(q3) - x(q1))
      .attr("height", height / 3)
      .attr("fill", "#e3f2fd")
      .attr("stroke", "steelblue");

    // Median line
    svg
      .append("line")
      .attr("x1", x(median))
      .attr("x2", x(median))
      .attr("y1", height / 3)
      .attr("y2", (height * 2) / 3)
      .attr("stroke", "green")
      .attr("stroke-width", 1);

    // Whiskers
    svg
      .append("line")
      .attr("x1", x(min))
      .attr("x2", x(q1))
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "steelblue");

    svg
      .append("line")
      .attr("x1", x(q3))
      .attr("x2", x(max))
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "steelblue");

    // Min and max ticks
    svg
      .append("line")
      .attr("x1", x(min))
      .attr("x2", x(min))
      .attr("y1", height / 3 - 5)
      .attr("y2", (height * 2) / 3 + 5)
      .attr("stroke", "steelblue");

    svg
      .append("line")
      .attr("x1", x(max))
      .attr("x2", x(max))
      .attr("y1", height / 3 - 5)
      .attr("y2", (height * 2) / 3 + 5)
      .attr("stroke", "steelblue");

    svg
      .append("line")
      .attr("x1", x(value))
      .attr("x2", x(value))
      .attr("y1", height / 3 - 5)
      .attr("y2", (height * 2) / 3 + 5)
      .attr("stroke", "red")
      .attr("stroke-width", 1);
  }, [data, width, height]);

  return <svg ref={ref} width={width} height={height} />;
};

export default BoxPlot;
