(() => {
    var dataset = [
        [5, 20, 10],
        [480, 90, 12],
        [250, 50, 15],
        [100, 33, 3],
        [85, 21, 5],
        [330, 95, 22],
        [410, 12, 13],
        [475, 44, 14],
        [25, 67, 4],
        [220, 88, 8]
    ];

    var w = 600,
        h = 400;

    var points = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").selectAll(".point").data(dataset).enter()
        .append("g").attr("class", "point")
        .attr("transform", (d, i) => {
            return "translate(" + [d[0], d[1]] + ")"
        });

    points.append("circle").attr("r", (d) => { return d[2] })

    points.append("text").text((d) => { return d });
})()