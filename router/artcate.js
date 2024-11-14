const { required } = require('@hapi/joi/lib/base')
const express = require('express')

const router = express.Router()

//导入处理函数
const artcatehandler = require('../router_handler/artcate')


//获取文件处理的路由
router.get('/cates', artcatehandler.getArtCates)


//新增文章分类的路由中间件
//导入验证数据的中间件
const expressjoi = require('@escook/express-joi')


//导入需要的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')


//添加文章的
router.post('/addcates', expressjoi(add_cate_schema), artcatehandler.articlecates)

//根据id 删除文章的路由
router.get('/deletecate/:id', expressjoi(delete_cate_schema), artcatehandler.deletecatebyid)

//根据id获取文章分类的路由
router.get('/cates/:id', expressjoi(get_cate_schema), artcatehandler.getArtCatById)

//根据id更新文章
router.post('/updatecate', expressjoi(update_cate_schema), artcatehandler.updateCateById)




module.exports = router