
/**
 * 在一个排好序的数组中到右边离他最近的数值。
 * 切到不能再切，满足要求的最后一个元素，就是想要的元素
 * 二分查找一个应用
 * @param {*} list 
 * @param {*} left 
 * @param {*} right 
 * @param {*} value 
 */
let index = 0
function find(list, left, right, value) {
    if (left <= right) {
        const mid = parseInt((left + right) / 2);
        if (value <= list[mid]) {
            index = mid;
            find(list, left, mid - 1, value);
        } else {
            find(list, mid + 1, right, value);
        }
    }
    return index;
}

module.exports = find