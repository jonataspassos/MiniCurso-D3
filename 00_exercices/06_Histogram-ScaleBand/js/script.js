(() => {
    var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15,
        13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25
    ];

    var w = 600,
        h = 400;

    var margin = {
        top: 10,
        bottom: 20,
        left: 20,
        right: 10
    }

    function gen_range(n, max) {
        let min = max ? n : 0;
        max = max || n;
        var ret = []
        for (var i = min; i < max; i++) {
            ret.push(i);
        }
        return ret;
    }

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");

    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    var x = d3.scaleBand().domain(gen_range(dataset.length))
        .range([0, w]).paddingInner(0.1).paddingOuter(0.0);
    var y = d3.scaleLinear().domain([0, d3.max(dataset)]).range([h, 0]);

    var nodes = graph.selectAll(".node").data(dataset).enter()
        .append("g").attr("class", "node")
        .attr("transform", (d, i) => {
            return "translate(" + [x(i), 0] + ")"
        });

    nodes.append("rect")
        .attr("y", (d) => { return y(d) })
        .attr("height", (d) => { return y(0) - y(d) })
        .attr("width", (d) => { return x.bandwidth() });

    nodes.append("text").text((d) => { return d })
        .attr("x", (d, i) => { return x.bandwidth() / 2; })
        .attr("y", (d) => { return y(d) + 18 });
})()