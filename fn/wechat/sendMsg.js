/**
 * Created by Administrator on 2017/4/1.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')

module.exports = async (appid,openid,msgType,content,media_id)=>{
  let authorizer_access_token = await Authorizer_access_token(appid)
  console.log('authorizer_access_token',authorizer_access_token)
  let opt
  if(msgType == 'text'){
    console.log('text')
    opt = {
      "touser":openid,
      "msgtype":'text',
      "text": {
          "content":content
        }
    }
  }else {
    opt = {
      "touser":openid,
      "msgtype":msgType,
      msgType: {
        "media_id":media_id
      }
    }
  }
  console.log('opt',opt)
  let result = await request('POST','https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+authorizer_access_token).send(opt)
  result = JSON.parse(result.text)
  console.log('sendMsg_result', result)
  return result
}