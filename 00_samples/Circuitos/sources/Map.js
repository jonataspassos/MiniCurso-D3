/**
 * Class Map config Sample mapConfig = { width:1000, height:600, size:30,
 * parent:"#circuitMap" }
 */
class Map{
    constructor(mapConfig){
	this.components = [];
	this.wires = [];
	this.element = "wire";
	this.cont = {c:0,r:0,i:0,t:0,fc:0,w:0};
	    this.get = null;
	    this.horizontal = true;;
	    this.width = mapConfig.width;
	    this.height = mapConfig.height;
	    this.size = mapConfig.size;
	    this.name = mapConfig.name;
	    var a = this;
	    
	    this.configs = this.configsFunc();
	    this.lineFunction = d3.line()
			    .x(function(d) { return d.x; }) // set the x values
							    // for the line
			    // generator
				.y(function(d) { return d.y; }) // set the y
								// values for
								// the line
						    // generator
				.curve(d3.curveStepAfter);
		this.svg = d3.select(mapConfig.parent)
			.append("svg").attr("id","svgCircuits")
			.attr("width",this.width).attr("height",this.height);
		this.svg.position = $("#svgCircuits").offset();
		
		var buttons = [
		    {text:"wire" ,func:this.name+".elementSet('wire')"},
		    {text:"resistor" ,func:this.name+".elementSet('resistor')"},
		    {text:"inductor" ,func:this.name+".elementSet('inductor')"},
		    {text:"capacitor" ,func:this.name+".elementSet('capacitor')"},
		    {text:"tensionSource" ,func:this.name+".elementSet('tension')"},
		  //  {text:"chain Source" ,func:this.name+".elementSet('chain')"},
			{text:"delete" ,func:this.name+".elementSet('delete')"},
		];
		
		this.buttons = d3.select(mapConfig.parent).append("div").attr("id","buttons")
			.selectAll("button").data(buttons).enter().append("button")
			.attr("id",function(d){return "btn-"+d.text;})
			.attr("onclick",function(d){return d.func;})
			.text(function(d){return d.text;});
		
		this.space = this.svg.append("g").attr("id","space");
		
		this.componentsContainer = this.svg.append("g").attr("id","componentsContainer").attr("height",this.height);
		this.wiresContainer = this.svg.append("g").attr("id","wiresContainer");
		
		this.mark = this.svg.append("g").attr("id","mark")
		.attr("transform","translate(-500,-500)");
		
		this.markLabel = d3.select(mapConfig.parent).append("p").attr("id","markLabel").text("");
		
		this.draw();
		this.addEvents();
		this.circuit = "Circuit not initialized. Call "+mapConfig.name+".process()";
	}
	process(){
	    var a = this;
	    var point = this.wires.map(function(d){
			return JSON.parse(JSON.stringify(d.point));
	    });
	    var nfiz = true;
	    while(nfiz){
		nfiz = false;
	    for(var i = 0;i<point.length;i++){
    		for(var j=i+1;j<point.length;j++){
    		    for(var k=0;k<point[i].length;k++){
    				if(point[i][k]== point[j][0] || point[i][k]== point[j][1]){
    				    for(var l=0;l<point[j].length;l++)
    					point[i].push(point[j][l]);
    				    point.splice(j,1);
    				    j--;
    				    k = point[i].length;
    				    nfiz = true;
    				}
    			    }
    			}
    		    }
	    }
		
	    for(var j=0;j<point.length;j++){
		point[j] = point[j].filter(function(este,i){return point[j].indexOf(este)==i;});
	    }
	    
	    var valueComponents = this.components.map(function(d){
			return {point:JSON.parse(JSON.stringify(d.point)), value:d.value, type:d.type};
	    });
	   
	    var ord = this.ord;
	    valueComponents = valueComponents.sort(function(d1,d2){return ord(d1.type)>ord(d2.type)?1:(ord(d1.type)<ord(d2.type))?-1:0});
		
	    var searchPoint = function (p){
		for(var i=0;i<point.length;i++)
		    for(var j=0;j<point[i].length;j++)
			if(point[i][j]==p)
			    return point[i][0];
		return p;
	    }
	    
	    valueComponents = valueComponents.map(function(d){
			d.point[0] = searchPoint(d.point[0]);
			d.point[1] = searchPoint(d.point[1]);
			return d;
	    });
	   
	    var contPoint=0;
	    for(var i=0;i<valueComponents.length;i++){
		var point = valueComponents[i].point[0];
		if(typeof point != "number"){
		    valueComponents[i].point[0] = contPoint;
		    for(var j=0;j<valueComponents.length;j++){
			if(valueComponents[j].point[0]==point)
			    valueComponents[j].point[0] = contPoint;
			if(valueComponents[j].point[1]==point)
			    valueComponents[j].point[1] = contPoint;
		    }
		    contPoint++;
		}
		point = valueComponents[i].point[1];
		if(typeof point != "number"){
		    valueComponents[i].point[1] = contPoint;
		    for(var j=0;j<valueComponents.length;j++){
			if(valueComponents[j].point[0]==point)
			    valueComponents[j].point[0] = contPoint;
			if(valueComponents[j].point[1]==point)
			    valueComponents[j].point[1] = contPoint;
		    }
		    contPoint++;
		}
	    }
	    
	    
	    
	    var tempComponents = valueComponents.map(function(d){
		return {point:d.point, type:ord(d.type)};
	    });
	    
	    
	    
	    var typeCircuit = function(tempComponents,contPoint){
		var ncomponents = tempComponents.length;
		
		var temp = null;
		var temp2=false;
		
		for(var i = 0;i<tempComponents.length;i++){// se todos os
							    // pontos se repetem
							    // ao menos uma vez
		    for(var k=0;k<2;k++){
			for(var j=0;j<tempComponents.length;j++){
			    if(i!=j && tempComponents[i]
					.point[k]==tempComponents[j]
						.point[0]
					|| tempComponents[i]
			    			.point[k]==tempComponents[j]
							.point[1]){
				temp2 = true;
				
				j=tempComponents.length;
			    }
			}
			if(!temp2){
			    	
				return "nenhum";
			}
			    temp2 = false;
		    }
		}
		
		if(valueComponents.length == 3 && contPoint == 3){
			if(valueComponents[2].type!="capacitor")
				return "nenhum";
		    return "RLCSerie";
		}
		else if(valueComponents.length == 3 && contPoint == 2){
			if(valueComponents[2].type!="capacitor")
				return "nenhum";
		    return "RLCParalelo";
		}
		else if(valueComponents.length == 4 && contPoint == 4){
		    return "RLCSerieDegrau";
		}
		else if(valueComponents.length == 4 && contPoint == 2){
		    return "RLCParaleloDegrau";
		}
		else if(valueComponents.length == 4 && contPoint == 3){
		    var temp = a.searchSeries(valueComponents);
			//console.log(temp);
		    switch(temp){
		    case 'ri':return "RLSerieCParalelo";
		    case 'rc':return "RCSerieLParalelo";
		    case 'ic':return "LCSerieRParalelo";
		    case 'rt':return "LCParaleloRSerie";
		    case 'it':return "RCParaleloLSerie";
		    case 'ct':return "RLParaleloCSerie";
		    default: return "nenhum";
		    }
		}
		
	    }
	    var tcirtuit = typeCircuit(tempComponents,contPoint);
	    console.log(tcirtuit);
	    switch(tcirtuit){
	    case "RLCSerie":this.circuit = new RLCSerie(valueComponents,iniciais);break;
	    case "RLCParalelo":this.circuit =  new RLCParalelo(valueComponents,iniciais);break;
	    case "RLCSerieDegrau":this.circuit =  new RLCSerieDegrau(valueComponents,iniciais);break;
	    case "RLCParaleloDegrau":this.circuit =  new RLCParaleloDegrau(valueComponents,iniciais);break;
	    case 'RLSerieCParalelo': this.circuit =  new RLSerieCParalelo(valueComponents,iniciais);break;
	    case 'RCSerieLParalelo': this.circuit =  new RCSerieLParalelo(valueComponents,iniciais);break;//alert("This setting will be dead short after a little bit time!");
	    case 'LCSerieRParalelo': this.circuit =  new LCSerieRParalelo(valueComponents,iniciais);break;
	    case 'LCParaleloRSerie': this.circuit =  new LCParaleloRSerie(valueComponents,iniciais);break;
	    case 'RCParaleloLSerie': this.circuit =  new RCParaleloLSerie(valueComponents,iniciais);break;
	    case 'RLParaleloCSerie': this.circuit =  new RLParaleloCSerie(valueComponents,iniciais);break;
		default: this.circuit =  "Unknow circuit!\nCheck out documentation!";
		alert(this.circuit);
	    }
		return this.circuit;
	}
	searchSeries(components){
		
	    	for(var i=0;i<components.length;i++){
	    	    for(var k=0;k<2;k++){
	    		var cont = 0;
	    		for(var j=0;j<components.length;j++){
	    		    if(j!=i)
	    		    // console.log(""+components[i].point[k]+"
			    // "+components[j].point[0] + " "+
			    // components[j].point[1]);
	    		    if(j!=i&&(components[i].point[k]==components[j].point[0] &&components[i].point[k]!=components[j].point[1])){
	    			cont++;
	    		    }
	    		    if(j!=i&&(components[i].point[k]==components[j].point[1] &&components[i].point[k]!=components[j].point[0])){
	    			cont++;
	    		    }
	    	    	}
	    		 //console.log(""+components[i].type+" "+cont);
	    		if(cont == 1){
	    		for(var j=0;j<components.length;j++){
	    		    if(j!=i)
	    		    // console.log(""+components[i].point[k]+"
			    // "+components[j].point[0] + " "+
			    // components[j].point[1]);
	    		    if(j!=i&&(components[i].point[k]==components[j].point[0] &&components[i].point[k]!=components[j].point[1])){
	    			return ""+components[i].type.charAt(0)+components[j].type.charAt(0);
	    		    }
	    		    if(j!=i&&(components[i].point[k]==components[j].point[1] &&components[i].point[k]!=components[j].point[0])){
	    			return ""+components[i].type.charAt(0)+components[j].type.charAt(0);
	    		    }
	    	    	}
	    		}
	    	    }
	    	}
	    }
	ord(type){
		switch(type){
		case "resistor":return 0;
		case "inductor":return 1;
		case "capacitor":return 2;
		case "tension":return 3;
		case "chain":return 4;
		default: return 5;
		}
	    }
	nameByOrd(type){
		switch(type){
		case 0:return "resistor";
		case 1:return "inductor";
		case 2:return "capacitor";
		case 3:return "tension";
		case 4:return "chain";
		default: return "";
		}
	    }
	draw(){
	    var a = this;
	    this.space.selectAll("g").data(this.xpoints(this.width,this.height,this.size)).enter().append("g")
			.attr("id",function(d){return "p"+d.point.y+"-"+d.point.x})
			.selectAll("line").data(function(d){return d.line;}).enter().append("line")
			.attr("fill","none").attr("stroke","#CCC").attr("stroke-width","1")
	 		.attr("x1", function(d){return d.x1})
	 		.attr("y1", function(d){return d.y1})
			.attr("x2", function(d){return d.x2})
			.attr("y2", function(d){return d.y2});
	    
		this.markDraw();

	    return this;
	    
	}
	addEvents(){
	    var a = this;
	    this.svg.on("mousemove", function(d){
		    var mX = d3.mouse(this.parentNode)[0];
		    var mY = d3.mouse(this.parentNode)[1];
		    var pi = Math.round((mY-a.size/2)/a.size);
		    var pj = Math.round((mX-a.size/2)/a.size);
		    a.markLabel.text("p"+pi+"-"+pj);
		    a.mark.attr("transform","translate("+(pj*a.size + a.size/2)+","+(pi*a.size + a.size/2)+")");
		    
		    if(a.get != null){
				a.wires[a.cont.w-1].movePoints({p2:"p"+pi+"-"+pj});
		    }
		});
	    
	    
	    this.svg.on("click", function(d){
		    var mX = d3.mouse(this.parentNode)[0];
		    var mY = d3.mouse(this.parentNode)[1];
		    var pi = Math.round((mY-a.size/2)/a.size);
		    var pj = Math.round((mX-a.size/2)/a.size);
			var exist = a.searchComponent(pi,pj);
			if(exist==null)
				exist = a.searchWire(pi,pj);
			if(exist !=null)
			switch(a.element){
				case "delete":
					do{
					a.remove(exist);
					}while(exist = a.searchWire(pi,pj));
					if(a.components.length == 0 && a.wires.length == 0)
						a.elementSet("wire");
					break;
				case "wire":
					if(!(exist instanceof Wire))
						if(exist.point[0].replace("p","").split("-")[1]!= pj)
							exist.newValPrompt();
						else{
							if(a.get!=null){
								a.dropWire();
							}else{
								
								a.addWire(pi,pj);	
							}
						}
					else{
						if(a.get!=null){
							a.dropWire();
							a.addWire(exist.point[1],"p"+pi+"-"+pj);
						}else{
							a.addWire(exist.point[1],"p"+pi+"-"+pj);
							a.addWire(pi,pj);	
						}
					}
					break;
				case "resistor":case "inductor":case "capacitor": case "tension": case "chain":
					if(!(exist instanceof Wire))
						alert("Component already insert here!");
					else{
						
						a.addComponent(pi,pj);
						a.addWire(exist.point[1],"p"+pi+"-"+pj);
					}
					break;
			}
			else
				switch(a.element){
				case "wire":
					if(a.get==null){
							a.addWire(pi,pj,pi,pj);						
						}else{
							a.dropWire();
					}
					break;
				case "resistor":case "inductor":case "capacitor":case "tension":case "chain":
					a.addComponent(pi,pj);
					break;
			}
		});
	}	
	searchComponent(pi,pj){
		for(var i=0;i<this.components.length;i++){
			var point = this.components[i].point[0].replace("p","").split("-");
			point = point.map(function(d){return parseInt(d)});
			
			if(point[0] == pi && point[1]<=pj && (point[1]+3)>pj){
				this.components[i].id = i;
			return this.components[i];
			}
		}
		return null;
	}
	searchWire(pi,pj){
		for(var i=0;i<this.wires.length;i++){
			var point = [this.wires[i].point[0].replace("p","").split("-"),this.wires[i].point[1].replace("p","").split("-")];
			point = point.map(function(d){return [parseInt(d[0]),parseInt(d[1])]});
			var smaller = [Math.min(point[0][0],point[1][0]),Math.min(point[0][1],point[1][1])];
			var greater = [Math.max(point[0][0],point[1][0]),Math.max(point[0][1],point[1][1])];
			
			if(pi<=greater[0]&&pi>=smaller[0]&&pj==point[1][1] 
					|| pj<=greater[1]&&pj>=smaller[1]&&pi==point[0][0]){
				this.wires[i].id = i;
				
				return this.wires[i];
			}
		}
	}
	createCircuit(n){
	    var i,j;
	    for(i=0;i<=n;i++){
		var pi = 1+ 2*i;
		var pj = 1;
		var component = this.componentSwitch(this.nameByOrd(i));
		component.point[0] = "p"+pi+"-"+pj;
	    	component.point[1] = "p"+pi+"-"+(pj+3);
	    	component.move(pj*this.size + (!this.horizontal?0:this.size/2), pi*this.size);
	    	console.log()
	    	var ret = {
	    	    id:this.components.length,
	    	    value:component.value,
	    	    point:component.point
	    	}
	    	component.element.attr("data",JSON.stringify(ret))
	    	this.components.push(component);
	    }
	    for(j=i;j<=3;j++){
		var pi = 1+ 2*(i-1);
		var pj = 1+ 4*(j-i+1);
		var component = this.componentSwitch(this.nameByOrd(j));
		component.point[0] = "p"+pi+"-"+pj;
	    	component.point[1] = "p"+pi+"-"+(pj+3);
	    	component.move(pj*this.size + (!this.horizontal?0:this.size/2), pi*this.size);
	    	console.log()
	    	var ret = {
	    	    id:this.components.length,
	    	    value:component.value,
	    	    point:component.point
	    	}
	    	component.element.attr("data",JSON.stringify(ret))
	    	this.components.push(component);
	    }
	}
	remove(el){	
		if(el instanceof Wire){
			this.cont.w--;
			this.wires.splice(el.id,1)[0].eraseMe();
		}else{
			var type = this.components.splice(el.id,1)[0].eraseMe().type;
			switch(type){
			case "resistor": this.cont.r--;break;
			case "capacitor": this.cont.c--;break;
			case "inductor": this.cont.i--;break;
			case "tension": this.cont.t--;break;
			case "chain": this.cont.fc--;break;
			}
	    }
	}
	elementSet(name){
		if(name == "delete" && this.components.length == 0 && this.wires.length == 0){
			this.elementSet("wire");
			console.log("There isn't anything to delete!");
			return;
		}
		
	    this.element = name;
		this.markDraw();
	}
	horizontalSet(){
	    this.horizontal = !this.horizontal;
	    if(this.horizontal)
	    	d3.select("#btnHorizontal").text("Horizontal");
	    else
			d3.select("#btnHorizontal").text("Vertical");
	}
  	configsFunc(){
  	    var a = this;
  	    return {
		    resistor:{
			size:this.size,
			parent:"#componentsContainer",
			svg:"true",
			name:function(){
			    return "resistor-"+(a.cont.r++);
			    },
			color:"#00F",
			horizontal:a.horizontal,
		},
		capacitor:{
			size:this.size,
			parent:"#componentsContainer",
			svg:"true",
			name:function(){
			    return "capacitor-"+(a.cont.c++);
			    },
			color:"#00F",
			horizontal:a.horizontal,
		},
		inductor:{
			size:this.size,
			parent:"#componentsContainer",
			svg:"true",
			name:function(){
			    return "inductor-"+(a.cont.i++);
			    },
			color:"#00F",
			horizontal:a.horizontal,
		},
		tension:{
			size:this.size,
			parent:"#componentsContainer",
			svg:"true",
			name:function(){
			    return "tension-"+(a.cont.t++);
			    },
			color:"#00F",
			horizontal:a.horizontal,
			orientation:true,
		},
		chain:{
			size:this.size,
			parent:"#componentsContainer",
			svg:"true",
			name:function(){
			    return "chain-"+(a.cont.fc++);
			    },
			color:"#00F",
			horizontal:a.horizontal,
			orientation:true,
		},
		tooltipConfig:{
			name: this.name+"-info",
			parent: "svg",// data: data,
			text:"Component <id>\n<type>\nPontos: <p1> - <p2>\nvalue: <value><unit>"
		},
		wire:{
			parent: "#wiresContainer",
			svg:"true",
			size: this.size,
			p1:"",
			p2:"",
		}
    }; 
  	}
	points(width,height,size){
	    var ret = [];
	    for(var i=0;i<=(height-size)/size;i++){
			for(var j=0;j<=(width-size)/size;j++){
			    ret.push({y:i*size + size/2,x:j*size+size/2});
			}
	    }
	    return ret;
	}
	lines(point,size){
	    var prop = 20;
	    return {line:[{x1:-size/prop+point.x,y1:-size/prop+point.y,x2:size/prop+point.x,y2:size/prop+point.y},
		    {x1:size/prop+point.x,y1:-size/prop+point.y,x2:-size/prop+point.x,y2:size/prop+point.y}],point:{x:Math.floor(point.x/size),y:Math.floor(point.y/size)}};
	}
	xpoints(width,height,size){
	    var lines = this.lines; 
	    return this.points(width,height,size).map(function(d){
			return lines(d,size);
	    });
	}
	componentSwitch(element){
	    switch(element){
	    case "resistor":
		if(this.cont.r==0){
		    return new Resistor(this.configs.resistor);
		}else 
		    alert("Resistor alread insert");
	    	break;
	    case "capacitor":
		if(this.cont.c==0){
		    return new Capacitor(this.configs.capacitor);
		}else 
		    alert("Capacitor alread insert");
	    	break;
	    case "inductor":
		if(this.cont.i==0){
		    return new Inductor(this.configs.inductor);
		}else 
		    alert("Inductor alread insert");
	    	break;
	    case "tension":
		if(this.cont.t==0){
		    return new Tension(this.configs.tension);
		}else 
		    alert("Tension Source alread insert");
	    	break;
	    case "chain":
		if(this.cont.fc==0){
		    return new Chain(this.configs.chain); 
		}else 
		    alert("Chain Source alread insert");
	    	break;
	    }
	}
	addWire(pi,pj){
		var temp = this.configsFunc().wire;
		if(typeof pi == "number" && typeof pj == "number"){
		this.get = {x:pj,y:pi};
		temp.p1 = "p"+pi+"-"+pj;
		temp.p2 = "p"+pi+"-"+pj;
		}else{
			if(pi == pj)
				return;
			temp.p1 = pi;
			temp.p2 = pj;
		}
		var wire = new Wire(temp);
		this.wires.push(wire);
		this.cont.w++;
	}
	dropWire(){
		this.get=null;
		if(this.wires[this.wires.length-1].point[0]==this.wires[this.wires.length-1].point[1])
			this.remove(this.wires[this.wires.length-1]);
	}
	addComponent(pi,pj){
		var component = this.componentSwitch(this.element);
		if(component!=null){
			this.components.push(component);
			if(component.newValPrompt()!=null)
				component
					.movePoints("p"+pi+"-"+pj,"p"+pi+"-"+(pj+3))
					.move(pj*this.size + (!this.horizontal?0:this.size/2), pi*this.size);
			else{
				var temp = this.components[this.components.length-1].id = this.components.length-1;
				this.remove(temp);
			}
		}
		this.elementSet("wire");
	}
	position(p){
	    return {x:p.x*this.size + this.size/2,y:p.y*this.size + this.size/2};
	}
	markDraw(){
		this.mark.text("");
		if(this.element=="delete"){
			this.mark.selectAll("line").data(this.lines({x:0,y:0},this.size*2).line).enter().append("line")
				.attr("fill","none").attr("stroke","#F00").attr("stroke-width","3")
				.attr("x1", function(d){return d.x1})
				.attr("y1", function(d){return d.y1})
				.attr("x2", function(d){return d.x2})
				.attr("y2", function(d){return d.y2});
		}else{
			this.mark.selectAll("line").data(this.lines({x:0,y:0},this.size).line).enter().append("line")
				.attr("fill","none").attr("stroke","#555").attr("stroke-width","2")
				.attr("x1", function(d){return d.x1})
				.attr("y1", function(d){return d.y1})
				.attr("x2", function(d){return d.x2})
				.attr("y2", function(d){return d.y2});
		switch(this.element){
		case "resistor":
			var temp = this.configsFunc().resistor;
			temp.parent = "#mark";
			temp.size = this.size/3;
			var elementTemp = new Resistor(temp);
			temp.size = this.size;
			temp.parent = "#componentsContainer";
			this.cont.r--;
			break;
		case "inductor":
			var temp = this.configsFunc().inductor;
			temp.parent = "#mark";
			temp.size = this.size/3;
			var elementTemp = new Inductor(temp);
			temp.size = this.size;
			temp.parent = "#componentsContainer";
			this.cont.i--;
			break;
		case "capacitor":
			var temp = this.configsFunc().capacitor;
			temp.parent = "#mark";
			temp.size = this.size/3;
			var elementTemp = new Capacitor(temp);
			temp.size = this.size;
			temp.parent = "#componentsContainer";
			this.cont.c--;
			break;
		case "tension":
			var temp = this.configsFunc().tension;
			temp.parent = "#mark";
			temp.size = this.size/3;
			var elementTemp = new Tension(temp);
			temp.size = this.size;
			temp.parent = "#componentsContainer";
			this.cont.t--;
			break;
		case "chain":
			var temp = this.configsFunc().chain;
			temp.parent = "#mark";
			temp.size = this.size/3;
			var elementTemp = new Chain(temp);
			temp.size = this.size;
			temp.parent = "#componentsContainer";
			this.cont.fc--;
			break;
		}
		}
	}
}