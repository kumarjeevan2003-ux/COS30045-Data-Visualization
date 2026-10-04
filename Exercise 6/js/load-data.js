d3.csv("data/Ex6_TVdata_withStar.csv", d => {
  const rawEnergy = d.energyConsumption || d.Energy_Consumption || d["energy consumption"] || d.Energy;
  const rawStar = d.star2 || d.starRating || d.Star_Rating || d.star;
  const rawTech = d.screenTechnology || d.screenTech || d.Screen_Technology || d["Screen Technology"] || d.technology;
  const rawSize = d.screenSize || d.Screen_Size || d["Screen Size"] || d.size;

  return {
    brand: d.brand || d.Brand || "Unknown",
    model: d.model || d.Model || "Unknown",
    screenTech: rawTech ? String(rawTech).trim() : "Other",
    screenSize: +rawSize || 0,
    starRating: +rawStar,
    energyConsumption: +rawEnergy
  };
}).then(data => {
  const validData = data.filter(d => 
    !isNaN(d.energyConsumption) && 
    d.energyConsumption > 0 && 
    d.energyConsumption <= 1800 &&
    !isNaN(d.starRating) &&
    d.starRating > 0
  );

  console.log(`Successfully loaded ${validData.length} TV records.`);

  // 1. Draw Histogram + its screen filter
  drawHistogram(validData);
  populateFilters(validData);

  // 2. Draw Scatterplot + its dedicated filter
  drawScatterplot(validData);
  populateScatterFilters(validData);

  // 3. Build Tooltips and register event listeners
  createTooltip();
  handleMouseEvents();

}).catch(error => {
  console.error("Error loading CSV dataset:", error);
});