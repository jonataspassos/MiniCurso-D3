var disciplinas = [
    { key: "Lógica", value: 78, obs: "fui bem" },
    { key: "Álgebra I", value: 71, obs: "fui bem" },
    { key: "Orientação a Objetos", value: 67, obs: "fui mal" },
    { key: "Estatística I", value: 93, obs: "fui muito bem" },
    { key: "Sistemas Operacionais I", value: 59, obs: "fui mal" },
    { key: "Física Experimental", value: 43, obs: "fui muito mal" },
    { key: "Engenharia de Software", value: 88, obs: "fui bem" },
    { key: "Estrutura de Dados", value: 36, obs: "fui muito mal" },
    { key: "Algoritmos I", value: 91, obs: "fui muito bem" },
    { key: "Algoritmos II", value: 74, obs: "fui bem" },
    { key: "Programação Java", value: 67, obs: "fui mal" },
    { key: "Programação Python", value: 75, obs: "fui bem" }
];

//Create your BarChart Here

var margin = { top: 10, bottom: 50, left: 30, right: 10 };

var svg = d3.select("#bar-chart").append("svg")//.on("click", draw);
var g = svg.append("g")
    .attr("transform", "translate(" + [margin.left, margin.top] + ")");

getSize = function (seletor) {
    var temp = document.querySelector(seletor).getBoundingClientRect();
    temp.w = temp.width;
    temp.h = temp.height;
    return temp;
}

/*ToolTip: https://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function draw() {
    var size = getSize("#bar-chart");
    var w = size.w, h = size.h;

    svg.attr("width", w).attr("height", h);
    g.transition().duration(500).attr("transform", "translate(" + [margin.left, margin.top] + ")");

    w += -margin.right - margin.left;
    h += -margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, w]).domain(disciplinas.map((d) => { return d.key }))
        .paddingInner(0.1).paddingOuter(0.1),
        y = d3.scaleLinear().range([h, 0])
            //.domain([d3.extent(disciplinas, d => d.value)]);
            //.domain([0,d3.max(disciplinas, d => d.value)]);
            .domain([0, 100]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    g.selectAll(".axis").data([["x", xAxis], ["y", yAxis]]).enter().append("g")
        .attr("class", (d) => { return "axis axis-" + d[0] })
        .attr("transform", (d) => { if (d[0] == "x") return "translate(" + [0, h] + ")" })
        .transition().duration(500).call((d) => d[1]);

    var xAxisGroup = g.select(".axis-x").transition().duration(500)
        .attr("transform", "translate(" + [0, h] + ")").call(xAxis)
        .selectAll(".tick").select("text").text((d) => { return d.split(" ").map((d) => { return d[0] }).join('') })
    var yAxisGroup = g.select(".axis-y").transition().duration(500)
        .call(yAxis);


    var bars = g.selectAll(".bar").data(disciplinas).enter().append("g")
        .attr("class", "bar").attr("opacity", 1)
        .on("mouseout", function (d) {
            d3.select(this).transition()
                .duration(200).attr("opacity", 1)
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }).on("click", function (d) {
            alert("Matéria: " + d.key + "\nNota: " + d.value + "\nAcho que " + d.obs + " nessa matéria");
        });

    bars.append("rect")
        .attr("x", (d) => x(d.key)).attr("y", h)
        .attr("width", x.bandwidth());

    g.selectAll(".bar").data(disciplinas).exit().remove();

    bars = g.selectAll(".bar").data(disciplinas)
        .on("mouseover", function (d) {
            d3.select(this).transition()
                .duration(200).attr("opacity", 0.7)
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.key + "<br/>Nota: " + d.value)
                .style("left", (size.x + margin.left + x(d.key) + x.bandwidth()) + "px")//d3.event.pageX
                .style("top", (size.y + margin.top + y(d.value) - 28) + "px");//d3.event.pageY
        });

    bars.select("rect")
        .transition().duration(500)
        .attr("fill", (d) => {return d.value >= 70 ? "#2355CD" : d.value >= 40 ? "#B7AD99" : "#C5303B";})
        //.attr("fill", (d) => {return d.value >= 70 ? "blue" : d.value >= 40 ? "grey" : "red";})
        .attr("width", x.bandwidth()).attr("height", d => { return h - y(d.value) })
        .attr("x", (d) => x(d.key)).attr("y", (d) => y(d.value));
}

draw();

window.addEventListener('resize', draw);
