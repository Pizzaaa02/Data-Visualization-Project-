// Set dimensions and margins for the graph
const marginDR = { top: 40, right: 150, bottom: 60, left: 60 },
    widthDR = 1000 - marginDR.left - marginDR.right,
    heightDR = 850 - marginDR.top - marginDR.bottom;

const svgDR = d3.select("#Drug-resist-tb")
    .append("svg")
    .attr("width", widthDR + marginDR.left + marginDR.right)
    .attr("height", heightDR + marginDR.top + marginDR.bottom)
    .append("g")
    .attr("transform", `translate(${marginDR.left},${marginDR.top})`);

const tooltip = d3.select("#tooltip"); // Select the tooltip div

// Load the CSV data
d3.csv("./DrugresistantTB.csv").then(data => {
    // Parse the data
    data.forEach(d => {
        d.Year = +d.Year;
        d["Confirmed cases of RR-/MDR-TB"] = +d["Confirmed cases of RR-/MDR-TB"];
    });

    // Function to update the chart based on selected country
    function updateChart(selectedCountry) {
        // Filter data based on selected country
        const filteredData = data.filter(d => d["Countries, territories and areas"] === selectedCountry || selectedCountry === "Stacked");

        // Set up the scales
        const x = d3.scaleBand()
            .domain([...new Set(filteredData.map(d => d.Year))]) // Unique years for x domain
            .range([0, widthDR])
            .padding(0.3); // Increase padding between bars for a cleaner look

        let yMax;

        if (selectedCountry === "Stacked") {
            // Calculate maximum Y value for stacked chart
            const countries = ["China", "India"]; // Adjust to the countries you want to stack
            yMax = d3.max(d3.rollup(filteredData,
                v => d3.sum(v, d => d["Confirmed cases of RR-/MDR-TB"]),
                d => d.Year
            ).values());
        } else {
            // Calculate maximum Y value for individual country
            yMax = d3.max(filteredData, d => d["Confirmed cases of RR-/MDR-TB"]);
        }

        const y = d3.scaleLinear()
            .domain([0, yMax]).nice()
            .range([heightDR, 0]);

        // Clear previous content
        svgDR.selectAll("*").remove();

        // Add the x Axis
        svgDR.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${heightDR})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Format ticks as integers

        // Add the y Axis
        svgDR.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        // Add the y-axis label
        svgDR.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -marginDR.left + 10)
            .attr("x", -(heightDR / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "var(--flint)")
            .style("font-size", "14px")
            .text("Confirmed Cases of RR-/MDR-TB");

        // X-axis label
        svgDR.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", widthDR / 2)
            .attr("y", heightDR + marginDR.bottom - 10) // Position below the x-axis
            .style("font-size", "14px")
            .text("Year");

        if (selectedCountry === "Stacked") {
            // Prepare the data for stacking
            const countries = ["China", "India"]; // Adjust to the countries you want to stack

            const stackedData = d3.rollup(filteredData,
                v => {
                    const result = { Year: v[0].Year };
                    countries.forEach(country => {
                        const countryData = v.find(c => c["Countries, territories and areas"] === country);
                        result[country] = countryData ? countryData["Confirmed cases of RR-/MDR-TB"] : 0;
                    });
                    return result;
                },
                d => d.Year
            );

            // Flatten the rollup map to an array for stacking
            const flattenedData = Array.from(stackedData, ([year, values]) => ({
                Year: year,
                ...values
            }));

            // Create stack layout
            const stack = d3.stack().keys(countries);
            const series = stack(flattenedData);
            const colorScale = d3.scaleOrdinal()
                .domain(["China", "India"])
                .range(["red", "green"]);

            // Bind the stacked data to the chart with transition
            svgDR.selectAll(".series")
                .data(series)
                .enter().append("g")
                .attr("class", "series")
                .attr("fill", (d) => colorScale(d.key)) // Color for each country
                .selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                .attr("class", "bar-segment")
                .attr("x", d => x(d.data.Year))
                .attr("y", heightDR) // Start from bottom
                .attr("height", 0) // Start with height 0
                .attr("width", x.bandwidth())
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`Year: ${d.data.Year}<br>Confirmed Cases: ${d[1] - d[0]}`);
                    tooltip.style("left", `${event.pageX + 15}px`)
                        .style("top", `${event.pageY - 15}px`);
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .transition()
                .duration(800)
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]));
        } else {
            // For individual countries (China or India)
            const countryData = filteredData.filter(d => d["Countries, territories and areas"] === selectedCountry);

            // Add bars for the selected country
            svgDR.selectAll(".bar")
                .data(countryData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.Year))
                .attr("y", heightDR) // Start at the bottom
                .attr("width", x.bandwidth())
                .attr("height", 0) // Start with height 0
                .attr("fill", selectedCountry === "China" ? "red" : "green")
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`Year: ${d.Year}<br>Confirmed Cases: ${d["Confirmed cases of RR-/MDR-TB"]}`);
                    tooltip.style("left", `${event.pageX + 15}px`)
                        .style("top", `${event.pageY - 15}px`);
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .transition()
                .duration(800)
                .attr("y", d => y(d["Confirmed cases of RR-/MDR-TB"]))
                .attr("height", d => heightDR - y(d["Confirmed cases of RR-/MDR-TB"]));
        }

        // Add a legend to the right of the chart
        const legendGroup = svgDR.append("g")
            .attr("transform", `translate(${widthDR + 30}, 20)`);

        const legendData = ["China", "India"];
        const legendColorScale = d3.scaleOrdinal().domain(legendData).range(["red", "green"]);

        legendData.forEach((country, index) => {
            const legend = legendGroup.append("g")
                .attr("transform", `translate(0, ${index * 20})`);

            legend.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", legendColorScale(country));

            legend.append("text")
                .attr("x", 24)
                .attr("y", 13)
                .style("font-size", "14px")
                .text(country);
        });
    }

    // Initial chart
    updateChart("China");

    // Update chart on dropdown change
    d3.select("#country-select").on("change", function () {
        const selectedCountry = d3.select(this).property("value");
        updateChart(selectedCountry);
    });
});
