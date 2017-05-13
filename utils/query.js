/**
 * Created by Administrator on 2017/3/14.
 */
/**
 * Created by Administrator on 2017/1/13.
 */
const mysql = require('mysql')
const config = require('../config/sqlConfig').sql
const pool = mysql.createPool(config)
const query = (sql, data) => {
  return new Promise((resolve, reject) => {
    console.log('sql',sql)
    pool.query(sql, data, (err, rows) => {
      if (err) {
        resolve({msg: err})
      }
      if (rows) {
        resolve({obj: rows})
      }
    })
  })
}

const queryall = (arr) => {
  let list = []
  for (let i = 0; i < arr.length; i++) {
    list.push(
      new Promise((resolve, reject) => {
        console.log('sql',arr[i][0])
        pool.query(arr[i][0], arr[i][1], (err, rows)=> {
          if (err) {
            resolve({msg: err})
          }
          if (rows) {
            resolve({obj: rows})
          }
        })
      })
    )
  }
  return Promise.all(list)
}

module.exports = {query, queryall}