/**
 * Created by Administrator on 2017/3/30.
 */
const pushTpl = require('../../fn/wechat/pushTpl')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  console.log('appid',appid)
  let openid = ctx.request.body.openid
  console.log('openid',openid)
  let tplId = ctx.request.body.tplId
  console.log('tplId',tplId)
  let url = ctx.request.body.url
  console.log('url',url)
  let obj = ctx.request.body.obj
  console.log('obj',obj)
  let result = await pushTpl(appid,openid,tplId,url,obj)
  ctx.body = result
}