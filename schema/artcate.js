//导入定义验证规则的模块
const joi = require('joi')
const { param } = require('../router/user')

//定义name alias的验证规则

const name = joi.string().required()
const alias = joi.string().alphanum().required()

//定义 id 的验证规则
const id = joi.number().integer().min(1).required()

//向外共享添加验证规则
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}


//向外共享删除的验证规则
exports.delete_cate_schema = {
    params: {
        id
    }
}


//验证规则对象 - 根据id获取文章分类
exports.get_cate_schema = {
    params: {
        id
    }
}

//验证规则对象 - 根据id跟新文章
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    },
}