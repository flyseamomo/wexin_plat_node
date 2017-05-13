const router = require('koa-router')()
const Pre_auth_code = require('../../common/pre_auth_code')
const plat = require('../../config/constant')
const callback = require('./callback')
//公众号授权页
router.get('/', async (ctx, next)=> {
  console.log('auth')
  //取pre_auth_code
  let pre_auth_code = await Pre_auth_code()
  //跳转微信授权扫描二维码
  await ctx.render('auth',{url:'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='+ plat.appid +'&pre_auth_code=' + pre_auth_code + '&redirect_uri=http://api.diandianyy.com/common/weixin/auth/callback'})
  // ctx.redirect('https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='+ plat.appid +'&pre_auth_code=' + pre_auth_code + '&redirect_uri=https://wx.shnavy.com/auth/callback')
})

//公众号授权回调
router.get('/callback', callback)

module.exports = router