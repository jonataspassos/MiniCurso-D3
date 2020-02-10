var barChartCont = 0;

class BarChart{
    constructor(chartConfig){
	this.validData(chartConfig)
		.create()
		.draw()
		.addInteractions();			
    }
    validData(chartConfig){
	if(chartConfig.data == undefined){
	    console.error("Impossible create BarChart without DataSource");
	    return;
	}
	if(chartConfig.dataConfig == undefined || chartConfig.dataConfig.ordinal == undefined || chartConfig.dataConfig.linear == undefined){
	    console.error("Impossible create BarChart without DataSource Config");
	    return;
	}
	if(chartConfig.name == undefined)chartConfig.name = "BarChart"+ barChartCont++;
	if(chartConfig.parent == undefined)chartConfig.parent  = "body";
	if(chartConfig.svg == undefined)chartConfig.svg = false;
	if(typeof chartConfig.dataConfig.linear != "string")
	    chartConfig.multiple = true;
	else
	    chartConfig.multiple = false;
	
	if(chartConfig.dimensions == undefined)chartConfig.dimensions = {};
	if(chartConfig.dimensions.width == undefined)chartConfig.dimensions.width = 900;
	if(chartConfig.dimensions.height == undefined)chartConfig.dimensions.height = 600;
	
	if(chartConfig.layout == undefined)chartConfig.layout = {};
	if(chartConfig.layout.horizontal == undefined)chartConfig.layout.horizontal=false;
	if(chartConfig.layout.corner == undefined)chartConfig.layout.corner=0;
	if(chartConfig.layout.view == undefined)chartConfig.layout.view = "stack";
	if(chartConfig.layout.orderBy != undefined){
	    if(chartConfig.layout.orderBy.row == undefined)
		chartConfig.layout.orderBy = undefined;
	    else if(chartConfig.layout.orderBy.grow  == undefined)
		chartConfig.layout.orderBy.grow = true;
	}
	if(chartConfig.layout.padding == undefined)chartConfig.layout.padding = 0.1;
	if(chartConfig.layout.margin == undefined)chartConfig.layout.margin = {};
		if(chartConfig.layout.margin.top == undefined)chartConfig.layout.margin.top = 20;
		if(chartConfig.layout.margin.right == undefined)chartConfig.layout.margin.right = 20;
		if(chartConfig.layout.margin.bottom == undefined)chartConfig.layout.margin.bottom = 30;
		if(chartConfig.layout.margin.left == undefined)chartConfig.layout.margin.left = 40;
	if(chartConfig.layout.divisions == undefined)chartConfig.layout.divisions = {};	
		if(chartConfig.layout.divisions.grid == undefined)chartConfig.layout.divisions = 10;
		if(chartConfig.layout.divisions.axis == undefined)chartConfig.layout.divisions = 10;
	if(chartConfig.layout.format == undefined)chartConfig.layout.format = {};
		if(chartConfig.layout.format.type == undefined)chartConfig.layout.format.type = "";
		if(chartConfig.layout.format.unit == undefined)chartConfig.layout.format.unit = "";
	if(chartConfig.layout.alias == undefined)chartConfig.layout.alias = {};
		if(chartConfig.layout.alias.ordinal == undefined)chartConfig.layout.alias.ordinal = chartConfig.dataConfig.ordinal;
		if(chartConfig.layout.alias.linear == undefined)chartConfig.layout.alias.linear = chartConfig.dataConfig.linear;
	if(chartConfig.layout.colors == undefined)chartConfig.layout.colors = d3.schemeCategory10;//[]
	
	if(chartConfig.bulletConfig != undefined)
		if(chartConfig.bulletConfig.refer == undefined || chartConfig.bulletConfig.base == undefined)
		    chartConfig.bulletConfig = undefined;
	
	if(chartConfig.textValueConfig != undefined){
	    if(chartConfig.textValueConfig.text == undefined)
		chartConfig.textValueConfig = undefined;
	    else{
		if(chartConfig.textValueConfig.color== undefined)chartConfig.textValueConfig.color = "#FFF";
		if(chartConfig.textValueConfig.font== undefined)chartConfig.textValueConfig.font = {};
			if(chartConfig.textValueConfig.font.name == undefined)chartConfig.textValueConfig.font.name = "sans-serif";
			if(chartConfig.textValueConfig.font.size == undefined)chartConfig.textValueConfig.font.size = 12;
		if(chartConfig.textValueConfig.position == undefined)chartConfig.textValueConfig.position = {};
			if(chartConfig.textValueConfig.position.dx ==undefined)chartConfig.textValueConfig.position.dx = 0;
			if(chartConfig.textValueConfig.position.dy ==undefined)chartConfig.textValueConfig.position.dy = 0;
	    }
	}
		
	chartConfig.title = d3.titleValid(chartConfig.title);
		
	if(chartConfig.tooltip != undefined){
	    if(chartConfig.tooltip.text == undefined)
		chartConfig.tooltip= undefined;
	    else{
		chartConfig.tooltip.name = chartConfig.name+"-toolTip";
		if(chartConfig.svg)
		    chartConfig.tooltip.parent = chartConfig.parent;
		else
		    chartConfig.tooltip.parent = "#"+chartConfig.name+"-container";
	    }
	}
		
	if(typeof chartConfig.dataConfig.linear != "string"){
	    if(chartConfig.legend == undefined)chartConfig.legend = {};
	    if(chartConfig.legend.data == undefined)chartConfig.legend.data = {};
	    if(chartConfig.legend.data.name == undefined)chartConfig.legend.data.name = chartConfig.layout.alias.linear;
	    chartConfig.legend.name = chartConfig.name+"-legend";
	    if(chartConfig.legend.svg == undefined)chartConfig.legend.svg = true;
	    if(chartConfig.legend.svg)
	    if(chartConfig.svg)
		    chartConfig.legend.parent = chartConfig.parent;
		else
		    chartConfig.legend.parent = "#"+chartConfig.name+"-container";
	    else
		if(chartConfig.legend.parent == undefined)
		    chartConfig.legend.parent = "body";
	    chartConfig.legend.data.color = chartConfig.layout.colors;
	    if(chartConfig.legend.position == undefined)chartConfig.legend.position = {};
	    if(chartConfig.legend.position.align == undefined){
		chartConfig.legend.position.align = "top-right";
		if(chartConfig.legend.svg){
		    chartConfig.legend.position.x = chartConfig.dimensions.width - chartConfig.layout.margin.right;
		    chartConfig.legend.position.y = chartConfig.layout.margin.top;
		}
	    }
	    
	}else{
	    chartConfig.legend = undefined;
	}
		
	chartConfig.interactions = d3.validEvents(chartConfig.interactions);
		
	this.chartConfig = chartConfig;
	return this;
   }
    create(){
	var a = this;
	    
	this.svg = a.chartConfig.svg?d3.select(a.chartConfig.parent):d3.select(a.chartConfig.parent).append("svg").attr("id",chartConfig.name+"-container");
	    
	this.g = this.svg.append("g");
	    
	this.ordinalAxisConfig = d3.scaleBand().rangeRound([0,0]);
	this.linearAxisConfig = d3.scaleLinear().rangeRound([0,0]);
	
	this.ordinalAxisConfig.domain(a.chartConfig.data.map(function(d) { return $(d).attr(a.chartConfig.dataConfig.ordinal); }));
	    
	this.grid = this.g.append("g")
		.attr("opacity",0)
		.classed("gridline", true)
		.attr("fill","none")
		.attr("color","#ccc")
		.attr("stroke-width",2);
	
	this.linearAxis = this.g.append("g")
	      .attr("class", "axis axis--linear");
	      
	this.ordinalAxis = this.g.append("g")
	      .attr("class", "axis axis--ordinal");
	this.toolTipConstruct();
	if(a.chartConfig.multiple){
	    
	    this.bar = [];
	    var ord = [];
	    var el = {base:0,mark:0,refer:0,nothing:0};
	    if(a.chartConfig.bulletConfig != undefined){
		this.rectOrder = a.chartConfig.dataConfig.linear.map(function(d,i){
	 		  for(var j=0;j<a.chartConfig.bulletConfig.base.length;j++)
	 		       if(i == a.chartConfig.bulletConfig.base[j]){
	 			  ord.splice(el.nothing+el.refer,0,i)
	 			  el.base++; 
	 			  return {name:d,type:"base"}
	 		       }
	 		  for(var j=0;j<a.chartConfig.bulletConfig.mark.length;j++)
	 		       if(i == a.chartConfig.bulletConfig.mark[j]){
	 			  ord.push(i);
	 			  el.mark++;
	 			  return {name:d,type:"mark"}
	 		       }
	 		 for(var j=0;j<a.chartConfig.bulletConfig.refer.length;j++)
	 		       if(i == a.chartConfig.bulletConfig.refer[j]){
	 			  ord.splice(el.nothing,0,i)
	 			  el.refer++;
	 			  return {name:d,type:"refer"}
	 		       }
	 		 el.nothing++;
	 		ord.unshift(i);
	 		 return {name:d,type:""};
	 		 
	 		});
	    }else{
		for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
		    a[i] = i;
		    this.bar[i] = undefined;
		}
	    }
	    for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
	 	this.bar[ord[i]] = a.g.append("g").attr("id","g-"+ord[i]).selectAll(".bar-"+ord[i])
		    .data(data)
		    .enter().append("rect").attr("data",function(d,j){
			var ret = {id:j,type:ord[i]};
			return JSON.stringify(ret);
		    })
		      .attr("class", "bar bar-"+i)
		      .attr("style","fill:"+a.chartConfig.layout.colors[ord[i]%a.chartConfig.layout.colors.length])
	    }
	    if(a.chartConfig.bulletConfig != undefined){
		this.axisBulet = this.g.append("g").selectAll("g")
			.data(a.chartConfig.data).enter().append("g")
			.attr("id",function(d,i){return "bulletAxis-"+i;})
			.attr("class", "axis axis--linear");
	    }
	    this.legendConstruct()
	}else{
	    this.bar = a.g.append("g").selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	}
	
	this.titleConstruct();
	
	this.margin(this.chartConfig.layout.margin);
	
	if(a.chartConfig.multiple){
	    for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
		if(!a.chartConfig.layout.horizontal)
		this.bar[i].attr("y", function(d) {
		    return a.h;
		})
		
	    }
	}else{
	    if(!a.chartConfig.layout.horizontal)
		this.bar.attr("y", function(d) {
		    return a.h;
		})
	}
	    
	this.beforeDraw();
	
	return this;
    }
    margin(m){
	var a = this;
	this.chartConfig.layout.margin = m;
	this.w = a.chartConfig.dimensions.width - m.right - m.left;
	this.h = a.chartConfig.dimensions.height - m.top - m.bottom;
	return this;
    }
    beforeDraw(){
	var a = this;
	
	if(!a.chartConfig.svg)
	    this.svg.attr("width",a.chartConfig.dimensions.width)
	    		.attr("height",a.chartConfig.dimensions.height);
	
	this.margin(this.chartConfig.layout.margin);
	this.g.attr("transform",
		"translate("+a.chartConfig.layout.margin.left+","+a.chartConfig.layout.margin.top+")");
	this.ordinalAxisConfig.rangeRound([0,0]);
	this.linearAxisConfig.rangeRound([0,0]);
	this.gridlines = a.gridLayout()()
		.scale(a.linearAxisConfig)
		.tickSize(0)
		.tickFormat("").ticks(a.chartConfig.layout.divisions.grid, "");
	this.grid.text("");
	this.grid
		.call(a.gridlines)
		.attr("transform",a.linearTransform());
	this.linearAxis.text("");
	
	this.linearAxis.attr("text-anchor", "end")
		.append("text").attr("fill","#000")
	      .attr("font-size",15)
	      .text("Frequency");
	
	this.ordinalAxis.text("");
	this.linearAxis.attr("transform",a.linearTransform()).call(this.linearLayout()(this.linearAxisConfig));
	
	
	
	if(a.chartConfig.multiple && a.chartConfig.bulletConfig != undefined){
	   for(var i=0;i<this.axisBulet._groups[0].length;i++){
	    	this.g.select("#bulletAxis-"+i).text("");
	   }
	}
	
	
	
    }
    draw(){
	var a = this;
	this.linearAxisConfig.rangeRound([0,0]);
	if(this.axisBulet != undefined){
	this.axisBulet.transition().duration(500)
		.attr("opacity",0)
		.call(this.linearLayout()(this.linearAxisConfig))
		.selectAll("path").attr("style","display:none;");
	}
	this.ordinalAxisConfig
		.padding(a.chartConfig.layout.padding)
		.rangeRound(a.ordinalSize());
	
	this.linearAxisConfig
		.rangeRound(a.linearSize());
	    
	var rCorner = a.ordinalAxisConfig.bandwidth()*a.chartConfig.layout.corner/2;
	    
	this.linearAxisConfig.domain(a.linearDomain());
	    
	this.gridlines.tickSize(a.ordinalSize()[1])
	this.grid.transition().duration(500)
		.attr("opacity",1)
		.call(a.gridlines)
		.attr("transform", this.linearTransform());
	
	this.ordinalAxis.attr("transform",a.ordinalTransform()).attr("text-anchor", "end");
	this.linearAxis
		.transition()
			.duration(500).attr("opacity",1)
		.call(this.linearLayout()(this.linearAxisConfig)
		.ticks(a.chartConfig.layout.divisions.axis,a.chartConfig.layout.format.type))
		.attr("transform",a.linearTransform());
	this.ordinalAxis
		.transition()
			.duration(500)
		.call(this.ordinalLayout()(this.ordinalAxisConfig))
		.attr("transform",a.ordinalTransform())
		.select("path").attr("style","display:none;");
	
	this.linearAxis.select("text").attr("text-anchor", "end").attr("transform", function(){
		  if(!a.chartConfig.layout.horizontal)
		      return "rotate(-90)";
		  else
		      return "rotate(0)";
	      })
	      .attr("x",function(){
		  if(!a.chartConfig.layout.horizontal)
		      return -6;
		  else
		      return a.w-6;
	      })
	      .attr("y",function(){
		  if(!a.chartConfig.layout.horizontal)
		      return 6;
		  else
		      return 0;
	      })
	      
	      .attr("dy", function(){
		  if(!a.chartConfig.layout.horizontal)
		      return "0.5em";
		  else 
		      return "-0.5em";
	      });
	    
	if(a.chartConfig.multiple){
	    this.moveLegend();
	    
	    switch(a.chartConfig.layout.view){
	    case "group":
		for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
		    this.bar[i].attr("rx", rCorner).attr("ry", rCorner);
		    if(!a.chartConfig.layout.horizontal){
			this.bar[i].transition().duration(500).delay(0)
		    		.attr("x", function(d) {
		    		return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+a.ordinalAxisConfig.bandwidth()*i/a.chartConfig.dataConfig.linear.length;
		    		})
		    		.attr("width",function(d){
		    		    return a.ordinalAxisConfig.bandwidth()/a.chartConfig.dataConfig.linear.length;  
		    		})
		    	this.bar[i].transition().duration(500).delay(500)
		    		.attr("y", function(d) {
		    		    return  a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
		 		})
		 		.attr("height", function(d) {
		 		    return  a.h-a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
		 		})
		    }else{
			this.bar[i].transition().duration(500).delay(0)
				.attr("y", function(d) {
				    return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+a.ordinalAxisConfig.bandwidth()*i/a.chartConfig.dataConfig.linear.length;
		 		}).attr("height", function(d) {
		 		    return a.ordinalAxisConfig.bandwidth()/a.chartConfig.dataConfig.linear.length;
		 		});
			this.bar[i].transition().duration(500).delay(500)
				.attr("x", function(d) {
				    return 0;
				})
				.attr("width",function(d) {
				    return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
				});
		    }	    
		}
		break;
	    case "bullet":
	    	if(a.chartConfig.bulletConfig != undefined){
	    	    this.linearAxisConfig.rangeRound([0,0]);
	    	    this.gridlines = a.gridLayout()()
			.scale(a.linearAxisConfig)
			.tickSize(0)
			.tickFormat("").ticks(a.chartConfig.layout.divisions.grid, "");
	    	    this.grid.transition().duration(500)
			.call(a.gridlines)
			.attr("transform",a.linearTransform());
	    	    this.linearAxis.transition().duration(500)
	    	    	.attr("opacity",0)
	    	    	.attr("transform",a.linearTransform())
	    	    	.call(this.linearLayout()(this.linearAxisConfig));
	    	this.moveLegend();
	    	this.linearAxisConfig.rangeRound(a.linearSize());
	    	this.axisBulet.transition().duration(500).duration(500)
	    		.attr("opacity",1);
	    	var wid = 4*a.ordinalAxisConfig.bandwidth()/5;
	    	    
	    	for(var i=0;i<this.axisBulet._groups[0].length;i++){
	    	    this.linearAxisConfig.domain(a.linearDomain(i));
	    	    this.g.select("#bulletAxis-"+i)
	    		.transition().duration(500).duration(500).attr("opacity",1)
	    		.call(this.linearLayout()(this.linearAxisConfig)
	    			.ticks(a.chartConfig.layout.divisions.axis/2,a.chartConfig.layout.format.type))
	    		.attr("transform",function(d){
	    		    if(!a.chartConfig.layout.horizontal)
	    		    return "translate("+(a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+wid/10)+",0)";
	    		    else
	    			return "translate(0,"+(a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+a.ordinalAxisConfig.bandwidth()-wid/10)+")";
	    		});
	    	}
	    	
	    	if(!a.chartConfig.layout.horizontal){
	    	    if(wid/10 <=4)
	    		this.axisBulet.selectAll(".tick").select("text")
	    	    	.attr("opacity",0)
	    	    else if(wid/10 <=5)
	    		this.axisBulet.selectAll(".tick").select("text").attr("text-anchor", "start").attr("transform","rotate(-90)")
	    		.attr("dy","-0.1em").attr("dx","10px").attr("opacity",1)
	    	    else if(wid/10 <=8)
	    		this.axisBulet.selectAll(".tick").select("text").attr("text-anchor", "middle").attr("transform","rotate(-90)")
	    		.attr("dy","-1em").attr("dx","10px").attr("opacity",1);
	    	    else
	    		this.axisBulet.selectAll(".tick").select("text").attr("text-anchor", "end").attr("transform","rotate(0)")
	    		.attr("dy","0.4em").attr("dx","0px").attr("opacity",1);
	    	}else{
	    	    if(wid/10 <=3)
	    		this.axisBulet.selectAll(".tick").select("text")
	    	    	.attr("opacity",0);
	    	    else if(wid/10 <=5.5)
	    		this.axisBulet.selectAll(".tick").select("text")
	    	    		.attr("text-anchor", "start").attr("opacity",1)
	    	    //.attr("transform","rotate(-90)")
	    		.attr("dy","-0.1em").attr("dx","3px");
	    	    else
	    		this.axisBulet.selectAll(".tick").select("text")
	    	    	.attr("text-anchor", "middle").attr("opacity",1)
	    	    //.attr("transform","rotate(-90)")
	    		.attr("dy","0.8em").attr("dx","0px");
	    	}
	    	
	    	for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
		    this.bar[i].attr("rx", rCorner).attr("ry", rCorner);
		    if(!a.chartConfig.layout.horizontal){
			this.bar[i].transition()
 			.duration(500).delay(0)
 			.attr("height",function(d,j){
 			   a.linearAxisConfig.domain(a.linearDomain(j));
 			  switch(a.rectOrder[i].type){
 			  	case "mark":
 			  	    	return 3;
 			 	case "base": case "refer":
 			  		return a.h-a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
 			  	default:
 			  		return 0;    
 			    }
 			    return 3;
 			}).attr("y",function(d,j){
 			   a.linearAxisConfig.domain(a.linearDomain(j));
 			    return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
 			});
			this.bar[i].transition()
 			.duration(500).delay(500)
 			.attr("width",function(){
 			    switch(a.rectOrder[i].type){
 			    case "base": return wid/3;
 			   	case "mark":case "refer":
 			  		return wid;
 			  	default:
 			  		return 0;    
 			    }
 			}).attr("x",function(d,j){
 			    switch(a.rectOrder[i].type){
 			    	case "base":
 			    	    	return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+ 13*wid/30;
 			   	case "mark":case "refer":
 			  		return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+ wid/10;
 			  	default:
 			  		return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal));    
 			    }
 			});
 			
 			
 			
		    }else{
			
				this.bar[i].transition()
	 			.duration(500).delay(0)
	 			.attr("width",function(d,j){
	 			   a.linearAxisConfig.domain(a.linearDomain(j));
	 			  switch(a.rectOrder[i].type){
	 			  	case "mark":
	 			  	    	return 3;
	 			 	case "base": case "refer":
	 			  		return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
	 			  	default:
	 			  		return 0;    
	 			    }
	 			    return 3;
	 			}).attr("x",function(d,j){
	 			   a.linearAxisConfig.domain(a.linearDomain(j));
	 			    if(a.rectOrder[i].type == "mark")
	 				return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]));
	 			   return 0;
	 			});
				this.bar[i].transition()
	 			.duration(500).delay(500)
	 			.attr("height",function(){
	 			    switch(a.rectOrder[i].type){
	 			    case "base": return wid/3;
	 			   	case "mark":case "refer":
	 			  		return wid;
	 			  	default:
	 			  		return 0;    
	 			    }
	 			}).attr("y",function(d,j){
	 			    switch(a.rectOrder[i].type){
	 			    	case "base":
	 			    	    	return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+ 13*wid/30;
	 			   	case "mark":case "refer":
	 			  		return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal))+ wid/10;
	 			  	default:
	 			  		return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal));    
	 			    }
	 			});
			    
		    }
		}
	    	
	    	break;
		};
	    default://stack
		for(var i=0;i<a.chartConfig.dataConfig.linear.length;i++){
		    this.bar[i].attr("rx", rCorner).attr("ry", rCorner);
		    if(!a.chartConfig.layout.horizontal){
			this.bar[i].transition().duration(500).delay(0)
	    		.attr("y", function(d) {
	    		    var ret = 0;
	 		    for(var j=i;j>=0;j--)
	 			ret+= $(d).attr(a.chartConfig.dataConfig.linear[j]); 
	 		    return  a.linearAxisConfig(ret);
	 		})
	 		.attr("height", function(d) {
	 		    var ret;
	 		    ret = a.h - a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]))-a.chartConfig.layout.padding*10;
	 		    if(ret<0)
	 			ret  = 0;
	 		    return ret;
	 		});
			this.bar[i].transition().duration(500).delay(500)
		    		.attr("x", function(d) {
		    		    return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal));
		    		})
		    		.attr("width",function(d){
		    		    return a.ordinalAxisConfig.bandwidth();  
		    		});
		    }else{
			this.bar[i].transition().duration(500).delay(0)
			.attr("x", function(d) {
			    var ret = 0;
			    for(var j=i-1;j>=0;j--)
				ret+= $(d).attr(a.chartConfig.dataConfig.linear[j]); 
			    return  a.linearAxisConfig(ret);
			})
			.attr("width",function(d) {
			    var ret;
			    ret = a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear[i]))-a.chartConfig.layout.padding*10;
			    if(ret<0)
				ret  = 0;
			    return ret;
			});
			this.bar[i].transition().duration(500).delay(500)
				.attr("y", function(d) {
				    return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal));
		 		}).attr("height", function(d) {
		 		   return a.ordinalAxisConfig.bandwidth();
		 		});
			
		    }
		}	
	    		
	    }
	}else{
	    if(!a.chartConfig.layout.horizontal){
	    this.bar.data(a.chartConfig.data)
	      .attr("class", "bar")
	      .transition()
			.duration(500)
	      .attr("x", function(d) { return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal)); })
	      	.attr("rx", rCorner)
	    	.attr("ry", rCorner)
	      .attr("width", a.ordinalAxisConfig.bandwidth());
	    this.bar.transition()
		.duration(500)
			.delay(500)
			.attr("y", function(d) { return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear)); })
	      .attr("height", function(d) {
		  return a.h - a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear));
	      });
	    }else{
		this.bar.data(a.chartConfig.data)
		      .attr("class", "bar")
		      .transition()
			.duration(500)
		      .attr("y", function(d) { return a.ordinalAxisConfig($(d).attr(a.chartConfig.dataConfig.ordinal)); })
		      	.attr("rx", rCorner)
		    	.attr("ry", rCorner)
		      .attr("height", a.ordinalAxisConfig.bandwidth());
		    this.bar.transition()
			.duration(500)
				.delay(500)
				.attr("x", function(d) { return 0; })
		      .attr("width", function(d) {
			  return a.linearAxisConfig($(d).attr(a.chartConfig.dataConfig.linear));
		      });
	    }
	}
	return this;
    }
    resize(width,height){
	if(width!=undefined)
	    this.chartConfig.dimensions.width = width;
	if(height!=undefined)
	    this.chartConfig.dimensions.height = height;
	var a = this;
	
	if(!a.chartConfig.svg)
	    this.svg.transition().duration(500)
	    		.attr("width",width)
	    		.attr("height",height);
	this.titleConstruct()
	
	this.margin(this.chartConfig.layout.margin);
	
	if(this.chartConfig.legend!=undefined && this.chartConfig.legend.svg)
	    this.legend.translate(width-a.chartConfig.layout.margin.right)
	
	this.g.attr("transform",
		"translate("+a.chartConfig.layout.margin.left+","+a.chartConfig.layout.margin.top+")");
	
	return this.draw();
    }
    reView(view){
	if(view=="horizontal"){
	    if(this.chartConfig.layout.horizontal == false){
		this.chartConfig.layout.horizontal = true;
		this.beforeDraw();
		return this.draw();
	    }
	}
	else if(view=="vertical"){
	    if(this.chartConfig.layout.horizontal == true){
		this.chartConfig.layout.horizontal = false;
	    	this.beforeDraw();
	    	return this.draw();
	    }
	}
	else{
	    this.chartConfig.layout.view = view;
	    return this.draw();
	}
    }
    linearDomain(val){
	if(val != undefined){
	    var max = 0;
	    for(var i=0;i<this.chartConfig.dataConfig.linear.length;i++){
		if(max<$(this.chartConfig.data[val]).attr(this.chartConfig.dataConfig.linear[i]) && this.rectOrder[i].type!="")
		    max = $(this.chartConfig.data[val]).attr(this.chartConfig.dataConfig.linear[i]);
	    }
	    return [0,max];
	}
	var a = this;
	if(a.chartConfig.multiple)
	switch(a.chartConfig.layout.view){
	case "group":case "bullet":
	    return [0, d3.max(a.chartConfig.data, function(d) {
		var max = 0;
		for(var i=0;i<a.chartConfig.dataConfig.linear.length;max = $(d).attr(a.chartConfig.dataConfig.linear[i])>max?$(d).attr(a.chartConfig.dataConfig.linear[i]):max,i++);
		return max;
	    })]
	break;
	default:
	    return [0, d3.max(a.chartConfig.data, function(d) { 
		var ret = 0;
		for(var i = 0;i<a.chartConfig.dataConfig.linear.length;i++)
		    ret+=$(d).attr(a.chartConfig.dataConfig.linear[i]);
		return ret;
	    })];
	}
	else{
	    return [0, d3.max(a.chartConfig.data, function(d) { 	
		return $(d).attr(a.chartConfig.dataConfig.linear);
	    })];
	}
    }
    ordinalSize(){
	
	if(!this.chartConfig.layout.horizontal){
	    return [0,this.w];
	}else{
	    return [0,this.h];
	}
    }
    linearSize(){
	if(!this.chartConfig.layout.horizontal){
	    return [this.h,0];
	}else{
	    return [0,this.w];
	}
    }
    ordinalLayout(){
	if(!this.chartConfig.layout.horizontal){
	    return d3.axisBottom;
	}else{
	    return d3.axisLeft;
	}
    }
    linearLayout(){
	if(!this.chartConfig.layout.horizontal){
	    return d3.axisLeft;
	}else{
    		return d3.axisBottom;
	}
    }
    gridLayout(){
	if(!this.chartConfig.layout.horizontal){
	    return d3.axisRight;
	}else{
    		return d3.axisTop;
	}
    }
    ordinalTransform(){
	if(!this.chartConfig.layout.horizontal){	    
	    return "translate(0,"+this.h+")";
	}else{
	    return "translate(0,0)";
	}
    }
    linearTransform(){
	if(!this.chartConfig.layout.horizontal){
	    return "translate(0,0)";
	}else{
	    return "translate(0,"+this.h+")";
	}
    }
    legendConstruct(){
	var a = this;
	
	a.chartConfig.legend.interactions = d3.validEvents(a.chartConfig.legend.interactions);
	
	var mouseover = function(element,data){
	    var index=-1;
	    for(var i=0;i<a.chartConfig.layout.alias.linear.length;i++){
		if(data == a.chartConfig.layout.alias.linear[i]){
		    index = i;
		    break;
		}
	    }
	    a.bar[index].attr("opacity",0.8);
	}
	var mouseout = function(element,data){
	    var index=-1;
	    for(var i=0;i<a.chartConfig.layout.alias.linear.length;i++){
		if(data == a.chartConfig.layout.alias.linear[i]){
		    index = i;
		    break;
		}
	    }
	    a.bar[index].attr("opacity",1);
	};
	a.chartConfig.legend.interactions.mouseover.push(mouseover); 
	a.chartConfig.legend.interactions.mouseout.push(mouseout);
	this.legend = new Legend(a.chartConfig.legend);
    }
    toolTipConstruct(){
	var a = this;
	if(this.chartConfig.tooltip!= undefined){
            this.toolTip = new ToolTip (this.chartConfig.tooltip);
            a.chartConfig.interactions.mouseover.push(function(element,data){
        	a.toolTip.show(a.alterData(element,data)); 
	    });
	    a.chartConfig.interactions.mousemove.push(function(element,data){
		a.toolTip.move();
	    });
	    a.chartConfig.interactions.mouseout.push(function(element,data){
		a.toolTip.hide();
	    });
        }
	return this;
    }
    alterData(element,data){//Garante value e label como valores principais do retangulo
	var a = this;
	if(a.chartConfig.multiple){
	    var currentEl = d3.select(element);
	    var s = $(currentEl._groups[0][0]).attr("data");
	    s = JSON.parse(s);
	    var value = $(data).attr(a.chartConfig.dataConfig.linear[s.type]);
	    var label = a.chartConfig.layout.alias.linear[s.type];
	}else{
	    var value = $(data).attr(a.chartConfig.dataConfig.linear);
	    var label = a.chartConfig.layout.alias.linear;
	}
	var key = $(data).attr(a.chartConfig.dataConfig.ordinal);
	
	data = JSON.parse(JSON.stringify(data));
	data._value = value;
	data._key = key;
	data._label = label;
	return data;
    }
    moveLegend(){
	var a = this;
	if(a.chartConfig.legend.svg){
	    if(a.chartConfig.layout.view != "bullet"){
		if(a.chartConfig.layout.horizontal){
		    a.legend.move(undefined,a.h+a.chartConfig.layout.margin.top-a.legend.legendDimensions.h);
		}else{
		    a.legend.move();
		}
	    }else{
		if(a.chartConfig.layout.horizontal){
	    	    a.legend.move(this.chartConfig.dimensions.width + this.legend.legendDimensions.w,a.h+a.chartConfig.layout.margin.top-a.legend.legendDimensions.h);
		}else{
		    a.legend.move(this.chartConfig.dimensions.width + this.legend.legendDimensions.w);
		}
	    }
	    
	}
	return this;
    }
    addInteractions(){
	var a = this;
	a.chartConfig.interactions.mouseover.push(function(element,data){
	    var currentEl = d3.select(element);
	    currentEl.attr("opacity",0.8);
	});
	a.chartConfig.interactions.mouseout.push(function(element,data){
	    var currentEl = d3.select(element);
	    currentEl.attr("opacity",1);
	});
	if(a.chartConfig.multiple){
	    for(var i=0;i<this.bar.length;i++){
		d3.addEvents(this.bar[i],a.chartConfig.interactions)
	    }
        }else{
            d3.addEvents(this.bar,a.chartConfig.interactions)
         }
	return this;
    }
    titleConstruct(){
	var a = this;
	
	if(a.chartConfig.titleConfig != undefined){
	    if(this.titleElement==undefined)
            this.titleElement = this.svg.append("text")
            .attr("id","titleElement_"+this.chartConfig.name)
            .style("font-size", a.chartConfig.titleConfig.font.size)
            	.style("font-family", a.chartConfig.titleConfig.font.name)
            	.attr("fill", "#FFF")
            .text(function(d){
        	return d3.textData(a.chartConfig.layout.alias,a.chartConfig.titleConfig.text);
            }).attr("fill", a.chartConfig.titleConfig.color.text);
            
            this.titleElement
            .style("font-size",String.adjustWidth(this.titleElement.text(),a.chartConfig.titleConfig.font.size,a.chartConfig.dimensions.width));
            
            a.chartConfig.titleConfig.position.dy = parseInt(this.titleElement.style("font-size").replace("px",""))/3;
            	var labelDim=document.getDimensions("#titleElement_"+this.chartConfig.name);
            this.titleElement
                .attr("transform", function(){
            		if(a.chartConfig.titleConfig.position.align == "middle")
            		    return"translate(" + (a.chartConfig.dimensions.width/2-labelDim.w/2) + ", " + 2*labelDim.h/3 + " )";
            		else if(a.chartConfig.titleConfig.position.align == "end")
            		    return"translate(" + (a.chartConfig.dimensions.width-labelDim.w) + ", " + 2*labelDim.h/3 + " )";
            		else
            		    return "translate(" + 4 + ", " + 2*labelDim.h/3 + " )";
            	    });
             var titleD = document.getDimensions("#titleElement_"+this.chartConfig.name);
             this.chartConfig.layout.margin.top = titleD.h;
             
             if(a.chartConfig.legend && a.chartConfig.legend.svg){
		    chartConfig.legend.position.x = chartConfig.dimensions.width - chartConfig.layout.margin.right;
		    chartConfig.legend.position.y = chartConfig.layout.margin.top;
             }
             
        }
	return this;
    }
}