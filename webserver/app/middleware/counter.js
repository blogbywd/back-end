//服务器响应时间计数器
const counter = async (ctx, next) => {
    const start = Date.now();
    //获取请求信息
    const reqInfo = { method: ctx.req.method, ip: ctx.req.connection.remoteAddress, url: ctx.req.url };
    console.info(
        'req info:==========>',
        `${ctx.req.method}:${ctx.req.connection.remoteAddress}:${ctx.req.url}`
    );
    //获取请求体
    console.log('req body:==========>', ctx.request.body);
    await next();
    //响应时间
    const ms = Date.now() - start;
    //响应信息
    const resInfo = { statusCode: ctx.res.statusCode, msg: ctx.response.message, ms };
    console.info('res info:==========>', resInfo);
    console.log('res body:==========>', ctx.body);
};

module.exports = counter;