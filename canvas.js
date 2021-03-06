Mp = [[Math.sqrt(2)/2,-Math.sqrt(2)/2,0],[-1/Math.sqrt(6), -1/Math.sqrt(6),Math.sqrt(2/3)]]

function copiaObj(o)
{
	let aux=Object.assign({},o);
	aux.__proto__=o.__proto__;
	return aux;
}

function criaSolido(face)
{
	let m=face.comprimentoMenorAresta();
	let outraFace = copiaObj(face);
	outraFace.transladar(0,0,m);
	outraFace.voltar();
	let l = []
	let len=face.arestas.length;
	for(let i=0; i<len; i++)
	{
		let primeiraAresta=new Aresta(face.arestas[i].vertice2,outraFace.arestas[i].vertice1);
		let segundaAresta=new Aresta(outraFace.arestas[i].vertice2,face.arestas[i].vertice1);
		let auxFace=new Face([face.arestas[i],primeiraAresta,outraFace.arestas[i],segundaAresta]);
		l.push(auxFace);
	}
	l.push(face);
	l.push(outraFace);
	return new Solido(l);
}

function calculaCentroide(l)
{
	var aux=new Ponto(0,0,0);
	for(p in l)
	{
		p=l[p];
		aux.x+=p.x;
		aux.y+=p.y;
		aux.z+=p.z;
	}
	aux.x/=l.length;
	aux.y/=l.length;
	aux.z/=l.length;
	return aux;
}

class Observador
{
	constructor(ponto)
	{
		this.ponto=ponto;
	}
}

class Solido
{
	constructor(faces)
	{
		this.faces=faces;
	}
	desenhar(ctx)
	{
		for(let i=0; i<this.faces.length; i++)
		{
			this.faces[i].desenhar(ctx);
		}
	}
	pespectiva()
	{
		for(let i=0; i<this.faces.length; i++)
		{
			this.faces[i].pespectiva();
		}
	}
}


function min(a,b)
{
	return a<b?a:b;
}

class Face
{
	constructor(arestas)
	{
		this.arestas=arestas;
	}
	pespectiva()
	{
		for(let i=0; i<this.arestas.length; i++)
		{
			this.arestas[i].pespectiva();
		}
	}
	voltar()
	{
		for(let i in this.arestas)
		{
			this.arestas[i]=new Aresta(this.arestas[i].vertice2,this.arestas[i].vertice1);
		}
	}
	comprimentoMenorAresta()
	{
		let comprimento=0;
		for(let i=0; i< this.arestas.length; i++)
		{
			comprimento=min(comprimento,this.arestas[i].comprimento());
		}
		return comprimento;
	}
	estaVisivel(observador)
	{
		
	}
	desenhar(canvas)
	{
		canvas.beginPath();
		this.arestas[0].desenharPrimeiro(canvas);
		for(let i = 1; i < this.arestas.length; i++)
		{
			this.arestas[i].desenhar(canvas);
		}
	}

	transladar(dx,dy,dz)
	{
		for(let i = 0; i<this.arestas.length; i++)
		{
			this.arestas[i].transladar(dx,dy,dz);
		}
	}
}

class Aresta{
  constructor(vertice1,vertice2) {
    this.vertice1=vertice1;
    this.vertice2=vertice2;
  }
	pespectiva()
	{
		this.vertice1.pespectiva();
		this.vertice2.pespectiva();
	}
	comprimento()
	{
		let dx=this.vertice1.getX()-this.vertice2.getX();
		let dy=this.vertice1.getY()-this.vertice2.getY();
		return Math.sqrt(dx*dx+dy*dy);
	}
  transladar(dx,dy,dz){
	  this.vertice1.transladar(dx,dy,dz);
	  this.vertice2.transladar(dx,dy,dz);
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
	
  rodar(thetax,thetay,thetaz,ponto){
	  this.vertice1.rodar(thetax,thetay,thetaz,ponto);
	  this.vertice2.rodar(thetax,thetay,thetaz,ponto);
	  
  }
}

class Vertice
{
	constructor(x,y,z=0)
	{
		this.atual=new Ponto(x,y,z);
		this.original=new Ponto(x,y,z);
	}
	pespectiva()
	{
		this.atual.pespectiva();
	}
	reset()
	{
		this.atual=new Ponto(this.original.x,this.original.y,this.original.z);
	}
	rodar(thetax,thetay,thetaz,ponto)
	{
		this.atual.rodar(thetax,thetay,thetaz,ponto);
	}
	transladar(dx,dy,dz)
	{
		this.atual.transladar(dx,dy,dz);
	}
	getX()
	{
		return this.atual.x;
	}
	getY()
	{
		return this.atual.y;
	}
	getZ()
	{
		return this.atual.z;
	}
}


class Ponto
{
	constructor(x,y,z)
	{
		this.x=x;
		this.y=y;
		this.z=z;
	}
	transladar(dx,dy,dz)
	{
		this.x=this.x+dx;
		this.y=this.y+dy;
		this.z=this.z+dz;
	}
	pespectiva()
	{
		this.x=Math.sqrt(2)/2*(this.x-this.y);
		this.y=Math.sqrt(2/3)*this.z-1/Math.sqrt(6)*(this.x+this.y);
		this.z=0;
	}
	rodar(thetax,thetay,thetaz,ponto)
	{
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
const solido = criaSolido(face);

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
}
resizeCanvas();

solido.pespectiva();
setInterval(() => {
	
	ctx.clearRect(0,0,canvas.width,canvas.height); 
	solido.desenhar(ctx); 
},25);



