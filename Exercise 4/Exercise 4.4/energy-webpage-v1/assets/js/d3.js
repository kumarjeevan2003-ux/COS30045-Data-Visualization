document.addEventListener("DOMContentLoaded", () => {

  // Path to your exported CSV file from KNIME
  const csvPath = "assets/data/TVdata.csv";

 
  // STEP 1 & 2: Load CSV with Row-Level Type Conversion
 
  
  d3.csv(csvPath, d => {
    return {
      brand: d.brand,       // string
      count: +d.count       // coerced to numeric float/integer
    };
  })
  .then(data => {

   
    // STEP 3: Inspect & Extract Dataset Summary Statistics
  
    console.log("--- 1. Parsed Data Objects Array ---");
    console.log(data);

    console.log("--- 2. Dataset Row Count (Length) ---");
    console.log("Total categories:", data.length);

    console.log("--- 3. Maximum Value ---");
    const maxVal = d3.max(data, d => d.count);
    console.log("Max count:", maxVal);

    console.log("--- 4. Minimum Value ---");
    const minVal = d3.min(data, d => d.count);
    console.log("Min count:", minVal);

    console.log("--- 5. Extent (Min & Max Tuple) ---");
    const extentVal = d3.extent(data, d => d.count);
    console.log("Extent [min, max]:", extentVal);

  
    // Sort Data (Descending Order for Clear Chart Layout)
 
    data.sort((a, b) => d3.descending(a.count, b.count));
    console.log("--- 6. Sorted Data (Highest to Lowest) ---");
    console.log(data);

 
    // Call drawBarChart() inside the Promise
   
    drawBarChart(data);

  })
  .catch(error => {
    console.error("Error loading CSV file:", error);
  });

});

// Placeholder function called inside the .then promise
// (This will be developed in Exercise 4.5 & 4.6)
function drawBarChart(data) {
  console.log("drawBarChart received data ready for rendering:", data);
}