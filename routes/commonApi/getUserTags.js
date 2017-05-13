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

  let result = await request('POST','https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=' + authorizer_access_token).send({
    "openid":openid
  })

  result = JSON.parse(result.text)
  console.log('res',result)
  ctx.body = result
}