import "./styles.css";
import * as d3 from "d3";

// Write title to page
document.getElementById("app").innerHTML = `
<h1 id="title">Doping Allegations for Professional Cyclists</h1>
`;

// API call and SVG graph generation
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const width = 800;
    const height = 500;
    const padding = 50;

    // parseTime function required to parse the time property from the API
    const parseTime = d3.timeParse("%M:%S");

    const parseYears = d3.timeParse("%Y");

    // Create xScale and yScale functions
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseYears(d.Year)))
      .range([padding, width - padding]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseTime(d.Time)))
      .range([padding, height - padding]);

    // Draw SVG
    const svg = d3
      .select("#app")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Draw circles (data)
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(parseYears(d.Year)))
      .attr("cy", (d) => yScale(parseTime(d.Time)))
      .attr("r", 5)
      .style("fill", (d) => (d.Doping === "" ? "#69b3a2" : "#ff0000"))
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => parseTime(d.Time))
      // On mouseover, show tooltip with data
      .on("mouseover", (e, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(`${d.Name}<br>${d.Time}<br>${d.Year}`)
          .attr("data-year", d.Year);
      })
      // On mouseout, hide tooltip
      .on("mouseout", (e, d) => {
        d3.select("#tooltip").style("opacity", 0);
      })
      // On mousemove, tooltip follows mouse
      .on("mousemove", (e, d) => {
        d3.select("#tooltip")
          .style("left", `${e.pageX + 20}px`)
          .style("top", `${e.pageY - 25}px`);
      });

    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    // Tooltip
    d3.select("#app")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

    // Legend
    const colors = ["#ff0000", "#69b3a2"];
    const doping = [true, false];
    svg
      .selectAll("legendColors")
      .data(colors)
      .enter()
      .append("circle")
      .attr("id", "legend")
      .attr("cx", width - 200)
      .attr("cy", (d, i) => 200 + i * 25)
      .attr("r", 5)
      .attr("fill", (d) => d);

    svg
      .selectAll("legendText")
      .data(doping)
      .enter()
      .append("text")
      .attr("id", "legend")
      .text((d) => (d ? "Doping allegations" : "No doping allegations"))
      .attr("x", width - 190)
      .attr("y", (d, i) => 205 + i * 25);
  });
