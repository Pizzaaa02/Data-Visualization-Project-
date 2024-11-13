// Set the margins, width, and height for the chart
const marginMT = { top: 50, right: 100, bottom: 120, left: 100 };
const widthMT = 1000 - marginMT.left - marginMT.right;
const heightMT = 850 - marginMT.top - marginMT.bottom;

// Append the SVG container for the chart
const svgMT = d3.select("#mortality_chart")
    .append("svg")
    .attr("width", widthMT + marginMT.left + marginMT.right)
    .attr("height", heightMT + marginMT.top + marginMT.bottom)
    .append("g")
    .attr("transform", `translate(${marginMT.left},${marginMT.top})`);

// Load data from CSV
d3.csv("./Mortality_modified.csv").then(csvData => {
    csvData.forEach(d => {
        d.year = +d.Year;
        d.deaths = +d["Number of deaths due to tuberculosis, excluding HIV (median)"];
    });

    // Group data by country and prepare unique list of countries
    const dataByCountry = d3.group(csvData, d => d.Countries);
    const countries = Array.from(dataByCountry.keys());

    // Define x and y scales
    const x = d3.scaleLinear().domain([2015, 2021]).range([0, widthMT]);
    const y = d3.scaleLinear()
                .domain([0, d3.max(csvData, d => d.deaths) * 1.25])
                .range([heightMT, 0]);

    // Define x and y axes
    const xAxis = d3.axisBottom(x).tickValues([2015, 2016, 2017, 2018, 2019, 2020, 2021]).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y).tickFormat(d3.format(",.0f"));

    // Append x and y axes to the SVG
    svgMT.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${heightMT})`)
        .call(xAxis);

    svgMT.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add axis labels for better readability
    svgMT.append("text")
        .attr("class", "x-axis-label")
        .attr("x", widthMT / 2)
        .attr("y", heightMT + marginMT.bottom / 2)
        .style("text-anchor", "middle")
        .text("Year");

    svgMT.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -heightMT / 2)
        .attr("y", -marginMT.left / 1.5)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Deaths Due to Tuberculosis");

    // Define the color scale for each country
    const color = d3.scaleOrdinal().domain(countries).range(d3.schemeCategory10);

    // Prepare the stacked area data
    const stack = d3.stack()
        .keys(countries)
        .value((d, key) => d[key] || 0);

    const stackedData = stack(
        Array.from(d3.group(csvData, d => d.year).values()).map(group => {
            const row = { year: group[0].year };
            group.forEach(d => row[d.Countries] = d.deaths);
            return row;
        })
    );

    // Define area generator for stacked areas
    const areaGenerator = d3.area()
        .x(d => x(d.data.year))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveMonotoneX);

    // Draw stacked areas
    svgMT.selectAll(".area")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("fill", d => color(d.key))
        .attr("d", areaGenerator)
        .attr("opacity", 0.8)
        .transition()
        .duration(1000);

    // Function to create x-axis gridlines (excluding the year 2021)
    const makeXGridlines = () => {
        return d3.axisBottom(x)
            .tickValues([2015, 2016, 2017, 2018, 2019, 2020,2021]) // Exclude 2021
            .tickSize(-heightMT)
            .tickFormat("");
    };

    // Append x-axis gridlines after the area paths for better visibility
    svgMT.append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0,${heightMT})`)
        .call(makeXGridlines())
        .selectAll("line")
        .style("stroke", "#666") // Darker color for gridlines
        .style("stroke-width", "1.5px") // Slightly thicker lines
        .style("stroke-dasharray", "4,2"); // Dashed lines for better readability

    // Add legends for each country and move to top-right corner
    const legend = svgMT.selectAll(".legend")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${i * 300}, ${heightMT + 70})`);  // Adjust position for top-right corner

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => `Number of deaths due to tuberculosis in ${d}`);
});
