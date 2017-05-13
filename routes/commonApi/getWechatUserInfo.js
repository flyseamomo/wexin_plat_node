/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  let openid = ctx.request.body.openid
  console.log('openid',openid)
  let authorizer_access_token = await Authorizer_access_token(appid)

  let result = await request('GET','https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + authorizer_access_token + '&openid=' + openid +'&lang=zh_CN')

  result = JSON.parse(result.text)
  console.log('res',result)
  ctx.body = result
}