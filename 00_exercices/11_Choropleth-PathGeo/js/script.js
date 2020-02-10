var year = 1990;

//Width and height
var w = 500;
var h = 300;

//Projection
var projection = d3.geoMercator().translate([w * 5 / 4, h / 6])
    .scale([400]);

//Define path generator
var path = d3.geoPath().projection(projection);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Load in GeoJSON data
d3.json("/data/brazil.geojson").then(function(json) {

    //Bind data and create one path per GeoJSON feature
    svg //.append("g").attr("transform", "translate(200,200)")
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("class", (d => { return "path-" + d.properties.L1.split(" ").join("-") }))
        .attr("fill", "none")
        //.attr("stroke", "black")
        //.attr("stroke-width", "1")
        .attr("d", path);

    //Load aids csv

    d3.csv("/data/aids.csv").then((csv) => {
        update = (year) => {
            var color = d3.scaleLinear().range(["bisque", "brown"]).domain(d3.extent(csv, d => d["" + year]))
            svg.selectAll("path").data(csv).attr("fill", (d) => color(d["" + year]))
        }

        update(year);
    })
});