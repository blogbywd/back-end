/*
*项目入口文件
*/
//servers配置
const configReader = require('./app/util/configReader');

//获取当前服务器id
const getCurrentServerId = () => {
    //获取当前进程的参数
    let args = process.argv;
    //获取服务器id
    for (let i = 2, len = args.length; i < len; i++) {
        //获取到"id"="webserver-n"
        let arg = args[i];
        //分割成数组，获取服务器id
        let result = arg.split("=");
        if (result[0] === "id") {
            return result[1];
        }
    }
    //默认返回第一台服务器id
    return "webserver-1";
};

//初始化web服务
const initAppInfo = (serverId) => {
    //获取server配置文件
    let servers = configReader.getServersConfig();
    //初始化当前服务器
    let mine;
    for (let i = 0, len = servers.length; i < len; i++) {
        if (servers[i].id === serverId) {
            mine = servers[i];
        }
    }
    console.log('use server');
    return { servers: servers, mine: mine };
};

//获取当前服务器id，并且初始化web服务
const currentServerId = getCurrentServerId();
const appInfo = initAppInfo(currentServerId);

//初始化进程相关信息
process.appInfo = appInfo;

//服务
//引入第三方模块
const koa = require('koa');
const koa_router = require('koa-router');
const koa_body = require('koa-body');
const koa_compress = require('koa-compress');
const koa_cors = require('koa-cors');
const koa_helmet = require('koa-helmet');
const koa_session = require('koa-session');
//引入自定义中间件模块
const counter = require('./app/middleware/counter');
const errorHandler = require('./app/middleware/errorHandler');
const resultWrapper = require('./app/middleware/resultWrapper');
//引入自定义数据库模块
const mysqlHelper = require('./app/dao/mysql/base/mysql');
const redisHelper = require('./app/dao/redis/base/redis');
//引入路由模块
const initRouter = require('./app/router');
//日志
const commonLogger = require('./logger/func/logger')(__filename).commonLogger;

//创建web服务
const createApp = () => {
    const app = new koa();
    //初始化数据库
    app.context.mysqlHelper = new mysqlHelper();
    app.context.redisHelper = new redisHelper();
    //配置session
    app.keys = ['back-end'];
    const options = {
        key: 'v3:sess',
        maxAge: 60 * 60 * 24,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false
    };
    //redis session存储
    let store = {
        maxAge: 60 * 60 * 8,
        async get(key, maxAge) {
            let data = await app.context.redisHelper.get(key).then((sess) => {
                return JSON.parse(sess);
            });
            app.context.redisHelper.expire(key, this.maxAge);
            return data;
        },
        set(key, sess, maxAge) {
            app.context.redisHelper.set(key, JSON.stringify(sess), this.maxAge);
        },
        destroy(key) {
            app.context.redisHelper.del(key);
        }
    };
    app.use(koa_session({ options, store }, app));
    //压缩数据
    app.use(koa_compress());
    //配置请求体 
    app.use(koa_body({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024
        }
    }));
    //跨域
    app.use(koa_cors());
    //安全
    app.use(koa_helmet());
    //自定义中间件
    app.use(counter);
    app.use(resultWrapper);
    app.use(errorHandler);
    //注册路由
    const router = new koa_router({ prefix: "/v3" });
    new initRouter(router);
    app.use(router.routes());
    //异常处理
    app.on('error', (error, ctx) => {
        console.log(`app error catch${error}`);
    });
    return app;
}

//监听启动web服务
const webApp = createApp();
webApp.listen(process.appInfo.mine.httpPort, () => {
    console.log("http server start success pid:", process.pid);
});

//进程错误处理
process.on("uncaughtException", (error) => {
    console.log(`exception:${error.stack}`);
})