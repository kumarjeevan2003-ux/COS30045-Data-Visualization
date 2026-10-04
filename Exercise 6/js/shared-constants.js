// --- Histogram Geometry ---
const margin = { top: 30, right: 30, bottom: 65, left: 75 };
const width = 1200;
const height = 650;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const bodyBackgroundColor = "#ffffff";
const barFillColor = "#2563eb";
const barStrokeColor = bodyBackgroundColor;

const xScale = d3.scaleLinear().range([0, innerWidth]);
const yScale = d3.scaleLinear().range([innerHeight, 0]);

const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

// Histogram Screen Filters
const filters = [
  { id: "all", label: "All Screens", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

const transitionDuration = 600;
const transitionEase = d3.easeCubicOut;

// --- Scatterplot Geometry ---
const marginS = { top: 40, right: 140, bottom: 65, left: 75 };
const widthS = 1200;
const heightS = 650;
const innerWidthS = widthS - marginS.left - marginS.right;
const innerHeightS = heightS - marginS.top - marginS.bottom;

let innerChartS;

const xScaleS = d3.scaleLinear().range([0, innerWidthS]);
const yScaleS = d3.scaleLinear().range([innerHeightS, 0]);

const screenCategories = ["LED", "LCD", "OLED"];
const colorScale = d3.scaleOrdinal()
  .domain(screenCategories)
  .range(["#2563eb", "#10b981", "#f97316"])
  .unknown("#64748b");

// Extension: Dedicated Scatterplot Filters
const filtersScatter = [
  { id: "all", label: "All Screens", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Extension: Sizing for Tooltips
const tooltipWidth = 160;   // Wider for Model and Brand names
const tooltipHeight = 58;  // Taller for 2 lines of text
const histTooltipWidth = 130;
const histTooltipHeight = 44;