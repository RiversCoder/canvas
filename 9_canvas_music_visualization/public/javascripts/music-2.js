class Music{
    
    constructor(){
        this.ac = new AudioContext();
        this.gainNode = this.ac.createGain();
        this.anayser = this.ac.createAnalyser();
        this.anayser.fftSize = 128*2;
        this.anayser.connect(this.gainNode);
        this.gainNode.connect(this.ac.destination);
        this.currentBufferSource = null;
        this.clickCount = 0;
        this.loadCount = 0;
        this.init();
    }

    //初始化
    init(){
        this.initDOM();
        //this.analyserAudioData();
    }   

    // 初始化DOM操作
    initDOM(){
        let lists = document.querySelector('#list').children;
        let volume = document.querySelector('#volume');
        let listsArr = Array.prototype.slice.call(lists);
        let currentItem = null;
        let self = this;

        // 列表交互操作
        listsArr.forEach((item,index,arr) => {
          item.onclick = function() {

            arr.forEach((el) => { el.classList.remove('selected') });
            this.classList.add('selected');
            self.requestMusicData(item,index);

            // 修复连续点击bug
            //self.clickCount++;
            self.currentBufferSource&&self.currentBufferSource.stop();
          }
        });

        // 监听改变声音大小
        self.gainNode.gain.value = volume.value/100;
        volume.addEventListener('change',function(){
            self.gainNode.gain.value = this.value/100;
        })
    }


    ajax(url,callback){
        let xhr = new XMLHttpRequest();
        xhr.open('get',url,true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
        xhr.onload = function(res){
            callback(res.target.response);
        }
    }

    // 点击音乐列表请求音乐数据
    requestMusicData(item,index){

        // 计数器拦截 多次点击
        let n = ++this.clickCount;
        
        //请求并且传递音乐名称
        fetch('/music/file?name='+item.innerText,{
            method: 'get',
            responseType: 'arraybuffer'
        }).then(res => {
            if(n != this.clickCount) return;
            return res.arrayBuffer();
        }).then(data => {
            this.ac.decodeAudioData(data,(buffer) => {
                if(n != this.clickCount) return;
                // 创建音频操作节点
                let bufferSource = this.ac.createBufferSource();
                bufferSource.buffer = buffer;
                // 保存当前的音频操作节点
                this.currentBufferSource = bufferSource;
                // 连接设备
                bufferSource.connect(this.anayser);
                // 播放音频
                bufferSource.start(0);
            },(err) => {
                console.log(err);
            });
        })
    }   

    // 分析音频节点
    analyserAudioData(callback){
        // 初始化一个空的 128位的 Unit8Array数组
        let arr = new Uint8Array(this.anayser.frequencyBinCount);
        let self = this;

        // 将分析到的音频数据存入 arr数组中
        function musicVisible(){
            self.anayser.getByteFrequencyData(arr);
            callback(arr);
            requestAnimationFrame(musicVisible);
        }
        musicVisible();
    }

    // 停止音频播放
    stopMusicPlay(){
        this.currentBufferSource.stop(0);
    } 
}


class Dot{
    constructor({x,y,r,canvas,ctx,colors}){

        this.x = x;
        this.y = y;
        this.r = r;

        this.canvas = canvas;
        this.ctx = ctx;
        this.colors = colors;
    }

    draw(){

        this.ctx.beginPath();
        

        this.ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
        this.fillRadial();
        //this.ctx.fillStyle = '#fff';
        //this.ctx.fill();
    }

    fillRadial(){

        let radial = this.ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
        radial.addColorStop(0, this.colors[0]);
        radial.addColorStop(0.5, this.colors[1]);
        radial.addColorStop(1, this.colors[2]);

        this.ctx.fillStyle = radial;
        this.ctx.fill();
    }

    update(){

    }

}

class Column{

    constructor({w,h,x,y,canvas,ctx,colors}){
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.colors = colors;

        //this.draw();
    }

    draw(){
        this.fillRects();
        this.ctx.beginPath();
        this.ctx.fillRect(this.x,this.y,this.w,this.h);
    }
    
    fillRects(){
        let line = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
        line.addColorStop(0,this.colors[0]);
        line.addColorStop(0.5,this.colors[1]);
        line.addColorStop(1,this.colors[2]);
        this.ctx.fillStyle = line;
    }

    update(){

    }   
}

class Canvas{

    constructor(){
        this.box = document.querySelector('#box');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.music = new Music();
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.size = 128;

        // 图形绘制
        this.type = 'column';
        this.dots = [];
        this.dotsPos = [];
        this.columns = [];


        this.init();
    }

    init(){
        this.initCanvas();
    }

    // 初始化canvas盒子
    initCanvas(){
        this.box.appendChild(this.canvas);
        this.resizeCanvas();
        window.addEventListener('resize',() => {
            this.resizeCanvas();
            this.initDotPos();
        })


        this.initDotPos();
        

        // 图形化音频数据
        this.music.analyserAudioData((arr) => {
            this.drawRect(arr);
            //console.log(arr);
        });


        // 点击切换柱状图和点状图
        let btns = document.querySelector('#type').children;
        let self = this;
        Array.prototype.slice.call(btns).forEach(v => {
            v.onclick = function(){
                for(var i=0;i<btns.length;i++){
                    btns[i].className = '';
                }
                this.className = 'selected';
                self.type = this.dataset.type;
            }
        })
    }


    initDotPos(){
        this.dotsPos = [];
        // 初始化dot图形位置
        for(let i=0;i<this.size;i++){
            this.dotsPos.push({
                x: this.canvasWidth*Math.random(),
                y: this.canvasHeight*Math.random(),
                colors: [this.getRamdomColor(),this.getRamdomColor(),this.getRamdomColor()],
                ctx: this.ctx,
                canvas: this.canvas
            })
        }    
    }

    resizeCanvas(){
        this.canvasWidth = this.box.clientWidth;
        this.canvasHeight = this.box.clientHeight;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    }


    // 绘制柱状图
    drawRect(arr){
        this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);

        let w = this.canvasWidth / this.size;

        for(let i=0;i<this.size;i++){
            if(this.type == 'column'){
                this.columns = [];
                let h = this.canvasHeight * (arr[i]/256);
                this.columns.push(new Column({
                    x: w*i,
                    y: this.canvasHeight-h,
                    w: w*0.6,
                    h: h,
                    ctx: this.ctx,
                    canvas: this.canvas,
                    colors:[this.getRamdomColor(),this.getRamdomColor(),this.getRamdomColor()]
                }));

                this.drawColumn();
            }else{
                this.dots = [];
                if((arr[i]/256)*50 == 0) return;
                
                this.dots.push(new Dot({
                    x: this.dotsPos[i].x,
                    y: this.dotsPos[i].y,
                    r: (arr[i]/256)*50,
                    ctx: this.dotsPos[i].ctx,
                    canvas: this.dotsPos[i].canvas,
                    colors: this.dotsPos[i].colors,
                }));

                this.drawDot();
            }
        }
    }

    // 绘制柱状图
    drawColumn(){
        this.columns.forEach(v => {
            v.draw();
        })
    }

    // 绘制点状图
    drawDot(){
        this.dots.forEach(v => {
            v.draw();
        })
    }

    // 获取随机颜色
    getRamdomColor(){
        return `rgb(${255*Math.random()},${255*Math.random()},${255*Math.random()})`;
    }

    // 获取两个数之间的随机数
    getRamdomNumber(n,m){
        return n + Math.floor((m-n)*Math.random());
    }
/*
    fillRects(){
        let line = this.ctx.createLinearGradient(0,0,0,this.canvasHeight);
        line.addColorStop(0,'red');
        line.addColorStop(0.5,'yellow');
        line.addColorStop(1,'green');
        this.ctx.fillStyle = line;
    }*/
    
}


//const music = new Music();
const canvas = new Canvas();