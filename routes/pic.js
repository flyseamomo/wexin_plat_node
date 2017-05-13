const router = require('koa-router')()
const multer = require('koa-multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits: {fileSize: '5MB'}})
const qiniu = require('../common/upload')

router.post('/', upload.any(), async (ctx, next) => {
    console.log('file', ctx.req.files)
    let url = await qiniu(ctx.req.files[0].buffer,null)
    ctx.body = url.url
})
module.exports = router