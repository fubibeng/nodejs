//导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
//导入处理密码的模块
const bcrypt = require('bcryptjs')



//抽离用户模块 ， 并共享出去
exports.getuserinfo = (req, res) => {
    const sql = 'select id,username,nickname,email,userpic from ev_users where id =  ?'
    //调用db.query()
    db.query(sql, req.auth.id, (err, result) => {
        //执行失败
        if (err) {
            return res.cc(err)
        }
        //执行成功 但是查询结果为空
        if (result.length !== 1) {
            console.log(req.auth.username)
            return res.cc('获取用户信息失败！')
        }
        res.send({
            status: 0,
            message: "获取用户成功",
            data: result[0],
        })
    })
}


//跟新用户基本信息 处理函数
exports.updateUserinfo = (req, res) => {
    //定义要执行的sql语句
    const sql = 'update ev_users set ? where id= ? '
    //调用db.query()执行sql语音
    db.query(sql, [req.body, req.body.id], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        //执行sql语句成功 但是 行数不为1
        if (result.affectedRows !== 1) {
            return res.cc('更新用户基本信息失败')
        }
        res.cc('更新用户信息成功', 0)
    })
}


//更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    
    //根据用户的id查询用户的信息
    
    const sql = `select * from ev_users where id = ?`
    //执行sql语句
    db.query(sql,req.auth.id,(err,result)=>{
        //执行sql语句失败
        if(err)
        {
            console.log(sql,req.auth.id,req.auth.newpwd,req.auth.oldpwd);
            
            return res.cc(err)
        }
        //判断用户是否存在
        if(result.length!==1)
        {
            return res.cc('用户不存在')
        }
        //判断用户输入的旧密码和数据库的旧密码是否一致
       const compareResult = bcrypt.compareSync(req.body.oldpwd,result[0].password)
        if(!compareResult)
        {
            return res.cc('旧密码错误')
        }
            


        //console.log(sql);
        console.log(req.auth.id);
        console.log(req.body.newpwd);
        console.log(req.body.oldpwd);


        //res.send('ok')

        
        //更新数据库
        //跟新密码的语句
        
        const sql = 'update ev_users SET password = ? WHERE id = ?'
        //加密新密码
        const newpwd = bcrypt.hashSync(req.body.newpwd,10)
        db.query(sql,[newpwd,req.auth.id],(err,result)=>{
            //执行sql失败
            if(err)
            {
                //console.log(sql)
                return res.cc(err)
            }
            //执行影响行数不为1
            if(result.affectedRows!==1)
            {
                return res.cc('跟新密码失败')
            }
            res.cc('跟新成功',0)
        })



    })
    
}

//跟新头像
exports.updateAvatar = (req, res) => {
    //跟新头像的sql语句
    const sql = 'update ev_users set userpic = ? where id= ?'
    //执行sql语句
    db.query(sql, [req.body.avatar, req.auth.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.affectedRows !== 1) {
            return res.cc('更新失败')
        }
        res.cc('更新头像成功', 0)
    })
}