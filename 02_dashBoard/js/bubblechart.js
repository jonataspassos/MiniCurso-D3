/**
 * Numero de Proposicoes por deputado
 * Faça um grafico de bolhas que represente esses dados
 * Foco: Uso das funções da biblioteca D3
 */
withBubbleDataDo((dataset)=>{
    var tag = d3.select("#bubble-chart");

    var size = getSize("#bubble-chart");

    console.log("DataSet bubble:");
    console.log(dataset);
    console.log("Size bubble:");
    console.log(size)
})