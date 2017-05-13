/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  if(appid){
    let authorizer_access_token = await Authorizer_access_token(appid)

    let result = await request('GET','https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + authorizer_access_token)

    result = JSON.parse(result.text)
    console.log('res',result)
    ctx.body = result
  }else ctx.body ='appid不可为空'
}