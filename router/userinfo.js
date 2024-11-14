const express=require('express')
const router=express.Router()

//挂载路由


//导入用户处理函数
const userinfoHandler = require('../router_handler/userinfo')

//导入验证数据的中间件
const expressjoi=require('@escook/express-joi')

//导入需要的验证数规则 数据对象
const {update_userinfo_schema, update_password_schema, update_avater_schema}=require('../schema/user')





//获取用户基本信息
router.get('/userinfo',userinfoHandler.getuserinfo)

//提供更新用户基本信息的路由
router.post('/userinfo',expressjoi(update_userinfo_schema),userinfoHandler.updateUserinfo)

//跟新密码的路由
router.post('/updatepwd',expressjoi(update_password_schema),userinfoHandler.updatePassword)

//更换头像路由
router.post('/update/avatar',expressjoi(update_avater_schema),userinfoHandler.updateAvatar)// 

//





module.exports=router