/**
 * Created by Administrator on 2017/4/1.
 */
const sendMsg = require('../../fn/wechat/sendMsg')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  console.log('appid',appid)
  let openid = ctx.request.body.openid
  console.log('openid',openid)
  let msgType = ctx.request.body.msgType
  console.log('msgType',msgType)
  let content = ctx.request.body.content
  console.log('content',content)
  let media_id = ctx.request.body.media_id
  console.log('media_id',media_id)
  let result = await sendMsg(appid,openid,msgType,content,media_id)
  ctx.body = result
}