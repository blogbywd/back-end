const koa_router = require('koa-router');
const router = new koa_router({ prefix: "/blog" });
const {
    register,
    login,
    logout
} = require('../domain/handler/blog/user');

//router.post('/register', register);//注册
//router.post('/login', login);//登陆
router.get('/logout', logout);//登出

module.exports = (app) => {
    app.use(router.routes(), router.allowedMethods());
};
