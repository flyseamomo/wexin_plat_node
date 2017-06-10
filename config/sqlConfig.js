console.log('env.NODE_ENV', process.env.NODE_ENV)

let sql, redisConfig

if (process.env.NODE_ENV === 'production') { //生产环境
  sql = {
    host: 'util-mysql',
    user: 'root',
    password: 'root123',
    database: 'weixin'
  }
  redisConfig = {
    host: 'util-redis',
    db: 0
  }
} else { //测试环境
  sql = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'weixin'
  }
  redisConfig = {
    host: '127.0.0.1',
    port: 6379,
    db: 0
  }
}

module.exports = {sql, redisConfig}
