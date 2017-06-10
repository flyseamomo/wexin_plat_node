const setMsg = require('../../fn/wechat/setMsg')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  console.log('appid',appid)
  let msg_str = 'subscribe'
  let reply = ctx.request.body.reply
  console.log('reply',reply)
  let postUrl = ctx.request.body.postUrl
  console.log('postUrl',postUrl)
  await setMsg(appid,msg_str,reply,postUrl)
  ctx.body = 'success'
}