// 使用二分查找返回下一个hash值的索引

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


const list = [1, 2, 5, 9, 20, 30, 50, 100];

console.log(query(list, 0, list.length-1, 40))
