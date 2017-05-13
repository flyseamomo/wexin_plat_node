const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const logUtil = require('./utils/log_util')
const cors = require('koa-cors')

const auth = require('./routes/auth/auth')
const event = require('./routes/auth/event')
const wx = require('./routes/wx/wx')
const api = require('./routes/api')
const pic = require('./routes/pic')
const sqlInit = require('./config/sqlInit')

console.log('---开始创建数据库---')
sqlInit()
// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(cors())
console.log('2')
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {extension: 'ejs'}))
// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date()
  //响应间隔时间
  let ms
  try {
    //开始进入到下一个中间件
    await next()
    ms = new Date() - start
    //记录响应日志
    logUtil.logResponse(ctx, ms)
  } catch (error) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, error, ms)
  }
})
router.get('/', (ctx, next) => {
  ctx.body = '欢迎调用微信开放平台api接口！'
})
router.use('/auth', auth.routes(), auth.allowedMethods())
router.use('/event', event.routes(), event.allowedMethods())
router.use('/wx', wx.routes(), wx.allowedMethods())
router.use('/app', api.routes(), api.allowedMethods())
router.use('/pic', pic.routes(), pic.allowedMethods())

app.use(router.routes(), router.allowedMethods())
// response
onerror(app)

module.exports = app