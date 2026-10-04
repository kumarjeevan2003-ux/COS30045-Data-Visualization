document.addEventListener("DOMContentLoaded", () => {

  const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 500 500")
      .style("border", "1px solid black");

  d3.csv("assets/data/TVdata.csv", d => {
    return {
      brand: d.brand,
      count: +d.count
    };
  }).then(data => {
    console.log(data);
    console.log("Length:", data.length);
    console.log("Max:", d3.max(data, d => d.count));
    console.log("Min:", d3.min(data, d => d.count));

    // Sort descending (highest counts first)
    data.sort((a, b) => b.count - a.count);

    drawBarChart(data);
  }).catch(error => {
    console.error("Error loading CSV:", error);
  });

  const drawBarChart = data => {
    // Continuous scale for bar width (max 400 leaves space for labels)
    const xScale = d3.scaleLinear()
      .domain([0, 1100])
      .range([0, 400]);

    // Band scale for vertical category placement
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.brand))
      .range([0, 500])
      .padding(0.1);

    // Bind data and render bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", 0)
      .attr("y", d => yScale(d.brand))
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue");
  };

});