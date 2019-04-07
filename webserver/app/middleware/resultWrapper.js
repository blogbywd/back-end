const resultWrapper = async (ctx, next) => {
    await next();
    if (!ctx.body) {
        ctx.body = {
            code: 1,
            msg: 'Not Found'
        }
        ctx.body = ctx.body;
    }
};

module.exports = resultWrapper;