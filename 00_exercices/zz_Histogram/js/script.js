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
        .append("g").attr("class", (d,i)=>{return "node node-"+i})
        .attr("transform", (d, i) => {
            return "translate(" + [i * w / l, 400] + ")"
        }).on("mouseover", (d, i) => {
            d3.select(".node-"+i).attr("class","node mouse-over node-"+i);
        }).on("mouseout", (d, i) => {
            d3.select(".node-"+i).attr("class","node node-"+i);
        });

    nodes.append("rect").attr("x", 1)
        .attr("width", (d, i) => { return w / l - 2; });

    nodes.append("text").text((d) => { return d })
        .attr("x", (d, i) => { return (w / l) / 2; })
        .attr("y", (d) => { return -d * (h - 20) / max + 18 })
        .attr("opacity", 0);

    nodes.selectAll("rect").transition().duration(1000)
        .attr("y", (d) => { return -d * (h - 20) / max })
        .attr("height", (d) => { return d * (h - 20) / max })

    nodes.selectAll("text").transition().delay(900)
        .duration(200)
        .attr("opacity", 1);
})()