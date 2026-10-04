document.addEventListener("DOMContentLoaded", () => {
  // Step 2: Append responsive SVG with viewBox
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 1200 1600")
      .style("border", "1px solid #334155"); // Subtle border matching dark theme

  // Step 3: Add test hardcoded rectangle
  svg
    .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 414)
      .attr("height", 16)
      .attr("fill", "#38bdf8"); // Bright neon cyan
});