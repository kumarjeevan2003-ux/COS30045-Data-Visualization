document.addEventListener("DOMContentLoaded", () => {

  // 1. Setup the Responsive SVG Canvas (from Ex 4.3)
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 1200 1600")
      .style("border", "1px solid #334155");

  // 2. Load and Type Data (from Ex 4.4)
  const csvPath = "assets/data/TVdata.csv"; // Ensure this matches your file path

  d3.csv(csvPath, d => {
    return {
      brand: d.brand,
      count: +d.count
    };
  })
  .then(data => {
    // Sort descending so the largest bars render first
    data.sort((a, b) => d3.descending(a.count, b.count));

    // Pass the loaded dataset and the svg reference to the rendering function
    drawBarChart(data, svg);
  })
  .catch(error => {
    console.error("Error loading CSV file:", error);
  });

});

// ==============================================================
// EXERCISE 4.5: Bind Data and Render Horizontal Bars
// ==============================================================
const drawBarChart = (data, svg) => {

  // Step 2: Define dimensions and spacing constants
  const barHeight = 20;     // Fixed thickness of each bar
  const barSpacing = 4;     // Gap between adjacent bars

  // Step 1: Bind data to rect elements using the D3 join pattern
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      // Assign dynamic class based on the count attribute
      .attr("class", d => `bar bar-${d.count}`)

      // Step 3: Horizontal starting coordinate (anchored at left)
      .attr("x", 0)

      // Step 3: Space bars vertically along the Y-axis using the index (i)
      .attr("y", (d, i) => i * (barHeight + barSpacing))

      // Step 2: Set width directly based on the count data
      .attr("width", d => d.count)

      // Step 2: Set bar thickness
      .attr("height", barHeight)

      // Styling: Use theme neon cyan fill
      .attr("fill", "#38bdf8");

};