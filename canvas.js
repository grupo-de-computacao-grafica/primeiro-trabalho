class Solido{
	constructor(faces){
		this.faces=faces;
	}
	rodarX(theta){
		
	}
	rodarY(theta){
	}
	rodarZ(theta){
	}
	transladar(dz,dy,dz){
	}
	pespectiva(...){
	}
}


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
  estaVisivel(observador){
  }
//TODO : desenhar precisa ser revisto em 3D
  desenhar(canvas){ //desenhar vai ficar bem mais complexo
    canvas.beginPath();
    this.arestas[0].desenharPrimeiro(canvas);
    for(let i = 1; i < this.arestas.length; i++) {
      this.arestas[i].desenhar(canvas);
    }
  }

  rodar(thetax,thetay,thetaz){
	centroide=this.calculaCentroide(); //TODO : calculaCentroide
	for(let i = 0; i<this.arestas.length; i++){
		this.arestas[i].rodar(theta,centroide);
	}
  }

  transladar(dx,dy,dz){
	for(let i = 0; i<this.arestas.length; i++){
		this.arestas[i].transladar(dx,dy,dz);
	}

  }
}

class Aresta{
  constructor(vertice1,vertice2) {
    this.vertice1=vertice1;
    this.vertice2=vertice2;
  }
  transladar(dx,dy,dz){
	  this.vertice1.transladar(dx,dy,dz);
	  this.vertice2.transladar(dx,dy,dz);
  }
//TODO : desenhar{,Primeiro} precisam ser revistos para 3D
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
	
  rodar(thetax,thetay,thetaz,ponto){
	  this.vertice1.rodar(thetax,thetay,thetaz,ponto);
	  this.vertice2.rodar(thetax,thetay,thetaz,ponto);
	  
  }
}

class Ponto{
  constructor(x,y,z) {
    this.x=x;
    this.y=y;
    this.z=z;
  }
  transladar(dx,dy,dz){
	  this.x=this.x+dx;
	  this.y=this.y+dy;
	  this.z=this.z+dz;
  }
//TODO : rodar
  rodar(thetax,thetay,thetaz,ponto){
	  this.transladar(-ponto.x,-ponto.y,-ponto.z);
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
