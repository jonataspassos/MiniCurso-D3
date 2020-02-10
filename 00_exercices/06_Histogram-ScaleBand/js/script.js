/* Assim como o exemplo anterior, este demonstra a utilizacao das escalas do d3
para este exemplo utilizou-se alem do scaleLinear, o scaleBand (com caracteristica categorica) */
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

    //Retorna um vetor com os valores solicitados em sequencia
    //Ex: gen_range(5) -> [0,1,2,3,4]
    //    gen_range(2,10) -> [2,3,4,5,6,7,8,9]
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

    //scaleBand eh um tipo de escala categorica. Seu diferencial eh 
    //o fato do dominio ser categorico e o contradominio ser linear
    //Ele divide o espaco linear em pedacos iguais de acordo com a 
    //o tamanho dos dados do dominio
    var x = d3.scaleBand().domain(gen_range(dataset.length))
        .range([0, w])
        .paddingInner(0.1)
        .paddingOuter(0.0);

    var y = d3.scaleLinear().domain([0, d3.max(dataset)])
        .range([h, 0]); //Observe a utilizacao invertida do range no eixo vertical
    //Isso resolve a questao do crescimento descendente do SVG (ainda 
    //deve-se atentar as alteracoes necessarias)

    var nodes = graph.selectAll(".node").data(dataset).enter()
        .append("g").attr("class", "node")
        .attr("transform", (d, i) => {
            return "translate(" + [x(i), 0] + ")"
        });

    //O scaleband tem em um dos seus metodos o tamanho da banda dividida
    //Isso eh util para definir a largura do retangulo para este caso
    //como para outros casos que podem ser encontrados futuramente
    nodes.append("rect")
        .attr("y", (d) => { return y(d) })
        .attr("height", (d) => { return y(0) - y(d) })
        .attr("width", (d) => { return x.bandwidth() });

    nodes.append("text").text((d) => { return d })
        .attr("x", (d, i) => { return x.bandwidth() / 2; })
        .attr("y", (d) => { return y(d) + 18 });
})()