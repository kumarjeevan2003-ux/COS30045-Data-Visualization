document.addEventListener("DOMContentLoaded", () => {

  // 1. Path to data file
  const csvPath = "assets/data/ARE_Spot_Prices.csv";

  // 2. Load CSV and extract Year and Average Price
  d3.csv(csvPath)
    .then(rawRows => {
      console.log("Spot Prices Raw Rows:", rawRows.length);
      if (rawRows.length > 0) {
        console.log("CSV Column Headers:", Object.keys(rawRows[0]));
      }

      // Format & clean data
      const data = rawRows.map(d => {
        // Find Year column (handles 'Year', 'year', or first column)
        const rawYear = d.Year || d.year || Object.values(d)[0];

        // Find Average Price column (handles 'Average', 'average', or last column)
        const rawPrice = d.Average || d.average || d["Average Price"] || Object.values(d)[Object.values(d).length - 1];

        return {
          year: +String(rawYear).trim(),
          price: +String(rawPrice).replace(/[^0-9.]/g, "")
        };
      });

      // Filter out invalid records
      const cleanData = data.filter(d => !isNaN(d.year) && !isNaN(d.price) && d.year > 0);

      // Sort chronologically ascending
      cleanData.sort((a, b) => a.year - b.year);

      console.log("Cleaned Spot Prices Data:", cleanData);

      // Render chart
      drawLineChart(cleanData);
    })
    .catch(error => {
      console.error("Error loading ARE_Spot_Prices.csv:", error);
    });

  // ==============================================================
  // Function: drawLineChart
  // ==============================================================
  const drawLineChart = data => {

    // 1. Margins & Dimensions (matching Ex 5.1 with wide left margin for labels)
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 60, left: 85 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Reset container in case of hot-reload
    d3.select("#line-chart").selectAll("*").remove();

    // 2. Append SVG container with responsive viewBox
    const svg = d3.select("#line-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Optional: Subtle neon gradient under the line
    const defs = svg.append("defs");
    const areaGradient = defs.append("linearGradient")
      .attr("id", "lineGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    areaGradient.append("stop").attr("offset", "0%").attr("stop-color", "#38bdf8").attr("stop-opacity", 0.5);
    areaGradient.append("stop").attr("offset", "100%").attr("stop-color", "#38bdf8").attr("stop-opacity", 0.0);

    // 3. Create innerChart group
    const innerChart = svg.append("g")
      .attr("id", "inner-line-chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 4. Scales
    // X-Scale: continuous linear scale spanning [1998, 2024]
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);

    // Y-Scale: continuous inverted linear scale [0, maxPrice + padding]
    const maxPrice = d3.max(data, d => d.price);
    const yScale = d3.scaleLinear()
      .domain([0, maxPrice * 1.1])
      .range([innerHeight, 0])
      .nice();

    // 5. Draw Axes
    // X-Axis: formatted with d3.format("d") so years are integers (e.g. 2005 not 2005.5)
    const xAxis = d3.axisBottom(xScale)
      .ticks(data.length > 15 ? 10 : data.length)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0);

    innerChart.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    // X-Axis Title
    innerChart.append("text")
      .attr("class", "axis-title")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 45)
      .attr("text-anchor", "middle")
      .text("Year");

    // Y-Axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `$${d}`);

    innerChart.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    // Y-Axis Title (rotated, positioned safely inside margin.left)
    innerChart.append("text")
      .attr("class", "axis-title")
      .attr("x", -innerHeight / 2)
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Average Price ($/MWh)");

    // 6. Draw Gradient Area Beneath the Line (Optional visual extension)
    const areaGenerator = d3.area()
      .x(d => xScale(d.year))
      .y0(innerHeight)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX);

    innerChart.append("path")
      .attr("class", "price-area")
      .attr("d", areaGenerator(data));

    // 7. Define D3 Line Generator
    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX); // Smooth interpolation curve

    // Draw the continuous path
    innerChart.append("path")
      .attr("class", "price-line")
      .attr("d", lineGenerator(data));

    // 8. Draw Scatter Plot Points (Circles)
    innerChart.selectAll(".data-point")
      .data(data)
      .join("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.price))
        .attr("r", 4); // circle radius

  };

});