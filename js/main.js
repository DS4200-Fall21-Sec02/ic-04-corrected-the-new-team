
// write your javascript code here.
// feel free to change the pre-set attributes as you see fit
//https://devsday.ru/blog/details/43429
let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

//SVG that will hold the visualization
let svg1 = d3.select('#d3-container')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '60%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', 'white')
  .style('border', 'solid')
  .attr('viewBox', [-70, -50, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

  d3.csv("data/data.csv").then ( function(data) {

    // Adding the X axis
    const x = d3.scaleBand()
      .range([ 0, width])
      .domain(data.map(d => d.X))
      .padding(0.5);
    svg1.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Adding the Y axis
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);
    svg1.append("g")
      .call(d3.axisLeft(y));

    // Bar Values
    svg1.append("g")
    .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
        .attr("x", d => x(d.X))
        .attr("y", d => y(d.Y))
        .transition()
        .duration(750)
        .attr("width", x.bandwidth())
        .attr("height", d => height  - y(d.Y))
        .attr("fill", "#ff0000");

        // create a tooltip
      const tooltip = d3.select('#tooltip');
      const tooltip_name = d3.select('#X');
      const tooltip_pop = d3.select('#Y');

      // Add mouse event to show the tooltip when hovering bars
      d3.selectAll('.bar')
        .on('mouseover', function () {
          tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function (e, d) {
          tooltip
            .style('top', event.pageY - 10 + 'px')
            .style('left', event.pageX + 10 + 'px');
          tooltip_name.text(d.X);
          tooltip_pop.text(`Y: ${d.Y}`);
        })
        .on('mouseout', function () {
          tooltip.style('visibility', 'hidden');
        });

    //adding the x label
    svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - 220)
    .attr("y", height + 30)
    .text("X");

    //adding the y label
    svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 10)
    .attr("x", -200)
    .attr("dy", "-2.8em")
    .attr("transform", "rotate(-90)")
    .text("Y");
  });
