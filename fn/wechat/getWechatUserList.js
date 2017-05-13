/**
 * Created by Administrator on 2017/3/30.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (appid,nextOpenid) => {
  let authorizer_access_token = await Authorizer_access_token(appid)
  console.log('request', authorizer_access_token)
  let result
  if(!nextOpenid){
    result = await request('GET','https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + authorizer_access_token)
  }else{
    result = await request('GET','https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + authorizer_access_token + '&next_openid=' + nextOpenid)
  }
  result = JSON.parse(result.text)
  console.log('res',result)
  return result
}