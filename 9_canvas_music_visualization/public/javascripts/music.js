class Music{
    
    constructor(){
        this.init();
    }

    //初始化
    init(){
        this.initDOM();
    }   

    // 初始化DOM操作
    initDOM(){
        let lists = document.querySelector('#list').children;
        let listsArr = Array.prototype.slice.call(lists);
        let currentItem = null;
        let self = this;

        listsArr.forEach((item,index,arr) => {
          item.onclick = function(){
            arr.forEach((el) => { el.classList.remove('selected') });
            this.classList.add('selected');
            self.requestMusicData(item,index);
          }
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

        //请求并且传递音乐名称
        fetch('/music/file?name='+item.innerText,{
            method: 'get',
            responseType: 'arraybuffer'
        }).then(res => {
            return res.arrayBuffer();
        }).then(data => {
            console.log(data);
        })
    }   

    
    
}

const music = new Music();