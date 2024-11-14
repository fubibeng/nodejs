//路由处理函数
//导入bcrypt包
const bcrypt = require('bcryptjs')

//导入数据库操作模块
const db = require('../db/index')
const { result } = require('@hapi/joi/lib/base')
//导入jsonwebtoken
const jwt=require('jsonwebtoken')

//导入全局配置文件
const config= require('../config')


//定义sql语句
let sql=''

//用户注册的处理函数
exports.regUser=(req,res)=>{

    const userinfo = req.body

    //检验是否拿到了表单数据
    //console.log(userinfo);
    
    // if(!userinfo.username||!userinfo.password)
    // {
    //     return res.send('用户名或密码不合法')
    // }

    //定义查询语句
    sql='SELECT * FROM ev_users WHERE username=?'
    //执行sql语句 sql语句 占位符参数 回调函数
    db.query(sql,userinfo.username,(err,results)=>{
        //判断是否报错 
        if(err)
        {
            // return res.send({status:1,message:err.message})
            return res.cc(err)
        }
        //判断查询结果是否大于 0 如果大于0 证明用户被占用
        if(results.length>0)
        {
            // return res.send({status:1,message:'用户名被占用'})
            return res.cc('用户名被占用')
        }
        //用户名可以使用

        //调用bcrypt.hashSync()进行加密
        //console.log(userinfo);

        userinfo.password=bcrypt.hashSync(userinfo.password,10)
        //console.log(userinfo);


        //插入数据
        sql='INSERT INTO ev_users set ?'
        db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            //判断sql语句是否执行成功
            if(err)
            {
                // return res.send({status:1,message:err.message})
                return res.cc(err)
                
            }

            if(results.affectedRows!==1)
            {
                // return res.send({status:1,message:'注册用户失败'})
                return res.cc(注册用户失败)

            }
        //  res.send({status:0,message:'注册成功'})\
            res.cc('注册成功',0)
        })



    })
    //res.send('reguser ok')
}


//用户登录的处理函数
exports.login=(req,res)=>{
    //接受表单数据
    const userinfo=req.body
    //要执行的sql语句
    const sql='SELECT * FROM ev_users WHERE username=?'
    //执行sql语句
    db.query(sql,userinfo.username,(err,result)=>{
        //执行sql语句失败
        if(err)
        {
            return res.cc(err)
        }
        //执行sql语句成功 但是结果不等于1
        if (result.length!==1)
        {
            return res.cc('登录失败')
        }
        //登录成功
        //bcrypt.compareSync('用户输入密码','数据库加密密码') 返回值 布尔型
        const compareResult = bcrypt.compareSync(userinfo.password,result[0].password)

        if(!compareResult)
        {
            return res.cc('密码错误')
        }
        
        
        //在 服务器生成token字符串
        const user={...result[0],password:'',userpic:''}
        //对用户信息进行加密 
        const tokenStr=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn })

        //调用res，send 将token响应给客户端
        res.send({
            status:0,
            message:"登录成功",
            token:'bearer '+tokenStr
        })
    })
}

