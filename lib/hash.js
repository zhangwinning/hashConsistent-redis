const crypto = require('crypto');

/**
 * Generate the hash of the value.
 *
 * @api private
 */
function hashValueHash(a, b, c, d) {
    return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

/**
 * Digest hash so we can make a numeric representation from the hash.
 *
 * @param {String} key The key that needs to be hashed.
 * @returns {Array}
 * @api private
 */
function digest(key) {
    let hash = crypto.createHash('md5').update(key).digest();
    if ('string' !== typeof hash) return hash;
    return hash.split('').map(function charCode(char) {
      return char.charCodeAt(0);
    });
};

/**
 * 产生hash值
 * @param {*} x
 */
function __generate(key) {
    const x = digest(key)
    return hashValueHash(x[0], x[3], x[7], x[15]);
}

function sortNumber(a,b){
    return a - b
}

class __Hash {
    constructor() {
        this.keys = []
        this.hashMap = new Map()
    }

    add(...keys) {
        for(let i = 0 ; i < keys.length; i++) {
            const key = keys[i]
            const hash = __generate(key)
            this.keys.push(hash)
            this.hashMap.set(hash, key)
        }
        this.keys.sort(sortNumber)  // 排好序，方便下面的二分搜索
    }

    get(key) {
        if (this.keys.length === 0) {
            return null
        }
        const hash = __generate(key)

        //  this.keys 存放的是节点
        const index = query(this.keys, 0, this.keys.length - 1, hash)
        return this.hashMap.get(this.keys[index])
    }
}



let index = 0
// 在一个排好序的数组中到右边离他最近的数值。
// 切到不能再切，满足要求的最后一个元素，就是想要的元素
function query(list, left, right, value) {
    if (left <= right) {
        const mid = parseInt((left + right) / 2);
        if (value < list[mid]) {
            index = mid;
            query(list, left, mid - 1, value);
        } else {
            query(list, mid + 1, right, value);
        }
    }
    return index;
}

module.exports = new __Hash()

// const hash = new __Hash()

// hash.add("127.0.0.1:6380", "127.0.0.1:6381", "127.0.0.1:6382")

// // hash.add("")

// console.log('====>', hash.keys, hash.hashMap, hash.get('testkey'))
