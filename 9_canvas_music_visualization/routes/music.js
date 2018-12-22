const router = require('koa-router')()
const fs = require('fs');
const path = require('path');
const bodyparser = require('koa-bodyparser')
router.use(bodyparser())


router.prefix('/music')

const musicPath = path.resolve(path.dirname(__dirname),'./public/music/');

router.get('/', async function (ctx, next) {
  
  let files = await readFiles();
  //console.log(files);
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    music: files
  });

})

router.get('/file',async function(ctx, next) {

    // 根据name值 获取相关的音乐文件信息
    let filename = ctx.query.name;
    let filepath = musicPath + '\\' + filename;

    // 读取音乐文件信息
    let fileData = await new Promise(function(resolve,reject){
        fs.readFile(filepath,function(err, data){
            resolve(data);
        });
    });

    console.log(fileData);
    
    ctx.body = fileData
    //console.log(ctx.query)
    //console.log(ctx);
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a music/bar response'
})


async function readFiles(){
    return fs.readdirSync(musicPath);
}

module.exports = router
