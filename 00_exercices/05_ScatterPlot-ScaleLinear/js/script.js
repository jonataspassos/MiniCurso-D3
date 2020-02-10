/* Este arquivo foi alterado para demonstrar a utilizacao das funcoes de escala do d3 */
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

    //A utilizacao das margens organiza o codigo e auxilia 
    //na parametrizacao de futuras alteracoes (faremos isso)
    var margin = {
        top: 10,
        bottom: 20,
        left: 20,
        right: 10
    }

    //O grafico agora e desenhado descolado da borda de acordo com o objeto de margem
    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");

    //Os tamanhos sao recalculados para configurar a alteracao das margens
    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    //Sao definidas para usar as escalas, domain e range.
    //O range significa o comportamento visual que a escala gera 
    //(como o contradominio de uma funcao)
    var x_range = [0, w],
        y_range = [h, 0],
        z_range = ["black", "red"];

    function updateGraph() {
        var dataset = dataSetGenerator(getRandom(10, 30));

        //O domain significa o conjunto de dados que a escala recebe
        //(como o dominino de uma funcao)
        //Extent entra em um vetor e retorna um vetor de 2 posicoes 
        //com o menor e o maior valor
        var x_domain = d3.extent(dataset, d => d[0]),
            y_domain = d3.extent(dataset, d => d[1]),
            z_domain = d3.extent(dataset, d => d[2]);

        //As escalas lineares representam uma tradução do domain 
        //para o range respeitando uma função afim de acordo 
        //com a proporcao entre o domain e o range
        var x = d3.scaleLinear().domain(x_domain).range(x_range);
        var y = d3.scaleLinear().domain(y_domain).range(y_range);
        var z = d3.scaleLinear().domain(z_domain).range(z_range);

        //Com isso, nao se usa mais os dados diretamente, mas passa-se 
        //pela funcao de escala para conversao de dados
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