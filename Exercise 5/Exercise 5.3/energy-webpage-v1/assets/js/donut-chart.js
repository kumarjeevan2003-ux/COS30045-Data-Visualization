document.addEventListener("DOMContentLoaded", () => {

  // 1. Path to Exercise 5.3 dataset
  const csvPath = "assets/data/Data_exercise 5.3.csv";

  // 2. Load CSV and extract category & count
  d3.csv(csvPath)
    .then(rawRows => {
      console.log("Donut Chart Raw Rows:", rawRows.length);
      if (rawRows.length > 0) {
        console.log("Donut CSV Headers:", Object.keys(rawRows[0]));
        console.log("Donut First Row:", rawRows[0]);
      }

      // Convert rows and coerce count to number
      const data = rawRows.map(d => {
        // Fallback checks for Size category column
        const category = d.size || d.Size || d["Screen Size"] || d["Size_Category"] || Object.values(d)[0];

        // Fallback checks for count / proportion column
        const rawCount = d.count || d.Count || d["Number of Models"] || Object.values(d)[1];

        return {
          category: category ? String(category).trim() : "Unknown",
          count: +String(rawCount).replace(/[^0-9.]/g, "")
        };
      });

      // Filter invalid rows
      const cleanData = data.filter(d => d.category && !isNaN(d.count) && d.count > 0);

      // NOTE: We deliberately do NOT sort here so the logical progression
      // ("Small" -> "Medium" -> "Large") remains intact as ordered in KNIME!
      console.log("Cleaned Donut Data:", cleanData);

      // Render chart
      drawDonutChart(cleanData);
    })
    .catch(error => {
      console.error("Error loading Data_exercise 5.3.csv:", error);
    });

  // ==============================================================
  // Function: drawDonutChart
  // ==============================================================
  const drawDonutChart = data => {

    // 1. Dimensions and Radius Calculation
    const width = 500;
    const height = 500;
    const margin = 40;

    // Radius fits inside the smallest dimension minus padding
    const radius = Math.min(width, height) / 2 - margin;

    // Clear previous elements if reloaded
    d3.select("#donut-chart").selectAll("*").remove();

    // 2. Append SVG with viewBox
    const svg = d3.select("#donut-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // 3. Center the chart group:
    // In pie/donut charts, (0, 0) must be the center of the circle!
    const chartGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 4. Color Scale (Ordinal) - Neon Palette matching theme
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(["#0284c7", "#38bdf8", "#c084fc", "#e879f9"]);

    // 5. Pie Generator: Calculates startAngle and endAngle
    const pieGenerator = d3.pie()
      .value(d => d.count)
      .sort(null); // Keep original dataset order (Small -> Medium -> Large)

    const pieData = pieGenerator(data);

    // 6. Arc Generator: Turns angles into SVG path definitions
    const arcGenerator = d3.arc()
      .innerRadius(radius * 0.58) // Set to 0 if you want a solid Pie Chart
      .outerRadius(radius)
      .padAngle(0.03)            // Gap between slices in radians
      .cornerRadius(6);          // Rounded wedge edges

    // Optional: Larger arc for label placement or hover effect
    const labelArc = d3.arc()
      .innerRadius(radius * 0.60)
      .outerRadius(radius);

    // 7. Draw the Donut Slices
    chartGroup.selectAll("path")
      .data(pieData)
      .join("path")
        .attr("class", "donut-slice")
        .attr("d", arcGenerator)
        .attr("fill", d => colorScale(d.data.category));

    // 8. Add Data Labels using arcGenerator.centroid()
    const labelGroup = chartGroup.selectAll(".donut-label-group")
      .data(pieData)
      .join("g")
        .attr("class", "donut-label-group")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`);

    // Primary Category Name (e.g. "Medium")
    labelGroup.append("text")
      .attr("class", "donut-label")
      .attr("dy", "-0.2em")
      .text(d => d.data.category);

    // Secondary Count / Value (e.g. "412")
    labelGroup.append("text")
      .attr("class", "donut-label donut-label-sub")
      .attr("dy", "1.1em")
      .text(d => `${d.data.count}`);

    // 9. Donut Hole Decoration (Center text)
    chartGroup.append("text")
      .attr("class", "donut-center-title")
      .attr("y", -6)
      .text("TV Sizes");

    const totalCount = d3.sum(data, d => d.count);
    chartGroup.append("text")
      .attr("class", "donut-center-subtitle")
      .attr("y", 16)
      .text(`${totalCount} Total`);

  };

});