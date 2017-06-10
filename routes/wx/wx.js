/**
 * Created by Administrator on 2017/3/30.
 */
const router = require('koa-router')()
const xml = require('../../common/xml')
const query = require('../../utils/query').query
const request = require('superagent')
const sendMsg = require('../../fn/wechat/sendMsg')
const encrypt = require('../../common/encrypt')
const Component_access_token = require('../../common/component_access_token')
const plat = require('../../config/constant')
const msg_event = require('../../fn/event/msg')
const scan_event = require('../../fn/event/scan')
const subscribe_event = require('../../fn/event/subscribe')
const unsubscribe_event = require('../../fn/event/unsubscribe')

router.post('/:appid', xml, (ctx, next) => {
    return new Promise(async(resolve, reject) => {
        let appid = ctx.params.appid
        console.log('appid', appid)
        console.log('data1', ctx.xml)
        let msg, opt
            //全网发布测试
        if (appid == 'wx570bc396a51b8ff8') {
            //推送事件
            if (ctx.xml.MsgType[0] == 'event') {
                console.log('Event', ctx.xml.Event[0])
                opt = {
                    ToUserName: ctx.xml.FromUserName[0],
                    FromUserName: ctx.xml.ToUserName[0],
                    CreateTime: parseInt(new Date().getTime() / 1000),
                    MsgType: 'text',
                    Content: ctx.xml.Event[0] + 'from_callback'
                }
                console.log('opt', opt)
                msg = encrypt(opt)
                console.log('msg', msg)
                resolve(msg)
            } else if (ctx.xml.Content[0] == 'TESTCOMPONENT_MSG_TYPE_TEXT') {
                opt = {
                    ToUserName: ctx.xml.FromUserName[0],
                    FromUserName: ctx.xml.ToUserName[0],
                    CreateTime: new Date().getTime() / 1000,
                    MsgType: 'text',
                    Content: 'TESTCOMPONENT_MSG_TYPE_TEXT_callback'
                }
                msg = encrypt(opt)
                console.log('msg', msg)
                resolve(msg)
            } else if (ctx.xml.Content[0].indexOf('QUERY_AUTH_CODE') > -1) {
                resolve('success')
                let component_access_token = await Component_access_token()
                let index = ctx.xml.Content[0].indexOf(':')
                let auth_code = ctx.xml.Content[0].substring(index + 1)
                console.log('auth_code', auth_code)
                let result = await request('POST', 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=' + component_access_token).send({
                    'component_appid': plat.appid,
                    'authorization_code': auth_code
                })
                result = JSON.parse(result.text)
                console.log('result', result)
                sendMsg(appid, ctx.xml.FromUserName[0], 'text', auth_code + '_from_api', null)
            } else {
                opt = {
                    ToUserName: ctx.xml.FromUserName[0],
                    FromUserName: ctx.xml.ToUserName[0],
                    CreateTime: new Date().getTime() / 1000,
                    MsgType: 'text',
                    Content: 'LOCATIONfrom_callback'
                }
                msg = encrypt(opt)
                console.log('msg', msg)
                resolve(msg)
            }
        } else {
            resolve('success')
                //扫码事件
            if (ctx.xml.Ticket) await scan_event(ctx.xml)
            if (ctx.xml.Event) {
                //关注事件
                if (ctx.xml.Event[0] == 'subscribe') await subscribe_event(ctx.xml)
                    //取消关注事件
                if (ctx.xml.Event[0] == 'unsubscribe') await unsubscribe_event(ctx.xml)
            }
            //文本消息事件
            if (ctx.xml.MsgType[0] == 'text') await msg_event(ctx.xml)
        }
    }).then((data) => {
        console.log('data', data)
        ctx.body = data
    })
})
module.exports = router
