/**
 * Uses polynomial interpolation to find new colors for the palette
 */

class Polynomial{// Polynomial type for repository
    constructor(order,coefficients){// if sent a vector in
				// coefficients, this constructor
				// create polynomial with that.
	this.coefficients = [];
	if (coefficients !== undefined){
	    this.coefficients = coefficients;
	}else if(order !== undefined){// else sent, creates a vector
	    			// with zeroed values
	    for(var i=0;i<order;i++)
	    this.coefficients.push(0.0);
	}else{			// else, creates a unitary vector
	    			// with zeroed values
	    this.coefficients.push(0.0);
	}
    }
    order(){
	return this.coefficients.length - 1;// return order of this polynomial
    }
    result(d) {// Calc the value of result x = d
	var ret=0;
	for(var i=0;i<=this.order();i++) {
		ret += this.coefficient(i)*Math.pow(d, i);
	}
	return ret;
    }
    
    coefficient(i){// return coefficient of a "cordinate" of polynomial.
		// If great than the order, result 0.
	if(i>this.order())
	    return 0;
	else
	    return this.coefficients[i];
    }

    static add(a,b) {// return Sum of two polynomials
	var s = [];
	var max = Math.max(a.order(),b.order())+1;
	for (var i = 0; i < max; i++) {
		s.push(a.coefficient(i) + b.coefficient(i));
	}
	return new Polynomial(0,s);
    }
    
    static sub(a,b) {// return Subtraction of two polynomials
	var s = [];
	var max = Math.max(a.order(),b.order())+1;
	for (var i = 0; i < max; i++) {
		s.push(a.coefficient(i) - b.coefficient(i));
	}
	return new Polynomial(0,s);
    }
    
    static mul(a, b) {// return Multiplication of two polynomials
	var s = [];
	var max  = a.order() + b.order() + 1;
	for(var i=0; i<max;i++)
		s.push(0);
	for (var i = 0; i <= a.order(); i++) {
	    for (var j = 0; j <= b.order(); j++)
		s[i + j] += a.coefficient(i) * b.coefficient(j);
	}
	return new Polynomial(0,s);
    }
    
    static muli(a,b) {// return multiplication of a polynomial and a scalar
			// value
	var s = [];
	var max = a.order()+1;
	for (var i = 0; i < max; i++) {
		s.push(a.coefficient(i) * b);
	}
	return new Polynomial(0,s);
    }
    
    static divi(a,b) {// return division of a polynomial and a scalar value
	var s = [];
	var max = a.order()+1;
	for (var i = 0; i < max; i++) {
		s.push(a.coefficient(i) / b);
	}
	return new Polynomial(0,s);
    }
}

class Lagrange{
    constructor(points){
	this.polynomial = this.p2(points);
    }
    static p2(a){ 
	if (a[0].length != 2) {
		return null;
		// TODO erro
	}
	var L = []
	var ini = [ 1 ];
	var temp = [0,0];
	var den = 1;
	temp[1] = 1;
	for (var i = 0; i < a.length; i++) {
		L[i] = new Polynomial(0,ini);
		den = 1;
		for (var j = 0; j < a.length - 1; j++) {
		    temp[0] = - a[(j < i ? j : j + 1)][0];
		    den *= a[i][0]-a[(j < i ? j : j + 1)][0];
		    L[i] = Polynomial.mul(L[i], new Polynomial(0,temp));
		}
		L[i] = Polynomial.divi(L[i], den);
	}
	var ret = new Polynomial();
	for(var i=0;i<L.length;i++) {
	    ret = Polynomial.add(ret, Polynomial.muli(L[i], a[i][1]));
	}
	return ret;
    }
}

/*
 * Considering the hexadecimal number of the color as three coordinates of a
 * space R3, This code receives a sequence of colors and uses Polynomial
 * interpolation in the three coordinates to return a sequence of colors between
 * the entry. The order of colors is important since it assigns the colors as
 * points during the time, forming a way of curves.
 * 
 */

class Palette{
    constructor(hex){
	var a = [];
	for(var i = 0,step =0;i<hex.length;i++,step+=1.0/(hex.length-1)){
	    a.push([step,hex[i]]);
	    a[i][1] = Palette.ascii_to_hex(hex[i]); 
	}
	var rgb = [[],[],[]];
	for(var i=2;i>=0;i--){
	    for(var j=0;j<a.length;j++){
		rgb[i].push([a[j][0],a[j][1]%256]);
		a[j][1] = a[j][1]/256;
	    }
	}
	this.rgb=[];
	for(var i=0;i<3;i++){
	    this.rgb.push(Lagrange.p2(rgb[i]));
	    // console.log(this.rgb[i].result(1));
	}
	console.log(rgb);
    }
    
    static ascii_to_hex(str)
    {
	var a = 'a'.charCodeAt(0);
	var f = 'f'.charCodeAt(0);
	var A = 'A'.charCodeAt(0);
	var F = 'F'.charCodeAt(0);
	var i0 = '0'.charCodeAt(0);
	var i9 = '9'.charCodeAt(0);
	
  	var ret=0;
  	var n=0
  	if(str.charAt(0)=='#')
  	    n=1;
  	var char;
  	for (var l = str.length; n < l; n ++) 
       {
  	    ret *=16;
  	    char = str.charCodeAt(n);
  	    if(char<=f && char>=a)
  		ret+=char-a+10;
  	    else if(char<=F && char>=A)
  		ret+=char-A+10;
  	    else if(char<=i9 && char>=i0)
		ret+=char-i0;
  	    else
  		console.log("lala");
  		
  	 }
  	return ret;
     }
    
    colors(qtd){
	var ret = [];
	var cUnit,cCum=0,str;
	for(var step=0,i=0;i<qtd;i++,step+=1/qtd){
	    cCum=0;
	    for(var j=2;j>=0;j--){
		cCum*=256;
		cUnit = Math.round(this.rgb[j].result(step));
		if(cUnit>255){
		    cUnit=255;
		}else if(cUnit<0){
		    cUnit = 0;
		}
		cCum+=cUnit;
	    }
	    str = cCum.toString(16);
		while(str.length<6)
		    str = "0"+ str;
		str = "#" + str;
	    ret.push(str);
	}
	return ret;
    }
}