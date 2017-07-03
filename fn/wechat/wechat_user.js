const query = require('../../utils/query').query
const Authorizer_access_token = require('../../common/authorizer_access_token')
const request = require('superagent')

module.exports = async (appid,openid) => {
  console.log('openid',openid)
  //查询wechat_user表该openid是否已注册
  let user = await query('SELECT * FROM wechat_user WHERE openid = ?', openid)
  console.log('user',user)
  if (user.obj.length>0) {
    //已注册直接返回该用户的信息
    return user
  }else{
    //未注册则先获取用户基本信息
    let authorizer_access_token = await Authorizer_access_token(appid)

    let result = await request('GET','https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + authorizer_access_token + '&openid=' + openid +'&lang=zh_CN')
    result = JSON.parse(result.text)
    console.log('get userInfo from wechat', result)
    //如果用户关注了公众号，并取得用户信息
    if(result.mickname){
      delete result.tagid_list
      //注册用户
      await query('INSERT INTO wechat_user SET ?',result)
    }
    return result
  } 
}