const mysql = require('mysql');
//引入自定义工具模块
const configReader = require('../../../util/configReader');

//创建mysql连接池
const createPool = (mysqlConfig) => {
    let dbConfig = {};
    dbConfig.host = mysqlConfig['host'];
    dbConfig.port = mysqlConfig['port'];
    dbConfig.database = mysqlConfig['database'];
    dbConfig.user = mysqlConfig['user'];
    dbConfig.password = mysqlConfig['password'];
    dbConfig.connectionLimit = 20;
    //创建mysql连接池
    return mysql.createPool(dbConfig);
};

//mysql异步查询
const queryPromise = function (pool, sqlString, args) {
    return new Promise(function (resolve, reject) {
        //获取数据库连接
        pool.getConnection(function (error, connection) {
            if (error) {
                reject(error);
                return;
            }
            //封装查询sql
            const queryObj = {
                sql: sqlString,
                timeout: 40 * 1000,
                values: args
            };
            //进行查询
            connection.query(queryObj, function (error, res) {
                //释放数据库连接
                pool.releaseConnection(connection);
                if (error) {
                    reject(error);
                } else {
                    resolve(res);
                }
            });
        });
    });
};

//创建mysql连接池
const mysqlHelper = function () {
    //mysql配置文件
    const dbArray = configReader.getMysqlConfig();
    this.dbPool = createPool(dbArray[0]);
};

//mysql查询
mysqlHelper.prototype.userQueryPromise = function (sqlString, args) {
    return queryPromise(this.dbPool, sqlString, args);
};

module.exports = mysqlHelper;