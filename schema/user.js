//导入定义验证规则的包
const joi = require('joi')



// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()

// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()


// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}





//定义id验证规则
const id = joi.number().integer().min(1).required()

//定义nickname验证规则
const nickname = joi.string().required()

//定义email验证规则
const email = joi.string().email().required()

//定义头像的验证规则
const avatar = joi.string().dataUri().required()

//验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
    body: {
        id: id,//es6 语法可以简写为 id 但是名字要保持一致
        nickname: nickname,
        email: email
    }
}


//跟新密码的验证规则
exports.update_password_schema={
    body:{
        oldpwd:password,
        newpwd:joi.not(joi.ref('oldpwd')).concat(password)
    }
}


//定义验证头像的规则

//
exports.update_avater_schema = {
    body:{
        avatar:avatar,
    }
}
    