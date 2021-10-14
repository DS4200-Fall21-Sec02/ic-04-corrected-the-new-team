
// write your javascript code here.
// feel free to change the pre-set attributes as you see fit
//Resources:
//https://devsday.ru/blog/details/43429
//https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
//https://www.d3-graph-gallery.com/graph/barplot_button_data_csv.html
//https://stackoverflow.com/questions/22382984/deleting-d3-svg-elements-for-redraw
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

//SVG that will hold the visualization
let svg2 = d3.select('#d3-container')
.append('svg')
.attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
.attr('width', '60%') // this is now required by Chrome to ensure the SVG shows up at all
.style('background-color', 'white')
.style('border', 'solid')
.attr('viewBox', [-70, -10, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

let svg3 = d3.select('#d3-container')
.append('svg')
.attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
.attr('width', '60%') // this is now required by Chrome to ensure the SVG shows up at all
.style('background-color', 'white')
.style('border', 'solid')
.attr('viewBox', [-70, -10, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))


//updates the charts
function update(Variables) {
  d3.csv("data/data.csv").then ( function(data) {
    svg1.selectAll("g > *").remove();

    //sorting the data
    if (Variables == 'ascending') {
      data.sort(function(b, a) {
        return  b.Y - a.Y; });
      } else if (Variables == 'alphabet') {
        data.sort(function(a, b){
          if(a.X < b.X) { return -1; }
          if(a.X > b.X) { return 1; }
          return 0;})
        }

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
        svg1.selectAll('.bar')
        .on('mouseover', function () {
          tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function (e, d) {
          tooltip
          .style('top', event.pageY - 100 + 'px')
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

    };

    //initiating the graph
    update('alphabet');

    d3.csv("data/covid.csv").then ( function(data) {
      const subgroups = data.columns.slice(1,3)

      const groups = data.map(d => d.Country)

      // Adding the X axis
      const x = d3.scaleBand()
      .range([ 0, width])
      .domain(data.map(d => d.Country))
      .padding(0.5);
      svg2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

      // Adding the Y axis
      const y = d3.scaleLinear()
      .domain([0, 45000])
      .range([ height, 0]);
      svg2.append("g")
      .call(d3.axisLeft(y));

      const xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05])

      const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c','#377eb8'])

      svg2.append("g")
      .selectAll(".bar2")
    // Enter in data = loop group per group
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x(d.Country)}, 0)`)
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .join("rect")
      .attr("class", "bar2")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .transition()
      .duration(750)
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

      // create a tooltip
      const tooltip2 = d3.select('#tooltip2');
      const tooltip_name2 = d3.select('#Country');
      const tooltip_pop1 = d3.select('#Cases');
      const tooltip_pop2 = d3.select('#Deaths');

      // Add mouse event to show the tooltip when hovering bars
      svg2.selectAll('.bar2')
      .on('mouseover', function () {
        tooltip2.style('visibility', 'visible');
      })
      .on('mousemove', function (e, d) {
        const [x, y] = d3.pointer(e);
        tooltip2.style("left", (x) + 50 + "px")
        .style("top", (y) - 800 + "px");
        tooltip_name2.text(d3.select(this.parentNode).datum().Country);
        tooltip_pop1.text(`Cases: ${d3.select(this.parentNode).datum().Cases}`);
        tooltip_pop2.text(`Deaths: ${d3.select(this.parentNode).datum().Deaths}`);
      })
      .on('mouseout', function () {
        tooltip2.style('visibility', 'hidden');
      });

      //adding the x label
      svg2.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width - 50)
      .attr("y", height + 70)
      .text("40 Countries with the highest covid cases");

      //adding the y label
      svg2.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 10)
      .attr("x", -100)
      .attr("dy", "-2.8em")
      .attr("transform", "rotate(-90)")
      .text("Covid cases and deaths");
    })

    d3.csv("data/covid.csv").then ( function(data) {

      // Adding the X axis
      const x = d3.scaleLinear()
      .domain([0, 800])
      .range([ 0, width])
      svg3.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

      // Adding the Y axis
      const y = d3.scaleLinear()
      .domain([0, 45000])
      .range([ height, 0]);
      svg3.append("g")
      .call(d3.axisLeft(y));

      svg3.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("cx", function (d) { return x(d.Deaths); } )
        .attr("cy", function (d) { return y(d.Cases); } )
        .attr("r", 3)
        .style("fill", "#000000");

      //adding the x label
      svg3.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width - 150)
      .attr("y", height + 40)
      .text("Covid Deaths");

      //adding the y label
      svg3.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("x", -150)
      .attr("dy", "-2.8em")
      .attr("transform", "rotate(-90)")
      .text("Covid Cases");
    })
