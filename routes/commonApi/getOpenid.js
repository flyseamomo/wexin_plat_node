/**
 * Created by Administrator on 2017/4/1.
 */
const getOpenid = require('../../fn/wechat/getOpenid')
const querystring = require("querystring")
const plat = require('../../config/constant')
const redis = require('../../utils/redis')

module.exports = async (ctx,next)=>{
  //获取url参数的callback，即需要取openid的回调地址
  let callback = querystring.parse(ctx.querystring).callback
  //获取url参数的wxid，即需要授权的appid
  let wxid = querystring.parse(ctx.querystring).wxid
  if(wxid){
    console.log('wxid_query',wxid)
    redis.set('wxid', wxid)
    redis.expire('wxid', 500)
  }else wxid = await redis.get('wxid')
  if(callback){
    callback = decodeURIComponent(callback)
    console.log('callback_query',callback)
    redis.set('callback', callback)
    redis.expire('callback', 500)
  }else callback = await redis.get('callback')

  let code = querystring.parse(ctx.querystring).code
  let url = encodeURIComponent('http://api.diandianyy.com/util/weixin/app/auth')
  if(code){
    console.log('code',code)
    let obj = await getOpenid(code,wxid)
    let openid = obj.openid
    ctx.redirect(callback+'?openid='+openid)
  }else{
    ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wxid+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid='+plat.appid+'#wechat_redirect')
  }
}