(() => {
    var dataset = [5, 10, 20, 45, 6, 25];

    var pie = d3.pie();
    var slices = pie(dataset);

    console.log(slices);

    var w = 500,
        h = 500;

    var arc = d3.arc().outerRadius(w / 2).innerRadius(h / 4).padAngle(0.03).cornerRadius(8);

    d3.select("body").append("svg").attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [w / 2, h / 2] + ")")
        .selectAll("path")
        .data(slices).enter().append("path").attr("class", "arc").attr("d", arc).attr("fill", "red")
})()