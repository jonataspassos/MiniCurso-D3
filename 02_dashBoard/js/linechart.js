/**
 * Numero de Proposicoes por mes
 * Faça um grafico de linha que represente esses dados
 * Foco: Criatividade do programador e maleabilidade do D3
 */
withLineDataDo((dataset)=>{
    var tag = d3.select("#line-chart");

    var size = getSize("#line-chart");

    console.log("DataSet line:");
    console.log(dataset);
    console.log("Size line:");
    console.log(size)
})