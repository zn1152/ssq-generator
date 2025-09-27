// src/generate.js

/**
 * 随机生成中国福利彩票双色球号码的工具
 * 
 * 该文件包含一个函数 `generateSSQ`，用于生成指定注数的双色球号码。
 * 红球从1-33中随机选择6个不重复的号码，并按从小到大排序。
 * 蓝球从1-16中随机选择1个号码。
 */

const { getRandomNumbers, formatNumbers, combination } = require('./utils');

/**
 * 生成普通投注号码
 * @param {number} count 注数
 * @returns {{numbers: string[], total: number, amount: number}}
 */
function generateNormal(count = 1) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const redBalls = getRandomNumbers(1, 33, 6).sort((a, b) => a - b);
        const blueBall = getRandomNumbers(1, 16, 1)[0];
        results.push(`第${i + 1}注：红球：${formatNumbers(redBalls)} | 蓝球：${formatNumbers([blueBall])}`);
    }
    return {
        numbers: results,
        total: count,
        amount: count * 2
    };
}

/**
 * 生成复式投注号码
 * @param {number} redCount 红球数量(6-33)
 * @param {number} blueCount 蓝球数量(1-16)
 * @returns {{numbers: string[], total: number, amount: number}}
 */
function generateMultiple(redCount, blueCount) {
    if (redCount < 6 || redCount > 33) throw new Error('红球数量必须在6-33之间');
    if (blueCount < 1 || blueCount > 16) throw new Error('蓝球数量必须在1-16之间');

    const redBalls = getRandomNumbers(1, 33, redCount).sort((a, b) => a - b);
    const blueBalls = getRandomNumbers(1, 16, blueCount).sort((a, b) => a - b);
    
    const total = combination(redCount, 6) * blueCount;
    
    return {
        numbers: [`复式：红球：${formatNumbers(redBalls)} | 蓝球：${formatNumbers(blueBalls)}`],
        total,
        amount: total * 2
    };
}

/**
 * 生成胆拖投注号码
 * @param {number[]} danma 胆码数组(1-5个)
 * @param {number[]} tuoma 拖码数组
 * @param {number} blueCount 蓝球数量(1-16)
 * @returns {{numbers: string[], total: number, amount: number}}
 */
function generateDanTuo(danma, tuoma, blueCount) {
    if (danma.length < 1 || danma.length > 5) throw new Error('胆码数量必须在1-5之间');
    if (danma.length + tuoma.length < 6) throw new Error('胆码+拖码数量必须大于等于6');
    if (blueCount < 1 || blueCount > 16) throw new Error('蓝球数量必须在1-16之间');

    const blueBalls = getRandomNumbers(1, 16, blueCount).sort((a, b) => a - b);
    const total = combination(tuoma.length, 6 - danma.length) * blueCount;

    return {
        numbers: [`胆拖：胆码：${formatNumbers(danma.sort((a,b) => a-b))} 拖码：${formatNumbers(tuoma.sort((a,b) => a-b))} | 蓝球：${formatNumbers(blueBalls)}`],
        total,
        amount: total * 2
    };
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log(`
双色球号码生成器使用说明：
1. 普通投注：node generate.js normal [注数]
   示例：node generate.js normal 5

2. 复式投注：node generate.js multiple <红球数> <蓝球数>
   示例：node generate.js multiple 7 2

3. 胆拖投注：node generate.js dantuo <胆码列表> <拖码列表> <蓝球数>
   示例：node generate.js dantuo "1,2,3" "4,5,6,7,8" 2

注意：所有投注均为2元/注
    `);
}

/**
 * 主函数：解析命令行参数并执行相应功能
 */
function main() {
    const args = process.argv.slice(2);
    const type = args[0];

    try {
        let result;
        switch (type) {
            case 'normal':
                const count = parseInt(args[1]) || 1;
                result = generateNormal(count);
                break;
            
            case 'multiple':
                const redCount = parseInt(args[1]);
                const blueCount = parseInt(args[2]);
                result = generateMultiple(redCount, blueCount);
                break;
            
            case 'dantuo':
                const danma = args[1].split(',').map(Number);
                const tuoma = args[2].split(',').map(Number);
                const blueCnt = parseInt(args[3]);
                result = generateDanTuo(danma, tuoma, blueCnt);
                break;
            
            default:
                showHelp();
                return;
        }

        console.log('\n==== 双色球号码 ====');
        result.numbers.forEach(num => console.log(num));
        console.log(`\n总注数：${result.total}注`);
        console.log(`总金额：${result.amount}元`);
        console.log('\n免责声明：本工具仅供娱乐，购彩需理性。');

    } catch (error) {
        console.error('\n错误：', error.message);
        showHelp();
    }
}

// 当作为主模块运行时执行
if (require.main === module) {
    main();
}

module.exports = {
    generateNormal,
    generateMultiple,
    generateDanTuo
};