// ==========================================
// 1. Histogram Filters (Exercise 6.2)
// ==========================================
function populateFilters(data) {
  const buttons = d3.select("#filters_screen")
    .selectAll("button")
    .data(filters)
    .join("button")
      .attr("class", d => d.isActive ? "filter-btn active" : "filter-btn")
      .text(d => d.label)
      .on("click", (event, selectedFilter) => {
        filters.forEach(f => {
          f.isActive = (f.id === selectedFilter.id);
        });
        buttons.classed("active", d => d.isActive);
        updateHistogram(selectedFilter.id, data);
      });
}

function updateHistogram(selectedTech, data) {
  const updatedData = selectedTech === "all"
    ? data
    : data.filter(d => (d.screenTech || "").toUpperCase() === selectedTech.toUpperCase());

  const updatedBins = binGenerator(updatedData);
  const yMax = d3.max(updatedBins, d => d.length) || 10;
  yScale.domain([0, yMax]).nice();

  d3.select("#histogram .y-axis")
    .transition()
    .duration(transitionDuration)
    .ease(transitionEase)
    .call(d3.axisLeft(yScale).ticks(10));

  const innerChart = d3.select("#histogram svg g");
  const histTooltip = innerChart.select(".histogram-tooltip");

  innerChart.selectAll("rect.histogram-bar")
    .data(updatedBins)
    .join(
      enter => enter.append("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("y", innerHeight)
        .attr("height", 0)
        .attr("fill", barFillColor)
        .attr("stroke", barStrokeColor)
        .attr("stroke-width", 2)
        .on("mouseenter", (e, d) => {
          d3.select(e.target).attr("fill", "#1d4ed8");
          histTooltip.select("text").text(`${d.length} TVs (${Math.round(d.x0)}–${Math.round(d.x1)} kWh)`);
          const barX = xScale(d.x0);
          const barW = Math.max(0, xScale(d.x1) - xScale(d.x0));
          const barY = yScale(d.length);
          const tipX = Math.max(0, Math.min(innerWidth - histTooltipWidth, barX + (barW / 2) - (histTooltipWidth / 2)));
          const tipY = Math.max(0, barY - histTooltipHeight - 8);
          histTooltip.attr("transform", `translate(${tipX}, ${tipY})`).transition().duration(120).style("opacity", 1);
        })
        .on("mouseleave", (e) => {
          d3.select(e.target).attr("fill", barFillColor);
          histTooltip.transition().duration(150).style("opacity", 0);
        })
        .call(enter => enter.transition()
          .duration(transitionDuration)
          .ease(transitionEase)
          .attr("y", d => yScale(d.length))
          .attr("height", d => innerHeight - yScale(d.length))
        ),
      update => update.call(update => update.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length))
      ),
      exit => exit.call(exit => exit.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove()
      )
    );
}

// ==========================================================
// 2. Extension: Scatterplot Tooltip (Brand, Model, Size)
// ==========================================================
function createTooltip() {
  const tooltip = innerChartS.append("g")
    .attr("class", "scatter-tooltip")
    .style("opacity", 0);

  tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", "#0f172a")
    .attr("opacity", 0.95);

  // Line 1: Brand & Model
  tooltip.append("text")
    .attr("class", "tooltip-title")
    .attr("x", tooltipWidth / 2)
    .attr("y", 22)
    .text("");

  // Line 2: Screen Size & Tech
  tooltip.append("text")
    .attr("class", "tooltip-subtitle")
    .attr("x", tooltipWidth / 2)
    .attr("y", 42)
    .text("");
}

function handleMouseEvents() {
  const tooltip = innerChartS.select(".scatter-tooltip");
  const titleText = tooltip.select(".tooltip-title");
  const subText = tooltip.select(".tooltip-subtitle");

  innerChartS.selectAll("circle.scatter-circle")
    .on("mouseenter", (e, d) => {
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // Brand + Model (truncated to fit box comfortably)
      const brandModel = `${d.brand} ${d.model}`.trim();
      const displayTitle = brandModel.length > 20 ? brandModel.substring(0, 18) + "…" : brandModel;

      titleText.text(displayTitle);
      subText.text(`Size: ${d.screenSize}" | ${d.screenTech}`);

      // Clamp position so tooltip remains entirely inside visible area
      const tipX = Math.max(0, Math.min(innerWidthS - tooltipWidth, cx - (tooltipWidth / 2)));
      const tipY = Math.max(0, cy - tooltipHeight - 10);

      tooltip
        .attr("transform", `translate(${tipX}, ${tipY})`)
        .transition()
        .duration(120)
        .style("opacity", 1);

      d3.select(e.target)
        .transition()
        .duration(80)
        .attr("r", 7)
        .attr("opacity", 1);
    })
    .on("mouseleave", (e) => {
      tooltip.transition().duration(150).style("opacity", 0);

      d3.select(e.target)
        .transition()
        .duration(120)
        .attr("r", 4.5)
        .attr("opacity", 0.45);
    });
}

// ==========================================================
// 3. Extension: Dedicated Scatterplot Screen Filters
// ==========================================================
function populateScatterFilters(data) {
  const buttons = d3.select("#filters_scatter")
    .selectAll("button")
    .data(filtersScatter)
    .join("button")
      .attr("class", d => d.isActive ? "filter-btn active" : "filter-btn")
      .text(d => d.label)
      .on("click", (event, selectedFilter) => {
        filtersScatter.forEach(f => {
          f.isActive = (f.id === selectedFilter.id);
        });
        buttons.classed("active", d => d.isActive);
        updateScatterplot(selectedFilter.id, data);
      });
}

function updateScatterplot(selectedTech, data) {
  const updatedData = selectedTech === "all"
    ? data
    : data.filter(d => (d.screenTech || "").toUpperCase() === selectedTech.toUpperCase());

  innerChartS.selectAll("circle.scatter-circle")
    .data(updatedData, d => d.model || (d.starRating + "-" + d.energyConsumption + "-" + Math.random()))
    .join(
      enter => enter.append("circle")
        .attr("class", "scatter-circle")
        .attr("cx", d => xScaleS(d.starRating))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("r", 0)
        .attr("opacity", 0)
        .call(enter => enter.transition()
          .duration(transitionDuration)
          .ease(transitionEase)
          .attr("r", 4.5)
          .attr("opacity", 0.45)
        ),
      update => update.call(update => update.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr("cx", d => xScaleS(d.starRating))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4.5)
        .attr("opacity", 0.45)
      ),
      exit => exit.call(exit => exit.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr("r", 0)
        .attr("opacity", 0)
        .remove()
      )
    );

  // Re-bind mouse events to newly created circles
  handleMouseEvents();
}