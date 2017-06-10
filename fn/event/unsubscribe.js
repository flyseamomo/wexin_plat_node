const query = require('../../utils/query').query

module.exports = async (xml) => {
  let openid = xml.FromUserName[0]
  console.log('openid',openid)
  let obj = {
    subscribe:0,
    unsubscribe_time:parseInt(new Date().getTime() / 1000)
  }
  let opt = await query('UPDATE wechat_config SET ? WHERE openid = ?', [obj,openid])
}