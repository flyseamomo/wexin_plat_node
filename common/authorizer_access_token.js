/**
 * Created by Administrator on 2017/2/9.
 */
const request = require('superagent')
const redis = require('../utils/redis')
const plat = require('../config/constant')
const Component_access_token = require('./component_access_token')
const query = require('../utils/query').query

module.exports = async (appid) => {
  let access_token = await redis.get('authorizer_access_token' + appid)
  console.log('authorizer_access_token' + appid, access_token)
  if (access_token) {
    return access_token
  } else {
    let authorizer_refresh_token = await redis.get('authorizer_refresh_token' + appid)
    console.log('authorizer_refresh_token',authorizer_refresh_token)
    let component_access_token = await Component_access_token()
    let result = await request('POST', 'https://api.weixin.qq.com /cgi-bin/component/api_authorizer_token?component_access_token=' + component_access_token).send({
      'component_appid': plat.appid,
      'authorizer_appid': appid,
      'authorizer_refresh_token': authorizer_refresh_token
    })
    result = JSON.parse(result.text)
    console.log('authorizer+refresh', result)
    redis.set('authorizer_access_token' + appid, result.authorizer_access_token)
    redis.expire('authorizer_access_token' + appid, 7000)
    redis.set('authorizer_refresh_token' + appid, result.authorizer_refresh_token)
    let row = {
      appid:appid,
      access_token:result.authorizer_access_token,
      refresh_token:result.authorizer_refresh_token
    }
    let obj = await query('UPDATE wechat_config SET ? WHERE appid = ?',[row,appid])
    console.log(appid+'refresh_token to mysql',obj)

    return result.authorizer_access_token
  }
}