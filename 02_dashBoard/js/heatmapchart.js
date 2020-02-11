/**
 * Numero de Proposicoes por mes
 * Faça um grafico de linha que represente esses dados
 * Foco: Criatividade do programador e maleabilidade do D3
 */
withHeatMapDataDo((dataset)=>{
    var tag = d3.select("#heatmap-chart");

    var size = getSize("#heatmap-chart");

    console.log("DataSet heatmap:");
    console.log(dataset);
    console.log("Size heatmap:");
    console.log(size)
})