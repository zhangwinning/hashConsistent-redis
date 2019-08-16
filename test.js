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

// const buffer = digest('哈哈')
// console.log('===>', buffer)
// const key = '哈哈'
// console.log('======>', __generate(key), __generate(key).toString().length)

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
        // keys 排好序
        this.keys.sort(sortNumber)
    }

    get(key) {
        if (this.keys.length === 0) {
            return null
        }
        const hash = __generate(key)

        //  this.keys 存放的是节点
        const index = query(this.keys, 0, this.keys.length - 1, hash)

        console.log('=====>', hash, index, this.keys[index])
        return this.hashMap.get(this.keys[index])
    }
}

// 二分查找
function query(list, left, right, value) {
    let index;
    if (left <= right) {
        const mid = parseInt((left + right) / 2);
        if (value === list[mid]) {
            index = mid;
        //    最后一个
        } else if (value > list[mid] && mid === list.length - 1) {
            index = 0;
        //
        } else if (value > list[mid] && value <= list[mid + 1]) {
            index = mid + 1;
        } else if (value > list[mid + 1]) {
            index = query(list, mid + 1, right, value);
        } else if (value < list[mid] && mid === 0){
            index = mid
        } else if (value < list[mid] && value >= list[mid - 1]) {
            index = mid
        }else if (value < list[mid - 1]) {
            index = query(list, left, mid - 1, value);
        }
    }
    return index;
}

// 使用二分查找返回

const hash = new __Hash()

hash.add("6", "4", "2")


console.log('====>', hash.keys, hash.hashMap, hash.get('haah'))