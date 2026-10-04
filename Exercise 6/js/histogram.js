function drawHistogram(data) {
  d3.select("#histogram").selectAll("*").remove();

  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "auto");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const filteredData = data.filter(d => d.energyConsumption <= 1800);
  const bins = binGenerator(filteredData);

  const xMin = bins[0].x0;
  const xMax = bins[bins.length - 1].x1;
  const yMax = d3.max(bins, d => d.length);

  xScale.domain([xMin, xMax]).nice();
  yScale.domain([0, yMax]).nice();

  // Create Histogram Tooltip element inside the chart
  const histTooltip = innerChart.append("g")
    .attr("class", "histogram-tooltip")
    .style("opacity", 0);

  histTooltip.append("rect")
    .attr("width", histTooltipWidth)
    .attr("height", histTooltipHeight)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", "#0f172a")
    .attr("opacity", 0.92);

  histTooltip.append("text")
    .attr("x", histTooltipWidth / 2)
    .attr("y", histTooltipHeight / 2)
    .text("");

  // Draw Bars with Mouse Events
  innerChart.selectAll("rect.histogram-bar")
    .data(bins)
    .join("rect")
      .attr("class", "histogram-bar")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barFillColor)
      .attr("stroke", barStrokeColor)
      .attr("stroke-width", 2)
      .on("mouseenter", (e, d) => {
        d3.select(e.target).attr("fill", "#1d4ed8");

        histTooltip.select("text")
          .text(`${d.length} TVs (${Math.round(d.x0)}–${Math.round(d.x1)} kWh)`);

        const barX = xScale(d.x0);
        const barW = Math.max(0, xScale(d.x1) - xScale(d.x0));
        const barY = yScale(d.length);

        const tipX = Math.max(0, Math.min(innerWidth - histTooltipWidth, barX + (barW / 2) - (histTooltipWidth / 2)));
        const tipY = Math.max(0, barY - histTooltipHeight - 8);

        histTooltip
          .attr("transform", `translate(${tipX}, ${tipY})`)
          .transition()
          .duration(120)
          .style("opacity", 1);
      })
      .on("mouseleave", (e) => {
        d3.select(e.target).attr("fill", barFillColor);
        histTooltip.transition().duration(150).style("opacity", 0);
      });

  // Axes
  const xAxis = d3.axisBottom(xScale).ticks(12);
  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 50)
    .text("Energy Consumption (kWh / year)");

  const yAxis = d3.axisLeft(yScale).ticks(10);
  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -50)
    .text("Number of TV Models");
}