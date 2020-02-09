var contComponents = 0;
var contWires = 0;
class Component{
    constructor(componentConfig){
	this.svg = componentConfig.svg? d3.select(componentConfig.parent):d3.select(componentConfig.parent).append("svg");
	this.size = componentConfig.size;
	this.color = componentConfig.color;
	this.point = [componentConfig.p1,componentConfig.p2];
	this.toolTipConfig = componentConfig.toolTipConfig;
	this.horizontal = componentConfig.horizontal;
	this.value = 0;
	
	
	this.element = this.svg.append("g")
			.attr("id",componentConfig.name);
	if(this.svg.attr("height")!=null)
	this.element.attr("transform","translate(0,"+this.svg.attr("height")+")");
	
	this.g = this.element.append("g").attr("text-anchor", "middle");
	this.type = "component";
	this.type2 = "this component";
	this.unit = undefined;
	contComponents++;
    }
    insertToolTip(){
	var ret = {
		    id:contComponents,
		    value:this.value,
		    p1:this.point[0],
		    p2:this.point[1],
		    unit:this.unit,
		    type:this.type
	    }
	this.element.attr("data",JSON.stringify(ret));
	return this;
    }
    movePoints(p1,p2){
	this.point[0] = p1;
	this.point[1] = p2;
	return this;
    }
    newVal(val){
	this.value = val;
	this.draw();
	return this;
    }
    newValPrompt(){
	var x = parseFloat(prompt("Enter a value of "+this.type2+"("+this.unit+"):", this.value));
	if(x != undefined && !isNaN(x))
	    return this.newVal(x);
	else{
	    return null;
	}	
    }
    eraseMe(){
	this.element.text("");
	this.element.remove();
	return this;
    }
    move(x,y){
	this.element.transition().attr("transform","translate("+x+","+y+")");
	return this;
    }
    insertLabel(){
	this.g.selectAll("text").remove()
	this.g.append("text")
		.attr("transform","translate("+this.size*3/2+","+-this.size+")")
		.attr("fill", "#000")
		.style("font-size", this.size/5)
		.text(function(d, i) {
		    return "";
		}).append("tspan").attr("id","text")
			.attr("x", 0).attr("y", 0).attr("dy", "1.9em")
			.text(this.value+this.unit);
	return this;
    }
    static config(){
	return { size:50,parent:"#svgCircuits", svg:"true", name:Component.name(), color:"#00F",horizontal:true, orientation:true}
    }
    static name(){
	return "component-"+contComponent;
    }
}

/**
     * Class Resistor config Sample var resistorConfig = { size:50,
     * parent:"#svgCircuits", svg:"true", name:"resistor-1", color:"#00F",
     * horizontal:true, };
     */

class Resistor extends Component{
    constructor(resistorConfig){
	super(resistorConfig);
	this.type = "resistor";
	this.type2 = "resistance";
	this.unit = "Ω";
	this.draw();
    }
    points(size,horizontal){
	var p = 4;
	if(horizontal)
	    var linesResistor = [ [ 0, 0 ], [ size/3, 0 ], [ size * 2 / 3, - size/2+p ],
		[ size , size/2 -p], [ size * 4 / 3, -size/2 +p],
		[ size * 5 / 3, size/2 -p], [ size * 2, -size/2 +p],
		[ size * 7 / 3, size/2 -p], [ size * 8 / 3, 0 ],
		[ size * 3, 0 ] ];
	else
	    var linesResistor = [ [ 0, 0 ], [ 0, size/3 ], [ - size/2+p, size * 2 / 3 ],
		[  size/2-p,size ], [ -size/2 +p, size * 4 / 3 ],
		[ size/2-p, size * 5 / 3 ], [-size/2 +p, size * 2 ],
		[ size/2-p, size * 7 / 3 ], [ 0, size * 8 / 3 ],
		[ 0, size * 3 ] ];
	var ret = "";
	for(var i=0;i<linesResistor.length;i++)
	    ret+=linesResistor[i][0]+","+linesResistor[i][1]+"\n\t";
	return ret.substr(0,ret.length-2);
    }
    draw(){
	this.g.text("");
	var size = this.size;
	var horizontal = this.horizontal;
	this.g.attr("transform",function(){ var ret = "";
		if(horizontal)
		    ret = "translate(0,"+size/2+")";
		else
		    ret = "translate("+size/2+",0)";
		return ret;
	});
	
	this.g.append("polyline").attr("points",this.points(this.size,this.horizontal)).attr("fill","none").attr("stroke",this.color).attr("stroke-width","2");
	
	this.insertLabel();
	
	return this;
    }
}

/**
 * Class Capacitor config Sample var capacitorConfig = { size:50,
 * parent:"#svgCircuits", svg:"true", name:"capacitor-1", color:"#00F",
 * horizontal:true, };
 */

class Capacitor extends Component{
    constructor(capacitorConfig){
	super(capacitorConfig);
	this.type = "capacitor";
	this.type2 = "capacitance";
	this.unit = "F";
	this.draw();
    }
    lines(){
	var size = this.size;
	var p=4;
	if(this.horizontal)
	    return [
		{x1:0,y1:0,x2:size,y2:0},
		{x1:size,y1:-size/2+p,x2:size,y2:size/2-p},
		{x1:size*2,y1:-size/2+p,x2:size*2,y2:size/2-p},
		{x1:size*2,y1:0,x2:size*3,y2:0}
		];
	else
	    return [
		{x1:0,y1:0,x2:0,y2:size},
		{x1:-size/2+p,y1:size,x2:size/2-p,y2:size},
		{x1:-size/2+p,y1:size*2,x2:size/2-p,y2:size*2},
		{x1:0,y1:size*2,x2:0,y2:size*3}
		];
    }
    draw(){
	this.g.text("");
	var size = this.size;
	var horizontal = this.horizontal;
	this.g.attr("transform",function(){ 
	    var ret = "";
	    if(horizontal)
		ret = "translate(0,"+size/2+")";
	    else
		ret = "translate("+size/2+",0)";
	    return ret;
	});
	this.g.selectAll("line").data(this.lines()).enter().append("line")
		.attr("fill","none").attr("stroke",this.color).attr("stroke-width","2")
		.attr("x1", function(d){return d.x1})
		.attr("y1", function(d){return d.y1})
		.attr("x2", function(d){return d.x2})
		.attr("y2", function(d){return d.y2});
	this.insertLabel();
	return this;
    }
}

/**
 * Class Inductor config Sample var inductorConfig = { size:50,
 * parent:"#svgCircuits", svg:"true", name:"inductor-1", color:"#00F",
 * horizontal:true, };
 */

class Inductor extends Component{
    constructor(inductorConfig){
	super(inductorConfig);
	this.type = "inductor";
	this.type2 = "inductance";
	this.unit = "H";
	this.draw();
    }
    points(){
	var size = this.size;
	if(this.horizontal)
	    return [
		{ "x": 0,   "y": 0},
		{ "x": size/2,   "y": 0},
		{ "x": size*3/4,   "y": size/2-1},
		{ "x": size*7/6,   "y": 0},
		{ "x": size,   "y": -size/2+1},
		{ "x": size*5/6,   "y": 0},
		{ "x": size*5/4,   "y": size/2-1},
		{ "x": size*10/6,   "y": 0},
		{ "x": size*6/4,   "y": -size/2+1},
		{ "x": size*8/6,   "y": 0},
		{ "x": size*7/4,   "y": size/2-1},
		{ "x": size*13/6,   "y": 0},
		{ "x": size*8/4,   "y": -size/2+1},
		{ "x": size*11/6,   "y": 0},
		{ "x": size*9/4,   "y": size/2-1},
		{ "x": size*10/4,   "y": 0},
		{ "x": size*3,   "y": 0}
		];
	else
	    return [
		{ "x": 0,   "y": 0},
		{ "x": 0,   "y": size/2},
		{ "x": size/2-1,   "y": size*3/4},
		{ "x": 0,   "y": size*7/6},
		{ "x": -size/2+1,   "y": size},
		{ "x": 0,   "y": size*5/6},
		{ "x": size/2-1,   "y": size*5/4},
		{ "x": 0,   "y": size*10/6},
		{ "x":  -size/2+1,   "y":size*6/4},
		{ "x": 0,   "y": size*8/6},
		{ "x":  size/2-1,   "y":size*7/4},
		{ "x": 0,   "y": size*13/6},
		{ "x": -size/2+1,   "y": size*8/4},
		{ "x": 0,   "y": size*11/6},
		{ "x": size/2-1,   "y": size*9/4},
		{ "x": 0,   "y": size*10/4},
		{ "x": 0,   "y": size*3}
		];
    }
    draw(){
	this.g.text("");
	var size = this.size;
	var horizontal = this.horizontal;
	this.g.attr("transform",function(){ var ret = "";
		if(horizontal)
		    ret = "translate(0,"+size/2+")";
		else
		    ret = "translate("+size/2+",0)";
		return ret;
	});
    // This is the accessor function we talked about above
	var lineFunction = d3.line()
		.x(function(d) { return d.x; }) // set the x values for the line
					    // generator
		.y(function(d) { return d.y; }) // set the y values for the line
					    // generator
		.curve(d3.curveBasis) // apply smoothing to the line
	 
    // The line SVG Path we draw
	this.g.append("path")
		.attr("d", lineFunction(this.points()))
		.attr("stroke", this.color)
		.attr("stroke-width", 2)
		.attr("fill", "none");
	// https://www.dashingd3js.com/svg-paths-and-d3js
	this.insertLabel();
	return this;
    }
}

/**
 * Class Tension config Sample var tensionConfig = { size:50,
 * parent:"#svgCircuits", svg:"true", name:"tension-1", color:"#00F",
 * horizontal:true,orientation:true, };
 */

class Source extends Component{   
    constructor(sourceConfig){
	super(sourceConfig);
	this.orientation = sourceConfig.orientation;
    }
    invert(){
	this.orientation = !this.orientation;
	return this.newVal(-this.value)
    }
}

class Tension extends Source{
    constructor(tensionConfig){
	super(tensionConfig);
	this.type = "tension";
	this.type2 = "tension";
	this.unit = "V";
	this.draw();
    }   
    lines(){
	var ret = [];
	var size = this.size;
	if(this.horizontal)
	    ret =  [
		{x1:0,y1:0,x2:size,y2:0},
		{x1:size*9/8,y1:0,x2:size*11/8,y2:0},
		{x1:size*13/8,y1:0,x2:size*15/8,y2:0},
		{x1:size*10/8,y1:-size/8,x2:size*10/8,y2:size/8},
		{x1:size*2,y1:0,x2:size*3,y2:0}
		];
	else
	    ret = [
		{x1:0,y1:0,x2:0,y2:size},
		{x1:0,y1:size*9/8,x2:0,y2:size*11/8},
		{x1:-size/8,y1:size*14/8,x2:size/8,y2:size*14/8},
		{x1:-size/8,y1:size*10/8,x2:size/8,y2:size*10/8},
		{x1:0,y1:size*2,x2:0,y2:size*3}
		];
	if(!this.orientation)
	    if(this.horizontal){
		ret[3] = {x1:size*14/8,y1:-size/8,x2:size*14/8,y2:size/8}
	    }else{
		ret[1] = {x1:0,y1:size*13/8,x2:0,y2:size*15/8}
	    }
	return ret;
    }
    draw(){
	this.g.text("");
	var size = this.size;
	var horizontal = this.horizontal;
	this.g.attr("transform",function(){
	    var ret = "";
	    if(horizontal)
		ret = "translate(0,"+size/2+")";
	    else
		ret = "translate("+size/2+",0)";
	    return ret;
	});
	this.g.append("circle")
		.attr("cx", function(){
		    if(horizontal)
			return size*3/2;
		    else
			return 0;
		})
		.attr("cy", function(){
		    if(horizontal)
			return 0;
		    else
			return size*3/2;
		})
		.attr("r", size/2-1)
		.attr("stroke", this.color)
		.attr("stroke-width", 2)
		.attr("fill", "none");
	this.g.selectAll("line").data(this.lines()).enter().append("line")
		.attr("fill","none").attr("stroke",this.color).attr("stroke-width","2")
		.attr("x1", function(d){return d.x1})
		.attr("y1", function(d){return d.y1})
		.attr("x2", function(d){return d.x2})
		.attr("y2", function(d){return d.y2});
	this.insertLabel();
	return this;
    }
	
 }

/**
 * Class Chain config Sample var chainConfig = { size:50, parent:"#svgCircuits",
 * svg:"true", name:"chain-1", color:"#00F", horizontal:true,orientation:true, };
 */

class Chain extends Source{
    constructor(chainConfig){
	super(chainConfig);
	this.type = "chain";
	this.type2 = "chain";
	this.unit = "A";
	this.draw();
    }
    lines(){
	var size = this.size;
	var ret = [];
	if(this.horizontal)
	    ret = [
		{x1:0,y1:0,x2:size,y2:0},
		{x1:size*11/8,y1:0,x2:size*15/8,y2:0},
		{x1:size*2,y1:0,x2:size*3,y2:0}
		];
	else
	    ret = [
		{x1:0,y1:0,x2:0,y2:size},
		{x1:0,y1:size*11/8,x2:0,y2:size*15/8},
		{x1:0,y1:size*2,x2:0,y2:size*3}
		];
	if(!this.orientation)
	    if(this.horizontal)
		ret[1] = {x1:size*9/8,y1:0,x2:size*13/8,y2:0};
	    else
		ret[1] = {x1:0,y1:size*9/8,x2:0,y2:size*13/8};
	return ret;
    }
    seta(){
	var size = this.size;
	var ret = [];
	if(this.horizontal)
	    ret = [ { "x": size*9/8,   "y": 0},  
		{ "x": size*11/8,  "y": -size/8},
		{ "x": size*11/8,  "y": size/8}];
	else
	    ret = [ { "x": 0,   "y": size*9/8},  
		{ "x": -size/8,  "y": size*11/8},
		{ "x": size/8,  "y": size*11/8}];
	if(!this.orientation){
	    if(this.horizontal)
		ret = [ { "x": size*15/8,   "y": 0},  
		    { "x": size*13/8,  "y": -size/8},
		    { "x": size*13/8,  "y": size/8}];
	    else
		ret = [ { "x": 0,   "y": size*15/8},  
		    { "x": -size/8,  "y": size*13/8},
		    { "x": size/8,  "y": size*13/8}];
	}
	return ret;
    }
    circle(){ 
	if(this.horizontal)
	    return {x:this.size*3/2,y:0};
	else
	    return {x:0,y:this.size*3/2};
    }
    draw(){
	this.g.text("");
	var size = this.size;
	var horizontal = this.horizontal;
	this.g.attr("transform",function(){
	    var ret = "";
	    if(horizontal)
		ret = "translate(0,"+size/2+")";
	    else
		ret = "translate("+size/2+",0)";
	    return ret;
	});
	var lineFunction = d3.line()
		.x(function(d) { return d.x; }) // set the x values for the line
	 					    // generator
		.y(function(d) { return d.y; }) // set the y values for the line
	 					    // generator
		.curve(d3.curveLinearClosed);

	this.g.append("circle")
		.attr("cx",this.circle().x)
		.attr("cy",this.circle().y)
		.attr("r", size/2-1)
		.attr("stroke", this.color)
		.attr("stroke-width", 2)
		.attr("fill", "none");
	 	
	this.g.selectAll("line").data(this.lines()).enter().append("line")
		.attr("fill","none").attr("stroke",this.color).attr("stroke-width","2")
		.attr("x1", function(d){return d.x1})
		.attr("y1", function(d){return d.y1})
		.attr("x2", function(d){return d.x2})
		.attr("y2", function(d){return d.y2});
	 	
	this.g.append("path")
		.attr("d", lineFunction(this.seta()))
		.attr("stroke", this.color)
		.attr("stroke-width", 2)
		.attr("fill", this.color);
	this.insertLabel();
	return this;
    }
}

class Wire {
	constructor(componentConfig){
		this.svg = componentConfig.svg? d3.select(componentConfig.parent):d3.select(componentConfig.parent).append("svg");
		this.size = componentConfig.size;
		this.color = componentConfig.color;
		this.point = [componentConfig.p1,componentConfig.p2];
		this.toolTipConfig = componentConfig.toolTipConfig;
		
		this.lineFunction = d3.line()
			    .x(function(d) { return d.x; }) // set the x values
							    // for the line
			    // generator
				.y(function(d) { return d.y; }) // set the y
								// values for
								// the line
						    // generator
				.curve(d3.curveStepAfter);
		
		this.element = this.svg.append("g").attr("class","wire");
		this.draw();
	}
	/*lines(){
		return d3.line()
			    .x(function(d) { return d.x; }) // set the x values
							    // for the line
			    // generator
				.y(function(d) { return d.y; }) // set the y
								// values for
								// the line
						    // generator
				.curve(d3.curveStepAfter);
	}*/
	insertToolTip(){
		var ret = {
				id:contWires,
				p1:this.point[0],
				p2:this.point[1],
			}
		this.element.attr("data",JSON.stringify(ret));
		return this;
    }
    movePoints(p){
		if(p.p1 != undefined)
			this.point[0] = p.p1;
		if(p.p2 != undefined)
			this.point[1] = p.p2;
		
		//var points = [a.position(a.get),a.position({x:pj,y:pi})];
		this.line.attr("d", this.lineFunction([this.position(this.strToPoints(this.point[0])),
					this.position(this.strToPoints(this.point[1]))]));
		
		this.cir1.attr("cx",this.position(this.strToPoints(this.point[0])).x)
			.attr("cy",this.position(this.strToPoints(this.point[0])).y);
			
		this.cir2.attr("cx",this.position(this.strToPoints(this.point[1])).x)
			.attr("cy",this.position(this.strToPoints(this.point[1])).y);
		
		return this;
    }
    eraseMe(){
		this.element.text("");
		this.element.remove();
		return this;
    }
    position(p){
	    return {x:p.x*this.size + this.size/2,y:p.y*this.size + this.size/2};
	}
	static config(){
		return { size:50,parent:"#svgCircuits", svg:"true", name:Component.name(), color:"#000"};
    }
    static name(){
		return "component-"+contWires;
    }
	draw(){
		this.element.text("");
		
		this.line = this.element.append("path")
			.attr("d", 
				this.lineFunction(
					[this.position(this.strToPoints(this.point[0])),
					this.position(this.strToPoints(this.point[1]))]))
			.attr("stroke", "#000")
			.attr("stroke-width", 2)
			.attr("fill", "none");
		this.cir1 = this.element.append("circle")
			.attr("cx",this.position(this.strToPoints(this.point[0])).x)
			.attr("cy",this.position(this.strToPoints(this.point[0])).y)
			.attr("r",this.size/15);
		this.cir2 = this.element.append("circle")
			.attr("cx",this.position(this.strToPoints(this.point[1])).x)
			.attr("cy",this.position(this.strToPoints(this.point[1])).y)
			.attr("r",this.size/15);
		return this;
	}
	strToPoints(string){
		var point = string.replace("p","").split("-");
		point = point.map(function(d){return parseInt(d)});
		return {x:point[1],y:point[0]};
	}
}
// https://www.dashingd3js.com/svg-basic-shapes-and-d3js
