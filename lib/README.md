# Hash一致性

#### 概述
在分布式开发中，往往需要把数据分开存储。既然是分开存储，每个分片中可能只存储整个数据的一部分。这种情况下，如果添加一个数据、或者查找一个数据
可以使用取模Hash操作。

比如现在有4台存储机器，就可以把需要操作的数据先取hash值，为什么要取hash值，因为hash函数具有随机性、均匀性。可以使得存储的数据取完hash值后，很
均匀的分布在一个区域内。

比如添加 A 字符。 [hash(A) % 4] 这样就可以得出 A 字符放在哪台机器了。取出是同样的原理，也是取模。
```
 server = serverList[hash(A) % 4]

```

如果就是4台机器正常运转是没问题的，但是如果某天4台机器存储不下当前的数据了，需要新增加一台。后序的数据可以正常取模进入正常的机器，但是原来的数据应该如何处理的？或者现在减少了某台机器。历史数据该如何处理？

如果使用这种方式，加减机器处理时全量数据操作。

这时候就该一致性 hash 登场了。一致性 hash 可以解决这个问题。
#### 一、原理
1、把 0-2^32-1这 2^32个数均匀的分布在一个环上。我们称这个环为 hash ring(hash 环)。

2、然后把这4台机器通过计算 hash 值在相应的环上找到相应的位置，如图所示

![hash-ring](https://github.com/zhangwinning/hashConsistent-redis/blob/master/assert/hashRing.png)

3、给你一个任意 key，如果计算范围是在红色区域之内，则是机器1负责，就把该数据放到机器1上。同理，机器2、3、4也是相同的逻辑。

以上就是Hash 一致性的原理。

但是它是如何解决机器数量增减呢？

比如现在增加一台机器5，我们通过 hash 值计算是在机器1、4之间，接下来要移动的数据就是把机器1的部分数据移到机器5上。其余机器的数据不变，这和通过
取模运算移动全部数据相比，效率是大大提升的。

![add-machine](https://github.com/zhangwinning/hashConsistent-redis/blob/master/assert/WX20190819-174842%402x.png)

比如现在机器2出现了问题，把机器2的数据迁移到机器3上去，其余机器不收影响。

![remove-machine](https://github.com/zhangwinning/hashConsistent-redis/blob/master/assert/WX20190819-175933%402x.png)

#### 二、负载均衡
在实际应用中，每个服务器可以映射到多个节点到 hash 环上，这些节点称之为**虚拟节点**。

比如某个机器1的性能比较差，那就分配少一点的虚拟节点,某些机器性能超强，那就分配较多的虚拟节点。通过配置，完成负载均衡。

#### 三、实现
[consistent-hashing-algorithmic](https://medium.com/@dgryski/consistent-hashing-algorithmic-tradeoffs-ef6b8e2fcae8)文章
介绍了一种简单的 [golang](https://github.com/golang/groupcache) 实现方式。下面通过 golang 这种方式实现了一种[js](https://github.com/zhangwinning/hashConsistent-redis/tree/master/lib/hash)的实现方式。

其中是通过[二分查找](https://github.com/zhangwinning/hashConsistent-redis/tree/master/lib/hash/find)的方式找到每个节点(服务器)在环上的位置。
