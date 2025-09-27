// src/generate.js

/**
 * 随机生成中国福利彩票双色球号码的工具
 * 
 * 该文件包含一个函数 `generateSSQ`，用于生成指定注数的双色球号码。
 * 红球从1-33中随机选择6个不重复的号码，并按从小到大排序。
 * 蓝球从1-16中随机选择1个号码。
 */

const { getRandomNumbers, formatNumbers } = require('./utils');

/**
 * 生成双色球号码
 * @param {number} count - 生成的注数，默认为1注
 */
function generateSSQ(count = 1) {
    const results = [];

    for (let i = 0; i < count; i++) {
        // 生成红球号码
        const redBalls = getRandomNumbers(1, 33, 6);
        // 生成蓝球号码
        const blueBall = getRandomNumbers(1, 16, 1)[0];

        // 格式化输出
        const formattedRedBalls = formatNumbers(redBalls.sort((a, b) => a - b));
        const formattedBlueBall = formatNumbers([blueBall]);

        results.push(`第${i + 1}注：红球：${formattedRedBalls} | 蓝球：${formattedBlueBall}`);
    }

    // 输出结果
    console.log(results.join('\n'));
}

// 导出函数以供其他模块使用
module.exports = generateSSQ;

// ========== CLI 支持：允许通过 `node src/generate.js [注数]` 直接执行 ==========
// 当此文件作为主模块执行时（而非被 require），解析命令行参数并调用 generateSSQ。
// 例如：`node src/generate.js` 会生成 1 注；`node src/generate.js 5` 会生成 5 注。
if (require.main === module) {
    const arg = process.argv[2];
    const count = arg ? parseInt(arg, 10) : 1;

    if (isNaN(count) || count < 1) {
        console.error('错误：注数必须为正整数，例如：node src/generate.js 5');
        process.exit(1);
    }

    generateSSQ(count);
}