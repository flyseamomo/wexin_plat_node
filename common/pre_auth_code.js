/**
 * Created by Administrator on 2017/2/9.
 */
const Component_access_token = require('./component_access_token')
const request = require('superagent')
const redis = require('./../utils/redis')
const plat = require('../config/constant')

module.exports = async () => {
  let pre_auth_code = await redis.get('pre_auth_code')
  console.log('pre_auth_code', pre_auth_code)
  if (pre_auth_code) {
    return pre_auth_code
  } else {
    let component_access_token = await Component_access_token()
    let result = await request('POST', 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=' + component_access_token).send({
      'component_appid': plat.appid
    })
    result = JSON.parse(result.text)
    console.log('pre_auth_code2', result.pre_auth_code)
    redis.set('pre_auth_code', result.pre_auth_code)
    redis.expire('pre_auth_code', 500)
    return result.pre_auth_code
  }
}