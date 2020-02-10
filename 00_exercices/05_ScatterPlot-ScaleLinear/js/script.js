(() => {

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generate(n, min, max) {
        n = n || 10;
        min = min || 0;
        max = max || 20;

        let array = [];
        for (let i = 0; i < n; i++) {
            array.push(getRandom(min, max));
        }

        return array;
    }

    function dataSetGenerator(n) {
        n = n || 20;
        let array = [];
        for (let i = 0; i < n; i++) {
            var el = generate(2, 0, 400)
            el.push(getRandom(5, 20));
            array.push(el);
        }
        return array;
    }

    var w = 600,
        h = 400;

    var margin = {
        top: 10,
        bottom: 20,
        left: 20,
        right: 10
    }

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");

    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    var x_range = [0, w],
        y_range = [h, 0],
        z_range = ["black", "red"];

    function updateGraph() {
        var dataset = dataSetGenerator(getRandom(10, 30));

        var x_domain = d3.extent(dataset, d => d[0]),
            y_domain = d3.extent(dataset, d => d[1]),
            z_domain = d3.extent(dataset, d => d[2]);

        var x = d3.scaleLinear().domain(x_domain).range(x_range);
        var y = d3.scaleLinear().domain(y_domain).range(y_range);
        var z = d3.scaleLinear().domain(z_domain).range(z_range);

        var points = graph.selectAll(".point").data(dataset).enter()
            .append("g").attr("class", "point").attr("transform", (d, i) => {
                return "translate(" + [x(d[0]), y(d[1])] + ")"
            });
        points.append("circle");
        points.append("text");

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
            .attr("fill", (d) => { return z(d[2]) }).attr("r", 8)
        points.select("text").text((d) => { return "" + d[0] + "," + d[1] });

    }

    updateGraph();
    d3.select("body").append("button").on("click", updateGraph).text("update Graph");

})()