/**
 * Created by Administrator on 2017/4/14.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  let menuid = ctx.request.body.menuid
  console.log('menuid',menuid)
  let authorizer_access_token = await Authorizer_access_token(appid)

  let result = await request('POST','https://api.weixin.qq.com/cgi-bin/menu/delconditional?access_token=' + authorizer_access_token).send({
    "menuid":menuid
  })

  result = JSON.parse(result.text)
  console.log('res',result)
  ctx.body = result
}