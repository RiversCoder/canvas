class Music{
    
    constructor(){
        this.ac = new AudioContext();
        this.gainNode = this.ac.createGain();
        this.anayser = this.ac.createAnalyser();
        this.anayser.fftSize = 128*2;
        this.anayser.connect(this.gainNode);
        this.gainNode.connect(this.ac.destination);
        this.oldBufferSource = [];
        this.currentBufferSource = null;
        this.clickCount = 0;
        this.loadCount = 0;
        this.canvas = new Canvas();

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

        /* this.ajax('/music/file?name='+item.innerText,function(res) {
            console.log(res);
        });*/
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
        // 初始化一个空的 256位的 Unit8Array数组
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
        
        this.init();
    }

    init(){
        this.initCanvas();
        //this.initEvent();
    }

    // 初始化canvas盒子
    initCanvas(){
        this.box.appendChild(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize',() => {
            this.resizeCanvas();
        });

        // 绘制
        this.music.analyserAudioData((arr) => {
            this.drawRect(arr);
        });
    }

    //绘制 柱状图
    drawRect(arr){
        this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        let w = this.canvasWidth / this.size;

        for(let i=0;i<size;i++){
            let h = arr[i] / 256 * this.canvasHeight;
            ctx.fillRect(w*i,this.cnvasHeight-h,w*0.6,h);
        }
    }


    resizeCanvas(){
        this.canvasWidth = this.box.clientWidth;
        this.canvasHeight = this.box.clientHeight;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        let line = this.ctx.createLinearGradient(0,0,0,height);
        line.addColorStop(0,'red');
        line.addColorStop(0.5,'yellow');
        line.addColorStop(1,'green');
        this.ctx.fillStyle = line;
    }
}

const canvas = new Canvas();
const music = new Music();
