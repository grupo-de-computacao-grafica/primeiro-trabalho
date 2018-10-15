class Vertice{
	constructor(x,y,z){
		this.atual=new Ponto(x,y,z);
		this.original=new Ponto(x,y,z);
	}
	reset(){
		this.atual=new Ponto(this.original.x,this.original.y,this.original.z);
	}
	rodar(thetax,thetay,thetaz,ponto){
		this.atual.rodar(thetax,thetay,thetaz,ponto);
	}
	transladar(dx,dy,dz){
		this.atual.transladar(dx,dy,dz);
	}
	getX(){
		return this.atual.x;
	}
	getY(){
		return this.atual.y;
	}
	getZ(){
		return this.atual.z;
	}
}

class Face{
  constructor(arestas) {
    this.arestas=arestas;
  }
//TODO : quais argumentos desenhar pode receber?
  desenhar(canvas){
    canvas.beginPath();
    this.arestas[0].desenharPrimeiro(canvas);
    for(let i = 1; i < this.arestas.length; i++) {
      this.arestas[i].desenhar(canvas);
    }
  }

  rodar(thetax,thetay,thetaz){
	var centroidex=0;
	var centroidey=0;
	var centroidez=0;
	for(let i = 0; i<this.arestas.length; i++){
		centroidex = centroidex + this.arestas[i].vertice1.getX() + this.arestas[i].vertice2.getX();
		centroidey = centroidey + this.arestas[i].vertice1.getY() + this.arestas[i].vertice2.getY();
		centroidez = centroidez + this.arestas[i].vertice1.getZ() + this.arestas[i].vertice2.getZ();
	}
	centroidex=centroidex-this.arestas[0].vertice1.getX();
	centroidey=centroidey-this.arestas[0].vertice1.getY();
	centroidez=centroidez-this.arestas[0].vertice1.getZ();
	var numeroPontos=this.arestas.length*2-1;
	var centroide = new Ponto(centroidex/numeroPontos,centroidey/numeroPontos);
	for(let i = 0; i<this.arestas.length; i++){
		this.arestas[i].rodar(theta,centroide);
	}
  }

  transladar(dx,dy){
	for(let i = 0; i<this.arestas.length; i++){
		this.arestas[i].transladar(dx,dy);
	}

  }
}

class Aresta{
  constructor(vertice1,vertice2) {
    this.vertice1=vertice1;
    this.vertice2=vertice2;
  }
  transladar(dx,dy){
	  this.vertice1.transladar(dx,dy);
	  this.vertice2.transladar(dx,dy);
  }
  desenharPrimeiro(canvas){
    canvas.moveTo(this.vertice1.getX(),this.vertice1.getY());
    canvas.lineTo(this.vertice2.getX(),this.vertice2.getY());
	canvas.stroke();
  }
  
  desenhar(canvas){
    canvas.lineTo(this.vertice1.getX(),this.vertice1.getY());
    canvas.lineTo(this.vertice2.getX(),this.vertice2.getY());
	canvas.stroke();
  }
	
  rodar(theta,ponto){
	  this.vertice1.rodar(theta,ponto);
	  this.vertice2.rodar(theta,ponto);
	  
  }
}

class Ponto{
  constructor(x,y) {
    this.x=x;
    this.y=y;
  }
  transladar(dx,dy){
	  this.x=this.x+dx;
	  this.y=this.y+dy;
  }
  rodar(theta,ponto){
	  this.transladar(-ponto.x,-ponto.y);
	  this.x=this.x*Math.cos(theta)-this.y*Math.sin(theta);
	  this.y=this.x*Math.sin(theta)+this.y*Math.cos(theta);
	  this.transladar(ponto.x,ponto.y);
  }
}
const canvas = document.getElementById("letra-I");
const ctx=canvas.getContext("2d");

var originX = window.innerWidth/2 - 100;
var originY = window.innerHeight/2 - 100;

function getArestasForLetterI(x,y) {
	const positions = [
		[[0,0], [100,0]],
		[[100,0], [100,30]],
		[[100,30], [66,30]],
		[[66,30], [66,100]],
		[[66,100], [100,100]],
		[[100,100], [100,130]],
		[[100,130], [0,130]],
		[[0,130], [0,100]],
		[[0,100], [33,100]],
		[[33,100], [33,30]],
		[[33,30], [0,30]],
		[[0,30], [0,0]]
	];
	return positions.map(pt => new Aresta(new Vertice(x + pt[0][0], y + pt[0][1]), new Vertice(x + pt[1][0], y + pt[1][1])));

}

const face = new Face(getArestasForLetterI(originX,originY));



class Bootstrap {
  constructor() {
    console.log('Bootstrap');
    face.desenhar(ctx)
  }
}


window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
}
resizeCanvas();

const pi = 3.141592;
const theta = pi / 100;

sumTheta = 0;
invert = 1;

const loop = false;

setInterval(() => {
	
	if(sumTheta >= pi/2 + theta - 0.001) { 
		if(!loop) return;
		invert = - invert; 
		sumTheta = 0; 
	};

	ctx.clearRect(0,0,canvas.width,canvas.height); 
	face.desenhar(ctx); 
	face.transladar(invert*5,invert*5); 

	face.rodar(invert*theta);

	sumTheta += theta;

},25);
