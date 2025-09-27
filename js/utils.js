/**
 * 工具函数集合
 */

// 生成指定范围内的随机不重复整数数组
function getRandomNumbers(min, max, count) {
    if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count)) {
        throw new TypeError('参数必须为整数');
    }
    if (min > max) {
        throw new RangeError('最小值不能大于最大值');
    }
    const range = max - min + 1;
    if (count < 1 || count > range) {
        throw new RangeError('数量超出范围');
    }

    const pool = Array.from({length: range}, (_, i) => min + i);
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

// 格式化数字为两位数字符串
function formatNumber(num) {
    return String(num).padStart(2, '0');
}

// 计算组合数
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