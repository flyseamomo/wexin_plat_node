/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const query = require('../../utils/query').query
const wechat_user = require('../../fn/wechat/wechat_user')

module.exports = async (ctx,next)=>{
  console.log('request',ctx.request.body)
  let openid = ctx.request.body.openid
  let appid = ctx.request.body.appid || 'wxfc623ff79ce99489'
  ctx.body = await wechat_user(appid, openid)
  // let obj = await query('SELECT * FROM wechat_user WHERE openid = ?', openid)
  // if(obj.obj) ctx.body = obj.obj[0]
  //   else ctx.body = obj.msg
}