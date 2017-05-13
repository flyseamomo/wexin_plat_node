/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  let tagId = ctx.request.body.tagId
  let openidList = ctx.request.body.openidList
  if(!appid) ctx.body ='appid不可为空'
  else if(!tagId) ctx.body ='tagId不可为空'
  else if(!openidList) ctx.body ='openidList不可为空'
  else{
    let authorizer_access_token = await Authorizer_access_token(appid)

    let result = await request('POST','https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=' + authorizer_access_token).send({
      "openid_list" :openidList,
      "tagid" : tagId
    })

    result = JSON.parse(result.text)
    console.log('res',result)
    ctx.body = result
  }
}