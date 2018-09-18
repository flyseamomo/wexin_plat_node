console.log('env.NODE_ENV', process.env.NODE_ENV)

let sql, redisConfig

if (process.env.NODE_ENV === 'production') { //生产环境
  sql = {
    host: ****,
    user: 'root',
    password: ****,
    database: ****
  }
  redisConfig = {
    host: ****,
    db: 0
  }
} else { //测试环境
  sql = {
    host: ****,
    port: 3306,
    user: 'root',
    password: ****,
    database: 'weixin'
  }
  redisConfig = {
    host: ****,
    port: ****,
    db: 0
  }
}

module.exports = {sql, redisConfig}
