/**
 * Created by Administrator on 2017/5/9.
 */
const query = require('../utils/query').query
module.exports = async ()=> {
    let result = await query("create table if not exists `wechat_config` (\
      `appid` varchar(20) NOT NULL COMMENT 'appid',\
      `secretid` varchar(100) DEFAULT NULL COMMENT 'secretid',\
      `originalid` varchar(20) DEFAULT NULL COMMENT '公众号原始id',\
      `mp_name` varchar(20) DEFAULT NULL COMMENT '公众号名称',\
      `auth_status` tinyint(1) DEFAULT NULL,\
      `mp_type` varchar(5) DEFAULT NULL COMMENT '微信号类型（SUB-订阅号 SER-服务号）',\
      `verify_type` varchar(5) DEFAULT NULL COMMENT '认证情况类型',\
      `mp_id` varchar(20) DEFAULT NULL COMMENT '公众号微信号',\
      `logo_url` varchar(200) DEFAULT NULL COMMENT '微信号logo',\
      `qrcode_url` varchar(200) DEFAULT NULL COMMENT '二维码url',\
      `business_info` varchar(2000) DEFAULT NULL COMMENT '功能开通情况',\
      `func_info` varchar(2000) DEFAULT NULL COMMENT '授权情况',\
      `authorization_code` varchar(200) DEFAULT NULL COMMENT '第三方平台公众号授权code',\
      `access_token` varchar(200) DEFAULT NULL COMMENT 'access_token',\
      `refresh_token` varchar(200) DEFAULT NULL COMMENT 'refresh_token',\
      PRIMARY KEY (`appid`)\
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='微信_接入配置'")
      await query("create table if not exists `qrcode` (\
        `qrcodeId` int(11) NOT NULL AUTO_INCREMENT,\
      `scene_str` varchar(32) NOT NULL,\
      `postUrl` varchar(100) NOT NULL,\
      `url` varchar(100) NOT NULL,\
      `creatAt` bigint(13) NOT NULL,\
      `appid` varchar(20) NOT NULL,\
      `ticket` varchar(200) DEFAULT NULL,\
      PRIMARY KEY (`qrcodeId`)\
  ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4")
      let obj = await query("create table if not exists `msg` (\
        `msgId` int(11) NOT NULL AUTO_INCREMENT,\
      `msg_str` varchar(255) NOT NULL,\
      `postUrl` varchar(100) DEFAULT NULL,\
      `creatAt` bigint(13) NOT NULL,\
      `appid` varchar(20) NOT NULL,\
      `reply` varchar(255) NOT NULL,\
      PRIMARY KEY (`msgId`)\
  ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4")
      console.log('msg',obj)
      await query("create table if not exists `wechat_user` (\
  `openid` varchar(50) NOT NULL COMMENT '用户openid',\
  `unionid` varchar(50) DEFAULT NULL COMMENT '用户unionid',\
  `subscribe` tinyint(1) DEFAULT NULL COMMENT '关注状态（0否 1是）',\
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',\
  `sex` varchar(1) DEFAULT NULL COMMENT '性别（0位置 1男 2女）',\
  `city` varchar(50) DEFAULT NULL COMMENT '城市',\
  `country` varchar(50) DEFAULT NULL COMMENT '国家',\
  `province` varchar(50) DEFAULT NULL COMMENT '省份',\
  `language` varchar(50) DEFAULT NULL COMMENT '语言',\
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像',\
  `subscribe_time` bigint(10) DEFAULT NULL COMMENT '最近关注时间',\
  `unsubscribe_time` bigint(10) DEFAULT NULL COMMENT '取消关注时间',\
  `remark` varchar(50) DEFAULT NULL COMMENT '备注',\
  `groupid` varchar(50) DEFAULT NULL COMMENT '分组id',\
  `appid` varchar(20) DEFAULT NULL COMMENT '微信appid',\
  `user_source` varchar(5) DEFAULT NULL COMMENT '用户来源 APP或MP',\
  PRIMARY KEY (`openid`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='微信_用户';")
  // console.log('result',result)
}