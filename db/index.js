//导入mysql
const mysql = require('mysql2')


//创建连接对象
const db =mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'my_db_01',
})

module.exports = db