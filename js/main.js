document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const typeBtns = document.querySelectorAll('.type-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const numberList = document.getElementById('number-list');
    const summary = document.getElementById('summary');

    // 当前选中的投注类型
    let currentType = 'normal';

    // 切换投注类型
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            switchBetType(type);
        });
    });

    // 生成号码
    generateBtn.addEventListener('click', generateNumbers);

    // 重置
    resetBtn.addEventListener('click', reset);

    // 切换投注类型函数
    function switchBetType(type) {
        // 更新按钮状态
        typeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // 显示对应参数区域
        document.querySelectorAll('.params-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`${type}-params`).classList.remove('hidden');

        currentType = type;
    }

    // 生成号码函数
    function generateNumbers() {
        try {
            let result;
            switch (currentType) {
                case 'normal':
                    const count = parseInt(document.getElementById('normal-count').value);
                    result = generateNormal(count);
                    break;
                case 'multiple':
                    const multipleCount = parseInt(document.getElementById('multiple-count').value);
                    const redCount = parseInt(document.getElementById('multiple-red').value);
                    const blueCount = parseInt(document.getElementById('multiple-blue').value);
                    result = generateMultiple(multipleCount, redCount, blueCount);
                    break;
                case 'dantuo':
                    const danStr = document.getElementById('dantuo-dan').value.trim();
                    const tuoStr = document.getElementById('dantuo-tuo').value.trim();
                    const blueCnt = parseInt(document.getElementById('dantuo-blue').value);
                    
                    if (!danStr) {
                        throw new Error('请输入胆码');
                    }
                    
                    const danma = danStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                    result = generateDanTuo(danma, tuoStr, blueCnt);
                    break;
            }

            displayResult(result);
        } catch (error) {
            alert(error.message);
        }
    }

    // 展示结果函数
    function displayResult(result) {
        // 清空之前的结果
        numberList.innerHTML = '';
        
        // 展示号码
        result.numbers.forEach((num, index) => {
            const div = document.createElement('div');
            div.className = 'number-item';
            
            // 解析号码字符串并创建球形展示
            const parts = num.split('|');
            const redPart = createBallSpans(parts[0], 'red-ball');
            const bluePart = createBallSpans(parts[1], 'blue-ball');
            
            div.innerHTML = `第${index + 1}注：${redPart} | ${bluePart}`;
            numberList.appendChild(div);
        });

        // 展示统计信息
        summary.innerHTML = `
            <p>总注数：${result.total}注</p>
            <p>总金额：${result.amount}元</p>
        `;
    }

    // 创建球形展示
    function createBallSpans(numberStr, className) {
        return numberStr.match(/\d{2}/g)
            .map(num => `<span class="${className}">${num}</span>`)
            .join(' ');
    }

    // 重置函数
    function reset() {
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'number') {
                input.value = input.min || '1';
            } else {
                input.value = '';
            }
        });
        numberList.innerHTML = '';
        summary.innerHTML = '';
    }

    // 添加输入验证
    document.getElementById('normal-count').addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });

    document.getElementById('multiple-count').addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });

    document.getElementById('multiple-red').addEventListener('change', function() {
        if (this.value < 6) this.value = 6;
        if (this.value > 33) this.value = 33;
    });

    document.getElementById('multiple-blue').addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 16) this.value = 16;
    });

    document.getElementById('dantuo-blue').addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 16) this.value = 16;
    });
});

// 生成函数实现
function generateNormal(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const redBalls = getRandomNumbers(1, 33, 6).sort((a, b) => a - b);
        const blueBall = getRandomNumbers(1, 16, 1)[0];
        
        // 格式化号码
        const redStr = redBalls.map(num => formatNumber(num)).join(' ');
        const blueStr = formatNumber(blueBall);
        
        results.push(`红球：${redStr} | 蓝球：${blueStr}`);
    }
    
    return {
        numbers: results,
        total: count,
        amount: count * 2
    };
}

function generateMultiple(count, redCount, blueCount) {
    if (redCount < 6 || redCount > 33) throw new Error('红球数量必须在6-33之间');
    if (blueCount < 1 || blueCount > 16) throw new Error('蓝球数量必须在1-16之间');
    
    const results = [];
    for (let i = 0; i < count; i++) {
        const redBalls = getRandomNumbers(1, 33, redCount).sort((a, b) => a - b);
        const blueBalls = getRandomNumbers(1, 16, blueCount).sort((a, b) => a - b);
        
        const redStr = redBalls.map(num => formatNumber(num)).join(' ');
        const blueStr = blueBalls.map(num => formatNumber(num)).join(' ');
        
        results.push(`红球：${redStr} | 蓝球：${blueStr}`);
    }
    
    const total = count * combination(redCount, 6) * blueCount;
    
    return {
        numbers: results,
        total: total,
        amount: total * 2
    };
}

function generateDanTuo(danma, tuoInput, blueCount) {
    // 参数验证
    if (!Array.isArray(danma) || danma.length < 1 || danma.length > 5) {
        throw new Error('胆码数量必须在1-5之间');
    }
    if (blueCount < 1 || blueCount > 16) {
        throw new Error('蓝球数量必须在1-16之间');
    }

    // 如果没有输入拖码，随机生成所需数量的拖码
    let tuoma = [];
    if (!tuoInput || tuoInput.trim() === '') {
        const neededCount = 6 - danma.length; // 需要的最少拖码数
        // 随机生成比最少数量多1-2个的拖码
        const randomCount = neededCount + Math.floor(Math.random() * 2) + 1;
        const availableNumbers = Array.from({length: 33}, (_, i) => i + 1)
            .filter(n => !danma.includes(n));
        tuoma = getRandomNumbers(1, 33, randomCount)
            .filter(n => !danma.includes(n))
            .sort((a, b) => a - b);
    } else {
        tuoma = tuoInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }

    if (danma.length + tuoma.length < 6) {
        throw new Error('胆码+拖码数量必须大于等于6');
    }

    // 验证胆码和拖码是否有重复
    const allNumbers = [...danma, ...tuoma];
    if (new Set(allNumbers).size !== allNumbers.length) {
        throw new Error('胆码和拖码不能重复');
    }

    // 生成蓝球
    const blueBalls = getRandomNumbers(1, 16, blueCount).sort((a, b) => a - b);
    
    // 格式化号码
    const danFormatted = danma.sort((a, b) => a - b).map(num => formatNumber(num)).join(' ');
    const tuoFormatted = tuoma.sort((a, b) => a - b).map(num => formatNumber(num)).join(' ');
    const blueFormatted = blueBalls.map(num => formatNumber(num)).join(' ');
    
    const total = combination(tuoma.length, 6 - danma.length) * blueCount;
    
    return {
        numbers: [`胆码：${danFormatted} 拖码：${tuoFormatted} | 蓝球：${blueFormatted}`],
        total: total,
        amount: total * 2
    };
}