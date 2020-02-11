/**
 * Numero de deputados federais por partido
 * Faça um gráfico de pizza que represente
 * esses dados
 * Foco: Uso das funções da biblioteca D3
 */
withPieDataDo((dataset)=>{
    var tag = d3.select("#pie-chart");

    var size = getSize("#pie-chart");

    console.log("DataSet Pie:");
    console.log(dataset);
    console.log("Size Pie:");
    console.log(size)
})