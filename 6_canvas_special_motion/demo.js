class Particle{
	constructor(x,y,radius,color){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.color = color;
		this.gravity = 1;
		this.friction = 0.8;
		this.mass = 1;
		this.opacity = 1;
		this.radians = 2*Math.PI*Math.random();
		this.velocity = 0.05;
		this.cx = x;
		this.cy = y;
		this.distanceFromCenter = this.randomNum(80,180);
		this.lastPosition = {
			x: x,
			y: y
		};
		this.lastMouse = {
			x: x,
			y: y
		};
	}

	update(particles,mouse){
		
		this.lastPosition.x = this.x;
		this.lastPosition.y = this.y;
		this.radians += this.velocity;

		if(mouse){

			this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
			this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

			this.x = this.lastMouse.x + Math.cos(this.radians)*this.distanceFromCenter;
			this.y = this.lastMouse.y + Math.sin(this.radians)*this.distanceFromCenter;
		}else{
			this.x = this.cx + Math.cos(this.radians)*this.distanceFromCenter;
			this.y = this.cy + Math.sin(this.radians)*this.distanceFromCenter;
		}

		this.draw();
	}

	draw(){
		var c = this.ctx;
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.moveTo(this.lastPosition.x,this.lastPosition.y);
		c.lineTo(this.x,this.y);
		c.stroke();
		c.closePath();
	}

	

	//计算是否已经碰撞
	countDis(x1,y1,r1,x2,y2,r2){
		var dx = Math.abs(x1-x2);
		var dy = Math.abs(y1-y2);
		var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		if(dis < r1+r2){
			return true;
		}else{
			return false;
		}
	}

	getDis(x1,y1,x2,y2){

		var dx = Math.abs(x1-x2);
		var dy = Math.abs(y1-y2);
		var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

		return dis;
	}

	//两个数之间的随机数
	randomNum(min,max){
		var num = 0;
		num = min + Math.floor(Math.abs(max-min)*Math.random());

		return num;
	}
}



class Motion{
	constructor(){
		//初始化
		this.init();
	}

	init(){
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.circle = null;
		this.group = [];
		this.mouse = {x: 0,y: 0,dis:80,maxr: 50,minr: 2};
		this.color = 'black';
		this.opacity = 0;

		//初始化画布
		this.initCanvas();

		//初始化事件
		this.initEvenets();

	}

	initCanvas(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		
		//初始化所有圆
		this.initGroup();

		//绘制形状
		this.drawCircle();
	}

	initGroup(){
		var x = 0,y = 0,radius = 0,color = '',len = 80;
		this.group = [];
		for(var i=0;i<len;i++){
			radius = this.randomNum(5,8);
			x = this.canvas.width/2;
			y = this.canvas.height/2;
			color = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${Math.random()*1})`;

			this.group.push(new Particle(x,y,radius,color));
		}
	}

	initEvenets(){
		window.addEventListener('mousemove',(ev)=>{
			this.mouse.x = ev.x;
			this.mouse.y = ev.y;
		});
		window.addEventListener('resize',(ev)=>{
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.initGroup();
		});
	}

	

	drawCircle(){

		//var c = this.ctx;
		var ctx = this.ctx;
		var cw = this.canvas.width;
		var ch = this.canvas.height;
		var This = this;
		var lastM = {
			x: 0,
			y: 0
		};
		
		function draw(){
			requestAnimationFrame(draw);
			//ctx.clearRect(0,0,cw,ch);
			//console.log(This.mouse)
			ctx.save();
			ctx.globalAlpha = 0.05;
			ctx.fillStyle = "rgba(255,255,255,1)";
			ctx.fillRect(0,0,cw,ch);
			//ctx.clearRect(0,0,cw,ch);
			ctx.restore();
			
			
			//ctx.clearRect(0,0,cw,ch);
			for(var i=0;i<This.group.length;i++){
				This.group[i].update(This.group,This.mouse);
			}
			lastM.x = This.mouse.x;
			lastM.y = This.mouse.y;
		}

		draw();
	}


	//计算是否已经碰撞
	countDis(x1,y1,r1,x2,y2,r2){
		var dx = Math.abs(x1-x2);
		var dy = Math.abs(y1-y2);
		var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		if(dis < r1+r2){
			return true;
		}else{
			return false;
		}
	}


	//两点之间的直线距离
	getDis(x1,y1,x2,y2){

		var dx = Math.abs(x1-x2);
		var dy = Math.abs(y1-y2);
		var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

		return dis;
	}

	//随机alpha颜色
	randomColor(){
		return `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${Math.random()*1})`;
	}

	//两个数之间的随机数
	randomNum(min,max){
		var num = 0;
		num = min + Math.floor(Math.abs(max-min)*Math.random());

		return num;
	}

}

new Motion();