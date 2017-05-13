/**
 * Created by Administrator on 2017/4/1.
 */
const request = require('superagent')
const Component_access_token = require('../../common/component_access_token')
const plat = require('../../config/constant')

module.exports = async (code,appid) => {
  console.log('getOpenid',code)
  let component_access_token = await Component_access_token()
  let result = await request('GET','https://api.weixin.qq.com/sns/oauth2/component/access_token?appid='+appid+'&code='+code+'&grant_type=authorization_code&component_appid='+plat.appid+'&component_access_token=' + component_access_token)

  result = JSON.parse(result.text)
  console.log('res',result)
  return result
}