# Appliance Energy Consumption Website

A responsive, multi-page website providing educational guidance on appliance energy consumption

## Project Structure
- `index.html` - Home page featuring an interactive accordion FAQ.
- `televisions.html` - Detail page highlighting TV power efficiency considerations.
- `about.html` - Overview of project background and mission.
- `assets/css/styles.css` - Global CSS containing custom layouts, color variables, and interactive states.
- `assets/js/main.js` - Global JavaScript handling dynamic footer year updates and FAQ accordion behavior.
- `assets/img/PowerIcon.png` - power logo

## Setup Instructions
1. Clone or download the repository.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge).



## Generative AI Reflection

* **Tools Used:** Google Gemini.
* **Purpose of GenAI Use:** Generated initial boilerplate structures for the 3-page HTML layout, structured the responsive CSS stylesheet (including CSS custom properties and flex/grid systems),and scaffolded the vanilla JavaScript accordion toggle logic.
* **Changes & Adaptations:** 
  * Refined color contrast ratios to meet standards by switching body copy from plain to purple dark theme with more readability font colors.
  * Adjusted accordion transitions to make sure it always shows rather than close once an other accordian was clicked. 
* **Key Learnings:** Learned how to effectively implement CSS custom properties for cohesive theming across multiple pages, handle scalable SVGs directly in modern layouts, and build accessible accordion components without relying on external UI libraries.
* **Limitations & Issues Encountered:** The initial theme iteration was bland and plain so I had to change it to a much more aesthetic neon hues at the expense of typography readability; this required manual intervention to tune contrast, ensure proper text hierarchies, and test legibility against deep dark backgrounds. 