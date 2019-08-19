let redis = require('redis')
const hash = require('./hash')

/**
 * 使用hash一致性分发数据到不同的redis实例
 */
class multiRedis {
    constructor(redises) {
        this.redises = redises || [{ host: '127.0.0.1', port: 6379 }];
        const keys = redises.map(redis => {
            return [redis.host, redis.port].join(':');
        })
        this.clients = keys.reduce(function(clients, key){
            var pieces = key.split(':'); 
            clients[key] = redis.createClient(pieces[1], pieces[0]);
            return clients
        }, {})
        this.hash = this.__initHash(keys)
    }

    /**
     * 初始化 hash 函数
     * @param {*} keys 
     */
    __initHash(keys) {
        hash.add(...keys)
        return hash
    }

    client(key) {
        return this.clients[this.hash.get(key)]
    }
}
