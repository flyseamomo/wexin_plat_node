/**
 * Created by Administrator on 2017/4/1.
 */
const request = require('superagent')
const query = require('../../utils/query').query

module.exports = async (appid,msg_str,reply,postUrl) => {
  let opt = {
    appid:appid,
    msg_str:msg_str,
    reply:reply,
    postUrl:postUrl,
    creatAt:parseInt(new Date().getTime() / 1000)
  }
  let result = await query('SELECT * FROM msg WHERE appid = ? AND msg_str = ?',[appid, msg_str])
  if(result.obj.length>0){
    await query('UPDATE msg SET ? WHERE msgId = ?',[opt, result.obj[0].msgId])
  }else await query('INSERT INTO msg SET ?',opt)
}