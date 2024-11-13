document.addEventListener("DOMContentLoaded", function () {
   const margin = { top: 20, right: 80, bottom: 55, left: 65 },
         width = 1000 - margin.left - margin.right,
         height = 850 - margin.top - margin.bottom;

   // Create SVG container
   const svg = d3.select("#treat-chart")
                 .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

   // Create a tooltip
   const tooltip = d3.select("body")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("position", "absolute")
                     .style("background-color", "white")
                     .style("border", "1px solid #ccc")
                     .style("padding", "10px")
                     .style("border-radius", "5px")
                     .style("display", "none");

   // Load CSV data
   d3.csv("Treatmentsuccess.csv").then(data => {
       // Process the data for China and India
       const dataChina = data
           .filter(d => d.Countries === 'China')
           .map(d => ({ Year: +d.Year, SuccessRate: +d['Treatment success rate: new TB cases %'] }));
           
       const dataIndia = data
           .filter(d => d.Countries === 'India')
           .map(d => ({ Year: +d.Year, SuccessRate: +d['Treatment success rate: new TB cases %'] }));

       const years = [...new Set(dataChina.concat(dataIndia).map(d => d.Year))].sort((a, b) => a - b);

       // Define scales
       const x = d3.scalePoint()
                   .domain(years)
                   .range([0, width]);

       const y = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height, 0]);

       // Define line generators
       const lineGenerator = d3.line()
                               .x(d => x(d.Year))
                               .y(d => y(d.SuccessRate));

       // Draw lines for China and India
       svg.append("path")
          .datum(dataChina)
          .attr("class", "line line-china")
          .attr("d", lineGenerator)
          .style("stroke", "blue")
          .style("fill", "none")
          .style("stroke-width", 2);

       svg.append("path")
          .datum(dataIndia)
          .attr("class", "line line-india")
          .attr("d", lineGenerator)
          .style("stroke", "orange")
          .style("fill", "none")
          .style("stroke-width", 2);

       // Add circles for each data point (China)
       svg.selectAll(".dot-china")
          .data(dataChina)
          .enter()
          .append("circle")
          .attr("class", "dot-china")
          .attr("cx", d => x(d.Year))
          .attr("cy", d => y(d.SuccessRate))
          .attr("r", 5)
          .style("fill", "blue")
          .on("mouseover", function (event, d) {
              tooltip.style("display", "block")
                     .html(`Country: China<br>Year: ${d.Year}<br>Success Rate: ${d.SuccessRate}%`)
                     .style("left", `${event.pageX + 10}px`)
                     .style("top", `${event.pageY - 20}px`);
          })
          .on("mouseout", () => tooltip.style("display", "none"));

       // Add circles for each data point (India)
       svg.selectAll(".dot-india")
          .data(dataIndia)
          .enter()
          .append("circle")
          .attr("class", "dot-india")
          .attr("cx", d => x(d.Year))
          .attr("cy", d => y(d.SuccessRate))
          .attr("r", 5)
          .style("fill", "orange")
          .on("mouseover", function (event, d) {
              tooltip.style("display", "block")
                     .html(`Country: India<br>Year: ${d.Year}<br>Success Rate: ${d.SuccessRate}%`)
                     .style("left", `${event.pageX + 10}px`)
                     .style("top", `${event.pageY - 20}px`);
          })
          .on("mouseout", () => tooltip.style("display", "none"));

       // Append X-axis
       svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x).tickValues(years).tickFormat(d3.format("d")));

       // Append Y-axis
       svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y));

       // Append X-axis label
       svg.append("text")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom - 10)
          .style("opacity", 0.5)
          .attr("text-anchor", "middle")
          .style("font-size", "24px")
          .text("Year");

       // Append Y-axis label
       svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 35)
          .attr("x", -height / 2)
          .style("opacity", 0.5)
          .attr("text-anchor", "middle")
          .style("font-size", "24px")
          .text("Success Rate (%)");

       console.log("Chart rendering completed.");
   }).catch(error => {
       console.error("Error loading CSV data:", error);
   });
});
