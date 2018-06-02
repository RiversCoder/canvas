class Particle{
	constructor(x,y,dx,dy,radius,color){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.color = color;
		this.gravity = 1;
		this.friction = 0.8;
		this.velocity = {
			'x': (Math.random() - 0.5)*5,
			'y': (Math.random() - 0.5)*5
		};
		this.mass = 1;
		this.opacity = 0;
	}

	draw(){
		var c = this.ctx;
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);

		c.save();
		c.globalAlpha = this.opacity;
		c.fillStyle = this.color;
		c.fill();
		c.restore();

		c.strokeStyle = this.color;
		c.stroke();
	}

	update(particles,mouse){

		var cw = this.canvas.width;
		var ch = this.canvas.height;

		//检测碰撞
		for(var i=0;i<particles.length;i++){
			if(this == particles[i]){
				continue;
			}
			if(this.countDis(this.x,this.y,this.radius,particles[i].x,particles[i].y,particles[i].radius)){
				resolveCollision(this, particles[i]);
			}
		}

		if( (this.velocity.x>0 && this.x+this.radius >= cw) || (this.velocity.x<0 && this.x-this.radius <= 0) ){
			this.velocity.x = -this.velocity.x;
		}

		if( (this.velocity.y>0 && this.y+this.radius > ch) || (this.velocity.y<0 && this.y-this.radius < 0)){
			this.velocity.y = - this.velocity.y;
		}

		//console.log(this.getDis(mouse.x,mouse.y,this.x,this.y))
		if(this.getDis(mouse.x,mouse.y,this.x,this.y) < 100 && this.opacity < 0.2){
			//console.log('123')
			this.opacity += 0.02;
			if(this.opacity > 1){
				this.opacity = 1;
			}
		}else if(this.getDis(mouse.x,mouse.y,this.x,this.y) >= 100 && this.opacity > 0){
			this.opacity -= 0.02;
			if(this.opacity < 0){
				this.opacity = 0;
			}
			//console.log(this.opacity)
			//console.log(this.opacity)
		}


		
		
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		this.draw();
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
		var x = 0,y = 0,dx = 0,dy = 0,radius = 0,color = '',len = 50;
		this.group = [];
		for(var i=0;i<len;i++){
			radius = (Math.random()*10)+20;
			x = this.randomNum(radius,this.canvas.width-radius);
			y = this.randomNum(radius,this.canvas.height-radius);
			dx = (Math.random()-0.5) * 8;
			dy = (Math.random()-0.5) * 8;
			color = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${Math.random()*1})`;

			//创建相互不碰撞的粒子
			if(i !== 0){
				for(var j=0;j<this.group.length;j++){
					if(this.countDis(x,y,radius+1,this.group[j].x,this.group[j].y,this.group[j].radius+1)){
						x = this.randomNum(radius,this.canvas.width-radius);
						y = this.randomNum(radius,this.canvas.height-radius);
						//radius = (Math.random()*50)+20;

						j = 0;
					}
				}
			}

			this.group.push(new Particle(x,y,dx,dy,radius,color));
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
		
		function draw(){
			requestAnimationFrame(draw);
			ctx.clearRect(0,0,cw,ch);
			//console.log(This.mouse)
			for(var i=0;i<This.group.length;i++){
				This.group[i].update(This.group,This.mouse);
			}
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