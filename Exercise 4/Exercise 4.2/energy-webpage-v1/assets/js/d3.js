// Ensure the DOM is fully loaded before D3 runs
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // STEP 2: Apply styles to HTML elements using D3
  // ==========================================
  
  // Select the main h1 and change its color to bright emerald/green
  d3.select("h1")
    .style("color", "#10b981")
    .style("text-shadow", "0 0 10px rgba(16, 185, 129, 0.4)");

  // Experiment: Select an element by class or id and alter styling
  d3.select(".d3-highlight-target")
    .style("color", "#38bdf8")
    .style("font-weight", "bold");


  // ==========================================
  // STEP 3: Append elements & text using D3
  // ==========================================
  
  // Select the target container and append a dynamic paragraph
  d3.select("#d3-text-container")
    .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!")
    .style("color", "#e879f9")
    .style("font-style", "italic")
    .style("border-left", "3px solid #e879f9")
    .style("padding-left", "0.75rem")
    .style("margin-top", "0.75rem");


  // ==========================================
  // STEP 4: Append SVG elements with attributes using D3
  // ==========================================
  
  // Select the empty <svg> element in the HTML and append a styled <rect>
  d3.select("#d3-canvas")
    .append("rect")
    .attr("x", 50)
    .attr("y", 35)
    .attr("width", 160)
    .attr("height", 50)
    .attr("rx", 6) // rounded corners
    .style("fill", "#10b981")
    .style("stroke", "#34d399")
    .style("stroke-width", "2");

  // Optional: Append a text label inside the SVG next to the rectangle
  d3.select("#d3-canvas")
    .append("text")
    .attr("x", 130)
    .attr("y", 65)
    .attr("text-anchor", "middle")
    .attr("fill", "#05030a")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .text("D3 Rect Bar");

});