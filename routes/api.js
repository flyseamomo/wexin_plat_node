/**
 * Created by Administrator on 2017/3/30.
 */
/**
 * Created by Administrator on 2017/3/30.
 */
const router = require('koa-router')()
const getWechatUserList = require('./commonApi/getWechatUserList')
const getWechatUserInfo = require('./commonApi/getWechatUserInfo')
const pushTpl = require('./commonApi/pushTpl')
const auth = require('./commonApi/getOpenid')
const sendMsg = require('./commonApi/sendMsg')
const jssdk = require('./commonApi/jssdk')
const creatMenu = require('./commonApi/creatMenu')
const deleteMenu = require('./commonApi/deleteMenu')
const creatConditionalMenu = require('./commonApi/creatConditionalMenu')
const deleteConditionalMenu = require('./commonApi/deleteConditionalMenu')
const tryMatchMenu = require('./commonApi/tryMatchMenu')
const getMenu = require('./commonApi/getMenu')
const creatQrcode = require('./commonApi/creatQrcode')
const refreshQrcode = require('./commonApi/refreshQrcode')
const getMedia = require('./commonApi/getMedia')
const createTag = require('./commonApi/createTag')
const deleteTag = require('./commonApi/deleteTag')
const getTagList = require('./commonApi/getTagList')
const setTag = require('./commonApi/setTag')
const removeTag = require('./commonApi/removeTag')
const getUserTags = require('./commonApi/getUserTags')


//获取用户列表
router.post('/getwechatuserlist',getWechatUserList)
//获取用户基本信息
router.post('/getwechatuserinfo',getWechatUserInfo)
//推送模板消息
router.post('/pushtpl',pushTpl)
//用户授权获取openid
router.get('/auth',auth)
//发送客服消息
router.post('/sendmsg',sendMsg)
//获取jssdk
router.post('/jssdk',jssdk)
//创建自定义菜单
router.post('/creatmenu',creatMenu)
//删除所有菜单
router.post('/deletemenu',deleteMenu)
//创建个性化菜单
router.post('/creatconditionalmenu',creatConditionalMenu)
//删除个性化菜单
router.post('/deleteconditionalmenu',deleteConditionalMenu)
//测试个性化菜单匹配结果
router.post('/trymatchmenu',tryMatchMenu)
//查询自定义菜单
router.post('/getmenu',getMenu)
//创建带参数二维码
router.post('/creatqrcode',creatQrcode)
//刷新二维码
router.post('/refreshqrcode',refreshQrcode)
//获取临时素材（通过jssdk上传的语音）
router.post('/getmedia',getMedia)
//创建标签
router.post('/createtag',createTag)
//获取标签列表
router.post('/gettaglist',getTagList)
//删除标签
router.post('/deletetag',deleteTag)
//为用户设置标签
router.post('/settag',setTag)
//为用户移除标签
router.post('/removetag',removeTag)
//获取用户的标签列表
router.post('/getusertags',getUserTags)

module.exports = router