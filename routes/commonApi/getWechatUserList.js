/**
 * Created by Administrator on 2017/3/30.
 */
const getWechatUserList = require('../../fn/wechat/getWechatUserList')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  let nextOpenid = ctx.request.body.nextOpenid
  console.log('nextOpenid',nextOpenid)
  let result = await getWechatUserList(appid,nextOpenid)
  ctx.body = result
}