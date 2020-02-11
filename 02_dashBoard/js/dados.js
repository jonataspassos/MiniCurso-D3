(() => {

    function getXML(xml, node, parameters) {
        var ret = [];
        var ine = xml.querySelectorAll(node);
        ine.forEach((element) => {
            var n = {}
            parameters.forEach((d) => {
                n[d] = element.querySelector(d).innerHTML.replace("<![CDATA[", "").replace("]]>", "").trim();
            })
            ret.push(n);
        });
        return ret;
    }

    //Lista de deputados
    withListaDeDeputadosDo = function (func) {
        d3.xml("/data/ObterDeputados.xml").then((xml) => {
            var node = "deputado"
            var parameters = ["ideCadastro", "nomeParlamentar", "urlFoto", "sexo", "uf", "partido", "fone", "email"];

            return func(getXML(xml, node, parameters));
        });
    }


    //Noticias
    var newsjs = []
    withNewsDo = function (func) {
        if (newsjs.length == 0) {
            d3.xml("/data/rss.xml").then((xml) => {
                var node = "item";
                var parameters = ["title", "description", "link", "pubDate"]
                newsjs = getXML(xml, node, parameters);
                return func(newsjs)
            });
        } else {
            return func(newsjs)
        }
    }

    //Pie Chart Data
    var pieData = []
    withPieDataDo = function (func) {
        if (pieData.length == 0)
            return withListaDeDeputadosDo((d) => {
                n = [];
                p = [];
                d.forEach((d) => {
                    var i = p.indexOf(d.partido);
                    if (i == -1)
                        p.push(d.partido), n.push(1);
                    else
                        n[i]++;
                })
                for (var i = 0; i < p.length; i++) {
                    pieData.push({ key: p[i], value: n[i] });
                }
                return func(pieData);

            })
        else
            return func(pieData);
    };

    //Lista de proposicoes
    withProposicoesDo = function (func) {
        d3.xml("/data/ListarProposicoes.xml").then((xml) => {
            var node = "proposicao";
            var parameters = ["id", "datApresentacao", "txtNomeAutor", "txtSiglaUF", "codPartido", "idecadastro", "codPartido"]
            return func(getXML(xml, node, parameters))
        });
    }

    //LineChart Data
    var lineData = []
    withLineDataDo = function (func) {
        if (pieData.length == 0)
            return withProposicoesDo((d) => {
                lineData = [];
                d.forEach((d) => {
                    var month = +d.datApresentacao.match(/([0-9]{2})\/[0-9]{4}/)[1];
                    lineData[month - 1] = lineData[month - 1] || 0;
                    lineData[month - 1]++;
                })
                return func(lineData);

            })
        else
            return func(lineData);
    }

    //HeatMap Data
    var heatData = [];
    withHeatMapDataDo = function (func) {
        if (heatData.length == 0)
            return withProposicoesDo((d) => {
                heatData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                d.forEach((d) => {
                    var day = d.datApresentacao.match(/([0-9]{1,2})\/0?2\/2011/);
                    if (day) {
                        day = +day[1];
                        heatData[day - 1] = heatData[day - 1] || 0;
                        heatData[day - 1]++;
                    }
                })
                heatData.forEach((d, i) => {
                    heatData[i] = { key: new Date(2011, 1, i + 1), value: d };
                })
                return func(heatData);

            })
        else
            return func(heatData);
    }

    //Buuble Data
    var buubleData = []
    withBubbleDataDo = function (func) {
        if (buubleData.length == 0)
            return withProposicoesDo((d) => {
                n = [];
                p = [];
                d.forEach((d) => {
                    var i = p.indexOf(d.idecadastro);
                    if (i == -1)
                        p.push(d.idecadastro), n.push(1);
                    else
                        n[i]++;
                })
                for (var i = 0; i < p.length; i++) {
                    buubleData.push({ ideCadastro: p[i], value: n[i] });
                }

                var newBubble = []

                return withListaDeDeputadosDo((d) => {
                    d.forEach((d) => {
                        var i = p.indexOf(d.ideCadastro)
                        if (i != -1) {
                            var b = {};
                            b.ideCadastro = d.ideCadastro
                            b.nomeParlamentar = d.nomeParlamentar
                            b.urlFoto = d.urlFoto
                            b.sexo = d.sexo
                            b.uf = d.uf
                            b.partido = d.partido
                            b.value = n[i];
                            newBubble.push(b);
                        }
                    })
                    buubleData = newBubble;
                    buubleData.sort((d1, d2) => { return d1.value < d2.value ? 1 : d1.value > d2.value ? -1 : 0 })
                    buubleData.splice(0, 1);
                    return func(buubleData);
                })


            })
        else
            return func(buubleData);
    };

    getSize = function (seletor) {
        var temp = document.querySelector("#pie-chart").getBoundingClientRect();
        return { w: temp.width, h: temp.height };
    }

})()