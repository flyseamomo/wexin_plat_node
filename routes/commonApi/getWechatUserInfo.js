/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const query = require('../../utils/query').query

module.exports = async (ctx,next)=>{
  let openid = ctx.request.body.openid
  console.log('openid',openid)
  let obj = await query('SELECT * FROM wechat_user WHERE openid = ?', openid)
  if(obj.obj) ctx.body = obj.obj[0]
    else ctx.body = obj.msg
}