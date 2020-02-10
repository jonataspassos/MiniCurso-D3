/* Este arquivo foi alterado para mostrar a utilização das transicoes */
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

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g");

    function updateGraph() {
        var dataset = dataSetGenerator(getRandom(10, 30));

        //Ao criar o elemento no ponto que ele devera iniciar, evita-se 
        //uma transicao com o ponto partindo da origem do grafico
        var points = graph.selectAll(".point").data(dataset).enter()
            .append("g").attr("class", "point").attr("transform", (d, i) => {
                return "translate(" + [d[0], d[1]] + ")"
            });
        points.append("circle");
        points.append("text");

        graph.selectAll(".point").data(dataset).exit().remove();

        //A transicao dos grupos na atualizacao é para tornar 
        //suave a movimentacao dos pontos antigos na tela
        points = graph.selectAll(".point")
            .transition() //Ativa a transicao
            .duration(500) //Transicao dura 500ms
            .attr("transform", (d, i) => {
                return "translate(" + [d[0], d[1]] + ")"
            });

        //A transicao no circulo torna suave o 
        //redimensionamento do raio
        points.select("circle")
            .transition()
            .delay(0)
            .duration(500)
            .attr("r", (d) => { return d[2] });

        //Textos não possuem transicao na mudanca de conteudo
        //Transicoes sao validas em atributos numericos(tamanhos, poricoes, cores, ...)
        points.select("text").text((d) => { return "" + d[0] + "," + d[1] });

    }

    updateGraph();
    d3.select("body").append("button").on("click", updateGraph).text("update Graph");

})()