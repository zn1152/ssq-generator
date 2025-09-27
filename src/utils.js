// utils.js
// 该文件包含辅助函数，用于生成随机号码和格式化输出

/**
 * 工具函数：getRandomNumbers, formatNumbers
 * - getRandomNumbers：使用 Fisher–Yates 随机打乱并返回指定数量的不重复整数
 * - formatNumbers：将数字数组格式化为两位补零的字符串（不带任何标签），返回字符串
 *
 * 重要：formatNumbers 不应该在内部打印或返回 undefined；应返回字符串供调用方（generate.js）拼接标签。
 */

/**
 * 生成不重复的随机整数数组（闭区间 [min, max]）
 * 使用 Fisher–Yates 洗牌保证均匀随机与去重
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @param {number} count - 需要的个数
 * @returns {number[]} 指定数量的不重复随机整数
 */
function getRandomNumbers(min, max, count) {
    if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count)) {
        throw new TypeError('min, max, count 必须为整数');
    }
    if (min > max) {
        throw new RangeError('min 不能大于 max');
    }
    const range = max - min + 1;
    if (count < 1 || count > range) {
        throw new RangeError('count 必须在 1 和 (max-min+1) 之间');
    }

    // 构造顺序数组 [min, min+1, ..., max]
    const pool = [];
    for (let v = min; v <= max; v++) pool.push(v);

    // Fisher–Yates 洗牌（只需要前 count 个，效率已足够）
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = pool[i];
        pool[i] = pool[j];
        pool[j] = tmp;
    }

    // 返回前 count 个元素（调用方决定是否排序）
    return pool.slice(0, count);
}

/**
 * 将数字数组格式化为两位补零并以空格分隔的字符串
 * 不包含“红球：”或“蓝球：”等标签，调用方负责添加标签
 * @param {number[]} arr - 要格式化的数字数组
 * @returns {string} 例如 "05 12 18 23 29 32"
 */
function formatNumbers(arr) {
    if (!Array.isArray(arr)) return '';
    return arr
        .map(n => {
            if (!Number.isInteger(n)) return '';
            return String(n).padStart(2, '0');
        })
        .join(' ');
}

/**
 * 计算组合数 C(n,m)
 * @param {number} n - 总数
 * @param {number} m - 选择数
 * @returns {number} 组合数
 */
function combination(n, m) {
    if (m > n) return 0;
    if (m === 0 || m === n) return 1;
    if (m > n / 2) m = n - m;
    
    let result = 1;
    for (let i = 1; i <= m; i++) {
        result *= (n - i + 1) / i;
    }
    return Math.round(result);
}

// 导出辅助函数
module.exports = {
    getRandomNumbers,
    formatNumbers,
    combination
};