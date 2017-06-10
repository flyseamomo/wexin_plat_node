const query = require('../../utils/query').query
const Authorizer_access_token = require('../../common/authorizer_access_token')
const wechat_user = require('../wechat/wechat_user')
const sendMsg = require('../wechat/sendMsg')

module.exports = async (xml) => {
  let originalid = xml.ToUserName[0]
  let openid = xml.FromUserName[0]
  console.log('openid',openid)
  //根据originalid查询appid
  let opt = await query('SELECT appid FROM wechat_config WHERE originalid = ?', originalid)
  appid = opt.obj.appid
  //注册或更新wechat_user
  await wechat_user(appid,openid)
  //发送欢迎词
  let result = query('SELECT * FROM msg WHERE appid = ? AND msg_str = ?',[appid,'subscribe'])
  if(result.obj.length>0){
    sendMsg(appid, xml.FromUserName[0], 'text', result.obj[0].reply,null)
    if(result.obj[0].postUrl){
      let post = await request('POST', result.obj[0].postUrl).send(ctx.xml)
        console.log('post',post.text)
    }
  }
}