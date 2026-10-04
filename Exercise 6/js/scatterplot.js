function drawScatterplot(data) {
  d3.select("#scatterplot").selectAll("*").remove();

  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${widthS} ${heightS}`)
      .attr("width", "100%")
      .attr("height", "auto");

  innerChartS = svg.append("g")
    .attr("transform", `translate(${marginS.left}, ${marginS.top})`);

  const maxStar = d3.max(data, d => d.starRating) || 10;
  xScaleS.domain([1, maxStar]).nice();

  const maxEnergy = d3.max(data, d => d.energyConsumption) || 1800;
  yScaleS.domain([0, maxEnergy]).nice();

  // Draw points with opacity for overplotting
  innerChartS.selectAll("circle.scatter-circle")
    .data(data)
    .join("circle")
      .attr("class", "scatter-circle")
      .attr("cx", d => xScaleS(d.starRating))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 4.5)
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.45);

  // X-Axis
  const xAxis = d3.axisBottom(xScaleS).ticks(10);
  innerChartS.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeightS})`)
    .call(xAxis);

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", innerWidthS / 2)
    .attr("y", innerHeightS + 45)
    .text("Star Rating");

  // Y-Axis
  const yAxis = d3.axisLeft(yScaleS).ticks(10);
  innerChartS.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeightS / 2)
    .attr("y", -50)
    .text("Energy Consumption (kWh / year)");

  // Top-Right Legend
  const legend = innerChartS.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidthS + 20}, 10)`);

  screenCategories.forEach((cat, index) => {
    const legendRow = legend.append("g")
      .attr("class", "legend-item")
      .attr("transform", `translate(0, ${index * 24})`);

    legendRow.append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 3)
      .attr("fill", colorScale(cat));

    legendRow.append("text")
      .attr("x", 22)
      .attr("y", 11)
      .text(cat);
  });
}