(() => {

    var w = 600,
        h = 400;

    var margin = {
        top: 10,
        bottom: 30,
        left: 35,
        right: 10
    }

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");

    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    var x_range = [0, w],
        y_range = [h, 0],
        z_range = ["black", "blue"];

    var x = d3.scaleLinear().range(x_range);
    var y = d3.scaleLinear().range(y_range);
    var z = d3.scaleLinear().range(z_range);

    var x_axis = d3.axisBottom(x);
    var y_axis = d3.axisLeft(y);

    var x_axis_group = graph.append("g").attr("class", "x-axis")
        .attr("transform", "translate(" + [0, y(0) + 10] + ")")

    var y_axis_group = graph.append("g").attr("class", "y-axis")
        .attr("transform", "translate(" + [-10, 0] + ")")

    function updateGraph(years) {
        d3.csv("data/aids.csv", (data) => {
            console.log(data);

            dataset = [];
            var x_domain = d3.extent(dataset, d => d[0]),
                y_domain = d3.extent(dataset, d => d[1]),
                z_domain = d3.extent(dataset, d => d[2]);

            x.domain(x_domain);
            y.domain(y_domain);
            z.domain(z_domain);

            x_axis_group.transition().duration(500).call(x_axis);
            y_axis_group.transition().duration(500).call(y_axis);

            var points = graph.selectAll(".point").data(dataset).enter()
                .append("g").attr("class", "point").attr("transform", (d, i) => {
                    return "translate(" + [x(d[0]), y(d[1])] + ")"
                });
            points.append("circle");

            graph.selectAll(".point").data(dataset).exit().remove();

            points = graph.selectAll(".point")
                .transition()
                .duration(500)
                .attr("transform", (d, i) => {
                    return "translate(" + [x(d[0]), y(d[1])] + ")"
                });

            points.select("circle")
                .transition()
                .delay(0)
                .duration(500)
                .attr("fill", (d) => { return z(d[2]) }).attr("r", 8);
        });
    }

    updateGraph();
    d3.select("body").append("button").on("click", updateGraph).text("update Graph");

})()