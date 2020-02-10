/** Para este exemplo, eh necessario que o arquivo esteja 
 * sendo referenciado a partir de um servidor http, para
 * solucionar o problema de cors
 */
(() => {

    var w = 600,
        h = 400;

    var margin = {
        top: 10,
        bottom: 65,
        left: 35,
        right: 10
    }

    var graph = d3.select("body").append("svg")
        .attr("width", w).attr("height", h)
        .append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");

    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    var x_range = [0, w],
        y_range = [h, 0],
        z_range = ["black", "blue"];

    //Foi alterado para receber os estados
    var x = d3.scaleBand().range(x_range);
    var y = d3.scaleLinear().range(y_range);
    //Foi alterado para receber os anos
    var z = d3.scaleOrdinal().range((d3.schemeCategory10 + d3.schemeTableau10).split(','));

    var x_axis = d3.axisBottom(x);
    var y_axis = d3.axisLeft(y);

    var x_axis_group = graph.append("g").attr("class", "x-axis")
        .attr("transform", "translate(" + [0, y(0) + 10] + ")")

    var y_axis_group = graph.append("g").attr("class", "y-axis")
        .attr("transform", "translate(" + [-10, 0] + ")")

    var legend_table = d3.select("body").append("div")
        .attr("class", "legend-table")

    //Nem sempre os dados que voce desejar representar em um grafico 
    //virao da forma como o grafico recebe. As vezes a solucao eh 
    //mais simples, mas isso tambem pode nao acontecer
    //Esta funcao reorganiza os dados importados para o desenho do grafico
    function dataConfig(data, years) {
        ret = [];
        data.forEach(d => {
            years.forEach(i => {
                if (d["" + i] != undefined) {
                    ret.push({ UF: d.UF, year: i, value: d["" + i] });
                }
            });
        });
        return ret;
    }

    //Comparador de array para filtrar os iguais
    function distinct(value, index, self) {
        return self.indexOf(value) === index;
    }

    updateGraph = function(years) {
        //Por default, selecionara apenas os dados de 98 e 99
        years = years || [1998, 1999]
            //Realiza a requisicao do arquivo e executa a funcao apenas quando o arquivo for totalmente carregado
        d3.csv("http://localhost/data/aids.csv").then(function(data) {
            //reconfigura os dados
            dataset = dataConfig(data, years);

            var x_domain = [],
                //obtem o maior e o menor valor
                y_domain = d3.extent(dataset, (d) => { return d.value }),
                z_domain = years;

            //Seleciona os estados e ordena
            dataset.forEach((d) => { x_domain.push(d.UF) });
            x_domain = x_domain.filter(distinct).sort();
            //zera o valor inicial
            y_domain[0] = 0;

            x.domain(x_domain);
            y.domain(y_domain);
            z.domain(z_domain);

            x_axis_group.transition().duration(500).call(x_axis)
                .selectAll(".tick").attr("transform",
                    (d) => { //Esta configuracao ajuda a ler os labels no eixo horizontal
                        return "translate(" + [x(d) + x.bandwidth() / 2, 0] +
                            ")rotate(-25)"
                    })
                .select("text").style("text-anchor", "end");
            y_axis_group.transition().duration(500).call(y_axis);

            graph.selectAll(".point").data(dataset).enter()
                .append("g").attr("class", "point").attr("transform", (d) => {
                    return "translate(" + [x(d.UF), y(d.value)] + ")"
                })
                .append("circle");

            graph.selectAll(".point").data(dataset).exit().remove();

            graph.selectAll(".point")
                .transition()
                .duration(500)
                .attr("transform", (d, i) => {
                    return "translate(" + [x(d.UF), y(d.value)] + ")"
                })
                .select("circle")
                .transition()
                .delay(0)
                .duration(500)
                .attr("fill", (d) => { return z(d.year) }).attr("r", 8);

        });

        var legend = legend_table
            .selectAll(".legend").data(years).enter().append("div").attr("class", "legend");

        legend.append("div")
        legend.append("a")
        d3.select("body").selectAll(".legend-table").selectAll(".legend").exit().remove();

        legend = legend_table
            .selectAll(".legend");

        legend.select("div").style("background-color", (d) => z(d)).style("width", "18").style("height", "18");
        legend.select("a").text((d) => { return d })
    }

    updateGraph();
    //d3.select("body").append("button").on("click", updateGraph).text("update Graph");

})()