  const query = require('../../utils/query').query
  const Authorizer_access_token = require('../../common/authorizer_access_token')
  const wechat_user = require('../wechat/wechat_user')
  const subscribe = require('./subscribe')

  module.exports = async(xml) => {
      let originalid = xml.ToUserName[0]
      let openid = xml.FromUserName[0]
      console.log('openid', openid)
      let result = await query('SELECT postUrl FROM qrcode WHERE ticket = ?', xml.Ticket[0])
      console.log('result', result.obj[0].postUrl)
      let post = await request('POST', result.obj[0].postUrl).send(xml)
      console.log('post', post.text)
      //if(xml.Event[0] == 'subscribe') await subscribe(xml)
  }
