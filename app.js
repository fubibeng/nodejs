//导入express
const express = require('express')

//创建服务器实例对象
const app = express()

//导入cors 用来解决跨域问题
const cors = require('cors')

const joi = require('joi')


//封装res.cc函数\
app.use((req, res, next) => {
    //status 默认值为 1 表示失败的情况  
    //err的值 可能是错误对象 也可能是错误信息
    res.cc = function (err, status = 1) {

        res.send({
            status,
            //instanceof Error:判断是否是err构造函数的一个实例
            message: err instanceof Error ? err.message : err,
        })

    }
    next()
})

//一定要在路由之前配置解析token的中间件
const { expressjwt: expressJWT } = require('express-jwt')

const config = require('./config')

//这是一个中间件 通过 secret 指定解密密钥 unless({path:[/^\/api/]}) 指定那些接口不需要进行token身份认证
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api/] }))

//注册cors
app.use(cors())


//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))



//导入用户模块
const userRouter = require('./router/user')

app.use('/api', userRouter)

//导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//定义错误级别的中间件
app.use((err, req, res, next) => {
    //验证失败
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    //身份认证失败后的结果
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败！')
    }
    //未知的错误
    res.cc(err)
})


//导入并使用文章分类的路由模块
const articleroter = require('./router/artcate')
app.use('/my/article', articleroter)


//启动服务器 端口号为 3007
app.listen(3007, () => {
    console.log('http://127.0.0.1:3007')
})