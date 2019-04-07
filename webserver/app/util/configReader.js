const configReader = module.exports;

//获取配置文件路径--公共方法
const readConfig = (fileName) => {
    //项目运行环境名称
    const envName = require('../../config/env.json').name;
    //获取配置文件的路径
    const configPath = `../../config/env/${envName}/${fileName}`;
    return require(configPath);
};

//获取servers配置文件路径
configReader.getServersConfig = () => {
    return readConfig('servers.json');
};

//获取mysql配置文件路径
configReader.getMysqlConfig = () => {
    return readConfig('mysql.json');
};

//获取redis配置文件路径
configReader.getRedisConfig = () => {
    return readConfig('redis.json');
};

