/**
 * Created by Administrator on 2017/2/10.
 */
const Redis = require('ioredis')
const redisConfig = require('../config/sqlConfig').redisConfig
// console.log('redisConfig',redisConfig)
const redis = new Redis(redisConfig)

module.exports = redis