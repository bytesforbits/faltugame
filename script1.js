const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
const CANVAS_WIDTH=canvas.width=500;
const CANVAS_HEIGHT=canvas.height=700;
let numberOfEnemies=Math.floor((Math.random()*10+5));
const eneniesArray=[];
const music=new Audio();
music.src='Easy song.mp3';

const buttonImage=new Image();
buttonImage.src='play1.png';
const buttonPreshImage=new Image();
buttonPreshImage.src='play2.png';
const buttonX=50;
const buttonY=50;
let gameFrame=0;
let presh=false;
let started=false;
let dragging=false;
let pick=false;
let canvasPosition=canvas.getBoundingClientRect();//provide info about element
class Enemy{
	constructor(){
		this.x=Math.random()*(canvas.width-60)+0;
		this.y=0;
		
		//this.speed=Math.random()*4-2; //-2 to 2
		//this.speed=Math.random()*2+1;
		this.enemyImage=new Image();
		this.enemyImage.src='spritesheet.png';
		this.spriteWidth=128;
		this.spriteHeight=128;
		this.width=this.spriteWidth*0.5;
		this.height=this.spriteHeight*0.5;
		this.frame=0;
		this.flapSpeed=Math.floor((Math.random()*2+1));
		this.fall=true;
		this.fallSpeed=Math.floor(Math.random()*4+1);
		this.angle=Math.random()*45;
		this.angleSpeed=Math.random()*0.1;
		this.curveLength=Math.random()*10;
		this.rotate=true;
		this.x+=this.curveLength*Math.sin(this.angle);
	}
	update(){
		//this.x-=this.speed;
		//if(this.x+this.width<0){
		//	this.x=canvas.width;
		//}
		//this.y+=this.curveLength*Math.sin(this.angle);
		//this.angle+=this.angleSpeed;
		this.falling();
		
		
	}
	rottate(){
		if(this.rotate && (!this.fall) && (this.frame==0)){
			this.rotate=false;
		}
		if(this.rotate&&(gameFrame % this.flapSpeed === 0)){
			this.frame>16 ? this.frame=0 : this.frame++;
		}

	}
	falling(){
		this.rottate();
		if(this.fall && (this.y<CANVAS_HEIGHT-this.height-5)){
			
			this.y+=this.fallSpeed;
			//this.x+=this.curveLength*Math.sin(this.angle);
			//this.angle+=this.angleSpeed;
		}
		else this.fall=false;
	}
	fallrollingleft(){
		this.rottate();
		this.x+=this.curveLength*Math.sin(this.angle);
		this.angle+=this.angleSpeed;
		this.falling()

	}
	draw(){
		//ctx.fillRect(this.x,this.y,this.width,this.height);
		//ctx.drawImage(enemyImage,this.x,this.y);
		ctx.drawImage(this.enemyImage,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
	}
	collision(x,y)
	{
		if(((this.x>=x-this.width+25) && (this.x<=x )&& (this.y+this.height>=y+25))||((this.x<=x+this.width-25) && (this.x>=x )&& (this.y+this.height>=y+25))){
			
			return true;
		}
		else return false;
	}
	drag(x){
		if(pick && dragging){
		this.x+=x;
		pick=false;
		if(dragX==this.x){
		dragging=false;
		}
		this.enemyImage.src='spritesheet.png';
		this.rotate=true;

	}
	}
	picking(x,y){
		if(x>=this.x && x<=this.x+this.width && y>=this.y && y<=this.y+this.width ){
		if(!pick && !dragging && !this.fall){
			this.rotate=false;
			this.enemyImage.src='boxipick.png';
			pick=true;

		}
	}

	}
}




window.addEventListener('click',(e)=>{
	positionX=e.x - canvasPosition.left;
	positionY=e.y - canvasPosition.top;
//ctx.fillStyle='white';
//ctx.fillRect(e.x - canvasPosition.left-25, e.y - canvasPosition.top-25 , 50, 50);
	
	x=positionX;//finding middle
	y=positionY;
	buttonPress(x,y);
		

});

function buttonPress(x,y){
if(x>=buttonX && x<=buttonX+64 && y>=buttonY && y<=buttonY+64 ){
			presh=true;
			let numberOfEnemies=Math.floor((Math.random()*10+5));
			for(let i=0;i<numberOfEnemies;i++){
				eneniesArray.push(new Enemy());
				}

		}
		if(!(started)){
			music.play();
			started=true;
		}
}

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	
	eneniesArray.forEach(enemy=>{
		enemy.update();
		enemy.draw();
		if(enemy.fall){
		eneniesArray.forEach(enemyOther=>{
			if(!enemyOther.fall)
			if(enemy.collision(enemyOther.x,enemyOther.y)){
				enemy.fall=false;
				console.log(enemy.x,enemy.y);
			}
		});
	}
	});
	gameFrame++;

		if(presh){
		ctx.drawImage(buttonPreshImage,buttonX,buttonY,64,64);	
		}
		else {

				
			ctx.drawImage(buttonImage,buttonX,buttonY,64,64);	
		}
	if((gameFrame % 10 === 0) && presh){

				presh=false;
			}

	requestAnimationFrame(animate);

}
animate();
music.loop=true;

