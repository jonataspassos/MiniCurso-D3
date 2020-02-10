/* este código varia unicamente na parte de atualizar os valores em tempo de execução com dados aleatórios*/
(() => {

    //Gera um valor aleatório
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Gera um vetor de n elementos com valores aleatorios
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

    //Gera o dataset do gráfico com n dados
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

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g");

    //As partes que definem os elementos internos do grafico foram 
    //envolvidas numa funcao para ser chamada em tempo de execucao
    function updateGraph() {
        //Gera um novo dataset (quantidades tambem variaveis)
        var dataset = dataSetGenerator(getRandom(10, 30));

        //Adiciona os pontos que faltam
        var points = graph.selectAll(".point").data(dataset).enter()
            .append("g").attr("class", "point");
        points.append("circle");
        points.append("text");

        //Retira os que sobram
        graph.selectAll(".point").data(dataset).exit().remove();

        //Atualiza todos os pontos (novos e velhos) com o novo conjunto de dados
        points = graph.selectAll(".point").attr("transform", (d, i) => {
            return "translate(" + [d[0], d[1]] + ")"
        });
        points.select("circle").attr("r", (d) => { return d[2] })
        points.select("text").text((d) => { return "" + d[0] + "," + d[1] });

    }

    //Cria o primeiro grafico
    updateGraph();
    //Cria o botao para redesenhar o grafico
    d3.select("body").append("button").on("click", updateGraph).text("update Graph");

})()