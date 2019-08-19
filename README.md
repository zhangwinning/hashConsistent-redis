# 利用hash一致性把不同分类的数据，存储到redis集群, 把不同的分类作为hash一致性的key 。

example:
```
    const MultiRedis = require('../lib/redis')
    const address = [
        { host: '127.0.0.1', port: 6379 },
        { host: '127.0.0.1', port: 6380 }
    ];
    const redises = new MultiRedis(address)
    const key = '分组'
    const client = redises.client(key)
    client.set('002', 'test01')

    client.get('002', (err, value) => {
        assert(value, 'test01')
        process.exit(0)
    })
```

redis 分布式集群存储是通过计算每个存储值的hash值查找server。本文通过每个分组作为key进行hash 计算从hash ring 中查找。

对于**分类比较多**的热缓存数据来说，可以使用。

本质上原理是利用的[一致性hash](https://github.com/zhangwinning/hashConsistent-redis/blob/master/lib/README.md)，
上文是通过简短代码实现的一致性hash原理。
