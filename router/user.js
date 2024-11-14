const express = require('express')
const router = express.Router()
//导入用户路由处理函数的模块
const userHandler = require('../router_handler/user')

//导入验证数据验证中间件
const expressjoi=require('@escook/express-joi')

const {reg_login_schema} =  require('../schema/user')


//注册
router.post('/reguser',expressjoi(reg_login_schema),userHandler.regUser)

//登录
router.post('/login', expressjoi(reg_login_schema),userHandler.login)

module.exports = router