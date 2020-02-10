(() => {
    //Dados do grafico
    var dataset = [
        [5, 20, 10],
        [480, 90, 12],
        [250, 50, 15],
        [100, 33, 3],
        [85, 21, 5],
        [330, 95, 22],
        [410, 12, 13],
        [475, 44, 14],
        [25, 67, 4],
        [220, 88, 8]
    ];

    //Tamanho parametrizado do grafico
    var w = 600,
        h = 400;

    //Criando grupos para cada ponto de dado
    var points = d3.select("body") //Seleciona o body do html
        .append("svg") //Adiciona um svg dentro
        .attr("width", w).attr("height", h) //Configura o tamanho
        .append("g") //Insere um grupo dentro do svg
        .selectAll(".point").data(dataset).enter() //Vincula os dados para adicionar os pontos
        .append("g").attr("class", "point") //Adiciona o grupo de cada ponto
        .attr("transform", (d, i) => { //Translada o grupo para a coordenada do ponto
            return "translate(" + [d[0], d[1]] + ")"
        });

    //Para cada ponto
    points.append("circle") //adiciona um circulo
        .attr("r", (d) => { return d[2] }) //configura o raio do circulo

    //Para cada ponto
    points.append("text") //adiciona um texto
        .text((d) => { return d }); //Escreve o texto
})()