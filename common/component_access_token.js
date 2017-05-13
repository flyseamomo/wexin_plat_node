/**
 * Created by Administrator on 2017/2/9.
 */
const request = require('superagent')
const redis = require('../utils/redis')
const plat = require('../config/constant')

module.exports = async () => {
  let component_access_token = await redis.get('component_access_token')
  console.log('component_access_token1', component_access_token)
  if (component_access_token) {
    return component_access_token
  } else {
    let ComponentVerifyTicket = await redis.get('ComponentVerifyTicket')
    let result = await request('POST', 'https://api.weixin.qq.com/cgi-bin/component/api_component_token').send({
      'component_appid': plat.appid,
      'component_appsecret': plat.appsecret,
      'component_verify_ticket': ComponentVerifyTicket
    })
    result = JSON.parse(result.text)
    console.log('result_component_access_token', result)
    console.log('component_access_token2', result.component_access_token)
    redis.set('component_access_token', result.component_access_token)
    redis.expire('component_access_token', 7000)
    return result.component_access_token
  }
}