document.addEventListener("DOMContentLoaded", () => {

  // 1. Setup the Responsive SVG Canvas with ViewBox
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 500 500")
      .style("border", "1px solid #334155");

  // 2. Load and Type Data from CSV
  const csvPath = "assets/data/TVdata.csv"; // Or "../data/tvBrandCount.csv" based on your setup

  d3.csv(csvPath, d => {
    return {
      brand: d.brand,
      count: +d.count
    };
  }).then(data => {
    console.log("Loaded dataset:", data);
    console.log("Total categories:", data.length);
    console.log("Max count:", d3.max(data, d => d.count));
    console.log("Min count:", d3.min(data, d => d.count));

    // Sort descending (highest counts first)
    data.sort((a, b) => b.count - a.count);

    // Call drawBarChart to render elements
    drawBarChart(data);
  }).catch(error => {
    console.error("Error loading CSV file:", error);
  });

  // ==============================================================
  // EXERCISE 4.7: Render Chart with Unified <g> Groups & Labels
  // ==============================================================
  const drawBarChart = data => {

    // Step 1: Scale tailored for a 100px left margin and 500px viewBox
    // [0, 330] leaves sufficient room for counts past the bar tip
    const maxVal = d3.max(data, d => d.count);
    const xScale = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([0, 330]);

    // Band scale for vertical category placement
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.brand))
      .range([0, 500])
      .padding(0.18);

    // Step 2: Create a <g> element for each data item and translate vertically
    const barAndLabel = svg
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // Step 3: Append the Rectangle (y is 0 because the group is translated)
    barAndLabel
      .append("rect")
        .attr("x", 100)                     // 100px left offset for brand labels
        .attr("y", 0)                       // Reset to 0 to avoid double offset
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#0284c7")            // Vibrant electric cyan/blue
        .attr("rx", 3);                     // Subtle rounded corner

    // Step 4: Brand Name Label (Left of bar, right-aligned)
    barAndLabel
      .append("text")
        .text(d => d.brand)
        .attr("x", 92)                      // Positioned just before x=100
        .attr("y", yScale.bandwidth() / 2)  // Centered vertically on the bar
        .attr("dy", "0.35em")               // Precise typographic alignment
        .attr("text-anchor", "end")         // Right-justified against the bar
        .attr("fill", "#f8fafc")            // High contrast off-white
        .style("font-size", "12px")
        .style("font-family", "sans-serif");

    // Step 5: Count Value Label (Right of bar)
    barAndLabel
      .append("text")
        .text(d => d.count)
        .attr("x", d => 100 + xScale(d.count) + 6) // Anchored right past the bar
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#eef1f1")            // Electric cyan accent
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("font-family", "sans-serif");

  };

});