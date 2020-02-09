/**
 * 	Class to set tooltips
 */

var ToolTip_js = true;
/* 
 * 	CONFIG SAMPLE
 *  config = { name:"",parent:"",data:[],text:"",color:{},font:{}}
 *  name: "toolTip";					String
 *  parent: "body";					String of Div's ID
 *  data: [{key:"1", value:1},{key:"2", value:2}];	Array with data source
 *  text: "ToolTip's Sample";				String, text of tooltip.
 *  color: {text:"#FFFFFF", background:"#000000"};
 *  font: {name:"sans-serif",size: 10,align:"start"};	align: start | middle | end | inherit
 *  
 *  the model of tooltip's text is:
 *  UserLabel: <atributeName of DataSouce>\nUserLabel:<atributeName>
 */

class ToolTip{
    constructor(config){
	this.name = (config.name != undefined) ? config.name : "toolTip";
	this.parent = (config.parent != undefined) ? config.parent : "body";
	//this.data = config.data;
	this.text = (config.text != undefined) ? config.text : "ToolTip's Sample";
	
	this.color = (config.color != undefined) ? config.color : {text:"#FFFFFF", background:"#000000"};
	if(this.color.text == undefined)
	     this.color.text = "#FFFFFF";
	if(this.color.background == undefined)
	     this.color.background = "#000000";
	
	this.font = (config.font != undefined) ? config.font: {name:"sans-serif",size: 10,align:"start"};
	if(this.font.name == undefined)
	     this.font.name = "sans-serif";
	if(this.font.size == undefined)
	     this.font.size = 10;
	if(this.font.align == undefined)
	     this.font.align = "start";
	
	this.instance = this.create();
    }
    create(){
	var tooltipg = d3.select(this.parent).append("g")
        	.attr("font-family", this.font.nsme)
        	.attr("font-size", this.font.size)
        	.attr("text-anchor", this.font.align)
        	.attr("id", "tooltip_" + this.name)
        	.attr("style", "opacity:0")
        	.attr("transform", "translate(-500,-500)");
	
	tooltipg.append("rect")
		.attr("id", "tooltipRect_" + this.name)
		.attr("x", 0)	
        	.attr("width", 120)
        	.attr("height", 80)
        	.attr("opacity", 0.8)
        	.style("fill", this.color.background);
	
	tooltipg.append("text")
		.attr("id", "tooltipText_" + this.name)
		.attr("x", 30)
		.attr("y", 15)
		.attr("fill", this.color.text)
		.style("font-size", this.font.size)
		.style("font-family", this.font.name)
		.text(function(d, i) {
		    return "";
		});
	
	return tooltipg;
    }
    show(val){//this method should be called inner event mouseover
	var align = this.font.align;
	if(typeof val == "string")
	var data = JSON.parse(val);
	else
	    data = val;
	//unhide tooltip
	var fadeInSpeed = 120;
        d3.select("#tooltip_" + this.name)
           .transition()
            .duration(fadeInSpeed)
            .style("opacity", function() {
                return 1;
            });
	
        //create text
        
	var lines = d3.textData(data,this.text).split("\n");//separate rows
	
	d3.selectAll("#tooltipText_" + this.name).text("");//erase old text
	for(var i=0;i<lines.length;i++){//create line by line
	    d3.selectAll("#tooltipText_" + this.name).append("tspan")
	    	.attr("x", 0).attr("y", i * 12).attr("dy", "1.9em")
	    	.text(lines[i]);//insert line into text
	}
        
	//resize rect
	var dims = document.getDimensions("#tooltipText_" + this.name);
	       d3.selectAll("#tooltipText_" + this.name + " tspan")
	            .attr("x",function(){
	        	if(align == "end")
	        	    return dims.w + 2;
	        	else if(align == "middle")
	        	    return  dims.w/2 + 4;
	        	else
	        	    return 4;
	            });

        d3.selectAll("#tooltipRect_" + this.name)
            .attr("width", dims.w + 10)
            .attr("height", dims.h + 20);
        //reposition tooltip
        this.move();
    }
    move(){//this method should be called inner event mousemove
	//reposition tooltip
	var generalDimensions = document.getDimensions(this.parent);
	var rectDimensions = document.getDimensions("#tooltipRect_" + this.name);
	
	var xCo,yCo; 
	d3.select("#tooltip_" + this.name).attr("transform", function(d) {
			try{
            	var mouseCoords = d3.mouse(this.parentNode);
            	xCo = mouseCoords[0] + 10;
				yCo = mouseCoords[1] + 10;
			}catch(e){
				xCo = event.clientX-4+10;
				yCo = event.clientY-6+10;
			}
            if(xCo + rectDimensions.w > generalDimensions.w){
        	xCo = generalDimensions.w - rectDimensions.w;
            }
            if(yCo + rectDimensions.h > generalDimensions.h){
        	yCo = generalDimensions.h - rectDimensions.h;
            }
            return "translate(" + xCo + "," + yCo + ")";
        });
    }
    hide(){//this method should be called inner event mouseout
	//hide tooltip
	d3.select("#tooltip_" + this.name)
        .style("opacity", function() {
            return 0;
        });
	d3.select("#tooltip_" + this.name).attr("transform", function(d, i) {
            var x = -500;
            var y = -500;
            return "translate(" + x + "," + y + ")";
        });
    }
}