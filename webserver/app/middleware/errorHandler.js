const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (process.env.NODE_ENV !== 'online') {
            console.error('1 level error catch:', error);
            ctx.body = {
                errorMsg: error.stack
            };
        } else {
            console.error('1 level error catch:', error);
            ctx.body = {
                errorMsg: "请稍后"
            };
        }
    }
};

module.exports = errorHandler;