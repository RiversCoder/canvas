const router = require('koa-router')()
const fs = require('fs');
const path = require('path');

router.prefix('/music')

router.get('/', async function (ctx, next) {
  
  let files = await readFiles();

  await ctx.render('index', {
    title: 'Hello Koa 2!',
    music: files
  });

})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a music/bar response'
})


async function readFiles(){
    let musicPath = path.resolve(path.dirname(__dirname),'../music/public/music');
    return fs.readdirSync(musicPath);
}

module.exports = router
