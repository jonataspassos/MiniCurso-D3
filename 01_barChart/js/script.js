(() => {
    var disciplinas = [
        { key: "Lógica", value: 78, obs: "fui bem" },
        { key: "Álgebra I", value: 71, obs: "fui bem" },
        { key: "Orientação a Objetos", value: 67, obs: "fui mal" },
        { key: "Estatística I", value: 93, obs: "fui muito bem" },
        { key: "Sistemas Operacionais I", value: 59, obs: "fui mal" },
        { key: "Física Experimental", value: 43, obs: "fui muito mal" },
        { key: "Engenharia de Software", value: 88, obs: "fui bem" },
        { key: "Estrutura de Dados", value: 36, obs: "fui muito mal" },
        { key: "Algoritmos I", value: 91, obs: "fui muito bem" },
        { key: "Algoritmos II", value: 74, obs: "fui bem" },
        { key: "Programação Java", value: 67, obs: "fui mal" },
        { key: "Programação Python", value: 75, obs: "fui bem" }
    ];

    getSize = function (seletor) {
        var temp = document.querySelector(seletor).getBoundingClientRect();
        temp.w = temp.width;
        temp.h = temp.height;
        return temp;
    }

    /*ToolTip: https://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var margin = { top: 10, bottom: 50, left: 30, right: 10 };

    var size = getSize("#bar-chart");
    var w = size.w, h = size.h;

    //alert("Matéria: " + d.key + "\nNota: " + d.value + "\nAcho que " + d.obs + " nessa matéria");

    /* On mouseover
            d3.select(this).transition()
                .duration(200).attr("opacity", 0.7)
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.key + "<br/>Nota: " + d.value)
                .style("left", (size.x + margin.left + x(d.key) + x.bandwidth()) + "px")//d3.event.pageX
                .style("top", (size.y + margin.top + y(d.value) - 28) + "px");//d3.event.pageY
    */

    /* On mouseout
            d3.select(this).transition()
                .duration(200).attr("opacity", 1)
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

    */

})()