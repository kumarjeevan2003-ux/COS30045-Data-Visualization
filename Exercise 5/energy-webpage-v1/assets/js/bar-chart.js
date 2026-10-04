document.addEventListener("DOMContentLoaded", () => {
  // 1. Path to your Exercise 5.1 CSV
  const csvPath = "assets/data/Data_exercise5.1.csv";

  // 2. Load CSV and parse rows
  d3.csv(csvPath)
    .then(rawRows => {
      console.log("1. Total rows loaded:", rawRows.length);
      if (rawRows.length > 0) {
        console.log("2. Detected CSV Column Headers:", Object.keys(rawRows[0]));
        console.log("3. Raw First Row Sample:", rawRows[0]);
      }

      // Convert rows and coerce numbers
      const data = rawRows.map(d => {
        // Detect screen technology column dynamically
        const screen = d["Screen Technology"] || 
                       d["Screen_Technology"] || 
                       d["screenType"] || 
                       d["Screen_Type"] || 
                       d["screen_tech"] ||
                       Object.values(d)[0]; // Fallback to 1st column

        // Detect energy column dynamically and clean non-numeric characters
        const rawEnergy = d["Mean(Energy Consumption)"] || 
                          d["Mean(Energy_Consumption)"] || 
                          d["energy"] || 
                          d["Energy"] || 
                          d["Energy Consumption"] ||
                          Object.values(d)[1]; // Fallback to 2nd column

        return {
          screenType: screen ? String(screen).trim() : "Unknown",
          energy: +String(rawEnergy).replace(/[^0-9.]/g, "")
        };
      });

      // Filter out invalid or zero-energy rows
      const cleanData = data.filter(d => d.screenType && !isNaN(d.energy) && d.energy > 0);
      console.log("4. Cleaned Data for Chart:", cleanData);

      if (cleanData.length === 0) {
        console.error("No valid data could be mapped. Check your CSV column headers!");
        return;
      }

      // Sort descending: highest energy consumption first
      cleanData.sort((a, b) => b.energy - a.energy);

      // Render the chart
      drawBarChart(cleanData);
    })
    .catch(error => {
      console.error("Error loading CSV file:", error);
    });

  // ==============================================================
  // Function: drawBarChart
  // ==============================================================
  const drawBarChart = data => {
    // 1. Dimensions and Margins
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 60, left: 150 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear any existing chart inside the container before rendering
    d3.select("#bar-chart").selectAll("*").remove();

    // 2. Append SVG with viewBox
    const svg = d3.select("#bar-chart")
      .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid #38245c")
        .style("border-radius", "8px");

    // 3. Create the innerChart group translated to margin offsets
    const innerChart = svg.append("g")
      .attr("id", "inner-chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 4. Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.screenType))
      .range([0, innerWidth])
      .padding(0.35);

    const maxY = d3.max(data, d => d.energy);
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.15]) // 15% headroom for value labels
      .range([innerHeight, 0])
      .nice();

    // 5. Draw Axes
    // X-Axis
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    innerChart.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
        .style("font-size", "13px")
        .style("font-weight", "600");

    // Y-Axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `${d} kWh`);

    innerChart.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    // Y-Axis Title Label
    innerChart.append("text")
      .attr("class", "axis-title")
      .attr("x", -innerHeight / 2)
      .attr("y", -90)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh/yr)");

    // 6. Draw Bars
    innerChart.selectAll(".bar")
      .data(data)
      .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.screenType))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.energy))
        .attr("rx", 4);

    // 7. Value Labels on top of each bar
    innerChart.selectAll(".bar-label")
      .data(data)
      .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.screenType) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.energy) - 8)
        .text(d => `${Math.round(d.energy)}`);
  };
});