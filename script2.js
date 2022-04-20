const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
const CANVAS_WIDTH=canvas.width=500;
const CANVAS_HEIGHT=canvas.height=700;
let numberOfEnemies=Math.floor((Math.random()*5+1));
const eneniesArray=[];
const music=new Audio();
music.src='Easy song.mp3';
const lineY=200;
let enemyRemains=200;
const buttonImage=new Image();
buttonImage.src='play1.png';
const buttonPreshImage=new Image();
buttonPreshImage.src='play2.png';
const buttonLeft=new Image();
buttonLeft.src='left.png';
const buttonRight=new Image();
buttonRight.src='right.png';
const buttonCancle=new Image();
buttonCancle.src='cancel.png';
const buttonX=50;
const buttonY=50;
const buttongridY=50;

let gameFrame=0;
let presh=false;
let started=false;
let dragging=false;
let enemyPicked=null;
let picked=false;

let canvasPosition=canvas.getBoundingClientRect();//provide info about element

class Button{
	constructor(x,y,image){
		this.x=x;
		this.y=y;
		this.image=image;
	}
	draw(){
		ctx.drawImage(this.image,this.x,this.y,64,64);
	}

	getX(){
		//console.log("buttonX"+this.x);
		let x=this.x;
		return this.x;
	}
	getY(){
		return this.y;
	}
}
class ButtonGrid{
	constructor(){
		this.leftBtn=new Button(buttonX,buttongridY,buttonLeft);
		this.rightBtn=new Button(buttonX+64+8,buttongridY,buttonRight);
		this.cancleBtn=new Button(buttonX+64+64+8+8,buttongridY,buttonCancle);

		this.show=false;

	}
	draw(){
		this.leftBtn.draw();
		this.cancleBtn.draw();
		this.rightBtn.draw();

	}

	preshLeft(x,y){

		let btnX=this.leftBtn.getX();
		let btnY=this.leftBtn.getY();
		if(x>=btnX && x<=btnX+64 && y>=btnY && y<=btnY+64 ){
			return true;
		}
		else return false
	}
	preshCancle(x,y){
		let btnX=this.cancleBtn.getX();
		let btnY=this.cancleBtn.getY();
		if(x>=btnX && x<=btnX+64 && y>=btnY && y<=btnY+64 ){
			return true;
		}
		else return false
	}
preshRight(x,y){
		let btnX=this.rightBtn.getX();
		let btnY=this.rightBtn.getY();
		if(x>=btnX && x<=btnX+64 && y>=btnY && y<=btnY+64 ){
			return true;
		}
		else return false
	}

}

buttonGrid= new ButtonGrid();
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
		this.pick=false;
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

	collisionDrag(x,y)
	{
		if( (!((y>=this.y-this.height && y<=this.y) && this.x>=x && this.x<=x+this.width-20)||((y>=this.y -this.height && y<=this.y) && this.x+this.width-20<=x+this.width-20 && this.x+this.width-20>=x))) {
			//console.log("picked"+this.x+ ","+this.y+", "+"other"+x+ ","+y);
			return false;
		}
		else return true;
	}

	collisionDragLeft(x,y)
	{
		if( ((y>=this.y-this.height && y<=this.y) && this.x>=x && this.x<=x+this.width-20)) {
			//console.log("picked"+this.x+ ","+this.y+", "+"other"+x+ ","+y);
			return true;
		}
		else return false;
	}

	collisionDragRight(x,y)
	{
		if( ((y>=this.y -this.height && y<=this.y) && this.x+this.width-20<=x+this.width-20 && this.x+this.width-20>=x)) {
			//console.log("picked"+this.x+ ","+this.y+", "+"other"+x+ ","+y);
			return true;
		}
		else return false;
	}
	drag(x){
		if(this.pick && this.x>=0 && this.x<=CANVAS_WIDTH){
		this.x+=x;
		
		
		//this.enemyImage.src='spritesheet.png';
		//this.rotate=true;

	}
	}
	picking(x,y){
		if(x>=this.x && x<=this.x+this.width && y>=this.y && y<=this.y+this.width ){
		if(!this.pick && !dragging && !this.fall && !picked){
			this.rotate=false;
			this.enemyImage.src='boxipick.png';
			this.pick=true;
			picked=true;
		return true;
		}
	}
	else return false
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
	eneniesArray.forEach(enemy=>{
		if(enemy.picking(x,y)){
			console.log("picked");
			eneniesArray.forEach(enemyOther=>{
				if(!enemyOther.fall){
					if(enemy!=enemyOther){
			if(enemy.collisionDrag(enemyOther.x,enemyOther.y)){
				enemy.enemyImage.src='spritesheet.png';
				console.log("stucked");
				enemy.pick=false;
				picked=false;
			}

		}

		}

			});
		}

		if(enemy.pick && picked){
			buttonGrid.show=true;
			enemyPicked=enemy;


		}

	});

if(buttonGrid.show){
	if(buttonGrid.preshLeft(x,y) && picked){

		enemyPicked.drag(-enemyPicked.fallSpeed*4);
		enemyPicked.fall=true;
		eneniesArray.forEach(enemyOther=>{
				if(!enemyOther.fall){
					if(enemyPicked!=enemyOther){
			if(enemyPicked.collisionDragLeft(enemyOther.x,enemyOther.y) && enemyPicked.collisionDragRight(enemyOther.x,enemyOther.y)){
				enemyPicked.enemyImage.src='spritesheet.png';
				
				console.log("stucked");
				enemy.pick=false;
				picked=false;
				enemyPicked.fall=false;
				enemyPicked.drag(enemyPicked.fallSpeed*4);
			}
			else if(enemyPicked.collisionDragLeft(enemyOther.x,enemyOther.y) ){
				enemyPicked.drag(enemyPicked.fallSpeed*4);
				enemyPicked.fall=false;
			}
			
			


				
		}

		}

			});


	}
	if(buttonGrid.preshRight(x,y) && picked){
		enemyPicked.drag(enemyPicked.fallSpeed*4);
		enemyPicked.fall=true;
		eneniesArray.forEach(enemyOther=>{
				if(!enemyOther.fall){
					if(enemyPicked!=enemyOther){
			if(enemyPicked.collisionDragLeft(enemyOther.x,enemyOther.y) && enemyPicked.collisionDragRight(enemyOther.x,enemyOther.y) ){
				enemyPicked.enemyImage.src='spritesheet.png';
				console.log("stucked");
				enemy.pick=false;
				picked=false;
				enemyPicked.drag(-enemyPicked.fallSpeed*4);
				enemyPicked.fall=false;
			}
			else if(enemyPicked.collisionDragRight(enemyOther.x,enemyOther.y) ){
				enemyPicked.drag(-enemyPicked.fallSpeed*4);
				enemyPicked.fall=false;
			}
			

		}

		}

			});
	}
	if(buttonGrid.preshCancle(x,y)){
		enemyPicked.enemyImage.src='spritesheet.png';
		picked=false;
		enemyPicked.pick=false;
		buttonGrid.show=false;


	}
}
		

});




function buttonPress(x,y){
	if(!buttonGrid.show){
if(x>=buttonX && x<=buttonX+64 && y>=buttonY && y<=buttonY+64 ){
			presh=true;
			let numberOfEnemies=Math.floor((Math.random()*10+3));

			for(let i=0;i<numberOfEnemies;i++){
				eneniesArray.push(new Enemy());
				}
			enemyRemains-=numberOfEnemies;

			if(enemyRemains==0){
				console.log("win");
			}

		}
		if(!(started)){
			music.play();
			started=true;
		}
	}

}

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	ctx.strokeStyle='#eeeeee';
	ctx.beginPath();
	ctx.moveTo(0, lineY);
	ctx.lineTo(CANVAS_WIDTH, lineY);
	ctx.font='20px Lilita One';
	ctx.fillStyle="#f5fcff"
	ctx.fillText("Box left: "+enemyRemains,CANVAS_WIDTH-160, lineY-100);
	
	ctx.stroke();

	
	eneniesArray.forEach(enemy=>{
		
		if(enemy.fall){
		eneniesArray.forEach(enemyOther=>{
			if(!enemyOther.fall){
			if(enemy.collision(enemyOther.x,enemyOther.y)){
				enemy.fall=false;
				console.log(enemy.x,enemy.y);
			}
		}
		});
	}
	enemy.update();
	enemy.draw();
	if(!enemy.fall && enemy.y<=lineY){
		console.log("loose");

	}
	});
	
	gameFrame++;
if(!buttonGrid.show){
		if(presh){
		ctx.drawImage(buttonPreshImage,buttonX,buttonY,64,64);	
		}
		else {

				
			ctx.drawImage(buttonImage,buttonX,buttonY,64,64);	
		}
	}

		if(buttonGrid.show){
			buttonGrid.draw();
		}
	if((gameFrame % 10 === 0) && presh){

				presh=false;
			}

	requestAnimationFrame(animate);

}
animate();
music.loop=true;

