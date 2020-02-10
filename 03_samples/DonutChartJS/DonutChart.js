/**
 * * chartConfig Sample
 * chartConfig = {name:"",parent:{},columnData:"",columnScale:"",data:[],dimensions:{},layout:{},font:{},time:{},slicesConfig:{},textValueConfig:{},labelConfig:{},tooltipConfig{},interactions:{}}
 * 
 * name:"DonutChart";			String
 * parent: {
 	id:"#chart",			
  	svg: false
  	}					
 * 
 * columnData: "value";					Name of column to set chart
 * columnScale: "key";					Name of column to set chart
 * data: [{key:"1", value:1},{key:"2", value:2}];	Array with data source
 * dimensions: {
  	width: 400,
  	height: 400,
  	padding:25
  	}
 * layout:{
 	thichness:0.5,
 	corner:0,
 	labelPadding: 0.5,
 	orderBy: {
 		row:"",
  		grow:true},
 	colors: d3.schemeCategory10//[],
 	backpath: #fff
 	}
 * font:{
	name:"sans-serif",
	size:12
	}
 * time:{
	dalay:1200,
	duration:1000
	}
 * slicesConfig:{
	time:{delay:500,duration:1000},
	colData:["key","value"],//,"obs"
	}
 * textValueConfig: { 
	text: "<value>",
	color: {text:"#FFF"},
	font: {name:"sans-serif",size: 12},
	position:{dx: "0.5em", dy: "-0.5em"},
	time: {delay:500,duration:1000}
	}
 * labelConfig:{ 
	text: "<key>",
	color: {text:"#000"},
	font: {name:"sans-comic",size: 15},
	position:{dx: 5, dy: "-0.25em"},
	time: {delay:1200,duration:1000}
	}
 * midleCaption:{ 
	text: "Notas",
	color: {text:"#000"},
	font: {name:"sans-comic",size: 50},
	position:{dx: 0, dy: 10},
	time: {delay:1200,duration:1000}
	}
 * titleConfig:{ 
	text: "Titulo",
	color: {text:"#000"},
	font: {name:"sans-comic",size: 50},
	position:{align: start},
	time: {delay:1200,duration:1000}
	}
 * tooltipConfig: NOTE: Check model in ToolTip's documentation
 * interactions:{
	onClick:function(event){}
	}
 */

/**
 * var chartConfig = {
		name:"DonutChart",
		parent:"#chart",
		column:"value",
		data:disciplinas,
		dimensions:{
		    width: 800,
		    height: 800,
		    padding:25
		},
		layout:{
		    thichness:0.5,
		    corner:0, 
		    labelPadding: 0.2, 
		    orderBy: {row:"key",grow:true}, 
		    colors: d3.schemeCategory10//[]
		},
		font:{
		    name:"sans-serif",
		    size:12
		},
		time:{
		    dalay:1200,
			duration:1000
		},
		slicesConfig: {
			time:{delay:500,duration:1000},
			colData:["key","value"],//,"obs"
		},
		textValueConfig: { 
			text: "<value>",
			color: {text:"#FFF"},
			font: {name:"sans-serif",size: 12},
			position:{dx: "0.5em", dy: "-0.5em"},
			time: {delay:1200,duration:1000}
		},
		labelConfig:{ 
			text: "<key>",
			color: {text:"#000"},
			font: {name:"sans-comic",size: 15},
			position:{dx: 5, dy: "-0.25em"},
			time: {delay:1200,duration:1000}
		},
		midleCaption:{ 
			text: "Notas",
			color: {text:"#000"},
			font: {name:"sans-comic",size: 100},
			position:{dy: 10},
//			time: {delay:1200,duration:1000}
		},
		titleConfig:{
			text: "Notas",
			color: {text:"#000"},
			font: {name:"sans-comic",size: 100},
			position:{align: "start"},
//			time: {delay:1200,duration:1000}
		}
		tooltipConfig:{
		    name: "notas",
		    parent: "svg",// data: data,
			text:"Materia: <key>\nNota: <value>"//\n Eu acho que <obs> nessa materia"
		}
		interactions:{
			onClick:function(event){console.log("Fui Clicado.")}
		}
	}
 */



if(typeof d3 == "undefined"){
    var imported = document.createElement('script');
    imported.src = '//d3js.org/d3.v5.min.js';
    document.head.prepend(imported); 
}

if(typeof jQuery == "undefined"){
    var imported = document.createElement('script');
    imported.src = 'http://code.jquery.com/jquery-latest.min.js';
    document.head.prepend(imported); 
}

if(typeof JSUtil_js == "undefined"){
    var imported = document.createElement('script');
    imported.src = '/Repository/JSUtil.js';
    document.head.prepend(imported); 
}

if(typeof ToolTip_js == "undefined"){
    var imported = document.createElement('script');
    imported.src = '/Repository/ToolTip.js';
    document.head.prepend(imported); 
}





class DonutChart{
    constructor(chartConfig){
	this.validData(chartConfig);
	
	this.create();
	 this.addEvents();
    }
    validData(chartConfig){
	if(chartConfig.data == undefined){
	    console.error("Impossible create graph without DataSource");
	    return null;
	}
	if(chartConfig.columnData == undefined || isNaN($(chartConfig.data[0]).attr(chartConfig.columnData))){
	    
	    console.error("Impossible create graph without DataSwitch or with incompatible DataSwitch \""+ chartConfig.columnData+"\"");
	    return null;
	}
	if(chartConfig.columnScale == undefined){
	    console.error("Impossible create graph without DataScale");
	    return null;
	}
	
	this.name = (chartConfig.name!=undefined)?chartConfig.name:"DonutChart";
	
	this.parent =  (chartConfig.parent!=undefined)?chartConfig.parent:{
	 	id:"#chart",			
	  	svg: false};
	if(this.parent.id == undefined)
	    this.parent.id = "#chart";
	if(this.parent.svg == undefined)
	    this.parent.svg = false;
	  	
	this.columnData = chartConfig.columnData;
	this.columnScale = chartConfig.columnScale;
	this.refer = chartConfig.refer;
	this.data = chartConfig.data;
	var parentSize = document.getDimensions(this.parent.id);
	
	this.dimensions = (chartConfig.dimensions != undefined)?chartConfig.dimensions:{
	    width: parentSize.w,
	    height: parentSize.h,
	    padding:25};
	if(this.dimensions.width == undefined)
	    this.dimensions.width = parentSize.w;
	if(this.dimensions.height == undefined)
	    this.dimensions.height = parentSize.h;
	if(this.dimensions.padding == undefined)
	    this.dimensions.padding = 25;
	
	this.layout = (chartConfig.layout!=undefined)?chartConfig.layout:{
	 	thichness:0.5,
	 	corner:0,
	 	labelPadding: 0.5,
	 	//orderBy: {row:"",grow:true},
	 	backpath: "#fff",
	 	colors: d3.schemeCategory10};
	 if(this.layout.thichness == undefined)
	     this.layout.thichness = 0.5;
	 if(this.layout.corner == undefined)
	     this.layout.corner = 0;
	 if(this.layout.labelPadding == undefined)
	     this.layout.labelPadding = 0.5;
	 if(this.layout.colors == undefined)
	     this.layout.colors = d3.schemeCategory10;
	 if(this.layout.backpath == undefined)
	     this.layout.backpath = "#fff";
	 if(this.layout.orderBy != undefined && this.layout.orderBy.grow ==undefined)
	     this.layout.orderBy.grow = true;
	 
	 this.font = (chartConfig.font!=undefined)?chartConfig.font:{
		name:"sans-serif",
		size:12};
	 if(this.font.name == undefined)
	     this.font.name = "sans-serif";
	 if(this.font.size == undefined)
	     this.font.size = 12;
	
	 this.time = (chartConfig.time != undefined)?chartConfig.time:{
		dalay:1200,
		duration:1000};
	if(this.time.delay == undefined)
	    this.time.delay = 1200;
	if(this.time.duration == undefined)
	    this.time.duration = 1000;
	 
	 this.slicesConfig = (chartConfig.slicesConfig != undefined)?chartConfig.slicesConfig:{
		time:{delay:this.time.delay/2,duration:this.time.duration},
		colData:[],
	};
	if(this.slicesConfig.time ==undefined)
	    this.slicesConfig.time = {};
	if(this.slicesConfig.time.delay == undefined)
	    this.slicesConfig.time.delay = this.time.delay/2;
	if(this.slicesConfig.time.duration == undefined)
	    this.slicesConfig.time.duration = this.time.duration;
	
	this.textValueConfig = chartConfig.textValueConfig;
	if(this.textValueConfig != undefined && this.textValueConfig.text !=undefined && this.textValueConfig.text!=""){
	    if(this.textValueConfig.color ==undefined)
		this.textValueConfig.color = {text:"#FFF"};
	    if(this.textValueConfig.color.text ==undefined)
		this.textValueConfig.color.text = "#FFF";
	    if(this.textValueConfig.font == undefined)
		this.textValueConfig.font = this.font;
	    if(this.textValueConfig.font.name == undefined)
		this.textValueConfig.font.name = this.font.name;
	    if(this.textValueConfig.font.size == undefined)
		this.textValueConfig.font.size = this.font.size;
	    if(this.textValueConfig.position == undefined)
		this.textValueConfig.position = {dx: "0.5em", dy: "-0.5em"};
	    if(this.textValueConfig.position.dx==undefined)
		this.textValueConfig.position.dx = "0.5em";
	    if(this.textValueConfig.position.dy==undefined)
		this.textValueConfig.position.dy = "-0.5em";
	    if(this.textValueConfig.time ==undefined)
		this.textValueConfig.time = {};
	    if(this.textValueConfig.time.delay == undefined)
		this.textValueConfig.time.delay = this.time.delay/2;
	    if(this.textValueConfig.time.duration == undefined)
		this.textValueConfig.time.duration = this.time.duration;
	}else
	    this.textValueConfig = undefined;
	
	this.labelConfig = chartConfig.labelConfig;
	if(this.labelConfig != undefined && this.labelConfig.text !=undefined && this.labelConfig.text!=""){
	    if(this.labelConfig.color ==undefined)
		this.labelConfig.color = {text:"#000"};
	    if(this.labelConfig.color.text ==undefined)
		this.labelConfig.color.text = "#000";
	    if(this.labelConfig.font == undefined)
		this.labelConfig.font = this.font;
	    if(this.labelConfig.font.name == undefined)
		this.labelConfig.font.name = this.font.name;
	    if(this.labelConfig.font.size == undefined)
		this.labelConfig.font.size = this.font.size;
	    if(this.labelConfig.position == undefined)
		this.labelConfig.position = {dx: "5", dy: "-0.25em"};
	    if(this.labelConfig.position.dx==undefined)
		this.labelConfig.position.dx = "5";
	    if(this.labelConfig.position.dy==undefined)
		this.labelConfig.position.dy = "-0.25em";
	    if(this.labelConfig.time ==undefined)
		this.labelConfig.time = {};
	    if(this.labelConfig.time.delay == undefined)
		this.labelConfig.time.delay = this.time.delay;
	    if(this.labelConfig.time.duration == undefined)
		this.labelConfig.time.duration = this.time.duration;
	}else
	    this.labelConfig = undefined;
	
	this.midleCaption = chartConfig.midleCaption;
	if(this.midleCaption != undefined && this.midleCaption.text !=undefined && this.midleCaption.text!=""){
	    if(this.midleCaption.color ==undefined)
		this.midleCaption.color = {text:"#000"};
	    if(this.midleCaption.color.text ==undefined)
		this.midleCaption.color.text = "#000";
	    if(this.midleCaption.font == undefined)
		this.midleCaption.font = {};
	    if(this.midleCaption.font.name == undefined)
		this.midleCaption.font.name = this.font.name;
	    if(this.midleCaption.font.size == undefined)
		this.midleCaption.font.size = this.font.size*2;
	    if(this.midleCaption.position == undefined)
		this.midleCaption.position = {dy:this.midleCaption.font.size/3};
	    if(this.midleCaption.position.dy==undefined)
		this.midleCaption.position.dy = this.midleCaption.font.size/3;
	    if(this.midleCaption.time ==undefined)
		this.midleCaption.time = {};
	    if(this.midleCaption.time.delay == undefined)
		this.midleCaption.time.delay = this.time.delay;
	    if(this.midleCaption.time.duration == undefined)
		this.midleCaption.time.duration = this.time.duration;
	}else
	    this.midleCaption = undefined;
	
	this.titleConfig = chartConfig.titleConfig;
	if(this.titleConfig != undefined && this.titleConfig.text !=undefined && this.titleConfig.text!=""){
	    if(this.titleConfig.color ==undefined)
		this.titleConfig.color = {text:"#000"};
	    if(this.titleConfig.color.text ==undefined)
		this.titleConfig.color.text = "#000";
	    if(this.titleConfig.font == undefined)
		this.titleConfig.font = {};
	    if(this.titleConfig.font.name == undefined)
		this.titleConfig.font.name = this.font.name;
	    if(this.titleConfig.font.size == undefined)
		this.titleConfig.font.size = this.font.size*2;
	    if(this.titleConfig.position == undefined)
		this.titleConfig.position = {align:"start"};
	    if(this.titleConfig.position.align==undefined)
		this.titleConfig.position.align = "start";
	    if(this.titleConfig.time ==undefined)
		this.titleConfig.time = {};
	    if(this.titleConfig.time.delay == undefined)
		this.titleConfig.time.delay = this.time.delay;
	    if(this.titleConfig.time.duration == undefined)
		this.titleConfig.time.duration = this.time.duration;
	}else
	    this.titleConfig = undefined;
	/**/
	
	this.tooltipConfig = chartConfig.tooltipConfig;
	if(this.tooltipConfig==undefined || this.tooltipConfig.text == undefined || this.tooltipConfig.text == "")
	    this.tooltipConfig = undefined;
	
	this.refer = chartConfig.refer;
	
	this.interactions = chartConfig.interactions;
	if(this.interactions == undefined)
	    this.interactions = {};
    }
    create(){
	var a = this;
	
        this.svgConstruct();
        
        if((this.width = this.svg.attr("width"))==undefined)
            this.width = this.dimensions.width;
        if((this.height = this.svg.attr("height"))==undefined)
            this.height = this.dimensions.height;
        
        this.titleDesloc = 0;
        
        this.titleConstruct();
    
        this.generalParams();
        
        this.g = this.svg
        	.append("g").attr("data",$(this.svg._groups[0][0].outerHTML).attr("data"));
        this.g.attr("width",this.radius*2)
        	.attr("transform", "translate(" + this.width/2 + "," + (this.height/2+ this.titleDesloc/2) + ")");
        	
        
        this.pathBack();
        
        this.slicesConstruct();
        
        this.textValueConstruct();
        
        this.labelConstruct();
        
        this.midleCaptionConstruct();
       
        this.toolTipConstruct();
    }
    generalParams(){
	this.radius = (Math.min(this.width,this.height)/2-this.dimensions.padding)-this.titleDesloc/2;
        this.inner = this.radius*this.layout.thichness;
        this.arc = d3.arc()
        	.outerRadius(this.radius)
        	.innerRadius(this.inner)
        	.cornerRadius((this.radius-this.inner)*this.layout.corner*0.5);
    }
    pathBack(){
	if(this.layout.backpath != "#fff" && this.layout.backpath != "#FFF"){
            var back = d3.arc()
            	.outerRadius(this.radius)
            	.innerRadius(this.inner)
            	.cornerRadius((this.radius-this.inner)*this.layout.corner*0.5)
            	.startAngle(0).endAngle(Math.PI*2);
            
            if(this.pathback == undefined)
        	this.pathback = this.g.append("path").attr("class", "background").style("fill", "#FFF");
        
            this.pathback.transition().duration(this.time.duration/2)
	    	.attr("d", back).style("fill", this.layout.backpath);
            }
    }
    svgConstruct(){
	this.svg;
        
        if(this.parent.svg){
            this.svg = d3.select(this.parent.id);
        }else{
            this.svg = d3.select(this.parent.id)
            .append("svg")
            	.attr("id",this.name)
            	.attr("width",this.dimensions.width)
            	.attr("height",this.dimensions.height);
        }
    }
    titleConstruct(){
	var a = this;
	
	if(a.titleConfig != undefined){
	    if(this.titleElement==undefined)
            this.titleElement = this.svg.append("text")
            .attr("id","titleElement_"+this.name)
            .style("font-size", a.titleConfig.font.size)
            	.style("font-family", a.titleConfig.font.name)
            	.attr("fill", "#FFF")
            .text(function(d){
        	return d3.textData((d!=undefined)?d[0]:d,a.titleConfig.text);
            }).attr("fill", a.titleConfig.color.text);
            
            this.titleElement
            .style("font-size",String.adjustWidth(this.titleElement.text(),a.titleConfig.font.size,this.width));
            
            a.titleConfig.position.dy = parseInt(this.titleElement.style("font-size").replace("px",""))/3;
            	var labelDim=document.getDimensions("#titleElement_"+this.name);
            this.titleElement
                .attr("transform", function(){
            		if(a.titleConfig.position.align == "middle")
            		    return"translate(" + (a.width/2-labelDim.w/2) + ", " + 2*labelDim.h/3 + " )";
            		else if(a.titleConfig.position.align == "end")
            		    return"translate(" + (a.width-labelDim.w) + ", " + 2*labelDim.h/3 + " )";
            		else
            		    return "translate(" + 4 + ", " + 2*labelDim.h/3 + " )";
            	    });
             var titleD = document.getDimensions("#titleElement_"+this.name);
             this.titleDesloc = titleD.h;
        }
    }
    sortRules(){
	var a = this;
	if(a.layout.orderBy == undefined || a.layout.orderBy.row == undefined || a.layout.orderBy.row == "")
	    return null;
        else
    	return function(d1,d2){
    	    var rule = (a.layout.orderBy.grow?1:-1);
    		if ($(d1).attr(a.layout.orderBy.row)==="")
    			return ($(d1).attr(a.layout.orderBy.row).charCodeAt(0) > $(d2).attr(a.layout.orderBy.row).charCodeAt(0)?rule:($(d1).attr(a.layout.orderBy.row).charCodeAt(0)<$(d2).attr(a.layout.orderBy.row).charCodeAt(0))?-rule:0);
    		else
    		    return ($(d1).attr(a.layout.orderBy.row) > $(d2).attr(a.layout.orderBy.row)?rule:($(d1).attr(a.layout.orderBy.row)<$(d2).attr(a.layout.orderBy.row))?-rule:0);
    	}
    }
    slicesConstruct(){
	var a = this;
        
        if(this.path == undefined){
        this.pie = d3.pie()
            .sort(this.sortRules())
            .value(function(d) { return $(d).attr(a.columnData); });
        
        this.arcs = this.pie(this.data);
        
        if(this.refer)
            this.arcs.pop();
        
        this.color = d3.scaleOrdinal()
        .domain(this.data.map(function(d){return $(d).attr(a.columnScale);}))
        .range(this.layout.colors); 
        
        this.path = this.g.selectAll("g")
        .data(this.arcs)
      .enter().append("g").append("path")
      .attr("id",function(d, i) {
              return "arc-" + i
          })
        .style("fill", function(d) {
  	 			return a.color(d.index); 
  	  		})
  	  .style("opacity",0.8)		
  	  .attr("data",function(d,i){
  	      var ret = {id:i};
  	      for(var i=0;i<a.slicesConfig.colData.length;i++){
  		    $(ret).attr(a.slicesConfig.colData[i],$(d.data).attr(a.slicesConfig.colData[i]));
  		  }
  	      return JSON.stringify(ret);
  	     })
        .each(function() { this._current = {startAngle: 0, endAngle: 0}; });
        
        }
        
        
        this.path.data(this.arcs)
            .transition()
            .duration(a.slicesConfig.time.duration)
            .delay(a.slicesConfig.time.delay)
                .attrTween("d", function(d) {
                  var interpolate = d3.interpolate(this._current, d);
                  this._current = interpolate(0);
                  return function(t) {
                    return a.arc(interpolate(t));
                  };
                });
        var duration = typeof a.slicesConfig.time.duration == "number"?a.slicesConfig.time.duration: a.slicesConfig.time.duration(this.layout.orderBy);
        var delay = typeof a.slicesConfig.time.delay == "number"?a.slicesConfig.time.delay: a.slicesConfig.time.delay(this.layout.orderBy);
        
        this.path.data(this.arcs).transition().delay(duration + delay).duration(duration).style("opacity",1);
    }
    textValueConstruct(){
	var a = this;
	if(a.textValueConfig!=undefined){
	    
            var label = d3.arc()
            	.outerRadius(this.radius - this.layout.thichness*this.radius*this.layout.labelPadding)
            	.innerRadius(this.radius - this.layout.thichness*this.radius*this.layout.labelPadding);
            
            if(this.texts == undefined)
            this.texts = this.g.selectAll("g").append("text")
            	.attr("transform", "translate(0,0)")
            	.style("font-size", a.textValueConfig.font.size)
            		.style("font-family", a.textValueConfig.font.name)
            	.attr("fill", a.textValueConfig.color.text)
            	.text(function(d) {
            	    return d3.textData(d.data,a.textValueConfig.text);
            	});
            
            this.texts
            .transition()
            	.delay(a.textValueConfig.time.delay)
            	.duration(a.textValueConfig.time.duration)
            .attr("transform", function(d) {
        	
                return "translate(" + label.centroid(d) + ")";
            })
            .attr("dy", a.textValueConfig.position.dx)
            .attr("dx", a.textValueConfig.position.dy);
        }
    }
    labelConstruct(){
	var a = this;
	if(a.labelConfig!=undefined){
	    
	    if( this.labels == undefined)
            this.labels = this.g.selectAll("g").append("text")
            .attr("dx", a.labelConfig.position.dx)
            .attr("dy", a.labelConfig.position.dy)
            .style("font-size", a.labelConfig.font.size)
            	.style("font-family", a.labelConfig.font.name)
            	.attr("fill", a.labelConfig.color.text)
            .append("textPath")
            .attr("xlink:href", function(d, i) {
                return "#arc-" + i;
            });
            
            this.labels
            	.transition().delay(3*a.labelConfig.time.delay/4).duration(a.labelConfig.time.duration)
            .text(function(d) {
                var string = d3.textData(d.data,a.labelConfig.text);
                console.log(a.radius);
                var sizeSpace = (d.endAngle - d.startAngle)*a.radius - a.labelConfig.position.dx/2;
                string = String.adjustLength(string,a.labelConfig.font.size,sizeSpace);
                
                return string;
            }).style("font-size", function(d){
        	var sizeSpace = (d.endAngle - d.startAngle)*a.radius - a.labelConfig.position.dx/2;
        	return String.adjustWidth(a.labels.text(),a.labelConfig.font.size,sizeSpace);
            });
        }
    }
    midleCaptionConstruct(){
	var a = this;
	if(a.midleCaption != undefined){
	    if(this.centerLabel == undefined)
            this.centerLabel = this.g.append("text")
            .attr("id","centerLabel_"+this.name)
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .text(function(d){
                return d3.textData(d,a.midleCaption.text);
            });
            
            this.centerLabel
            .style("font-size", function(d){return String.adjustWidth(a.centerLabel.text(),a.midleCaption.font.size,a.inner*2);})
            	.style("font-family",a.midleCaption.font.name )
            	.attr("fill", "#FFF");
            
            a.midleCaption.position.dy = parseInt(this.centerLabel.style("font-size").replace("px",""))/3;
            var labelDim=document.getDimensions("#centerLabel_"+this.name);
                
            this.centerLabel
                .attr("transform", "translate(" + (labelDim.w/2)*-1 + ", " + a.midleCaption.position.dy + " )")
                .attr("fill", a.midleCaption.color.text);
        }
    }
    toolTipConstruct(){
	if(this.tooltipConfig != undefined){
            this.toolTip = new ToolTip (this.tooltipConfig);
        }
    }
    resize(width,height){
	if(!this.parent.svg)
	    this.svg.attr("width",width)
        	.attr("height",height);
	this.width = width;
	this.height = height;
	
	this.titleConstruct();
	
	this.generalParams();
	
	this.g.attr("width",this.radius*2)
	.attr("transform", "translate(" + this.width/2 + "," + (this.height/2+ this.titleDesloc/2) + ")");
	
	this.pathBack();
	
	this.slicesConstruct();
	
	this.textValueConstruct();
	
	this.labelConstruct();
	this.midleCaptionConstruct();
    }
    addEvents(){
	var a = this;
	
	this.path.on("mouseover", function(d){
             var currentEl = d3.select(this);
             currentEl.style("opacity",0.8);
             if(a.toolTip != undefined)
        	 a.toolTip.show($(currentEl._groups[0][0]).attr("data"));
         });
         
         this.path.on("mousemove", function(d){
             if(a.toolTip != undefined)
        	 a.toolTip.move();
         });
         
         this.path.on("mouseout", function(d){
             if(a.toolTip != undefined)
         	a.toolTip.hide();
             var currentEl = d3.select(this);
             currentEl.style("opacity",1);
         });
     
         this.path.on("click", function(d){
             if(a.interactions.onClick!=undefined)
        	 a.interactions.onClick(this,d);
         });
     
    }
}


class ReferDonutChart{
    constructor(referDonutChartConfig){
	this.validData(referDonutChartConfig);
	this.create();
	this.addEvents();
    }
    validData(referDonutChartConfig){
	if(referDonutChartConfig.data == undefined){
	    console.error("Impossible create graph without DataSource");
	    return;
	}
	if(referDonutChartConfig.columnData == undefined || isNaN($(referDonutChartConfig.data[0]).attr(referDonutChartConfig.columnData))){
	   
	    console.error("Impossible create graph without DataSwitch or with incompatible DataSwitch \""+ referDonutChartConfig.columnData+"\"");
	    return;
	}
	if(referDonutChartConfig.columnScale == undefined){
	    console.error("Impossible create graph without DataScale");
	    return;
	}
	if(referDonutChartConfig.data.refer == undefined){
	    console.error("Impossible create graph without maximum reference");
	    return;
	}
	
	this.referDonutChartConfig = referDonutChartConfig;
	
	if(this.referDonutChartConfig.name==undefined)
	    this.referDonutChartConfig.name= "ReferDonutChart";
	
	if(this.referDonutChartConfig.parent == undefined)
	    this.referDonutChartConfig.parent == "#chart";
	
	if(this.referDonutChartConfig.dimensions == undefined)
	    this.referDonutChartConfig.dimensions = {
		    width:400,
		    height:400,
		    padding:5,};
	
	if(this.referDonutChartConfig.layout == undefined)
	    this.referDonutChartConfig.layout = {
		thichness:0.7,
		corner:1,};
	
	
	if(this.referDonutChartConfig.color == undefined)
	    this.referDonutChartConfig.color = {
		 slices:d3.schemeCategory10,//[],
		 text:"#000",
		 background:"#DDD",};
	
	
	if(this.referDonutChartConfig.font == undefined)
	    this.referDonutChartConfig.font = {
		    size:20,
			name:"sans-serif",};
	
	if(this.referDonutChartConfig.time == undefined)
	    this.referDonutChartConfig.time = {
		duration:1000,
		delay:500,
		proportional:false,};
		
	if(this.referDonutChartConfig.midleCaption!= undefined && (this.referDonutChartConfig.midleCaption.text=="undefined" || this.referDonutChartConfig.midleCaption.text==""))
	    this.referDonutChartConfig.midleCaption = undefined;
	
	if(this.referDonutChartConfig.titleConfig  != undefined && (this.referDonutChartConfig.titleConfig.text=="undefined" || this.referDonutChartConfig.titleConfig.text==""))
	    this.referDonutChartConfig.titleConfig = undefined;
	
	if(this.referDonutChartConfig.caption != undefined && (this.referDonutChartConfig.caption.text=="undefined" || this.referDonutChartConfig.caption.text==""))
	    this.referDonutChartConfig.caption = undefined;
	
	if(this.referDonutChartConfig.tooltipConfig != undefined && (this.referDonutChartConfig.tooltipConfig.text=="undefined" || this.referDonutChartConfig.tooltipConfig.text==""))
	    this.referDonutChartConfig.tooltipConfig = undefined;
	
	if(this.referDonutChartConfig.interactions == undefined)
	    this.referDonutChartConfig.interactions = {};
	
	this.refer = this.referDonutChartConfig.data.refer;
	this.referDonutChartConfig.data = referDonutChartConfig.data.map(function(d){
			var d2 = {};
			$(d2).attr(referDonutChartConfig.columnData,referDonutChartConfig.data.refer-$(d).attr(referDonutChartConfig.columnData));
			$(d2).attr(referDonutChartConfig.columnScale,$(d).attr(referDonutChartConfig.columnScale));
			return [d,d2];
	    });
    }
    create(){
	var a = this;
	
	this.width = a.referDonutChartConfig.dimensions.width;
	this.height = a.referDonutChartConfig.dimensions.height;
	
	this.svgConstruct();
	
	this.groupsConstruct();
	    
	this.donutsConstruct();
	   
	if(a.referDonutChartConfig.tooltipConfig != undefined){
	     this.toolTip = new ToolTip (a.referDonutChartConfig.tooltipConfig);
	}
    }
    resize(width,height){
	this.width = width;
	this.height = height;
	
	this.svgConstruct();
	
	this.groupsConstruct();
	
	this.donutsConstruct();
	
    }
    svgConstruct(){
	var a = this;
	if(this.svg == undefined)
	this.svg = d3.select(a.referDonutChartConfig.parent).append("svg").attr("id","svg-"+a.referDonutChartConfig.name);
	
	this.svg.attr("width", this.width)
    	.attr("height",this.height);
    }
    groupsConstruct(){
	var a = this;
	
	if(this.groups == undefined)
	    this.groups = this.svg.selectAll("g")
            	.data(a.referDonutChartConfig.data).enter()
            	.append("g")
            	.attr("id",function(d,i){
            	    return "graph_"+i;
            	})
            	.attr("data",function(d,i){
            	    var ret = {};
            		$(ret).attr(a.referDonutChartConfig.columnData,$(d[0]).attr(a.referDonutChartConfig.columnData));
        			$(ret).attr(a.referDonutChartConfig.columnScale,$(d[0]).attr(a.referDonutChartConfig.columnScale));
            	    return JSON.stringify(ret);
            	})
            	.style("opacity",1);
	
	this.gdin = Math.partRect(this.width,this.height,a.referDonutChartConfig.data.length);
	
	this.groups.attr("transform", function(d,i){
    	    var n = i%a.gdin.n;
    	    var m = Math.floor(i/a.gdin.n);
    	    var r = a.referDonutChartConfig.data.length%a.gdin.n;
    	    var t = a.referDonutChartConfig.data.length - a.referDonutChartConfig.data.length%a.gdin.n;
    	    var center = (this.width-r*a.gdin.l)/2;
    	    return "translate(" + (i<t?n*a.gdin.l:n*a.gdin.l+center) + "," + m*a.gdin.l + ")"
    	});
	
    }
    donutsConstruct(){
	var a = this;
	if(this.donut == undefined)
	    this.donut = [];
	
	for(var i=0; i<this.groups._groups[0].length; i++){
	    	if(this.donut[i]==undefined){
	    	    var temp = this.chartConfig();
	    	    temp.name = a.referDonutChartConfig.name + "-" + i;
	    	    temp.data = a.referDonutChartConfig.data[i];
	    	    temp.layout.colors[0] = a.referDonutChartConfig.color.slices[(i+2)%a.referDonutChartConfig.color.slices.length];
	    	    temp.parent.id = "#"+this.groups._groups[0][i].id
	    	    this.donut[i] = new DonutChart (temp);
	    	}else
	    	this.donut[i].resize(this.gdin.l,this.gdin.l);
		
	}
    }
    chartConfig(){
	return {
		name:"DonutChart",
		parent:{id:"#svg-"+referDonutChartConfig.nome,svg:true},
		columnData:referDonutChartConfig.columnData,
		columnScale:referDonutChartConfig.columnScale,
		refer:this.refer,
		data:referDonutChartConfig.data,
		dimensions:{
		    width: this.gdin.l,
		    height: this.gdin.l,
		    padding: referDonutChartConfig.dimensions.padding,
		},
		layout:{
			thichness:referDonutChartConfig.layout.thichness,
		 	corner:referDonutChartConfig.layout.corner,
		 	backpath:referDonutChartConfig.color.background,
		 	colors:[]
		},
		slicesConfig: {
			time:{delay:function(d){return referDonutChartConfig.time.delay;},duration:function(d){return referDonutChartConfig.time.duration*(referDonutChartConfig.time.proportional?d.value/referDonutChartConfig.data.refer:1);}},
			colData:[referDonutChartConfig.columnScale,referDonutChartConfig.columnData],//
		},
		midleCaption:referDonutChartConfig.midleCaption,
		titleConfig:referDonutChartConfig.titleConfig,
	};
    }
    addEvents(){
	var a = this;
	 a.groups.on("mouseover", function(d){
             var currentEl = d3.select(this);
             currentEl.style("opacity",0.8);
             if(a.toolTip !=undefined)
        	 a.toolTip.show($(currentEl._groups[0][0]).attr("data"));
         });
         
         a.groups.on("mousemove", function(d){
             if(a.toolTip !=undefined)
        	 a.toolTip.move();
         });
         
         a.groups.on("mouseout", function(d){
     		var currentEl = d3.select(this);
             currentEl.style("opacity",1);
             if(a.toolTip !=undefined)
         	a.toolTip.hide();
         });
         a.groups.on("click", function(d){
             if(referDonutChartConfig.interactions.onClick)
        	 referDonutChartConfig.interactions.onClick(d);
         });
    }
}