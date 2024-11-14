const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
const { query } = require('express')


//查询文章分类
exports.getArtCates = (req, res) => {
    // 定义查询sql语句
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id  asc'
    //调用db.query()执行sql语句
    db.query(sql, (err, result) => {
        //sql语句失败
        if (err) {
            return res.cc(err)
        }
        //执行成功
        res.send({
            status: 0,
            message: '执行成功',
            data: result
        })
    })
}

//新增文章分类成功
exports.articlecates = (req, res) => {
    //定义sql语句
    const sql = 'select * from ev_article_cate where name = ? or alias = ?'
    //执行sql语句
    db.query(sql, [req.body.name, req.body.alias], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length === 2) {
            return res.cc('分类名称和分类别名被占用 请跟换后重试')
        }
        if (result.length === 1 && result[0].name === req.body.name && result[0].alias === req.body.alias) {
            return res.cc('分类名称和分类别名被占用 请跟换后重试')
        }
        if (result.length === 1 && result[0].name === req.body.name) {
            return res.cc('分类名称被占用 请跟换后重试')
        }
        if (
            result.length === 1 && result[0].alias === req.body.alias
        ) {
            return res.cc('分类别名被占用 请跟换后重试')
        }
        //分类名称 和 分类别名 都可用 执行添加
        //定义sql语句
        const sql = 'insert into ev_article_cate set ?'
        //执行sql语句
        db.query(sql, req.body, (err, result) => {
            //报错
            if (err) {
                return res.cc(err)
            }
            //判断是否是影响了一条 记录
            if (result.affectedRows !== 1) {
                return res.cc('新增文章分类失败')
            }
            res.cc('新增文章分类成功', 0)
        })
    })
}

//根据id删除文章
exports.deletecatebyid = (req, res) => {
    //定义sql语句
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    //执行sql语句
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.affectedRows !== 1) {
            return res.cc('文章删除失败')
        }
        res.cc('删除成功', 0)
    })
}

//根据id获取文章分类
exports.getArtCatById = (req, res) => {
    //定义sql语句
    const sql = 'select * from ev_article_cate where id = ? '//and is_delete = 0

    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 1) {
            return res.cc('获取文章数据失败')
        }
        res.send({
            status: 0,
            message: '获取成功',
            data: result
        })
    })
}

//根据id根据文章
exports.updateCateById = (req, res) => {
    //定义sql语句
    const sql = 'select * from ev_article_cate where id <> ? and (name = ? or alias = ?)'
    //执行sql语句
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length === 2) {
            return res.cc('名称和别名被占用')
        }
        if (result.length === 1 && result[0].name === req.body.name && result[0].alias === req.body.alias) {
            return res.cc('名称和别名被占用')
        }
        if (result.length === 1 && result[0].name === req.body.name ) {
            return res.cc('名称被占用')
        }
        if (result.length === 1 && result[0].alias === req.body.alias) {
            return res.cc('别名被占用')
        }

        const sql = 'update ev_article_cate set ? where id = ?'
        db.query(sql,[req.body,req.body.id],(err,result)=>{
            if(err)
            {
                return res.cc(err)
            }
            if (result.affectedRows !== 1) {
                return res.cc('更新文章数据失败')
            }
            res.send({
                status: 0,
                message: '更新成功',
            })
        })

    })
}