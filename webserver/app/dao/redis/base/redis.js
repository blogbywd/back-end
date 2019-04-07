const redis = require('ioredis');
const readConfig = require('../../../util/configReader');

const redisHelper = function () {
    //读取配置文件
    const configs = readConfig.getRedisConfig();
    //获取redis重连延迟时间
    configs.retryStrategy = (time) => {
        let delay = Math.min(time * 50, 2000);
        return delay;
    }
    //redis重新连接出错处理
    configs.reconnectOnError = (error) => {
        console.log(`redis reconnect error${error.message}`);
        let targetError = 'READONLY';
        if (error.message.slice(0, targetError.length) === targetError) {
            return true;
        }
    }
    //创建redis客户端
    let client = new redis(configs[0]);
    //客户端错误
    client.on('error', (error) => {
        console.log(`redis error:${error}`);
    });
    this.client = client;
};

module.exports = redisHelper;

//redis数据库操作封装方法

//key
redisHelper.prototype.getKeysBySubName = function (subName) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.keys(subName + "*", function (error, res) {
            if (!!error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.existsKey = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.exists(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.del = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.del(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.cleanUpAll = function () {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.flushdb(function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//string
redisHelper.prototype.set = function (key, value, ex) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        if (!!ex) {
            client.set(key, value, "EX", ex, function (err, res) {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        } else {
            client.set(key, value, function (err, res) {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        }
    });
};

// 更新key的ttl
redisHelper.prototype.expire = function (key, ex) {
    let client = this.client;
    return new Promise((resolve, reject) => {
        client.expire(key, ex, (err, res) => {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

redisHelper.prototype.get = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.get(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//hash
redisHelper.prototype.setObject = function (key, object) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.hmset(key, object, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.setFieldForObject = function (key, field, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.hset(key, field, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.getObject = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.hgetall(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.getFieldForObject = function (key, field) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.hget(key, field, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//set
redisHelper.prototype.addToSet = function (key, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.sadd(key, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.getAllFromSet = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.smembers(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.countOfSet = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.scard(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.removeFromSet = function (key, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.srem(key, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.randomPopFromSet = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.spop(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//sortedSet
redisHelper.prototype.addToSortedSet = function (key, scoreValueArray) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zadd(key, scoreValueArray, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.countOfSortedSet = function (list) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zcard(list, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//from max to min
redisHelper.prototype.getFromSortedSetByMaxAndMin = function (list, max, min) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zrevrangebyscore(list, max, min, "WITHSCORES", function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//from max to min
redisHelper.prototype.getAllFromSortedSet = function (list) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zrevrange(list, 0, -1, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.removeFromSortedSet = function (list, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zrem(list, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.getScoreFromSortedSet = function (list, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zrem(list, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//from max to min
redisHelper.prototype.getRankFromSortedSet = function (list, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.zrevrank(list, value, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

//list
redisHelper.prototype.leftPopFromList = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.lpop(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.rightPushToList = function (key, value) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.lpop(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

redisHelper.prototype.getListLength = function (key) {
    let client = this.client;
    return new Promise(function (resolve, reject) {
        client.llen(key, function (err, res) {
            if (!!err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};