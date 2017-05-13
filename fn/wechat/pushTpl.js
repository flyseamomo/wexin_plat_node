/**
 * Created by Administrator on 2017/3/30.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (appid,openid,tplId,url,obj)=>{
  let authorizer_access_token = await Authorizer_access_token(appid)
  console.log('authorizer_access_token',authorizer_access_token)
  let opt = {
    "touser":openid,
    "template_id":tplId,
    "url":url,
    "data":obj
  }
  let result = await request('POST','https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+authorizer_access_token).send(opt)
  result = JSON.parse(result.text)
  console.log('push_result', result)
  return result
}