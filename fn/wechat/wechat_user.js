const query = require('../../utils/query').query
const Authorizer_access_token = require('../../common/authorizer_access_token')
const request = require('superagent')

module.exports = async (appid,openid) => {
  console.log('openid',openid)
  let authorizer_access_token = await Authorizer_access_token(appid)

  let result = await request('GET','https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + authorizer_access_token + '&openid=' + openid +'&lang=zh_CN')

  result = JSON.parse(result.text)
  delete result.tagid_list
  console.log('res',result)

  let user = await query('SELECT * FROM wechat_user WHERE openid = ?', openid)
  console.log('user',user)
  if (user.obj.length>0) {
    query('UPDATE wechat_user SET ? WHERE openid = ?',[result,openid])
  }else query('INSERT INTO wechat_user SET ?',result)
}