(() => {
    var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15,
        13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25
    ];

    //Dados de parametrizacao
    var w = 600, //largura
        h = 400, //altura
        l = dataset.length, //tamanho do dataset
        max = Math.max(...dataset); //maior valor

    //Configura o container do grafico
    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g");

    //Vincula os dados e adiciona um grupo para cada valor
    var nodes = graph.selectAll(".node").data(dataset).enter()
        .append("g").attr("class", "node")
        .attr("transform", (d, i) => {
            return "translate(" + [i * w / l, 400] + ")"
        });

    //Configura o retangulo de cada valor
    //Os dados são usados para calcular cada posição
    nodes.append("rect").attr("x", 1)
        .attr("y", (d) => { return -d * (h - 20) / max })
        .attr("height", (d) => { return d * (h - 20) / max })
        .attr("width", (d, i) => { return w / l - 2; });

    //Configura o label de cada valor
    nodes.append("text").text((d) => { return d })
        .attr("x", (d, i) => { return (w / l) / 2; })
        .attr("y", (d) => { return -d * (h - 20) / max + 18 });
})()