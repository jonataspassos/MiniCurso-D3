var iniciais = {v0:0,dV:0,i0:0,dI:0}
class Componente {
	constructor (ponto1, ponto2, value, type) {
    this.value = value; 
    }		
}
//iniciais = {v0: ,dV:, i0:, dI:};
//RLC EM SÉRIE, SEM FONTE
class RLCSerie {
	constructor(Componentes,iniciais){
		this.Componentes = Componentes;
		//0 - resistencia
		//1 - indutancia
		//2 - capacitancia
		this.i0 = iniciais.i0;
		this.dI = iniciais.dI;
		console.log("FUNÇÕES:");
		console.log("RESPOSTA NATURAL: a.equacaoCorrente()");
		console.log("FREQUÊNCIA RESSONANTE: a.omega()");
		console.log("FREQUENCIA DE NEPER: a.alfa()");
		console.log("TIPO DE AMORTECIMENTO: a.compara_amortecimento()");
	}
	alfa(){ //frequencia neperiana
		return this.Componentes[0].value/(2*this.Componentes[1].value); //r/2L
		};	
	omega(){ //frequencia natural não-amortecida
		return 1/Math.sqrt(this.Componentes[1].value*this.Componentes[2].value); //1/sqrt(LC)
	};
	raizes(){ //frequencias naturais
		var a = this.alfa();
		var o = this.omega();
		return {s1: - a + Math.sqrt(a*a - o*o), s2: -a - Math.sqrt(a*a - o*o)}; }
	
	compara_amortecimento(){
		var a = this.alfa();
		var o = this.omega();
		if (a>o)		
			return "supercrítico";
		else if(a==o)
			return "crítico";
		else 
			return "subamortecido"; }
	equacaoCorrente(){
		return RLCSerie.equacaoCorrente(this);
	}
	static equacaoCorrente(a){//a instanceof RLCSerie
	    var raizes = a.raizes();
		var i0 = a.i0;
		var dI = a.dI;
		var alfa = a.alfa();
		var omega = a.omega();
		switch(a.compara_amortecimento()) {
			case "supercrítico":
				return {string:("i(t) = " +i0+"e^("+raizes.s1+"t) + " + dI+"e^("+raizes.s2+"t)")};
				//break;
			case "crítico":
		return {string:("i(t) = (" +dI+ " + " + i0 + "t)e^(" + -alfa() + "t)")};
				//break;
			case "subamortecido":
				var wd = Math.sqrt(-omega^2 - alfa^2);
				return {string:("i(t) = e^(" + -alfa+"t)("+ (dI+i0) +"cos("+wd+"t) + j("+ (i0-dI)+"sen("+wd+"t)")}; 
				//break;
		}
		
	}
	
}
//RLC PARALELO SEM FONTE
class RLCParalelo {
	constructor(Componentes,iniciais){
		this.Componentes = Componentes;
		//0 - resistencia
		//1 - indutancia
		//2 - capacitancia
		this.v0 = iniciais.v0;
		this.dV = iniciais.dV;
		
		console.log("FUNÇÕES:");
		console.log("RESPOSTA NATURAL: a.equacaoCorrente()");
		console.log("FREQUÊNCIA RESSONANTE: a.omega()");
		console.log("FREQUENCIA DE NEPER: a.alfa()");
		console.log("TIPO DE AMORTECIMENTO: a.compara_amortecimento()");
	}
	alfa(){ //frequencia neperiana
		return 1/(2*this.Componentes[0].value*this.Componentes[2].value); //1/2RC
		};
	omega(){ //frequencia natural não-amortecida
		return 1/Math.sqrt(this.Componentes[1].value*this.Componentes[2].value); //1/sqrt(LC)
	};
	raizes(){ //frequencias naturais
	    var a = this.alfa();
	    var o = this.omega();
	    return {s1: - a + Math.sqrt(a*a - o*o), s2: -a - Math.sqrt(a*a - o*o)};
	}
	compara_amortecimento(){
	var a = this.alfa();
	var o = this.omega();
	if (a>o)
		return "supercrítico";
	else if(a==o)
		return "crítico";
		else return "subamortecido";
	}
	
	equacaoTensao(){
		return RLCParalelo.equacaoTensao(this);
	}
	
	static equacaoTensao(a){//a instanceof RLCParalelo
	    var raizes = a.raizes();
		var v0 = a.v0;
		var dV = a.dV;
		var alfa = a.alfa();
		var omega = a.omega();
		switch(a.compara_amortecimento()) {
			case "supercrítico":
				return {string:("v(t) = " +v0+"e^("+raizes.s1+"t) + " + dV+"e^("+raizes.s2+"t)")};
				//break;
			case "crítico":
				return {string:("v(t) = (" +v0+ " + " + dV + "t)e^(" + -alfa + "t)")};
				//break;
			case "subamortecido":
				var wd = Math.sqrt(-omega^2 - alfa^2);
				return {string:("v(t) = e^(" + -alfa+"t)("+ v0 +"cos("+wd+"t) + "+ dV+"sen("+wd+"t)")}; 
				//break;
		}

	}
	
}
class RLCSerieDegrau extends RLCSerie{
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		//0 - resistencia
		//1 - indutancia
		//2 - capacitancia
		//3 - fonte	de tensao	
		this.v0 = iniciais.v0;
		this.dV = iniciais.dV;
		this.tensao = RLCSerieDegrau.equacaoTensao(this);
		console.log("RESPOSTA AO DEGRAU: a.equacaoTensao().string e a.equacaoCorrente()");

	}
	equacaoTensao(){
		return RLCSerieDegrau.equacaoTensao(this);
	}
	static equacaoTensao(a){ //no capacitor a instanceof RLCSerieDegrau
		var raizes = a.raizes();
		var v0 = a.v0;
		var dV = a.dV;
		var alfa = a.alfa();
		var omega = a.omega();
		
		if(a.compara_amortecimento() == "supercrítico"){ //f, df e string
		    var f = function(t){
				return a.Componentes[3].value + 
					v0*Math.exp(raizes.s1*t) +
					dV*Math.exp(raizes.s2*t); }
		    f.df = function(t){
			 	return v0*raizes.s1*Math.exp(raizes.s1*t) +
				dV*raizes.s2*Math.exp(raizes.s2*t);
		     }
		    f.string = ("V(t) = " + a.Componentes[3].value + " + " + v0 + "*e^(" + raizes.s1 +"*t) + " + dV + "*e^("+(raizes.s2)+"t)");
		     return f; }
		else if (a.compara_amortecimento() == "crítico") {
			var f = function(t){
				return a.Componentes[3].value +
				(v0 + dV*t)*Math.exp(-alfa*t); }
			f.df = function(t) {
				return ((v0 + dV*t)*(-alfa)*Math.exp(-alfa*t)) + dV*Math.exp(-alfa*t);	}
			f.string = ("V(t) = " + a.Componentes[3].value + " + (" + v0 + " + " + dV + "*t)*" + "e^(" + -alfa + "t)");	
			 return f; }
		else {
			var f = function(t){
				return a.Componentes[3].value +
				(v0*Math.cos(omega*t) + dV*Math.sin(omega*t))*Math.exp(-alfa*t); }
			f.df = function(t) {
				return (-alfa)*(-v0*omega*Math.sin(omega*t) + dV*omega*Math.cos(omega*t))*Math.exp(-alfa*t) }
			f.string = ("V(t) = " + v0 + "*cos(" + omega + "t)" + " + " + dV + "*sen(" + omega + "t)*e^(" + -alfa + "t)");
			return f;
		}
	}
};
// FAZER OS toString do paralelodegrau
class RLCParaleloDegrau extends RLCParalelo{
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		//0 - resistencia
		//1 - indutancia
		//2 - capacitancia
		//3 - fonte	de corrente
		this.i0 = iniciais.i0;
		this.dI = iniciais.dI;
		
		this.corrente = RLCParaleloDegrau.equacaoCorrente(this);
		console.log("RESPOSTA AO DEGRAU: a.corrente.string e a.corrente");
	}
	//correnteString(){};
	
	static equacaoCorrente(a){ //no indutor
	var raizes = a.raizes();
	var i0 = a.i0;
	var dI = a.dI;
	var alfa = a.alfa();
	var omega = a.omega();
	var wd = Math.sqrt(-omega^2 - alfa^2);
	
	if(a.compara_amortecimento == "supercrítico") {
		var f = function(t){
			return a.Componentes[3].value + 
				i0*Math.exp(raizes.s1*t) + dI*Math.exp(raizes.s2*t)}; 
		f.df = function(t) {
			return i0*raizes.s1*Math.exp(raizes.s1*t) + 
						dI*raizes.s2*Math.exp(raizes.s2*t);	}
		f.string = ("i(t) =" + a.Componentes[3].value +" + "+i0+ "e^("+raizes.s1+"t) + "+ dI+"e^("+raizes.s2+"t)");
		return f;
		} else if (a.compara_amortecimento == "crítico") {
				var f = function(t){
					return a.Componentes[3].value +
						(i0 + dI*t)*Math.exp(-alfa*t); }
				f.df = function(t){
					return (-alfa)*(i0 + dI*t)*Math.exp(-alfa*t) + dI*Math.exp(-alfa*t); }
				f.string =  ("i(t) = "+a.Componentes[3].value + " + (" + i0 + " + " + dI+ "t)e^("+ -alfa + "t)");
			return f;
			}
		else { 
			var f = function(t){
				return a.Componentes[3].value +
				(i0*Math.cos(omega*t) + dI*Math.sin(omega*t))*Math.exp(-alfa*t);	}
				
			f.df = function(t){
				return (omega*-i0*Math.sin(omega*t)) + 
					(-alfa*dI*Math.sin(omega*t))*Math.exp(-alfa*t) + 
							(omega*dI*Math.cos(omega*t))*Math.exp(-alfa*t);}
							
			f.string = ("i(t) = "+ a.Componentes[3].value + "(" + i0 + "cos(" +wd+"t) + "+dI+"sen("+wd+"t))e^("+-alfa+"t)");
			return f;
		}
	
}

};
// PARA MISTOS RECEBER V OU I INICIAIS E FINAIS E DV OU DI INICIAIS
class RLCMisto {
	constructor(Componentes, iniciais){
		this.Componentes = Componentes;
		this.v0 = iniciais.v0;
		this.dV = iniciais.dV;
		this.i0 = iniciais.i0;
		this.dI = iniciais.dI;
		console.log("FUNÇÕES DISPONIVEIS NO CONSTRUTOR ");
		console.log("OU USANDO a.corrente E/OU a.tensao");
	};
}
class LCParaleloRSerie extends RLCMisto {
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		this.semFonte = new RLCParalelo (Componentes, iniciais);
		this.corrente = ("i(t) = " + RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","")
					+"/"+ this.Componentes[0].value + " + " + this.Componentes[3].value +"/"+ this.Componentes[0].value) ;
		this.tensao = ("v(t) = " + this.Componentes[3].value + " - " + this.Componentes[0].value 
					+"("+ RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","")+"/"+ this.Componentes[0].value +")");
	};	
};
class RCParaleloLSerie extends RLCMisto {
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		this.semFonte = new RLCParalelo(Componentes, iniciais);
		this.corrente = ("i(t) = " + RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","")
					+"/"+ Componentes[0].value + this.Componentes[3].value +"/"+ Componentes[0].value);//iPARALELO = vPARALELO/R
		this.tensao = ("v(t) = " + RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","") + "+" + this.Componentes[3].value);
	};
};
class RLParaleloCSerie extends RLCMisto {
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		this.semFonte = new RLCParalelo(Componentes, iniciais);
		this.corrente = ("i(t) = " + RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","")
					+"/"+ this.Componentes[0].value);// = function (t) { return RLCParalelo.corrente(t); }
		this.tensao = ("v(t) = " + RLCParalelo.equacaoTensao(this.semFonte).string.replace("v(t) = ","") + "+" + this.Componentes[3].value);
	}

};
class LCSerieRParalelo extends RLCMisto {
	constructor(Componentes, iniciais){
			console.log("Essa montagem coloca um capacitor sem uma resistencia em série. Restrição."); 
	}};
class RCSerieLParalelo extends RLCMisto{
	constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		this.semFonte = new RLCSerie(Componentes, iniciais);
		this.corrente = RLCSerie.equacaoCorrente(this.semFonte).string;
		this.tensao = ("v(t) = " + RLCSerie.equacaoCorrente(this.semFonte).string.replace("i(t) = ","") + " + " + Componentes[3].value);
		
	}	
	
}; //curto circuito?????
class RLSerieCParalelo extends RLCMisto {
constructor(Componentes, iniciais){
		super(Componentes, iniciais);
		this.semFonte = new RLCSerie(Componentes, iniciais);
		this.corrente = (RLCSerie.equacaoCorrente(this.semFonte).string + " + " + this.Componentes[3].value + "/" + this.Componentes[0].value);
		console.log(RLCSerie.equacaoCorrente(this.semFonte));
		this.tensao = ("v(t) = " + RLCSerie.equacaoCorrente(this.semFonte).string.replace("i(t) = ","") +"*"+ this.Componentes[0].value  + " + " + this.Componentes[3].value);
	}
};

	


	

/*

var Resistor1 = new Componente(0, 0, 10, "resistor");
var Indutor1 = new Componente (0, 0, 0.5, "indutor");
var Capacitor1 = new Componente (0, 0, 0.05, "capacitor");
var Tensao1 = new Componente (0, 0, 12, "fonteTensao");
var RLCSerieDegrau1 = new RLCSerieDegrau([Resistor1, Indutor1, Capacitor1,Tensao1], 2, 5);
*/