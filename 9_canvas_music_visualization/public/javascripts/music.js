class Music{
    
    constructor(){
        this.init();
    }

    //初始化
    init(){
        this.initDOM();
    }   

    initDOM(){
        let lists = document.querySelector('#list').children;
        let listsArr = Array.prototype.slice.call(lists);
        let currentItem = null;
        let self = this;

        listsArr.forEach((item,index,arr) => {
          item.onclick = function(){
            arr.forEach((el) => { el.classList.remove('selected') });
            this.classList.add('selected');
            self.requestMusicData(index);
          }
        })
    }

    // 点击音乐列表请求音乐数据
    requestMusicData(index){
        
    }   

    
    
}

const music = new Music();