const crypto = require('crypto');

const find = require('./find')

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

class Hash {
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
        const index = find(this.keys, 0, this.keys.length - 1, hash)
        return this.hashMap.get(this.keys[index])
    }
}

module.exports = Hash