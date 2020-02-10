var dictionary={
    vfalse:"0",
    vtrue:"1",
    //value:""+this.vfalse+this.vtrue,// 0 - FALSE; 1 - TRUE;
    verdict:"a-zA-Z",
    connective:{
        and:"&\\^",
        or:"|",
        implication:">",
        consequency:"<",
        bimplication:"=",
        negation:"¬!",
        //binary:""+this.and+this.or+this.implication+this.bimplication, // & - AND; | - OR; > - IMPLICATION; = - EQUIVALENCE
        //unary:this.negation,//  - NOT;
        all:""+this.binary+this.unary,
    },
    punctuation:{
        open:"\\(",
        close:"\\)",
    }
}
dictionary.value = dictionary.vfalse+dictionary.vtrue;
dictionary.connective.binary = dictionary.connective.and+dictionary.connective.or+dictionary.connective.implication+dictionary.connective.consequency+dictionary.connective.bimplication;
dictionary.connective.unary = dictionary.connective.negation;
var createRegex = function(str){
return new RegExp("["+str+"]");
}
var dictionaryRegex = {
vfalse:createRegex(dictionary.vfalse),
vtrue:createRegex(dictionary.vtrue),
value:createRegex(dictionary.value),
verdict:createRegex(dictionary.verdict),
connective:{
    and:createRegex(dictionary.connective.and),
    or:createRegex(dictionary.connective.or),
    implication:createRegex(dictionary.connective.implication),
    consequency:createRegex(dictionary.connective.consequency),
    bimplication:createRegex(dictionary.connective.bimplication),
    negation:createRegex(dictionary.connective.negation),
    binary:createRegex(dictionary.connective.binary),
    unary:createRegex(dictionary.connective.unary),
    all:createRegex(dictionary.connective.all),
},
punctuation:{
    open:createRegex(dictionary.punctuation.open),
    close:createRegex(dictionary.punctuation.close),
    all:new RegExp("\(?<="+dictionary.punctuation.open+"\)[^"+dictionary.punctuation.open+
        dictionary.punctuation.close+"]+?\(?="+dictionary.punctuation.close+"\)","g"),// tudo entre ( )
}
}
var body = d3.select("body");
var div_dictionary = body.append("div").attr("id","dictionary").attr("class","dictionary");
var div_title = div_dictionary.append("div").attr("class","tittle");
var div_content = div_dictionary.append("div").attr("class","content");

div_title.append("h1").attr("id","tittle").text("Dictionary");

var div_value = div_content.append("div").attr("class","sub");
div_value.append("h3").text("Valor:");
div_value.append("p").text("Verdadeiro: "+dictionary.vtrue);
div_value.append("p").text("Falso: "+dictionary.vfalse);

//var div_verdicts = div_content.append("div").attr("class","sub");
div_value.append("h3").text("Sentenças:");
div_value.append("p").text(dictionary.verdict);

var div_punctuatcions = div_content.append("div").attr("class","sub");
div_punctuatcions.append("h3").text("Pontuação:");
div_punctuatcions.append("p").text("Começo: "+dictionary.punctuation.open);
div_punctuatcions.append("p").text("Fim: "+dictionary.punctuation.close);

var div_conectives = div_content.append("div").attr("class","sub");
div_conectives.append("h3").text("Conectivos:");
div_conectives.append("p").text("Negação: "+dictionary.connective.negation);
div_conectives.append("p").text("Conjunção: "+dictionary.connective.and);
div_conectives.append("p").text("Disjunção: "+dictionary.connective.or);
div_conectives.append("p").text("Implication: "+dictionary.connective.implication);
//div_conectives.append("p").text("Consequency: "+dictionary.connective.consequency);
div_conectives.append("p").text("Bimplication: "+dictionary.connective.bimplication);

var btn = body.append("button").attr("onCLick","btnFunction()").text("Digitar Expressão Lógica");


var isSentence = function(s){
//value valid
s = s.trim();
s = s.replace(/[\s\\t]/g,"");
if(s=="" || s.search(new RegExp("[^"+
        dictionary.value+
        dictionary.verdict+
        dictionary.connective.binary+
        dictionary.connective.unary+
        dictionary.punctuation.open+
        dictionary.punctuation.close+
    "]"))!=-1)
    return false;
if(s.replace(new RegExp("["+dictionary.value+"]"),"")=="")
    return true;
//verdict valid
if(s.replace(new RegExp("["+dictionary.verdict+"]"),"")=="")
    return true;
//unary valid
if(s.search("["+dictionary.connective.unary+"]")==0)
    return isSentence(s.substr(1,s.length-1));
//punctuaction valid
var temp = true;
while(s.search(dictionaryRegex.punctuation.all)!=-1){
    var puncts = s.match(dictionaryRegex.punctuation.all)
    for(var i=0;i<puncts.length;i++){
        temp = temp && isSentence(puncts[i]);
        s = s.replace("\("+puncts[i]+"\)","a");
    }
}
if(s=="")
    return temp;
var v = s.split(new RegExp("["+dictionary.connective.binary+"]"));
for(var i=0;i<v.length;i++){
    var l = v[i].search("["+dictionary.connective.unary+"]")
    if(l!=-1 && l!=0)
        return false;
    if(l==-1 && v[i].length!=1)
        return false;
    temp = temp && isSentence(v[i]);
}

return temp;
}

var isOperand = function(o){
return o.replace(dictionaryRegex.verdict,"")=="";
}
var isValue = function(o){
return o.replace(dictionaryRegex.value,"")=="";
}

var operation = function(c){
if(c.replace(dictionaryRegex.connective.and,"")=="")
    c = "and";
else if(c.replace(dictionaryRegex.connective.or,"")=="")
    c = "or";
else if(c.replace(dictionaryRegex.connective.implication,"")=="")
    c = "implication";
else if(c.replace(dictionaryRegex.connective.consequency,"")=="")
    c = "consequency";
else if(c.replace(dictionaryRegex.connective.bimplication,"")=="")
    c = "bimplication";
else if(c.replace(dictionaryRegex.connective.negation,"")=="")
    c = "negation";
else if(c.replace(dictionaryRegex.punctuation.open,"")=="")
    c = "open";
else if(c.replace(dictionaryRegex.punctuation.close,"")=="")
    c = "close";
else   
    c = "nothing";
return c;
}

var apply = function(c,op1,op2){
c = operation(c);
switch(c){
    case "and" : return op1!=undefined?(op2!=undefined?op1 && op2:(op1==false?false:undefined)):(op2!=undefined?(op2==false?false:undefined):undefined);
    case "or": return op1!=undefined?(op2!=undefined?op1 || op2:(op1==true?true:undefined)):(op2!=undefined?(op2==true?true:undefined):undefined);
    case "implication": return op1!=undefined?(op2!=undefined?!op1 || op2:(op1==false?true:undefined)):(op2!=undefined?(op2==true?true:undefined):undefined);
    case "consequency": return op1!=undefined?(op2!=undefined?op1 || !op2:(op1==true?true:undefined)):(op2!=undefined?(op2==false?true:undefined):undefined);
    case "bimplication": return op1!=undefined&&op2!=undefined?!(op1 ^ op2):undefined;
    case "negation": return op1==undefined?undefined:!op1;
    default: return undefined;
}
}

var takeValue = function(truthTable,formul,interpretation){
for(var i=0;i<truthTable.length;i++){
    if(formul == truthTable[i].formul)
        break;
}
if(i==truthTable.length)
    return undefined;
return truthTable[i].value[interpretation];
}

var check = function(e,truthTable){
var symbol;
var i=0;
var pilha_operandos = [];
while(symbol=e[i++]){
    if(isOperand(symbol))
        pilha_operandos.push($(truthTable).attr(symbol));
    else if(isValue(symbol)){
        pilha_operandos.push((symbol.replace(dictionaryRegex.vfalse,"")=="")?false:true);
    }
    else if(symbol.replace(dictionaryRegex.connective.unary,"")==""){
        var op1 = pilha_operandos.pop();
        pilha_operandos.push(apply(symbol,op1));
    }else{
        var op2=pilha_operandos.pop(),
            op1 = pilha_operandos.pop();
        pilha_operandos.push(apply(symbol,op1,op2));
    }
}
return pilha_operandos.pop();
}

var prcd = function(op1,op2){
op1 = operation(op1);
op2 = operation(op2);
if(op2 == "open")
    return op1=="close";
if(op2 == "close")
    return op1!="open";
if(op1 == "open")
    return op2=="close";
else if(op1=="negation")
    return op2!="negation";
if((op1=="implication" || op1=="consequency") && op2 !="negation")
    return true;
if(op1=="bimplication" && op2 !="negation" && !(op2=="implication" || op2=="consequency"))
    return true;
if(op1 == "and" && op2!="bimplication" && op2 !="negation" && !(op2=="implication" || op2=="consequency"))
    return true;
if(op1 == "or" && op2 != "and" && op2!="bimplication" && op2 !="negation" && !(op2=="implication" || op2=="consequency"))
    return true;
return false;
}

var convert = function(o){
var symbol,d="";
var i1=0,i2=0;
var opstk = [];
while(symbol=o[i1++]){
    if(isOperand(symbol)||isValue(symbol)){
        d+=symbol;
    }else{
        while(opstk.length>0 && prcd(opstk[opstk.length-1],symbol)){
            d+=opstk.pop();
        }
        if(symbol==")"){
            opstk.pop();
        }else
            opstk.push(symbol);
    }
}
while(opstk.length>0){
    d+=opstk.pop();
}
return d;
}
var count = 1;
var niveis = 1;
var nodesVector = [];
var node = function(f,context,symbols,level,father){
    var temp = {node:count++,context:context,level:level,father:father};
    nodesVector.push(temp);
    temp.value = check(f,temp.context);
    temp.context.toString = function(){
            var ret = "";
            for(var i=0;i<temp.level;i++){
                ret += symbols[i] + ": "+($(this).attr(symbols[i])?"T":"F") + "; ";
            }
            return ret.trim();
    }
    if(temp.value==undefined){
        niveis = temp.level+1;
        var contextemp = JSON.copyObject(context);
        $(contextemp).attr(symbols[temp.level],true);
        console.log(contextemp);
        temp.sonT = node(f,contextemp,symbols,temp.level+1,temp);
        contextemp = JSON.copyObject(context);
        $(contextemp).attr(symbols[temp.level],false);
        temp.sonF = node(f,contextemp,symbols,temp.level+1,temp);
        temp.allResult = temp.sonF.allResult==temp.sonT.allResult?temp.sonT.allResult:undefined;
        if(temp.sonT.naturalDisjuntiva!=undefined||temp.sonF.naturalDisjuntiva!=undefined){
            temp.naturalDisjuntiva = (temp.sonT.naturalDisjuntiva!=undefined?temp.sonT.naturalDisjuntiva:"");
            temp.naturalDisjuntiva += (temp.sonF.naturalDisjuntiva!=undefined?(temp.naturalDisjuntiva==""?"":" "+dictionary.connective.or.charAt(0)+" ")+
                    temp.sonF.naturalDisjuntiva:"");
        }
        if(temp.sonT.naturalConjuntiva!=undefined||temp.sonF.naturalConjuntiva!=undefined){
            temp.naturalConjuntiva = (temp.sonT.naturalConjuntiva!=undefined?temp.sonT.naturalConjuntiva:"");
            temp.naturalConjuntiva += (temp.sonF.naturalConjuntiva!=undefined?(temp.naturalConjuntiva==""?"":" "+dictionary.connective.and.charAt(0)+" ")+
                        temp.sonF.naturalConjuntiva:"");
        }
        temp.folhas = temp.sonT.folhas + temp.sonF.folhas;
    }else{
        temp.allResult = temp.value;
        temp.folhas = 1;
        if(temp.value == true){
            temp.naturalDisjuntiva = "";
            for(var j=0;j<temp.level;j++){
                temp.naturalDisjuntiva += (temp.naturalDisjuntiva==""?"":dictionary.connective.and.charAt(0)) + ($(temp.context).attr(symbols[j])?"":dictionary.connective.negation.charAt(0))+symbols[j];
            }
        }else{
            temp.naturalConjuntiva = "";
            for(var j=0;j<temp.level;j++){
                temp.naturalConjuntiva += (temp.naturalConjuntiva==""?"":dictionary.connective.or.charAt(0)) + ($(temp.context).attr(symbols[j])?dictionary.connective.negation.charAt(0):"")+symbols[j];
            }
            temp.naturalConjuntiva = dictionary.punctuation.open.charAt(dictionary.punctuation.open.length-1)+temp.naturalConjuntiva+dictionary.punctuation.close.charAt(dictionary.punctuation.open.length-1);
        }
    }
    temp.type = function(){
        return (this.sonT==undefined?"":this.allResult==true?"Satisfatível e Taltologia":(this.allResult==false?"Contradição":"Satisfatível e Contingência"));
    }
    temp.toString = function(){
        var context = this.context.toString();
        var type = this.type();
        return ""+this.node+": nivel "+(this.level+1)+"\n"+
                (this.value!=undefined?("Valor:"+(this.value?"True":"False")+";\n"):"")+
                (context==""?(type==""?"":(type)):("Contexto: "+context));
                
    }
    return temp;
}
var div_tree = d3.select("body").append("div");
var tree = function(e){
if(isSentence(e)){
    var f = convert(e);
    var allTrue = true;
    var allFalse = false;
    var verdictSymbols = e.match(new RegExp("["+dictionary.verdict+"]","g"));
    
    if(verdictSymbols != null)
        verdictSymbols = Array.removeRepetitions(verdictSymbols);    
    else{
        verdictSymbols = [];
        allTrue = check(f);
    }
    count = 1;
    count_folha = 0;
    niveis = 1;
    nodesVector = [];
    var ret = node(f,{},verdictSymbols,0);
    ret.expression = e;
    ret.postfix = f;
    ret.typeString = ret.type();
    ret.nnodes = count;
    ret.maxLevels = niveis;
    //ret.nFolhas = count_folha;
    ret.nodesVector = nodesVector;
    ret.symbols = verdictSymbols;
    ret.print = function(){
        var a = this;
        div_table.text(""); 
        div_tree.text("");
        div_tableau.text("");
        div_tree.append("p").text("Expressão: "+this.expression+";   Expressão pós fixada: "+this.postfix+";");
        div_tree.append("p").text("Tipo: "+this.type()+";   Nós: "+this.nnodes+";   Folhas: "+this.folhas+ ";");
        div_tree.append("p").text("Formula Natural Disjuntiva: "+this.naturalDisjuntiva+";"); 
        div_tree.append("p").text("Formula Natural Conjuntiva: "+this.naturalConjuntiva+";"); 
        var svg = div_tree.append("svg").attr("id","svg-tree");//
        var g = svg.append("g").attr("id","tree");
        var menor = 300;
        var tempBase = 7*Math.pow(2,a.maxLevels);
        var axis = d3.scaleBand().rangeRound([16,(this.maxLevels+1)*20-4]).domain(this.symbols);
        svg.append("g").call(d3.axisLeft(axis)).attr("transform","translate(15,0)").select("path").remove();
        this.nodesVector = this.nodesVector.map(function(d,i){
            if(i==0)
                d.x = tempBase/2,d.y = 0;
            if(d.sonT!=undefined){
                var xlevel = tempBase/Math.pow(2,d.level+1);
                d.sonT.x = d.x-xlevel,
                d.sonF.x = d.x+xlevel,
                d.sonT.y = d.y+20,
                d.sonF.y = d.y+20;
                d.wires = [{x1:5,y1:15,x2:d.sonT.x-d.x+5,y2:d.sonT.y-d.y},{x1:5,y1:15,x2:d.sonF.x-d.x+5,y2:d.sonF.y-d.y}];
                menor = ((d.sonT.x<menor)?d.sonT.x:menor);
                menor = ((d.sonF.x<menor)?d.sonF.x:menor);
            }
            return d;
        });
        var nodes = g.selectAll(".node").data(this.nodesVector).enter()
            .append("g").attr("class","node")
                .attr("transform",function(d){return "translate("+d.x+","+d.y+")"});

        var rects = nodes.append("rect").attr("width",10).attr("height",15).attr("fill",function(d){return d.value==true?"#3F3":(d.value==false?"#F33":"#ccc")});
        this.toolTip = new ToolTip({
            name:"tooltip-tree",
            parent:"#svg-tree",
            text:"<this>"
        });
        var interactions = {mouseout:[],mousemove:[],mouseover:[],click:[function(element,data){alert(data)}]}
        interactions.mouseover.push(function (element, data) {
            element = d3.select(element);
            if (element.attr("opacity") != 0)
                a.toolTip.show(data);
        });
        interactions.mousemove.push(function (element, data) {
            a.toolTip.move();
        });
        interactions.mouseout.push(function (element, data) {
            a.toolTip.hide();
        });
        d3.addEvents(rects,interactions);
        nodes.selectAll(".wire").data(function(d){return d.wires==undefined?[]:d.wires}).enter()
            .append("line")
                .attr("fill","none").attr("stroke","#000").attr("stroke-width","1")
                .attr("x1", function(d){return d.x1})
                .attr("y1", function(d){return d.y1})
                .attr("x2", function(d){return d.x2})
                .attr("y2", function(d){return d.y2});
        var treeDimensions = document.getDimensions("#tree");
        g.attr("transform","translate("+(-menor+20)+",0)")
        svg.attr("width",Math.max(150,treeDimensions.w+25)).attr("height",treeDimensions.h+50);
    }
    return ret;
}
}
var div_table = d3.select("body").append("div");
var truthTable = function (e){
if(isSentence(e)){
    var f = convert(e);
    var truthTable = [];
    var allTrue = true;
    var allFalse = false;
    var verdictSymbols = e.match(new RegExp("["+dictionary.verdict+"]","g"));
    
    if(verdictSymbols != null)
        verdictSymbols = Array.removeRepetitions(verdictSymbols);    
    else{
        verdictSymbols = [];
        allTrue = check(f);
    }
    var interpretations = Math.pow(2,verdictSymbols.length);
    var truthTable = {};
    truthTable.values=[];
    for(var i=0;i<verdictSymbols.length;i++){
        for(var j=0;j<Math.pow(2,verdictSymbols.length);j++){
            if(i==0)
                truthTable.values[j]={};
            $(truthTable.values[j]).attr(verdictSymbols[i],(Math.floor(j/Math.pow(2,i))%2)!=0);
        }
    }
    verdictSymbols.push("Res");//truthTable.z = [];
    truthTable.naturalDisjuntiva = "";
    truthTable.naturalConjuntiva = "";
    if(interpretations>1)
    for(var i=0;i<interpretations;i++){
        var temp = check(f,truthTable.values[i]);
        truthTable.values[i].Res = temp;
        allTrue = allTrue && temp;
        allFalse = allFalse || temp;
        if(temp){
            var temp2="";
            for(var j=0;j<verdictSymbols.length-1;j++){
                temp2 += (temp2==""?"":dictionary.connective.and.charAt(0)) + ($(truthTable.values[i]).attr(verdictSymbols[j])?"":dictionary.connective.negation.charAt(0))+verdictSymbols[j];
            }
            truthTable.naturalDisjuntiva += (truthTable.naturalDisjuntiva==""?"":" "+dictionary.connective.or.charAt(0)+" ") + temp2;
        }else{
            var temp2="";
            for(var j=0;j<verdictSymbols.length-1;j++){
                temp2 += (temp2==""?"":dictionary.connective.or.charAt(0)) + ($(truthTable.values[i]).attr(verdictSymbols[j])?dictionary.connective.negation.charAt(0):"")+verdictSymbols[j];
            }
            truthTable.naturalConjuntiva += (truthTable.naturalConjuntiva==""?"":" "+dictionary.connective.and.charAt(0)+" ") + dictionary.punctuation.open.charAt(dictionary.punctuation.open.length-1) + temp2 + dictionary.punctuation.close.charAt(dictionary.punctuation.close.length-1);
        }
    }
    truthTable.interpretations = interpretations;
    truthTable.expression = e;
    truthTable.postfix = f;
    if(interpretations>1)
        truthTable.type = allFalse?("Satisfatível e "+(allTrue?"Taltologia":"Contingência")):"Contradição";
    else{
        truthTable.type = allTrue?"Taltologia":"Contradição";
        truthTable[0].value[0] = allTrue;
    }
    truthTable.print = function(){
        //if(d3.select("body").select("#table"))
        div_table.text(""); 
        div_tree.text("");
        div_tableau.text("");
        div_table.append("p").text("Expressão: "+this.expression+";   Interpretações: "+this.interpretations);
        div_table.append("p").text("Tipo: "+this.type+";   Expressão pós fixada: "+this.postfix+";");
        div_table.append("p").text("Formula Natural Disjuntiva: "+this.naturalDisjuntiva+";"); 
        div_table.append("p").text("Formula Natural Conjuntiva: "+this.naturalConjuntiva+";"); 
        var svg = div_table.attr("id","table").append("svg").attr("width",verdictSymbols.length*21).attr("height",(this.interpretations+2) * 13);
        var horizontal = d3.scaleBand().rangeRound([0,verdictSymbols.length*20]).domain(verdictSymbols).padding(0.1);
        var vertical = d3.scaleBand().rangeRound([0,this.interpretations * 13]).domain(this.values.map(function(d,i){return i;}));

        var g = svg.append("g").attr("transform","translate(0,20)");
        
        g.append("g").call(d3.axisTop(horizontal));
        var rows = g.attr("text-anchor", "middle").selectAll(".rows").data(this.values).enter()
        rows.append("g").attr("class","rows")
            .attr("transform",function(d,i){return "translate(0,"+(vertical(i)+15)+")"})
        .selectAll(".column")
            .data(function(d){return verdictSymbols.map(function(e){return $(d).attr(e)})})
            .enter()
            .append("g").attr("class","column")
                .attr("transform",function(d,i){return "translate("+(horizontal(verdictSymbols[i])+horizontal.bandwidth()/2)+",0)";})
                .append("text")
                    .text(function(d){return d?"1":"0"});
    }

    return truthTable;
}
return undefined;
}

var btnFunction = function(){
var str = prompt("Informe a expressao (exit - to exit)");
while(str != "exit" && str != null && str != ""){
    console.log(str);
    if(isSentence(str)){
        var op = prompt("1-Tabela Verdade; 2-Arvore semântica; 3-Tableau; 0-sair");
        console.log(op);
        while(op!=null){
            switch(op){
                case "1":
                    var table = truthTable(str);
                    if(table){
                        table.print();
                        str = "";
                    }
                    op="";
                    break;
                case "2":
                    var t = tree(str);
                    if(t){
                        t.print();
                        str = "";
                    }
                    op="";
                    break;
                case "3":
                    var t = tableaux(str);
                    if(t){
                        t.print();
                        str="";
                    }
                    op = "";
                case "0":case "": case undefined:case null: op = null;str=null;break;
                default:alert("Opção inválida!");
                    op = prompt("1-Tabela Verdade; 2-Arvore semântica; 3-Tableau; 0-sair");
            }
        }
    }else{
        alert("sentença INVÁLIDA");
        str = prompt("Informe a expressao (exit - to exit)");
    }
    
}
}
var types = /(?<expression>[a-zA-Z])|(?<binarycomutative>[\^&|=])|(?<binary>[><])|(?<unary>[!¬])/
var caracteres;
var tree_vector;

var role_factor = function(d){
    if(d.factor!=undefined){

    }else if(d.c.match(/[a-z]/)){
        d.factor = d.c.charCodeAt(0)-"a".charCodeAt(0)+2;
    }else if(d.c.match(/[A-Z]/)){
        d.factor = d.c.charCodeAt(0)-"A".charCodeAt(0)+28;
    }else if(d.c.match(/[¬!]/)){
        d.factor = 2*role_factor(d.son[0]);
    }else if(d.c.match(/[\^&]/)){
        d.factor = 2*(role_factor(d.son[0])+role_factor(d.son[1]))
    }else if(d.c.match(/[|]/)){
        d.factor = 4*(role_factor(d.son[0])+role_factor(d.son[1]))
    }else if(d.c.match(/[>]/)){
        d.factor = role_factor(d.son[0])+2*role_factor(d.son[1])
    }else if(d.c.match(/[=]/)){
        d.factor = 6*(role_factor(d.son[0])+role_factor(d.son[1]))
    }
    return d.factor;
}

var rule_sort = function(d1,d2){
    if(d1.factor>d2.factor)
        return 1;
    else if(d1.factor<d2.factor)
        return -1;
    return 0;
}

var parse_node = function(caractere){
    var type = caractere.c.match(types);
    if(type[1]){//expression
        caractere.type = 1;
    }else if(type[2]){//binarycomutative
        caractere.type = 2;
        caractere.son = [parse_node({c:caracteres.pop()}),parse_node({c:caracteres.pop()})];
        caractere.son.sort(rule_sort);
    }else if(type[3]){//binary
        caractere.type = 3;
        caractere.son = [undefined,parse_node({c:caracteres.pop()})];
        caractere.son[0] = parse_node({c:caracteres.pop()});
        if(caractere.c=="<"){
            caractere.c=">";
            var x = caractere.son[0];
            caractere.son[0]=caractere.son[1];
            caractere.son[1]=x;
        }
    }else if(type[4]){//uniary
        caractere.type = 4;
        caractere.son = [parse_node({c:caracteres.pop()})];
    }else{
        return;
    }
    caractere.factor = role_factor(caractere);
    tree_vector.push(caractere);
    return caractere;
}

var get_type_factor = function(caractere){
    var type = caractere.c.match(types);
    if(type[1]){//expression
        caractere.type = 1;
    }else if(type[2]){//binarycomutative
        caractere.type = 2;
    }else if(type[3]){//binary
        caractere.type = 3;
    }else if(type[4]){//uniary
        caractere.type = 4;
    }else{
        return;
    }
    caractere.factor = role_factor(caractere);
    return caractere;
}

var get_in_ord = function(tree_vector){
    var ret = "";
    if(tree_vector.son==undefined){
        ret+=tree_vector.c;
    }else if(tree_vector.son.length==2){
        var a = get_in_ord(tree_vector.son[0]);
        var b = get_in_ord(tree_vector.son[1]);
        //var parentesis = false;
        if(a.length>1 && prcd(tree_vector.c,tree_vector.son[0].c))
            a = "("+a+")";
        if(b.length>1 && prcd(tree_vector.c,tree_vector.son[1].c))
            b = "("+b+")";
        ret +=a+tree_vector.c+b
    }else if(tree_vector.son.length==1){
        var a = get_in_ord(tree_vector.son[0]);
        if(a.length>1 && prcd(tree_vector.c,tree_vector.son[0].c))
            a = "("+a+")";
        ret +=tree_vector.c+a;
    }
    return ret;
}

var get_pos_ord = function(tree_vector){
    var ret = "";
    if(tree_vector.son==undefined)
        ret+=tree_vector.c;
    else if(tree_vector.son.length==2)
        ret +=get_pos_ord(tree_vector.son[0])+get_pos_ord(tree_vector.son[1])+tree_vector.c
    else if(tree_vector.son.length==1)
        ret +=get_pos_ord(tree_vector.son[0])+tree_vector.c
    return ret;
}

var parse_tree_vector = function(s){
    caracteres = s.split("");
    tree_vector = [];
    parse_node({c:caracteres.pop()});
    console.log()
    tree_vector.sort(function(d1,d2){return rule_sort(d2,d1)});
    return tree_vector;
}
var tableaux_rules = [/[\^&]$/,/[|]$/,/[>]$/,/[=]$/,/[!]{2}$/,/[\^&][¬!]$/,/[|][¬!]$/,/[>][¬!]$/,/[=][¬!]$/];
var tableaux_id_str = function(e){
    var rule;
    for(var rule=0;!(e.match(tableaux_rules[rule])) && rule<9;rule++);
    return rule;
}
var tableaux_id = function(tree){
    if(tree.type==1)
        return;
    else if(tree.c.match(/[\^&]/))
        return 0;
    else if(tree.c.match(/[|]/))
        return 1;
    else if(tree.c.match(/[>]/))
        return 2;
    else if(tree.c.match(/[=]/))
        return 3;
    else if(tree.c.match(/[¬!]/)){
        if(tree.son[0].type==1)
            return;
        else if(tree.son[0].c.match(/[¬!]/))
            return 4;
        else if(tree.son[0].c.match(/[\^&]/))
            return 5;
        else if(tree.son[0].c.match(/[|]/))
            return 6;
        else if(tree.son[0].c.match(/[>]/))
            return 7;
        else if(tree.son[0].c.match(/[=]/))
            return 8;
    }
}

var apply_rule = function(node,expression,rule,level){
    if(expression == undefined)
        expression = node.expres_tree;
    var rule = tableaux_id(expression);
    var ret = {};
    switch(rule){
        case 0://&
            ret.son = {};

            ret.expres_tree = expression.son[0];
            ret.son.expres_tree = expression.son[1];

            ret.level = node.level +1;
            ret.son.level = node.level+2;

            //node.used = true;

            ret.type = tableaux_id(ret.expres_tree);
            ret.son.type = tableaux_id(ret.son.expres_tree);

            if(ret.type==undefined)
            ret.used = true; 
            if(ret.son.type==undefined)
            ret.son.used = true;

            ret.father = node;
            ret.son.father = ret;

            break;
        case 1://|  bifurca
            ret = [{},{}];

            ret[0].expres_tree = expression.son[0];
            ret[1].expres_tree = expression.son[1];

            ret[0].level = node.level+1;
            ret[1].level = node.level+1;

            //node.used = true;

            ret[0].type = tableaux_id(ret[0].expres_tree)
            ret[1].type = tableaux_id(ret[1].expres_tree)
            if(ret[0].type==undefined)
            ret[0].used = true; 
            if(ret[1].type==undefined)
            ret[1].used = true;

            ret[0].father = node;
            ret[1].father = node;

            break;
        case 2://>  bifurca
            ret = [{},{}];

            ret[0].expres_tree = {c:"!",son:[expression.son[0]]};
            get_type_factor(ret[0].expres_tree);
            ret[1].expres_tree = expression.son[1];

            ret[0].level = node.level+1;
            ret[1].level = node.level+1;

            //node.used = true;

            ret[0].type = tableaux_id(ret[0].expres_tree)
            ret[1].type = tableaux_id(ret[1].expres_tree)
            if(ret[0].type==undefined)
            ret[0].used = true; 
            if(ret[1].type==undefined)
            ret[1].used = true;

            ret[0].father = node;
            ret[1].father = node;

            break;
        case 3://=  bifurca
            ret = [{},{}];

            ret[0].expres_tree = {c:"&",son:[expression.son[0],expression.son[1]]};
            get_type_factor(ret[0].expres_tree);
            ret[1].expres_tree = {c:"&",son:[{c:"!",son:[expression.son[0]]},{c:"!",son:[expression.son[1]]}]};
            get_type_factor(ret[1].expres_tree);

            ret[0].level = node.level+1;
            ret[1].level = node.level+1;

            //node.used = true;

            ret[0].type = tableaux_id(ret[0].expres_tree)
            ret[1].type = tableaux_id(ret[1].expres_tree)
            if(ret[0].type==undefined)
            ret[0].used = true; 
            if(ret[1].type==undefined)
            ret[1].used = true;

            ret[0].father = node;
            ret[1].father = node;

            break;
        case 4://!!
            ret.expres_tree = expression.son[0].son[0];
            ret.level = node.level +1;
            //node.used = true;
            ret.type = tableaux_id(ret.expres_tree);
            if(ret.type==undefined)
            ret.used = true; 
            ret.father = node;
            break;
        case 5://!&  bifurca
            ret = [{},{}];

            ret[0].expres_tree = {c:"!",son:[expression.son[0].son[0]]};
            get_type_factor(ret[0].expres_tree);
            ret[1].expres_tree = {c:"!",son:[expression.son[0].son[1]]};
            console.log(ret);
            get_type_factor(ret[1].expres_tree);

            ret[0].level = node.level+1;
            ret[1].level = node.level+1;

            //node.used = true;

            ret[0].type = tableaux_id(ret[0].expres_tree)
            ret[1].type = tableaux_id(ret[1].expres_tree)
            if(ret[0].type==undefined)
            ret[0].used = true; 
            if(ret[1].type==undefined)
            ret[1].used = true;

            ret[0].father = node;
            ret[1].father = node;

            break;
        case 6://!|
            ret.son = {};

            ret.expres_tree = {c:"!",son:[expression.son[0].son[0]]};
            get_type_factor(ret.expres_tree);
            ret.son.expres_tree = {c:"!",son:[expression.son[0].son[1]]};
            get_type_factor(ret.son.expres_tree);

            ret.level = node.level +1;
            ret.son.level = node.level+2;
            
            //node.used = true;

            ret.type = tableaux_id(ret.expres_tree);
            ret.son.type = tableaux_id(ret.son.expres_tree);
            if(ret.type==undefined)
            ret.used = true; 
            if(ret.son.type==undefined)
            ret.son.used = true;

            ret.father = node;
            ret.son.father = ret;
            break;
        case 7://!>
            ret.son = {};

            ret.expres_tree = expression.son[0].son[0];
            ret.son.expres_tree = {c:"!",son:[expression.son[0].son[1]]};
            get_type_factor(ret.son.expres_tree);

            ret.level = node.level +1;
            ret.son.level = node.level+2;
            
            //node.used = true;

            ret.type = tableaux_id(ret.expres_tree);
            ret.son.type = tableaux_id(ret.son.expres_tree);
            if(ret.type==undefined)
            ret.used = true; 
            if(ret.son.type==undefined)
            ret.son.used = true;
            
            ret.father = node;
            ret.son.father = ret;

            break;
        case 8://!=  bifurca
            ret = [{},{}];

            ret[0].expres_tree = {c:"&",son:[{c:"!",son:[expression.son[0].son[0]]},expression.son[0].son[1]]};
            get_type_factor(ret[0].expres_tree);
            ret[1].expres_tree = {c:"&",son:[expression.son[0].son[0],{c:"!",son:[expression.son[0].son[1]]}]};
            get_type_factor(ret[1].expres_tree);

            ret[0].level = node.level+1;
            ret[1].level = node.level+1;

            //node.used = true;

            ret[0].type = tableaux_id(ret[0].expres_tree)
            ret[1].type = tableaux_id(ret[1].expres_tree)
            if(ret[0].type==undefined)
            ret[0].used = true; 
            if(ret[1].type==undefined)
            ret[1].used = true;

            ret[0].father = node;
            ret[1].father = node;

            break;
    }

    if(ret[0]==undefined){
        ret.rule = "R"+(rule+1)+"("+(level+1)+")";
        if(ret.son)
            ret.son.rule = "R"+(rule+1)+"("+(level+1)+")";
    }else{
        ret[0].rule = "R"+(rule+1)+"("+(level+1)+")";
        ret[1].rule = "R"+(rule+1)+"("+(level+1)+")";
    }

    return ret;
}

var sort_tableaux_node = function(d1,d2){   
    var tableaux_rules_prc = [4,0,7,6,1,2,5,3,8];
    d1 = tableaux_rules_prc.indexOf(d1.type);
    d2 = tableaux_rules_prc.indexOf(d2.type);
    if(d1<d2)return 1;
    if(d1>d2)return -1;
    return 0;
}

var is_closed = function(node){
    var temp1=node,temp2,i,j;

    for(i=node.level;i>=1;i--){
        var not = false;
        while(temp1.level>i)
            temp1 = temp1.father;
        if(temp1.expres_tree.c == "!")
            not = true;
        temp2 = temp1;
        for(j=i-1;j>=0;j--){
            while(temp2.level>j)
                temp2 = temp2.father;
            if(temp2.expres_tree.c=="!" ^ not){
                if(not){
                    if(get_pos_ord(temp2.expres_tree)==get_pos_ord(temp1.expres_tree.son[0]))
                        return true;
                }else{
                    if(get_pos_ord(temp2.expres_tree.son[0])==get_pos_ord(temp1.expres_tree))
                        return true;
                }
            }
        }
    }
    return false;
}

var is_satured = function(node_touse){
    node_touse.to_use = node_touse.to_use.filter(function(d){return d.used!=true});
    if(node_touse.to_use.length==0)
        return true;
    return false;
}

var find_expression = function(node_touse){
    node_touse.to_use.sort(sort_tableaux_node);

    return node_touse.to_use.pop();
}

var copyVector = function(d){
    var ret = [];
    for(var i=0;i<d.length;i++)
        ret.push(d[i]);
    return ret;
}
var div_tableau = d3.select("body").append("div");
var tableaux = function(e){
    var f = convert(e);
    var tree = parse_tree_vector(f);
    var raiz = {expres_tree:tree[0],level:0,rule:"prmss"};
    var fila_abertos_insaturados = [{node:raiz,to_use:[raiz]}];
    var folhas = [];
    var nodes = [raiz];
    while(fila_abertos_insaturados.length>0){
        var temp = fila_abertos_insaturados[fila_abertos_insaturados.length-1];
        if(is_closed(temp.node)){
            temp.node.closed = true;
            folhas.push(fila_abertos_insaturados.pop().node);
        }else if(is_satured(temp)){//not implemented
            temp.node.closed = false;
            folhas.push(fila_abertos_insaturados.pop().node);
        }else{
            var temp_expression = find_expression(temp);
            temp.node.son = apply_rule(temp.node,temp_expression.expres_tree,undefined,temp_expression.level);//find_expression not implemented
            if(temp.node.son[0]==undefined){//nao bifurca
                while(temp.node.son!=undefined){
                    temp.to_use.push(temp.node.son);
                    nodes.push(temp.node.son);
                    temp.node = temp.node.son;
                }
                //fila_abertos_insaturados.pop();
                //fila_abertos_insaturados.push(temp);
            }else{//bifurca
                fila_abertos_insaturados.pop();
                var temp1 = copyVector(temp.to_use),temp2 = copyVector(temp.to_use);
                temp1.push(temp.node.son[0]);
                temp2.push(temp.node.son[1]);
                nodes.push(temp.node.son[0]);
                nodes.push(temp.node.son[1]);
                fila_abertos_insaturados.push({node:temp.node.son[0],to_use:temp1});
                fila_abertos_insaturados.push({node:temp.node.son[1],to_use:temp2});
                
            }
        }
    }
    //adiciona informações de conclusões na raiz
    raiz.expression = e;
    raiz.postfix = f;
    raiz.folhas = folhas;
    raiz.allClosed = true;
    raiz.notAllOpen = false;
    raiz.maxLevel = 0;
    raiz.nodes = nodes;
    for(var i=0;i<raiz.folhas.length;i++){
        raiz.allClosed = raiz.allClosed && raiz.folhas[i].closed;
        raiz.notAllOpen = raiz.notAllOpen || raiz.folhas[i].closed;
        raiz.maxLevel = raiz.maxLevel<raiz.folhas[i].level?raiz.folhas[i].level:raiz.maxLevel;
    }
    for(var i=0;i<raiz.nodes.length;i++){
        raiz.nodes[i].expres_tree.toString = function(){
            return get_in_ord(this);
        }
    }
    raiz.tableau_type = raiz.allClosed?"Fechado":"Aberto";
    raiz.semantica = raiz.allClosed?"Contradição":"Satisfatível";
    raiz.horizontal_position = function(d){
        if(d.position!=undefined){
            
        }else if(d.son != undefined){
            if(d.son[0] == undefined){
                d.position = this.horizontal_position(d.son);
            }else{
                d.position = (this.horizontal_position(d.son[0])+this.horizontal_position(d.son[1]))/2;
            }
        }else{
            d.position = this.folhas.indexOf(d);
        }
        return d.position;
    }
    raiz.print = function(){
        var a = this;   
        div_table.text(""); 
        div_tree.text("");
        div_tableau.text("");
        div_tableau.append("p").text("Expressão: "+this.expression+";   Expressão pós fixada: "+this.postfix+";");
        div_tableau.append("p").text("Tipo: "+this.semantica+";   Tipo do Tableau: "+this.tableau_type+";   Ramos: "+this.folhas.length+ ";");
        
        var svg = div_tableau.append("svg").attr("id","svg-tableau");//
        var g = svg.append("g").attr("id","tableau").attr("transform","translate(25,0)");
        var levelsAxis = d3.scaleBand().rangeRound([0,(this.maxLevel+1)*30]).domain(range(1,this.maxLevel+2,1))
        var ramoAxis = d3.scaleLinear().rangeRound([0,(this.folhas.length)*50]).domain([0,this.folhas.length-1]);
        g.append("g").call(d3.axisLeft(levelsAxis.padding(0.15))).select("path").remove();
        var lines = g.append("g")
            .classed("gridline", true)
            .attr("fill","none")
            .attr("color","#ccc")
            .attr("stroke-width",2)
            .call(d3.axisRight(levelsAxis).tickSize((this.folhas.length+1)*50));
        lines.select("path").remove()
        lines.selectAll("text").remove();
        lines.attr("transform","translate(0,"+levelsAxis.bandwidth()/2+")");
        //g.append("g").call(d3.axisTop(ramoAxis).ticks(this.folhas.length+1));
        
        var nodes = g.append("g").selectAll(".node").data(this.nodes).enter().append("g").attr("class","node")
            .attr("transform",function(d){return "translate("+ramoAxis(a.horizontal_position(d))+","+(levelsAxis(d.level+1)+1)+")"})
            .attr("text-anchor", "middle");
        nodes.append("rect").attr("height",20).attr("width",50).attr("fill",function(d){
            return d.closed==true?"#F22":(d.closed==false?"#2F2":"#CCC");
        });
        nodes.append("text")
            .attr("transform","translate(25,0)")
            .attr("dy","1em")
            .text(function(d){return d.rule;});

        this.toolTip = new ToolTip({
            name:"tooltip-tableau",
            parent:"#svg-tableau",
            text:"<expres_tree>"
        });
        var interactions = {mouseout:[],mousemove:[],mouseover:[],click:[function(element,data){alert((data.level+1)+": "+data.expres_tree+" ;      "+data.rule)}]}
        interactions.mouseover.push(function (element, data) {
            element = d3.select(element);
            if (element.attr("opacity") != 0)
                a.toolTip.show(data);
        });
        interactions.mousemove.push(function (element, data) {
            a.toolTip.move();
        });
        interactions.mouseout.push(function (element, data) {
            a.toolTip.hide();
        });
        d3.addEvents(nodes,interactions);

        var treeDimensions = document.getDimensions("#tableau");
        svg.attr("width",Math.max(150,treeDimensions.w+25)).attr("height",treeDimensions.h+50);
    }

    return raiz;
}

var temp_expession = "!!((p>q)&!(p=q)&(!!p))";

    //var tab = fila_abertos_insaturados[0];
    //tab.type = tableaux_id(tab.expres_tree);
    //tab.son = apply_rule(tab);