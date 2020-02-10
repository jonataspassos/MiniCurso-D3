(() => {
    var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15,
        13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

    var w = 600,
        h = 400,
        l = dataset.length,
        max = Math.max(...dataset);

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g");

    var nodes = graph.selectAll(".node").data(dataset).enter()
        .append("g").attr("class", "node")
        .attr("transform", (d, i) => {
            return "translate(" + [i * w / l, 400] + ")"
        });

    nodes.append("rect").attr("x", 1)
        .attr("y", (d) => { return -d * (h - 20) / max })
        .attr("height", (d) => { return d * (h - 20) / max })
        .attr("width", (d, i) => { return w / l - 2; });

    nodes.append("text").text((d) => { return d })
        .attr("x", (d, i) => { return (w / l) / 2; })
        .attr("y", (d) => { return -d * (h - 20) / max + 18 });
})()
