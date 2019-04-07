const loginHandler = async (ctx, next) => {
    //检测是否登陆
    if (ctx.session.user) {
        await next();
    } else {
        ctx.body = {
            code: 1,
            msg: '请先登陆'
        }
    }
};

module.exports = loginHandler;