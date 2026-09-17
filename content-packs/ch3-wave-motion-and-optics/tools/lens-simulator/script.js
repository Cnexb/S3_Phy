// 獲取canvas元素和上下文
// Get canvas element and context
const canvas = document.getElementById('lensCanvas');
const ctx = canvas.getContext('2d');

function isS3phyEmbed() {
    return document.documentElement.classList.contains('s3phy-embed');
}

let currentLang = 'zh';

const STRINGS = {
    zh: {
        title: '透鏡光學模擬器',
        titleConvex: '凸透鏡光學模擬器',
        titleConcave: '凹透鏡光學模擬器',
        convexLens: '⛶ 凸透鏡',
        concaveLens: '⫽ 凹透鏡',
        drag: '拖動',
        objectDistanceLabel: '物距',
        imageDistanceLabel: '像距',
        screenLabel: '屏幕',
        realImage: '實像',
        virtualImage: '虛像',
        infinity: '無窮遠',
        erect: '正立',
        inverted: '倒立',
        sameSize: '等大',
        magnified: '放大',
        diminished: '縮小',
        noImageParallel: '不成像 (光線平行)',
    },
    en: {
        title: 'Lens Simulator',
        titleConvex: 'Convex Lens Simulator',
        titleConcave: 'Concave Lens Simulator',
        convexLens: '⛶ Convex lens',
        concaveLens: '⫽ Concave lens',
        drag: 'Drag',
        objectDistanceLabel: 'Object Distance',
        imageDistanceLabel: 'Image Distance',
        screenLabel: 'Screen',
        realImage: 'Real Image',
        virtualImage: 'Virtual Image',
        infinity: 'Infinity',
        erect: 'Erect',
        inverted: 'Inverted',
        sameSize: 'Same Size',
        magnified: 'Magnified',
        diminished: 'Diminished',
        noImageParallel: 'No Image (Parallel Rays)',
    },
};

function hubLangToLocal(hubLang) {
    if (hubLang === 'zh-Hant' || hubLang === 'zh') return 'zh';
    return 'en';
}

function setLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'en';
}

function initLangFromLocation() {
    const lang = new URLSearchParams(location.search).get('lang');
    if (lang) setLang(hubLangToLocal(lang));
}

function bindHubLangSync() {
    window.addEventListener('message', (ev) => {
        if (ev.data?.type !== 's3phy:lang') return;
        const next = hubLangToLocal(ev.data.lang);
        if (next === currentLang) return;
        setLang(next);
        refreshLangUi();
    });
}

function t(key) {
    return STRINGS[currentLang][key] ?? key;
}

function applyDocumentTitle() {
    const key = state.lensType === 'concave' ? 'titleConcave' : 'titleConvex';
    document.title = t(key);
}

function updateLensTypeText() {
    const el = document.getElementById('lensTypeText');
    if (!el) return;
    el.textContent = state.lensType === 'concave' ? t('concaveLens') : t('convexLens');
}

function refreshLangUi() {
    applyDocumentTitle();
    updateLensTypeText();
    updateMeasurements();
    draw();
}

// 定义全局变量
// Define global variables — pixelsPerCm is rescaled in embed mode to fit the canvas
let pixelsPerCm = 10; // 每厘米对应的像素数 // Pixels per centimeter
const studentHeight = 60; // 学生图像高度 // Student image height
const arrowHeight = 60; // 箭头高度 // Arrow height

// Keep ray diagram + object within ~85% of half canvas height (typical max magnification buffer)
function syncPixelsPerCm() {
    const h = canvas.height;
    const w = canvas.width;
    if (h < 48 || w < 48) {
        pixelsPerCm = 10;
        return;
    }
    const halfH = h / 2;
    const margin = 16;
    const embed = isS3phyEmbed();
    const tallEmbed = embed && h >= 520;
    const maxVertCm = embed ? (tallEmbed ? 20 : 18) : 32;
    const maxPpc = embed ? (tallEmbed ? 24 : 20) : 10;
    const minPpc = embed ? 5 : 3;
    const ppc = Math.min(maxPpc, Math.max(minPpc, ((halfH - margin) * 0.85) / maxVertCm));
    pixelsPerCm = ppc;
}

// 設置canvas的尺寸以匹配其顯示尺寸
// Set canvas dimensions to match display size
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Full-page mode: keep legacy min height for grid. Embed: use container size only.
    if (!isS3phyEmbed()) {
        const minHeight = 700; // 70格 * 10像素/格
        if (canvas.height < minHeight) {
            canvas.height = minHeight;
        }
    }

    syncPixelsPerCm();
    draw(); // 當調整大小時重新繪製 // Redraw when resizing
}

// 頁面加載和窗口調整大小時調整canvas尺寸
// Adjust canvas size on page load and window resize
window.addEventListener('resize', resizeCanvas);

// 定義模擬器的狀態
// Define simulator state
const state = {
    objectType: 'arrow', // 'student' 或 'arrow' // 'student' or 'arrow'
    objectDistance: 30.0, // 修改为30.0厘米 // Modified to 30.0 cm
    focalLength: 7.5, // 修改焦距为7.5厘米 // Modified focal length to 7.5 cm
    lensPosition: 8.0, // 修改透镜位置为8.0厘米以便完整显示光线和像 // Modified lens position to 8.0 cm for better display
    objectPosition: -22.0, // 物体的绝对位置（相对于8.0的透镜位置） // Object's absolute position (relative to lens at 8.0)
    objectHeight: 9.0, // 物体高度（厘米），默认值改为9.0 cm
    lensType: 'convex', // 透鏡類型: 'convex'（凸透鏡）或 'concave'（凹透鏡）
    screenPosition: 15.0, // 投影屏幕位置（厘米）
    rules: {
        rule1: true, // 平行光線→經過焦點 // Parallel ray→Through focus
        rule2: true, // 通過中心的光線 // Ray through center
        rule3: true  // 經過焦點→平行光線 // Through focus→Parallel ray
    },
    display: {
        grid: true,
        measurements: true,
        image: true,
        screen: true, // 显示投影屏幕
        bundleRays: false // 显示光束
    }
};

// 計算像距，使用薄透鏡方程: 1/f = 1/p + 1/q
// Calculate image distance using thin lens equation: 1/f = 1/p + 1/q
function calculateImageDistance(objectDistance, focalLength) {
    // 根據透鏡類型調整焦距符號
    const effectiveFocalLength = state.lensType === 'convex' ? Math.abs(focalLength) : -Math.abs(focalLength);
    
    if (objectDistance === 0) {
        return Infinity; // 物體在透鏡上時，像距無窮大 // When object is on the lens, image distance is infinity
    }
    // 凸透鏡且物距等於焦距時，像距無窮大
    if (state.lensType === 'convex' && Math.abs(objectDistance) === Math.abs(focalLength)) {
        return Infinity; // 物距等於焦距時，像距無窮大 // When object distance equals focal length, image distance is infinity
    }
    
    // 凹透镜特殊处理
    if (state.lensType === 'concave') {
        // 凹透镜的像始终是虚像，像距为负值
        // 使用标准薄透镜公式：1/v = 1/f - 1/u
        // 注意：凹透镜的f为负值，而v为正值表示实像、负值表示虚像
        
        let result;
        
        // 考虑物体在透镜左侧或右侧的情况
        if (objectDistance < 0) {
            // 物体在右侧
            const absObjectDistance = Math.abs(objectDistance);
            // 薄透镜公式：v = u*f/(u-f)，f为负值
            // 对于凹透镜，当物体在右侧时，像应该在物体同侧（右侧）
            // 确保结果是负的（像在右侧，按照我们的坐标系，需要是负值）
            result = (effectiveFocalLength * absObjectDistance) / (absObjectDistance - effectiveFocalLength);
        } else {
            // 物体在左侧
            // 薄透镜公式：v = u*f/(u-f)，f为负值，确保结果为负值（虚像）
            result = (objectDistance * effectiveFocalLength) / (objectDistance - effectiveFocalLength);
        }
        
        // 確保結果精確到0.1厘米
        return parseFloat((Math.round(result * 10) / 10).toFixed(1));
    }
    
    // 以下是凸透镜的标准计算
    
    // 薄透鏡方程
    // 根據物體位置（相對於透鏡）計算像距
    let result;
    
    // 使用透镜方程 1/f = 1/u + 1/v，其中f为焦距，u为物距，v为像距
    // 求解v: v = u*f/(u-f)
    
    // 物體在右側時的處理 (u < 0)
    if (objectDistance < 0) {
        // 將物距轉為正值進行計算，但保持正確的物理意義
        const absObjectDistance = Math.abs(objectDistance);
        
        // 使用標準薄透鏡公式，注意焦距的符號
        result = -(effectiveFocalLength * absObjectDistance) / (absObjectDistance - effectiveFocalLength);
    } else {
        // 物體在左側，常規計算
        result = (objectDistance * effectiveFocalLength) / (objectDistance - effectiveFocalLength);
    }
    
    // 確保結果精確到0.1厘米
    return parseFloat((Math.round(result * 10) / 10).toFixed(1));
}

// 計算放大率: m = -q/p
// Calculate magnification: m = -q/p
function calculateMagnification(objectDistance, imageDistance) {
    // 物距為0時，放大率為無窮大
    if (objectDistance === 0) {
        return Infinity;
    }
    
    // 特殊情况：像距为无穷大（物距等于焦距）
    if (!isFinite(imageDistance)) {
        return Infinity; // 放大率为无穷大
    }
    
    // 凹透镜特殊处理：始终产生正立、缩小的虚像
    if (state.lensType === 'concave') {
        // 凹透镜的放大率计算：m = |v/u| < 1 (正值，表示正立、缩小)
        // 由于虚像的像距为负值，正常计算会得到正值放大率
        const m = Math.abs(imageDistance / objectDistance);
        return m; // 确保为正值
    }
    
    // 放大率計算統一使用公式 m = -v/u (其中v為像距, u為物距)
    // 不管物體在哪一側，統一使用 m = -v/u 公式
    return -imageDistance / objectDistance;
}

// 確定像的類型
function determineImageType(imageDistance, magnification) {
    let type = [];
    
    // 物距為0（物體在透鏡上）或物距等於焦距時，像距為無窮大
    if (!isFinite(imageDistance) || state.objectDistance === 0) {
        type.push(t('realImage'));
        type.push(t('infinity'));
        return type.join(', ');
    }
    
    // 實像/虛像判斷
    if (state.lensType === 'concave') {
        type.push(t('virtualImage'));
        type.push(t('erect'));
        type.push(t('diminished'));
        return type.join(', ');
    } else {
        if (state.objectDistance < 0) {
            if (Math.abs(state.objectDistance) < Math.abs(state.focalLength)) {
                type.push(t('virtualImage'));
            } else {
                type.push(t('realImage'));
            }
        } else {
            if (imageDistance < 0) {
                type.push(t('virtualImage'));
            } else {
                type.push(t('realImage'));
            }
        }
    }
    
    if (state.lensType === 'convex') {
        const epsilon = 0.01;
        if (Math.abs(Math.abs(magnification) - 1) < epsilon) {
            type.push(t('sameSize'));
        } else if (Math.abs(magnification) > 1) {
            type.push(t('magnified'));
        } else {
            type.push(t('diminished'));
        }
        
        if (magnification > 0) {
            type.push(t('erect'));
        } else {
            type.push(t('inverted'));
        }
    }
    
    return type.join(', ');
}

// 绘制 v against u 图表
function drawUVGraph() {
    const canvas = document.getElementById('uvGraphCanvas');
    if (!canvas) return;
    
    // 控制图表容器的显示
    const container = canvas.parentElement;
    const dataCard = document.querySelector('.data-card');
    if (state.lensType === 'convex' && dataCard && dataCard.classList.contains('expanded')) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 只有凸透镜且能成实像才绘制
    if (state.lensType !== 'convex') return;
    
    const f = state.focalLength;
    // 仅绘制 u > f 的部分（实像）
    const minU = f + 0.1;
    const maxU = 30;
    
    // 边距
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    
    // 坐标轴范围
    const xMax = 30;
    const yMax = 30;
    
    // 坐标转换函数
    const getX = (u) => margin.left + (u / xMax) * graphWidth;
    const getY = (v) => margin.top + graphHeight - (v / yMax) * graphHeight;
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    // Y轴
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + graphHeight);
    // X轴
    ctx.lineTo(margin.left + graphWidth, margin.top + graphHeight);
    ctx.stroke();
    
    // 绘制箭头
    ctx.beginPath();
    ctx.moveTo(margin.left - 3, margin.top + 5);
    ctx.lineTo(margin.left, margin.top);
    ctx.lineTo(margin.left + 3, margin.top + 5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin.left + graphWidth - 5, margin.top + graphHeight - 3);
    ctx.lineTo(margin.left + graphWidth, margin.top + graphHeight);
    ctx.lineTo(margin.left + graphWidth - 5, margin.top + graphHeight + 3);
    ctx.stroke();
    
    // 绘制刻度和标签
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // X轴刻度 (u)
    for (let i = 0; i <= xMax; i += 10) {
        const x = getX(i);
        ctx.beginPath();
        ctx.moveTo(x, margin.top + graphHeight);
        ctx.lineTo(x, margin.top + graphHeight + 4);
        ctx.stroke();
        ctx.fillText(i, x, margin.top + graphHeight + 15);
    }
    ctx.textAlign = 'right';
    ctx.fillText('u / cm', width - 5, margin.top + graphHeight - 5);
    
    // Y轴刻度 (v)
    ctx.textAlign = 'right';
    for (let i = 0; i <= yMax; i += 10) {
        const y = getY(i);
        ctx.beginPath();
        ctx.moveTo(margin.left - 4, y);
        ctx.lineTo(margin.left, y);
        ctx.stroke();
        ctx.fillText(i, margin.left - 8, y + 3);
    }
    ctx.fillText('v / cm', margin.left, margin.top - 5);
    
    // 绘制渐近线 (u = f 和 v = f)
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.setLineDash([5, 5]);
    // u = f
    ctx.moveTo(getX(f), margin.top);
    ctx.lineTo(getX(f), margin.top + graphHeight);
    // v = f
    ctx.moveTo(margin.left, getY(f));
    ctx.lineTo(margin.left + graphWidth, getY(f));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制曲线
    ctx.beginPath();
    ctx.strokeStyle = '#4a69bd';
    ctx.lineWidth = 2;
    let firstPoint = true;
    
    for (let u = minU; u <= maxU; u += 0.5) {
        const v = (u * f) / (u - f);
        if (v > yMax) continue; // 超出图表范围不绘制
        
        const x = getX(u);
        const y = getY(v);
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 标记当前状态点
    const currentU = Math.abs(state.objectDistance);
    if (currentU > f && state.objectDistance > 0) { // 只在左侧(u>0)且能成实像(u>f)时标记
        const currentV = calculateImageDistance(state.objectDistance, state.focalLength);
        
        if (currentV > 0 && currentV <= yMax) {
            const px = getX(currentU);
            const py = getY(currentV);
            
            // 绘制连线
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.setLineDash([2, 2]);
            ctx.moveTo(px, margin.top + graphHeight);
            ctx.lineTo(px, py);
            ctx.lineTo(margin.left, py);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // 绘制点
            ctx.beginPath();
            ctx.fillStyle = '#ff0000';
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // 显示当前数值
            ctx.textAlign = 'left';
            ctx.fillStyle = '#d32f2f'; // 使用深红色使文字更明显
            ctx.font = 'bold 11px Arial';
            
            // 确保文本不会超出画布边界
            let textX = px + 8;
            let textY = py - 8;
            if (textX > width - 70) textX = px - 65; // 太靠右则显示在左边
            if (textY < 20) textY = py + 15; // 太靠上则显示在下边
            
            ctx.fillText(`u=${currentU.toFixed(1)}, v=${currentV.toFixed(1)}`, textX, textY);
        }
    }
}

// 更新測量數據顯示
// Update measurement data display
function updateMeasurements() {
    // 获取透镜位置和物体位置
    const lensX = canvas.width / 2 + state.lensPosition * pixelsPerCm;
    const objectX = canvas.width / 2 + state.objectPosition * pixelsPerCm;
    
    // 计算物距 (绝对值，保留一位小数)
    const objectDistance = Math.abs(state.objectDistance).toFixed(1);
    
    // 计算像距 (使用薄透镜方程)
    const imageDistance = calculateImageDistance(state.objectDistance, state.focalLength);
    const absImageDistance = !isFinite(imageDistance) ? 'Infinity' : Math.abs(imageDistance).toFixed(1);
    
    // 计算放大率
    const magnification = calculateMagnification(state.objectDistance, imageDistance);
    const absMagnification = !isFinite(magnification) ? 'Infinity' : Math.abs(magnification).toFixed(2);
    
    // 计算总距离 (物距 + 像距)
    const totalDistance = (!isFinite(imageDistance)) ? 'Infinity' : (parseFloat(objectDistance) + parseFloat(absImageDistance)).toFixed(1);
    
    // 更新HTML元素
    document.getElementById('objectDistance').textContent = objectDistance + ' cm';
    document.getElementById('imageDistance').textContent = (!isFinite(imageDistance)) ? 'Infinity' : absImageDistance + ' cm';
    document.getElementById('magnification').textContent = (!isFinite(magnification)) ? 'Infinity' : absMagnification + 'x';
    document.getElementById('totalDistance').textContent = (!isFinite(imageDistance)) ? 'Infinity' : totalDistance + ' cm';
    
    // 确定像的特性
    let imageNature = '';
    
    // 凹透镜的情况单独处理
    if (state.lensType === 'concave') {
        imageNature = [t('erect'), t('diminished'), t('virtualImage')].join(', ');
        document.getElementById('imageType').textContent = imageNature;
        return;
    }
    
    if (!isFinite(imageDistance) || Math.abs(Math.abs(state.objectDistance) - Math.abs(state.focalLength)) < 0.01) {
        document.getElementById('imageType').textContent = t('noImageParallel');
        
        // 隱藏虛像實像的標示點
        document.getElementById('virtualImageIndicator').style.display = 'none';
        document.getElementById('realImageIndicator').style.display = 'none';
        
        // 更新v-u图表
        drawUVGraph();
        return;
    }
    
    // 以下是凸透镜的处理逻辑
    
    // 正立/倒立判断 - 通过放大率符号判断
    if (magnification > 0) {
        imageNature += t('erect');
    } else {
        imageNature += t('inverted');
    }
    
    const epsilon = 0.01;
    if (Math.abs(Math.abs(magnification) - 1) < epsilon) {
        imageNature += ', ' + t('sameSize');
    } else if (Math.abs(magnification) > 1) {
        imageNature += ', ' + t('magnified');
    } else {
        imageNature += ', ' + t('diminished');
    }
    
    if (state.objectDistance < 0) {
        if (Math.abs(state.objectDistance) < Math.abs(state.focalLength)) {
            imageNature += ', ' + t('virtualImage');
        } else {
            imageNature += ', ' + t('realImage');
        }
    } else {
        if (imageDistance < 0) {
            imageNature += ', ' + t('virtualImage');
        } else {
            imageNature += ', ' + t('realImage');
        }
    }
    
    document.getElementById('imageType').textContent = imageNature;
    
    // 更新v-u图表
    drawUVGraph();
}

// 繪製函數
// Drawing function
function draw() {
    if (!ctx) return;
    
    // 清除画布
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格
    // Draw grid
    if (state.display.grid) {
        drawGrid();
    }
    
    // 繪製光軸
    // Draw optical axis
    drawOpticalAxis();
    
    // 計算像距
    // Calculate image distance
    const imageDistance = calculateImageDistance(state.objectDistance, state.focalLength);
    
    // 如果是凹透镜，验证参数
    if (state.lensType === 'concave') {
        validateConcaveParams(state.focalLength, state.objectDistance);
    }
    
    // 計算放大率
    // Calculate magnification
    const magnification = calculateMagnification(state.objectDistance, imageDistance);
    
    // 绘制焦点
    // Draw focal points
    drawFocalPoints();
    
    // 繪製透鏡
    // Draw lens
    drawLens();
    
    // 繪製物體
    // Draw object
    drawObject();
    
    // 繪製光線
    // Draw rays
    if (state.rules.rule1 || state.rules.rule2 || state.rules.rule3) {
        drawRays(imageDistance);
    }
    
    // 繪製光束
    // Draw bundle of light rays
    if (state.display.bundleRays) {
        drawBundleRays(imageDistance);
    }
    
    // 繪製各規則對應的光束效果
    // Draw rule-specific bundle effects
    if (state.display.bundleRays) {
        if (state.rules.rule1) {
            drawRule1BundleRays(imageDistance);
        }
        if (state.rules.rule2) {
            drawRule2BundleRays(imageDistance);
        }
        if (state.rules.rule3) {
            drawRule3BundleRays(imageDistance);
        }
    }

    // 绘制投影屏幕
    if (state.display.screen) {
        drawScreen();
    }
    
    // 繪製像（如果像距有限）
    // Draw image (if image distance is finite)
    if (isFinite(imageDistance) && state.objectDistance !== 0) {
        drawImage(imageDistance, magnification);
    }
    
    // 控制測量數據面板的顯示與隱藏
    // Control measurement panel visibility
    const measurementPanel = document.getElementById('image-type-indicator');
    if (measurementPanel) {
        measurementPanel.style.display = state.display.measurements ? 'block' : 'none';
    }
    
    // 更新指示器显示
    const virtualImageIndicator = document.getElementById('virtualImageIndicator');
    const realImageIndicator = document.getElementById('realImageIndicator');
    
    // 凹透镜始终显示虚像指示器
    if (state.lensType === 'concave') {
        virtualImageIndicator.style.display = 'block';
        realImageIndicator.style.display = 'none';
    } else if (state.objectDistance === 0 || !isFinite(imageDistance)) {
        // 特殊情况：物体在透镜上或像距无穷大
        virtualImageIndicator.style.display = 'none';
        realImageIndicator.style.display = 'none';
    } else {
        // 凸透镜根据像距判断
        const isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < Math.abs(state.focalLength)) || 
                             (state.objectDistance > 0 && imageDistance < 0);
                            
        if (isVirtualImage) {
            virtualImageIndicator.style.display = 'block';
            realImageIndicator.style.display = 'none';
        } else {
            virtualImageIndicator.style.display = 'none';
            realImageIndicator.style.display = 'block';
        }
    }
}

// 繪製網格
// Draw grid
function drawGrid() {
    const gridSize = pixelsPerCm; // 1 cm on diagram; tracks dynamic scale in embed mode
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    const axisY = canvas.height / 2; // 光轴的Y坐标
    const lensX = canvas.width / 2 + state.lensPosition * pixelsPerCm; // 透镜中心的X坐标
    
    // 修改网格对齐方式，使其与光轴对齐
    // 水平线从光轴(axisY)开始上下计算，确保整数厘米高度与网格线对齐
    const offsetY = axisY % gridSize;
    
    // 垂直线 - 固定间隔，不跟随透镜移动
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        
        // 如果这条线接近透镜中心，使用深一点的颜色突出显示
        if (Math.abs(x - lensX) < 1) {
            ctx.strokeStyle = '#d0d0d0';
        } else {
            ctx.strokeStyle = '#e0e0e0';
        }
        
        ctx.stroke();
    }
    
    // 水平线 - 从光轴开始，上下等间距绘制，确保与光轴对齐
    // 先绘制光轴及其上方的网格线
    for (let y = axisY; y >= 0; y -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        
        // 如果这条线是光轴，使用深一点的颜色突出显示
        if (Math.abs(y - axisY) < 1) {
            ctx.strokeStyle = '#d0d0d0';
        } else {
            ctx.strokeStyle = '#e0e0e0';
        }
        
        ctx.stroke();
    }
    
    // 再绘制光轴下方的网格线
    for (let y = axisY + gridSize; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = '#e0e0e0';
        ctx.stroke();
    }
}

// 繪製光軸
// Draw optical axis
function drawOpticalAxis() {
    const axisY = canvas.height / 2;
    
    // 使用更精细的中心光轴
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(canvas.width, axisY);
    
    // 根据透镜类型改变光轴样式
    if (state.lensType === 'concave') {
        ctx.strokeStyle = '#718096'; // 中灰色
        ctx.lineWidth = 1;  // 更细的线
        ctx.setLineDash([5, 3]); // 使用虚线
    } else {
        ctx.strokeStyle = '#4a5568'; // 深灰色
        ctx.lineWidth = 1.5; // 稍粗的线
        ctx.setLineDash([]); // 实线
    }
    
    ctx.stroke();
    ctx.setLineDash([]); // 重置为实线
}

// 繪製透鏡
// Draw lens
function drawLens() {
    const lensHeight = Math.min(canvas.height * 0.7, 500); // 透镜高度上限为500像素或画布高度的70%，取较小值
    const axisY = canvas.height / 2;
    const lensX = canvas.width / 2 + state.lensPosition * pixelsPerCm; // 使用pixelsPerCm
    const absF = Math.abs(state.focalLength);
    
    // 繪製透鏡
    // Draw lens
    ctx.strokeStyle = '#4a69bd';
    
    // 根据透镜类型设置线宽
    ctx.lineWidth = state.lensType === 'concave' ? 1.8 : 3;
    
    if (state.lensType === 'convex') {
        // 凸透镜形状
        ctx.beginPath();
        
        // 左弧
        ctx.moveTo(lensX, axisY - lensHeight / 2);
        ctx.quadraticCurveTo(
            lensX - 30, axisY,
            lensX, axisY + lensHeight / 2
        );
        
        // 右弧
        ctx.moveTo(lensX, axisY - lensHeight / 2);
        ctx.quadraticCurveTo(
            lensX + 30, axisY,
            lensX, axisY + lensHeight / 2
        );
        
        ctx.stroke();
    } else {
        // 凹透镜形状 - 使用标准双凹透镜形状（两端宽、中间窄）
        
        // 根据焦距调整曲率
        const controlOffset = absF * 1.5; 
        
        // 设置透镜尺寸（以厘米为单位）
        const edgeWidthCm = 0.8; // 边缘宽度
        const centerWidthCm = 0.25; // 中间宽度
        
        // 将厘米转换为像素
        const edgeWidth = edgeWidthCm * pixelsPerCm;
        const centerWidth = centerWidthCm * pixelsPerCm;
        
        // 简化设计，使用更流畅的曲线
        ctx.beginPath();
        
        // 计算关键点坐标
        const topY = axisY - lensHeight / 2;
        const bottomY = axisY + lensHeight / 2;
        const leftEdgeX = lensX - edgeWidth / 2;
        const rightEdgeX = lensX + edgeWidth / 2;
        const centerLeftX = lensX - centerWidth / 2;
        const centerRightX = lensX + centerWidth / 2;
        
        // 绘制左上到中心的曲线
        ctx.moveTo(leftEdgeX, topY);
        ctx.bezierCurveTo(
            leftEdgeX - edgeWidth * 0.1, topY + lensHeight * 0.2,
            centerLeftX - centerWidth * 0.1, axisY - lensHeight * 0.2,
            centerLeftX, axisY
        );
        
        // 绘制中心到左下的曲线
        ctx.bezierCurveTo(
            centerLeftX - centerWidth * 0.1, axisY + lensHeight * 0.2,
            leftEdgeX - edgeWidth * 0.1, bottomY - lensHeight * 0.2,
            leftEdgeX, bottomY
        );
        
        // 绘制左下到右下的直线
        ctx.lineTo(rightEdgeX, bottomY);
        
        // 绘制右下到中心的曲线
        ctx.bezierCurveTo(
            rightEdgeX + edgeWidth * 0.1, bottomY - lensHeight * 0.2,
            centerRightX + centerWidth * 0.1, axisY + lensHeight * 0.2,
            centerRightX, axisY
        );
        
        // 绘制中心到右上的曲线
        ctx.bezierCurveTo(
            centerRightX + centerWidth * 0.1, axisY - lensHeight * 0.2,
            rightEdgeX + edgeWidth * 0.1, topY + lensHeight * 0.2,
            rightEdgeX, topY
        );
        
        // 闭合路径
        ctx.closePath();
        
        // 填充透镜
        const skyBlue = '#64c3e9'; // 使用类似参考图的天蓝色
        ctx.fillStyle = skyBlue;
        ctx.fill();
        
        // 描边透镜
        ctx.strokeStyle = '#408aad'; // 深一点的蓝色边框
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    
    // 标记透镜中心
    ctx.fillStyle = '#4a69bd';
    ctx.beginPath();
    ctx.arc(lensX, axisY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加拖动提示
    ctx.beginPath();
    ctx.arc(lensX, axisY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(74, 105, 189, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 添加左右箭头表示可拖动
    ctx.beginPath();
    ctx.moveTo(lensX - 15, axisY);
    ctx.lineTo(lensX - 10, axisY);
    ctx.moveTo(lensX - 15, axisY);
    ctx.lineTo(lensX - 13, axisY - 2);
    ctx.moveTo(lensX - 15, axisY);
    ctx.lineTo(lensX - 13, axisY + 2);
    
    ctx.moveTo(lensX + 15, axisY);
    ctx.lineTo(lensX + 10, axisY);
    ctx.moveTo(lensX + 15, axisY);
    ctx.lineTo(lensX + 13, axisY - 2);
    ctx.moveTo(lensX + 15, axisY);
    ctx.lineTo(lensX + 13, axisY + 2);
    ctx.stroke();
    
    // 添加拖动文本提示
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(74, 105, 189, 0.8)';
    ctx.fillText(t('drag'), lensX, axisY + 15);
}

// 繪製焦點標記
// Draw focal point markers
function drawFocalPoints() {
    // 計算透鏡在畫布上的x座標
    // Calculate the x-coordinate of the lens on the canvas
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    const absF = Math.abs(state.focalLength);
    
    // 根據透鏡類型確定焦點位置和樣式
    const isConcave = state.lensType === 'concave';
    
    // 如果是凹透镜，焦点在透镜的另一侧（虚焦点）
    const leftFocalX = isConcave ? lensX + pixelsPerCm * absF : lensX - pixelsPerCm * absF;
    const rightFocalX = isConcave ? lensX - pixelsPerCm * absF : lensX + pixelsPerCm * absF;
    
    // 根据焦距计算焦点标记大小
    // Calculate focal point size based on focal length
    const focalMarkerSize = absF * 0.1 * pixelsPerCm; // 焦点标记大小 = |f| * 0.1
    const pulseSize = focalMarkerSize * (1 + Math.sin(Date.now() / 300) * 0.2);
    
    // 绘制左侧焦点
    ctx.beginPath();
    ctx.arc(leftFocalX, canvas.height / 2, pulseSize / 2, 0, Math.PI * 2);
    
    // 为凹透镜的虚焦点使用不同的样式
    if (isConcave) {
        ctx.fillStyle = 'rgba(99, 179, 237, 0.4)'; // 蓝色半透明
        ctx.setLineDash([4, 2]); // 虚线参数优化
        ctx.strokeStyle = '#63B3ED'; // 蓝色
    } else {
        ctx.fillStyle = 'rgba(252, 129, 129, 0.7)'; // 红色半透明
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(229, 62, 62, 1)'; // 红色
    }
    
    // 凹透镜左侧焦点(在透镜右侧)，仅保留中心点，不绘制外圈
    if (isConcave) {
        // 不绘制外圈，只用阴影和中心点来表示
    } else {
        ctx.fill();
        ctx.lineWidth = 1.2; // 更精细的线宽
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // 添加焦点中心点效果
    ctx.shadowBlur = 6 + Math.sin(Date.now() / 300) * 2;
    if (isConcave) {
        ctx.shadowColor = 'rgba(99, 179, 237, 0.6)'; // 蓝色阴影
        ctx.fillStyle = 'rgba(99, 179, 237, 0.8)'; // 蓝色
    } else {
        ctx.shadowColor = 'rgba(229, 62, 62, 0.6)'; // 红色阴影
        ctx.fillStyle = 'rgba(252, 129, 129, 1)'; // 红色
    }
    
    ctx.beginPath();
    ctx.arc(leftFocalX, canvas.height / 2, pulseSize / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 添加拖动提示 - 左侧焦点（仅针对非凹透镜）
    if (!isConcave) {
        ctx.beginPath();
        ctx.arc(leftFocalX, canvas.height / 2, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(229, 62, 62, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }
    
    // 添加左右箭头表示可拖动（凸透镜的左侧焦点或凹透镜的左侧焦点，根据当前设置）
    if (!isConcave) {
        ctx.beginPath();
        ctx.moveTo(leftFocalX - 15, canvas.height / 2);
        ctx.lineTo(leftFocalX - 10, canvas.height / 2);
        ctx.moveTo(leftFocalX - 15, canvas.height / 2);
        ctx.lineTo(leftFocalX - 13, canvas.height / 2 - 2);
        ctx.moveTo(leftFocalX - 15, canvas.height / 2);
        ctx.lineTo(leftFocalX - 13, canvas.height / 2 + 2);
        
        ctx.moveTo(leftFocalX + 15, canvas.height / 2);
        ctx.lineTo(leftFocalX + 10, canvas.height / 2);
        ctx.moveTo(leftFocalX + 15, canvas.height / 2);
        ctx.lineTo(leftFocalX + 13, canvas.height / 2 - 2);
        ctx.moveTo(leftFocalX + 15, canvas.height / 2);
        ctx.lineTo(leftFocalX + 13, canvas.height / 2 + 2);
        ctx.strokeStyle = 'rgba(229, 62, 62, 0.8)';
        ctx.stroke();
        
        // 添加拖动文本提示
        ctx.font = '9px Arial';
        ctx.fillStyle = 'rgba(229, 62, 62, 0.8)';
        ctx.fillText(t('drag'), leftFocalX, canvas.height / 2 + 20);
    }
    
    // 繪製左側焦點標籤，并根據透鏡類型選擇標籤名稱
    // Draw left focal point label
    ctx.font = '12px Arial';
    ctx.fillStyle = isConcave ? '#4299E1' : '#e53e3e';
    ctx.textAlign = 'center';
    
    // 根據透鏡類型顯示不同的焦點標籤
    if (isConcave) {
        ctx.fillText("F'", leftFocalX, canvas.height / 2 - 15);
    } else {
        ctx.fillText('F', leftFocalX, canvas.height / 2 - 15);
    }
    
    // 繪製右側焦點
    // Draw right focal point
    ctx.beginPath();
    ctx.arc(rightFocalX, canvas.height / 2, pulseSize / 2, 0, Math.PI * 2);
    
    // 为凹透镜的虚焦点使用不同的样式
    if (isConcave) {
        ctx.fillStyle = 'rgba(99, 179, 237, 0.4)'; // 蓝色半透明
        ctx.setLineDash([4, 2]); // 虚线参数优化
        ctx.strokeStyle = '#63B3ED'; // 蓝色
    } else {
        ctx.fillStyle = 'rgba(252, 129, 129, 0.7)'; // 红色半透明
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(229, 62, 62, 1)'; // 红色
    }
    
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 添加焦点中心点效果
    ctx.shadowBlur = 6 + Math.sin(Date.now() / 300) * 2;
    if (isConcave) {
        ctx.shadowColor = 'rgba(99, 179, 237, 0.6)'; // 蓝色阴影
        ctx.fillStyle = 'rgba(99, 179, 237, 0.8)'; // 蓝色
    } else {
        ctx.shadowColor = 'rgba(229, 62, 62, 0.6)'; // 红色阴影
        ctx.fillStyle = 'rgba(252, 129, 129, 1)'; // 红色
    }
    
    ctx.beginPath();
    ctx.arc(rightFocalX, canvas.height / 2, pulseSize / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 繪製右側焦點標籤，并根據透鏡類型選擇標籤名稱
    // Draw right focal point label
    ctx.fillStyle = isConcave ? '#4299E1' : '#e53e3e';
    ctx.textAlign = 'center';
    
    // 根據透鏡類型顯示不同的焦點標籤
    if (isConcave) {
        ctx.fillText("F", rightFocalX, canvas.height / 2 - 15);
    } else {
        ctx.fillText("F'", rightFocalX, canvas.height / 2 - 15);
    }
    
    // 如果是凹透镜，在右侧焦点添加拖动指示器（因为现在凹透镜的右侧焦点是可拖动的）
    if (isConcave) {
        // 添加拖动提示 - 右侧焦点
        ctx.beginPath();
        ctx.arc(rightFocalX, canvas.height / 2, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(99, 179, 237, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        // 添加左右箭头表示可拖动
        ctx.beginPath();
        ctx.moveTo(rightFocalX - 15, canvas.height / 2);
        ctx.lineTo(rightFocalX - 10, canvas.height / 2);
        ctx.moveTo(rightFocalX - 15, canvas.height / 2);
        ctx.lineTo(rightFocalX - 13, canvas.height / 2 - 2);
        ctx.moveTo(rightFocalX - 15, canvas.height / 2);
        ctx.lineTo(rightFocalX - 13, canvas.height / 2 + 2);
        
        ctx.moveTo(rightFocalX + 15, canvas.height / 2);
        ctx.lineTo(rightFocalX + 10, canvas.height / 2);
        ctx.moveTo(rightFocalX + 15, canvas.height / 2);
        ctx.lineTo(rightFocalX + 13, canvas.height / 2 - 2);
        ctx.moveTo(rightFocalX + 15, canvas.height / 2);
        ctx.lineTo(rightFocalX + 13, canvas.height / 2 + 2);
        ctx.strokeStyle = 'rgba(99, 179, 237, 0.8)';
        ctx.stroke();
        
        // 添加拖动文本提示
        ctx.font = '9px Arial';
        ctx.fillStyle = 'rgba(99, 179, 237, 0.8)';
        ctx.fillText(t('drag'), rightFocalX, canvas.height / 2 + 20);
    }
    
    // 绘制2F点(左侧)
    // Draw 2F point (left side)
    const left2FX = isConcave ? lensX + pixelsPerCm * absF * 2 : lensX - pixelsPerCm * absF * 2;
    const twofMarkerSize = focalMarkerSize * 0.8; // 2F点标记略小于F点
    
    ctx.beginPath();
    ctx.arc(left2FX, canvas.height / 2, twofMarkerSize / 2, 0, Math.PI * 2);
    
    // 根据透镜类型设置2F点样式
    if (isConcave) {
        ctx.fillStyle = 'rgba(99, 179, 237, 0.4)'; // 蓝色半透明
        ctx.setLineDash([4, 2]); // 虚线参数优化
        ctx.strokeStyle = 'rgba(99, 179, 237, 0.8)'; // 蓝色
    } else {
        ctx.fillStyle = 'rgba(252, 129, 129, 0.6)'; // 红色半透明
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(229, 62, 62, 0.8)'; // 红色
    }
    
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制左侧2F点标签
    ctx.fillStyle = isConcave ? '#4299E1' : '#e53e3e';
    ctx.textAlign = 'center';
    
    // 根據透鏡類型顯示不同的焦點標籤
    if (isConcave) {
        ctx.fillText("2F'", left2FX, canvas.height / 2 - 15);
    } else {
        ctx.fillText("2F", left2FX, canvas.height / 2 - 15);
    }
    
    // 绘制2F点(右侧)
    // Draw 2F point (right side)
    const right2FX = isConcave ? lensX - pixelsPerCm * absF * 2 : lensX + pixelsPerCm * absF * 2;
    ctx.beginPath();
    ctx.arc(right2FX, canvas.height / 2, twofMarkerSize / 2, 0, Math.PI * 2);
    
    // 根据透镜类型设置2F点样式
    if (isConcave) {
        ctx.fillStyle = 'rgba(99, 179, 237, 0.4)'; // 蓝色半透明
        ctx.setLineDash([4, 2]); // 虚线参数优化
        ctx.strokeStyle = 'rgba(99, 179, 237, 0.8)'; // 蓝色
    } else {
        ctx.fillStyle = 'rgba(252, 129, 129, 0.6)'; // 红色半透明
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(229, 62, 62, 0.8)'; // 红色
    }
    
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制右侧2F点标签
    ctx.fillStyle = isConcave ? '#4299E1' : '#e53e3e';
    ctx.textAlign = 'center';
    
    // 根據透鏡類型顯示不同的焦點標籤
    if (isConcave) {
        ctx.fillText("2F", right2FX, canvas.height / 2 - 15);
    } else {
        ctx.fillText("2F'", right2FX, canvas.height / 2 - 15);
    }
    
    // 恢復陰影設置
    // Reset shadow settings
    ctx.shadowBlur = 0;
    
    // 繪製焦平面（虛線）
    // Draw focal planes (dashed lines)
    ctx.setLineDash([4, 2]); // 更精细的虚线参数
    ctx.beginPath();
    ctx.moveTo(leftFocalX, canvas.height / 4);
    ctx.lineTo(leftFocalX, canvas.height * 3 / 4);
    ctx.strokeStyle = isConcave ? 'rgba(144, 205, 244, 0.7)' : 'rgba(203, 213, 224, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 右侧焦平面
    ctx.beginPath();
    ctx.moveTo(rightFocalX, canvas.height / 4);
    ctx.lineTo(rightFocalX, canvas.height * 3 / 4);
    ctx.strokeStyle = isConcave ? 'rgba(144, 205, 244, 0.7)' : 'rgba(203, 213, 224, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 重置线型
    ctx.setLineDash([]);
}

// 繪製物體
// Draw object
function drawObject() {
    const axisY = canvas.height / 2;
    const centerX = canvas.width / 2;
    // 確保物體位置精確到0.1厘米
    state.objectPosition = parseFloat((Math.round(state.objectPosition * 10) / 10).toFixed(1));
    // 使用絕對位置計算物體的X座標，而不是相對於透鏡
    const objectX = centerX + state.objectPosition * pixelsPerCm; // 轉換為像素
    const objectHeight = state.objectHeight * pixelsPerCm; // 使用状态中的物体高度
    
    // 確保使用實線繪製物體
    ctx.setLineDash([]); // 明確設置為實線
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 2;
    
    if (state.objectType === 'arrow') {
        // 繪製箭頭物體
        ctx.beginPath();
        ctx.moveTo(objectX, axisY);
        ctx.lineTo(objectX, axisY - objectHeight);
        
        // 根据物体高度调整箭头显示比例
        if (state.objectHeight <= 0.2) {
            // 高度小于或等于0.2cm时不显示箭头
            // 只保留垂直线
        } else if (state.objectHeight < 0.6) {
            // 高度小于0.6cm时调整箭头比例
            const arrowSize = Math.max(5, 15 * (state.objectHeight / 0.6));
            ctx.lineTo(objectX - arrowSize/1.5, axisY - objectHeight + arrowSize);
            ctx.moveTo(objectX, axisY - objectHeight);
            ctx.lineTo(objectX + arrowSize/1.5, axisY - objectHeight + arrowSize);
        } else {
            // 正常显示箭头
            ctx.lineTo(objectX - 10, axisY - objectHeight + 15);
            ctx.moveTo(objectX, axisY - objectHeight);
            ctx.lineTo(objectX + 10, axisY - objectHeight + 15);
        }
        
        ctx.stroke();
    } else {
        // 繪製學生物體（簡化為人形）
        const scale = objectHeight / studentHeight; // 计算缩放比例
        ctx.beginPath();
        // 頭部
        ctx.arc(objectX, axisY - objectHeight + 15 * scale, 15 * scale, 0, Math.PI * 2);
        // 身體
        ctx.moveTo(objectX, axisY - objectHeight + 30 * scale);
        ctx.lineTo(objectX, axisY - 20 * scale);
        // 手臂
        ctx.moveTo(objectX - 20 * scale, axisY - objectHeight + 45 * scale);
        ctx.lineTo(objectX, axisY - objectHeight + 40 * scale);
        ctx.lineTo(objectX + 20 * scale, axisY - objectHeight + 45 * scale);
        // 腿
        ctx.moveTo(objectX, axisY - 20 * scale);
        ctx.lineTo(objectX - 15 * scale, axisY);
        ctx.moveTo(objectX, axisY - 20 * scale);
        ctx.lineTo(objectX + 15 * scale, axisY);
        ctx.stroke();
    }
    
    // 繪製物體標記點（底部绿色点，添加视觉提示表明可拖动）
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(objectX, axisY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加拖动提示
    ctx.beginPath();
    ctx.arc(objectX, axisY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 添加左右箭头表示可拖动
    ctx.beginPath();
    ctx.moveTo(objectX - 15, axisY);
    ctx.lineTo(objectX - 10, axisY);
    ctx.moveTo(objectX - 15, axisY);
    ctx.lineTo(objectX - 13, axisY - 2);
    ctx.moveTo(objectX - 15, axisY);
    ctx.lineTo(objectX - 13, axisY + 2);
    
    ctx.moveTo(objectX + 15, axisY);
    ctx.lineTo(objectX + 10, axisY);
    ctx.moveTo(objectX + 15, axisY);
    ctx.lineTo(objectX + 13, axisY - 2);
    ctx.moveTo(objectX + 15, axisY);
    ctx.lineTo(objectX + 13, axisY + 2);
    ctx.stroke();
    
    // 添加拖动文本提示
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
    ctx.fillText(t('drag'), objectX, axisY + 15);
    
    // 標記物體高度
    ctx.setLineDash([]);  // 再次確保使用實線
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(objectX, axisY);
    ctx.lineTo(objectX, axisY - objectHeight);
    ctx.stroke();
    
    // 在物體頂部添加可拖動的高度調整點
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(objectX, axisY - objectHeight, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加高度调整提示
    ctx.beginPath();
    ctx.arc(objectX, axisY - objectHeight, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 在物體底部顯示物距數值，增強顯示效果
    const lensX = centerX + state.lensPosition * pixelsPerCm;
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 14px Arial';
    const objectDistance = state.objectDistance;
    const displayText = `u = ${objectDistance.toFixed(1)} cm`;
    
    // 決定文字位置，避免重疊
    const textX = objectX;
    const textY = axisY + 25; // 在光軸下方顯示
    
    // 繪製背景使文字更清晰
    const textWidth = ctx.measureText(displayText).width;
    ctx.fillStyle = 'rgba(46, 204, 113, 0.2)'; // 使用綠色背景，更好區分
    ctx.fillRect(textX - textWidth/2 - 5, textY - 14, textWidth + 10, 20);
    
    // 繪製文字
    ctx.fillStyle = '#2ecc71';
    ctx.textAlign = 'center';
    ctx.fillText(displayText, textX, textY);
    
    // 添加小標籤說明
    ctx.font = '12px Arial';
    ctx.fillText(t('objectDistanceLabel'), textX, textY + 16);
}

// 繪製像
// Draw image
function drawImage(imageDistance, magnification) {
    // 如果不顯示像，或像距為無窮大，或物距為0，則不繪製像
    if (!state.display.image || !isFinite(imageDistance) || state.objectDistance === 0) return;

    const axisY = canvas.height / 2;
    const centerX = canvas.width / 2;
    const lensX = centerX + state.lensPosition * pixelsPerCm;
    const imageX = lensX + imageDistance * pixelsPerCm; // 轉換為像素
    
    // 使用state中的物体高度
    const objectHeight = state.objectHeight * pixelsPerCm;
    
    // 檢查物體是否在透鏡右側
    const isObjectOnRight = state.objectDistance < 0;
    
    // 凹透镜特殊处理
    const isConcave = state.lensType === 'concave';
    
    // 判斷是否為虛像，凹透镜始终形成虚像
    let isVirtualImage;
    
    // 计算像的高度（厘米）
    const imageHeightCm = state.objectHeight * Math.abs(magnification);
    
    if (isConcave) {
        isVirtualImage = true; // 凹透鏡始終形成虛像
        // 确保虚像始终是正立的
        const actualMagnification = Math.abs(magnification);
        // 凹透镜的像高度始终是正立的
        const imageHeight = objectHeight * actualMagnification;
        
        // 计算正确的像位置，确保物体在凹透镜右侧时，像仍然显示在右侧
        let actualImageX = imageX;
        
        // 调整像在X轴上的位置：如果物体在凹透镜右侧，确保像也在右侧
        if (isObjectOnRight) {
            // 当物体在右侧时，像距为负值，但像应该显示在右侧
            // 重新计算actualImageX确保像在右侧
            actualImageX = lensX - imageDistance * pixelsPerCm; // 因为imageDistance是负的，所以这里用减法
        }
        
        // 凹透镜始终用虚线绘制虚像
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);  // 虛像使用虛線
        
        if (state.objectType === 'arrow') {
            // 繪製箭頭像 - 凹透鏡虛像始終正立
            ctx.beginPath();
            ctx.moveTo(actualImageX, axisY);
            ctx.lineTo(actualImageX, axisY - imageHeight);
            
            // 根据像高度调整箭头显示
            if (imageHeightCm <= 0.2) {
                // 像高度小于或等于0.2cm时不显示箭头
                // 只保留垂直线
            } else if (imageHeightCm < 0.6) {
                // 像高度小于0.6cm时调整箭头比例
                const arrowSize = Math.max(5, 15 * (imageHeightCm / 0.6));
                ctx.lineTo(actualImageX - arrowSize/1.5, axisY - imageHeight + arrowSize);
                ctx.moveTo(actualImageX, axisY - imageHeight);
                ctx.lineTo(actualImageX + arrowSize/1.5, axisY - imageHeight + arrowSize);
            } else {
                // 正常显示箭头
                ctx.lineTo(actualImageX - 10, axisY - imageHeight + 15);
                ctx.moveTo(actualImageX, axisY - imageHeight);
                ctx.lineTo(actualImageX + 10, axisY - imageHeight + 15);
            }
            
            ctx.stroke();
        } else {
            // 繪製學生物體像（人形）- 凹透鏡虛像始終正立
            ctx.beginPath();
            // 頭部
            ctx.arc(actualImageX, axisY - imageHeight + 15 * actualMagnification / objectHeight * 40, 
                  15 * actualMagnification / objectHeight * 40, 0, Math.PI * 2);
            // 身體
            ctx.moveTo(actualImageX, axisY - imageHeight + 30 * actualMagnification / objectHeight * 40);
            ctx.lineTo(actualImageX, axisY - 20 * actualMagnification / objectHeight * 40);
            // 手臂
            ctx.moveTo(actualImageX - 20 * actualMagnification / objectHeight * 40, 
                     axisY - imageHeight + 45 * actualMagnification / objectHeight * 40);
            ctx.lineTo(actualImageX, axisY - imageHeight + 40 * actualMagnification / objectHeight * 40);
            ctx.lineTo(actualImageX + 20 * actualMagnification / objectHeight * 40, 
                     axisY - imageHeight + 45 * actualMagnification / objectHeight * 40);
            // 腿
            ctx.moveTo(actualImageX, axisY - 20 * actualMagnification / objectHeight * 40);
            ctx.lineTo(actualImageX - 15 * actualMagnification / objectHeight * 40, axisY);
            ctx.moveTo(actualImageX, axisY - 20 * actualMagnification / objectHeight * 40);
            ctx.lineTo(actualImageX + 15 * actualMagnification / objectHeight * 40, axisY);
            ctx.stroke();
        }
        
        // 繪製像標記點
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(actualImageX, axisY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 標記像高度
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // 凹透镜的像始终正立
        ctx.moveTo(actualImageX, axisY);
        ctx.lineTo(actualImageX, axisY - imageHeight);
        
        ctx.stroke();
        ctx.setLineDash([]); // 重置虚线样式
        
        // 在像底部顯示像距數值
        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 14px Arial';
        // 凹透镜的像距为负值
        const displayText = `v = ${imageDistance.toFixed(1)} cm`;
        
        // 決定文字位置，避免重疊
        const textX = actualImageX;
        const textY = axisY + 40; // 正立像 - 文本放在光轴下方
        
        // 繪製背景使文字更清晰
        const textWidth = ctx.measureText(displayText).width;
        const labelText = t('imageDistanceLabel');
        const labelWidth = ctx.measureText(labelText).width;
        const maxWidth = Math.max(textWidth, labelWidth);
        
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)'; // 使用藍色背景，更好區分
        ctx.fillRect(textX - maxWidth/2 - 5, textY - 14, maxWidth + 10, 36); // 高度增加以容纳两行文本
        
        // 繪製文字
        ctx.fillStyle = '#3498db';
        ctx.textAlign = 'center';
        ctx.fillText(displayText, textX, textY);
        
        // 添加小標籤說明
        ctx.font = '12px Arial';
        ctx.fillText(labelText, textX, textY + 16);
        
        return; // 凹透镜特殊处理完毕，直接返回
    }
    
    // 以下是凸透镜的正常处理逻辑（原有代码）
    const imageHeight = objectHeight * Math.abs(magnification); // 像高度
    
    // 检查是否是预设值情况2且物高大于等于8cm
    const isCase2WithTallObject = state.lensPosition === -12.0 && 
                                state.objectDistance === 10.0 && 
                                state.focalLength === 7.5;
    
    if (isObjectOnRight) {
        // 物體在右側
        // 使用物距和焦距的關係判斷：如果物體在焦點內側(|u| < f)，則為虛像
        isVirtualImage = Math.abs(state.objectDistance) < state.focalLength;
    } else {
        // 物體在左側
        // 像距為負時為虛像
        isVirtualImage = imageDistance < 0;
    }
    
    // 設置虛線或實線
    if (isVirtualImage) {
        ctx.setLineDash([5, 3]);  // 虛像使用虛線
    } else {
        ctx.setLineDash([]);  // 實像使用實線
    }
    
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;

    if (state.objectType === 'arrow') {
        // 繪製箭頭像
        ctx.beginPath();
        
        // 使用放大率符號直接判斷像是正立還是倒立
        if (magnification < 0) {
            // 倒立像
            ctx.moveTo(imageX, axisY);
            ctx.lineTo(imageX, axisY + imageHeight);
            
            // 根据像高度调整箭头显示
            if (imageHeightCm <= 0.2) {
                // 像高度小于或等于0.2cm时不显示箭头
                // 只保留垂直线
            } else if (imageHeightCm < 0.6) {
                // 像高度小于0.6cm时调整箭头比例
                const arrowSize = Math.max(5, 15 * (imageHeightCm / 0.6));
                ctx.lineTo(imageX - arrowSize/1.5, axisY + imageHeight - arrowSize);
                ctx.moveTo(imageX, axisY + imageHeight);
                ctx.lineTo(imageX + arrowSize/1.5, axisY + imageHeight - arrowSize);
            } else {
                // 正常显示箭头
                ctx.lineTo(imageX - 10, axisY + imageHeight - 15);
                ctx.moveTo(imageX, axisY + imageHeight);
                ctx.lineTo(imageX + 10, axisY + imageHeight - 15);
            }
        } else {
            // 正立像
            ctx.moveTo(imageX, axisY);
            ctx.lineTo(imageX, axisY - imageHeight);
            
            // 根据像高度调整箭头显示
            if (imageHeightCm <= 0.2) {
                // 像高度小于或等于0.2cm时不显示箭头
                // 只保留垂直线
            } else if (imageHeightCm < 0.6) {
                // 像高度小于0.6cm时调整箭头比例
                const arrowSize = Math.max(5, 15 * (imageHeightCm / 0.6));
                ctx.lineTo(imageX - arrowSize/1.5, axisY - imageHeight + arrowSize);
                ctx.moveTo(imageX, axisY - imageHeight);
                ctx.lineTo(imageX + arrowSize/1.5, axisY - imageHeight + arrowSize);
            } else {
                // 正常显示箭头
                ctx.lineTo(imageX - 10, axisY - imageHeight + 15);
                ctx.moveTo(imageX, axisY - imageHeight);
                ctx.lineTo(imageX + 10, axisY - imageHeight + 15);
            }
        }
        
        ctx.stroke();
    } else {
        // 繪製學生物體像（人形）
        ctx.beginPath();
        
        // 计算缩放比例，使用物体实际高度
        const scale = Math.abs(magnification);
        
        // 使用放大率符號直接判斷像是正立還是倒立
        if (magnification < 0) {
            // 倒立像 - 向下繪製
            // 頭部
            ctx.arc(imageX, axisY + imageHeight - 15 * scale, 
                  15 * scale, 0, Math.PI * 2);
            // 身體
            ctx.moveTo(imageX, axisY + imageHeight - 30 * scale);
            ctx.lineTo(imageX, axisY + 20 * scale);
            // 手臂
            ctx.moveTo(imageX - 20 * scale, 
                     axisY + imageHeight - 45 * scale);
            ctx.lineTo(imageX, axisY + imageHeight - 40 * scale);
            ctx.lineTo(imageX + 20 * scale, 
                     axisY + imageHeight - 45 * scale);
            // 腿
            ctx.moveTo(imageX, axisY + 20 * scale);
            ctx.lineTo(imageX - 15 * scale, axisY);
            ctx.moveTo(imageX, axisY + 20 * scale);
            ctx.lineTo(imageX + 15 * scale, axisY);
        } else {
            // 正立像
            // 頭部
            ctx.arc(imageX, axisY - imageHeight + 15 * scale, 
                  15 * scale, 0, Math.PI * 2);
            // 身體
            ctx.moveTo(imageX, axisY - imageHeight + 30 * scale);
            ctx.lineTo(imageX, axisY - 20 * scale);
            // 手臂
            ctx.moveTo(imageX - 20 * scale, 
                     axisY - imageHeight + 45 * scale);
            ctx.lineTo(imageX, axisY - imageHeight + 40 * scale);
            ctx.lineTo(imageX + 20 * scale, 
                     axisY - imageHeight + 45 * scale);
            // 腿
            ctx.moveTo(imageX, axisY - 20 * scale);
            ctx.lineTo(imageX - 15 * scale, axisY);
            ctx.moveTo(imageX, axisY - 20 * scale);
            ctx.lineTo(imageX + 15 * scale, axisY);
        }
        
        ctx.stroke();
    }
    
    // 繪製像標記點
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(imageX, axisY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 標記像高度
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    if (magnification < 0) {
        // 倒立像
        ctx.moveTo(imageX, axisY);
        ctx.lineTo(imageX, axisY + imageHeight);
    } else {
        // 正立像
        ctx.moveTo(imageX, axisY);
        ctx.lineTo(imageX, axisY - imageHeight);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 在像底部顯示像距數值
    ctx.fillStyle = '#3498db';
    ctx.font = 'bold 14px Arial';
    const displayText = `v = ${imageDistance.toFixed(1)} cm`;
    
    // 決定文字位置，避免重疊
    const textX = imageX;
    let textY;
    
    // 根据像是正立还是倒立调整文本位置
    if (magnification < 0) {
        // 倒立像 - 文本放在像的下方
        if (isCase2WithTallObject) {
            // 情况2特殊处理，避免文字位置过低
            textY = axisY + Math.min(imageHeight + 30, 80); // 限制文字垂直位置
        } else {
            textY = axisY + imageHeight + 30; // 在像下方显示
        }
    } else {
        // 正立像 - 文本放在光轴下方
        textY = axisY + 40; // 足够远离光轴
    }
    
    // 繪製背景使文字更清晰
    const textWidth = ctx.measureText(displayText).width;
    const labelText = t('imageDistanceLabel');
    const labelWidth = ctx.measureText(labelText).width;
    const maxWidth = Math.max(textWidth, labelWidth);
    
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)'; // 使用藍色背景，更好區分
    ctx.fillRect(textX - maxWidth/2 - 5, textY - 14, maxWidth + 10, 36); // 高度增加以容纳两行文本
    
    // 繪製文字
    ctx.fillStyle = '#3498db';
    ctx.textAlign = 'center';
    ctx.fillText(displayText, textX, textY);
    
    // 添加小標籤說明
    ctx.font = '12px Arial';
    ctx.fillText(labelText, textX, textY + 16);
}

// 繪製光線
// Draw rays
function drawRays(imageDistance) {
    // 當物距為0或像距無窮大時，不繪製光線
    if (state.objectDistance === 0 || !isFinite(imageDistance)) return;
    
    // 計算透鏡在畫布上的x座標
    // Calculate the x-coordinate of the lens on the canvas
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    
    // 計算物體頂點座標（使用畫布座標）
    // Calculate object vertex coordinates (using canvas coordinates)
    const objectTopX = canvas.width / 2 + pixelsPerCm * state.objectPosition;
    const axisY = canvas.height / 2; // 光轴Y坐标
    
    // 使用state中的物体高度，而不是固定值
    const objectHeight = state.objectHeight * pixelsPerCm;
    const objectTopY = canvas.height / 2 - objectHeight;
    
    // 計算像的位置和高度
    // Calculate image position and height
    const magnification = calculateMagnification(state.objectDistance, imageDistance);
    const imageHeight = objectHeight * Math.abs(magnification);
    const imageX = lensX + pixelsPerCm * imageDistance;
    
    // 確定透鏡類型
    const isConcave = state.lensType === 'concave';
    
    // 如果是凹透镜，像始终是正立的
    let imageTopY;
    if (isConcave) {
        // 凹透鏡的像始終是正立的
        imageTopY = canvas.height / 2 - imageHeight;
    } else {
        // 根據放大率確定像的頂點y座標
        const imageIsInverted = magnification < 0;
        imageTopY = imageIsInverted ? 
            canvas.height / 2 + imageHeight : // 倒立 (inverted)
            canvas.height / 2 - imageHeight;  // 正立 (erect)
    }
    
    // 凹透镜的像始终是虚像
    let isVirtualImage;
    if (isConcave) {
        isVirtualImage = true; // 凹透镜始终形成虚像
    } else {
        // 凸透镜的判断逻辑
        isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < state.focalLength) || 
                         (state.objectDistance > 0 && imageDistance < 0);
    }
    
    // 检查物体是否在透镜右侧
    const isObjectOnRight = state.objectDistance < 0;
    
    const rayStrokeStyle = isVirtualImage ? 
        'rgba(113, 128, 150, 0.7)' : // 虛像 Virtual image
        'rgba(229, 62, 62, 0.7)';    // 實像 Real image
    
    // 計算實際的物體頂部和像頂部位置
    const objectTop = objectTopY;
    const imageTop = imageTopY;
    
    // 只有像距有限時才繪製光線
    if (!isFinite(imageDistance)) return;
    
    // 添加辅助函数检查像是否在光轴上
    function isImageOnAxis(imageTopY) {
        return Math.abs(imageTopY - axisY) < 1;
    }
    
    // 規則1: 平行光線→經過焦點
    if (state.rules.rule1) {
        const absF = Math.abs(state.focalLength);
        const isConcave = state.lensType === 'concave';
        
        // 根據透鏡類型確定焦點位置
        const f1X = isConcave ? lensX - absF * pixelsPerCm : lensX + absF * pixelsPerCm; // 右焦點F
        const f2X = isConcave ? lensX + absF * pixelsPerCm : lensX - absF * pixelsPerCm; // 左焦點F
        
        ctx.strokeStyle = '#e74c3c'; // 紅色
        ctx.lineWidth = 2;
        ctx.setLineDash([]); // 實線
        ctx.beginPath();
        
        if (!isObjectOnRight) {
            // 物體在左側
            // 從物體頂部發出平行於光軸的光線
            ctx.moveTo(objectTopX, objectTop);
            ctx.lineTo(lensX, objectTop);
            
            if (isConcave) {
                // 凹透鏡的情況：光線遠離焦點折射，形成虛像
                // 計算從透鏡通過的光線的斜率
                const slope = (objectTop - axisY) / (f1X - lensX);
                
                // 延長線的座標（向右延伸）
                const extendX = lensX + 200;
                const extendY = objectTop - slope * (extendX - lensX);
                
                // 繪製實線部分
                ctx.lineTo(extendX, extendY);
                ctx.stroke();
                
                // 繪製虛線部分（往回指向虛焦點）
                ctx.beginPath();
                ctx.setLineDash([5, 3]); // 虤線
                ctx.moveTo(lensX, objectTop);
                ctx.lineTo(f1X, axisY);
                ctx.stroke();
                ctx.setLineDash([]); // 重置為實線
                
                // 物體到透鏡的箭頭
                const arrowX1 = objectTopX + (lensX - objectTopX) * 0.5;
                drawArrow(objectTopX, objectTop, arrowX1, objectTop, '#e74c3c');
                
                // 透鏡往右延伸的箭頭（實線部分）
                const arrowX2 = lensX + 60;
                const arrowY2 = objectTop - slope * 60;
                drawArrow(lensX, objectTop, arrowX2, arrowY2, '#e74c3c');
            } else {
                // 凸透鏡的原始邏輯
                // 光線通過透鏡後的路徑
                if (!isVirtualImage) {
                    // 實像：平行光線必須穿過焦點
                    ctx.lineTo(f1X, axisY);
                    
                    // 從焦點延伸到像點（如果像點位於焦點後方）
                    if (imageX > f1X) {
                        ctx.lineTo(imageX, imageTop);
                    }
                    ctx.stroke();
                    
                    // 物體到透鏡的箭頭
                    const arrowX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    drawArrow(objectTopX, objectTop, arrowX1, objectTop, '#e74c3c');
                    
                    // 透鏡右側到像點的箭頭
                    if (imageX > f1X) {
                        const arrowX3 = f1X + (imageX - f1X) * 0.5;
                        const arrowY3 = axisY + (imageTop - axisY) * 0.5;
                        drawArrow(f1X, axisY, arrowX3, arrowY3, '#e74c3c');
                    } else {
                        // 如果像點與焦點重合或在焦點前方，則箭頭指向焦點
                        const arrowX2 = lensX + (f1X - lensX) * 0.5;
                        const arrowY2 = objectTop + (axisY - objectTop) * 0.5;
                        drawArrow(lensX, objectTop, arrowX2, arrowY2, '#e74c3c');
                    }
                } else {
                    // 虛像：光線向焦點方向延伸，但被反向折射
                    // 透鏡右側的光線必須直接連到焦點，不管物距和焦距的關係
                    ctx.lineTo(f1X, axisY);
         
                    // 計算從透鏡頂部到焦點的斜率
                    const slopeToF = (axisY - objectTop) / (f1X - lensX);
                    
                    // 延伸線的末端座標
                    const extendX = f1X + 150; // 延伸足夠遠的距離
                    const extendY = axisY + slopeToF * (extendX - f1X); // 沿著原方向延伸
                    
                    // 從焦點延伸直線
                    ctx.lineTo(extendX, extendY);
                    
                    // 繪製實線部分
                    ctx.stroke();
                    
                    // 添加虛線部分（從透鏡的穿透點到虛像頂部的虛線，不添加箭頭）
                    ctx.beginPath();
                    ctx.strokeStyle = '#e74c3c'; // 紅色
                    ctx.setLineDash([5, 3]); // 虤線
                    ctx.moveTo(lensX, objectTop);
                    ctx.lineTo(imageX, imageTop);
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置為實線
                    
                    // 物體到透鏡的箭頭
                    const arrowX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    drawArrow(objectTopX, objectTop, arrowX1, objectTop, '#e74c3c');
                    
                    // 透鏡右側的箭頭（實線部分）
                    const arrowX3 = f1X + 50;
                    const arrowY3 = axisY + slopeToF * 50;
                    drawArrow(f1X, axisY, arrowX3, arrowY3, '#e74c3c');
                }
            }
        } else {
            // 物體在右側
            // 從物體頂部發出與光軸平行的光線
            ctx.moveTo(objectTopX, objectTop);
            ctx.lineTo(lensX, objectTop);
            
            if (isConcave) {
                // 凹透鏡的情況：光線偏離焦點方向折射，形成虛像
                // 計算從透鏡通過的光線的斜率
                const slope = (objectTop - axisY) / (f2X - lensX);
                
                // 延長線的座標（向左延伸）
                const extendX = lensX - 200;
                const extendY = objectTop + slope * (lensX - extendX);
                
                // 繪製實線部分
                ctx.lineTo(extendX, extendY);
                ctx.stroke();
                
                // 繪製虛線部分（往回指向左側虛焦點 - 不论物体在凹透镜左侧还是右侧）
                ctx.beginPath();
                ctx.setLineDash([5, 3]); // 虤線
                ctx.moveTo(lensX, objectTop);
                ctx.lineTo(f2X, axisY); // 对于凹透镜，始终将橙色虚线连接到左侧焦点
                ctx.stroke();
                ctx.setLineDash([]); // 重置為實線
                
                // 物體到透鏡的箭頭
                const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                drawArrow(objectTopX, objectTop, midX1, objectTop, '#e74c3c');
                
                // 透鏡往左延伸的箭頭（實線部分）
                const arrowX = lensX - 60;
                const arrowY = objectTop + slope * 60;
                drawArrow(lensX, objectTop, arrowX, arrowY, '#e74c3c');
            } else {
                // 凸透鏡的原始邏輯
                // 計算從透鏡頂部到焦點的斜率（用於確定光線方向）
                const slopeToF = (axisY - objectTop) / (f2X - lensX);
                
                // 從透鏡到左側焦點F2
                ctx.lineTo(f2X, axisY);
                
                // 光線穿過透鏡後折射
                if (Math.abs(state.objectDistance) < absF) {
                    // 物體在焦點內側，形成虛像
                    
                    // 從左焦點往左延伸，保持直線方向
                    const extendX = f2X - 200; // 向左延伸
                    // 計算延伸線的Y坐標，保持與透鏡-焦點線段相同的斜率
                    const extendY = axisY - slopeToF * (f2X - extendX);
                    ctx.lineTo(extendX, extendY);
                    ctx.stroke();
                    
                    // 添加虛線部分（從透鏡穿透點到虛像頂部的虛線，不添加箭頭）
                    ctx.beginPath();
                    ctx.strokeStyle = '#e74c3c'; // 紅色
                    ctx.setLineDash([5, 3]); // 虤線
                    ctx.moveTo(lensX, objectTop);
                    ctx.lineTo(imageX, imageTop);
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置為實線
                    
                    // 物體到透鏡的箭頭
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, objectTop, '#e74c3c');
                    
                    // 透鏡到左側焦點的箭頭
                    const midX2 = lensX - (lensX - f2X) * 0.5;
                    const midY2 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(lensX, objectTop, midX2, midY2, '#e74c3c');
                    
                    // 左側焦點向左延伸的箭頭，沿著原來的方向
                    const arrowX = f2X - 60;
                    const arrowY = axisY - slopeToF * 60;
                    drawArrow(f2X, axisY, arrowX, arrowY, '#e74c3c');
                } else {
                    // 物體在焦點外側，形成實像
                    
                    // 如果像點在焦點之前，從焦點連到像點
                    if (imageX < f2X) {
                        ctx.lineTo(imageX, imageTop);
                    } else {
                        // 如果像點在焦點之後或重合，需要從焦點向左延伸
                        const extendX = f2X - 200; // 向左延伸
                        // 計算延伸線的Y坐標，保持與透鏡-焦點線段相同的斜率
                        const extendY = axisY - slopeToF * (f2X - extendX);
                        ctx.lineTo(extendX, extendY);
                    }
                    ctx.stroke();
                    
                    // 物體到透鏡的箭頭
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, objectTop, '#e74c3c');
                    
                    // 透鏡到左側焦點的箭頭
                    const midX2 = lensX - (lensX - f2X) * 0.5;
                    const midY2 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(lensX, objectTop, midX2, midY2, '#e74c3c');
                    
                    // 如果像點在焦點之前，添加從焦點到像點的箭頭
                    if (imageX < f2X) {
                        const midX3 = f2X - (f2X - imageX) * 0.5;
                        const midY3 = axisY + (imageTop - axisY) * 0.5;
                        drawArrow(f2X, axisY, midX3, midY3, '#e74c3c');
                    } else {
                        // 如果像點在焦點之後或重合，添加從焦點向左的箭頭，沿著原來的方向
                        const arrowX = f2X - 60;
                        const arrowY = axisY - slopeToF * 60;
                        drawArrow(f2X, axisY, arrowX, arrowY, '#e74c3c');
                    }
                }
            }
        }
    }
    
    // 規則2: 通過中心的光線
    if (state.rules.rule2) {
        ctx.strokeStyle = '#27ae60'; // 綠色
        ctx.lineWidth = 2;
        ctx.setLineDash([]); // 實線
        
        // 计算从物体顶部到透镜中心的斜率
        const slope = (objectTop - axisY) / (objectTopX - lensX);
        
        if (isVirtualImage) {
            // 虛像情况
            
            // 计算光线实际延伸方向的斜率
            const isWithinFocal = Math.abs(state.objectDistance) < Math.abs(state.focalLength);
            
            // 计算物体是否在f到2f的范围内（针对凹透镜的特殊处理）
            // 注意：对于凹透镜，焦距是负值，所以需要取绝对值比较
            const absF = Math.abs(state.focalLength);
            const isWithinFTo2F = isConcave && (Math.abs(state.objectDistance) >= absF && Math.abs(state.objectDistance) <= 2 * absF);
            // 判断物体是否大于2f（针对凹透镜）
            const isGreaterThan2F = isConcave && (Math.abs(state.objectDistance) > 2 * absF);
            // 判断物体是否在凹透镜右侧
            const isObjectOnRightSideOfConcave = isConcave && state.objectDistance < 0;
            
            // 当物体在凹透镜右侧时，计算实际的像位置
            let actualImageX = imageX;
            if (isObjectOnRightSideOfConcave) {
                // 对于物体在凹透镜右侧的情况，像应该显示在透镜右侧
                actualImageX = lensX - imageDistance * pixelsPerCm; // 因为imageDistance是负的，所以这里用减法
            }
            
            if (isWithinFocal || isWithinFTo2F || isGreaterThan2F || isObjectOnRightSideOfConcave) {
                // 物体在焦距内 或 凹透镜且物体在f到2f范围内 或 凹透镜且物体大于2f 或 物体在凹透镜右侧
                // 1. 先绘制物体到透镜中心再延伸到足够远的实线部分
                ctx.beginPath();
                ctx.setLineDash([]); // 实线
                ctx.moveTo(objectTopX, objectTop);
                ctx.lineTo(lensX, axisY);
                
                // 计算光线向另一侧延伸的方向
                let extendX;
                if (objectTopX < lensX) { // 物体在左侧
                    extendX = lensX + 300; // 向右延伸
                } else { // 物体在右侧
                    extendX = lensX - 300; // 向左延伸
                }
                const extendY = axisY + slope * (extendX - lensX); // 使用正确的斜率计算延伸点Y坐标
                
                // 绘制透镜中心向另一侧延伸的实线
                ctx.lineTo(extendX, extendY);
                ctx.stroke();
                
                // 2. 添加物体到透镜中心的箭头
                if (objectTopX < lensX) { // 物体在左侧
                    const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    const midY1 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
                } else { // 物体在右侧
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    const midY1 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
                }
                
                // 3. 在透镜中心向另一侧的实线上添加箭头
                if (objectTopX < lensX) { // 物体在左侧，光线向右延伸
                    const arrowX = lensX + 100;
                    const arrowY = axisY + slope * (arrowX - lensX);
                    drawArrow(lensX, axisY, arrowX, arrowY, '#27ae60');
                } else { // 物体在右侧，光线向左延伸
                    const arrowX = lensX - 100;
                    const arrowY = axisY + slope * (arrowX - lensX);
                    drawArrow(lensX, axisY, arrowX, arrowY, '#27ae60');
                }
                
                // 4. 绘制虚线部分 (从透镜中心到虚像顶端)
                // 在凹透镜的f至2f范围内或大于2f时或物体在凹透镜右侧时不需要绘制该虚线
                if (!isWithinFTo2F && !isGreaterThan2F && !isObjectOnRightSideOfConcave) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#27ae60'; // 保持绿色
                    ctx.setLineDash([5, 3]); // 虚线
                    ctx.moveTo(lensX, axisY);
                    ctx.lineTo(actualImageX, imageTop); // 使用正确的像位置
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置为实线
                }
            } else {
                // 物体不在焦距内: 按原逻辑处理
                // 从物体顶部发出通过透镜中心的光线
                ctx.beginPath();
                ctx.setLineDash([]); // 实线
                ctx.moveTo(objectTopX, objectTop);
                ctx.lineTo(lensX, axisY);
                
                // 计算光线实际延伸的方向
                let extendX;
                if (imageX < lensX) { // 虚像在左侧 (物体在右侧)
                    extendX = lensX - 300; // 向左延伸
                } else { // 虚像在右侧 (物体在左侧)
                    extendX = lensX + 300; // 向右延伸
                }
                const extendY = axisY + slope * (extendX - lensX); // 使用正确的斜率计算延伸点Y坐标
                
                // 绘制实线部分 (从透镜中心到实际延伸方向)
                ctx.lineTo(extendX, extendY);
                ctx.stroke();
                
                // 物体到透镜中心的箭头
                if (objectTopX < lensX) { // 物体在左侧
                    const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    const midY1 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
                } else { // 物体在右侧
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    const midY1 = objectTop + (axisY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
                }
                
                // 在实线部分添加箭头 (光线实际延伸方向)
                if (imageX < lensX) { // 向左延伸
                    const arrowX = lensX - 100;
                    const arrowY = axisY + slope * (arrowX - lensX);
                    drawArrow(lensX, axisY, arrowX, arrowY, '#27ae60');
                } else { // 向右延伸
                    const arrowX = lensX + 100;
                    const arrowY = axisY + slope * (arrowX - lensX);
                    drawArrow(lensX, axisY, arrowX, arrowY, '#27ae60');
                }
                
                // 绘制虚线部分 (从透镜中心到虚像顶部，不添加箭头)
                ctx.beginPath();
                ctx.strokeStyle = '#27ae60'; // 保持绿色
                ctx.setLineDash([5, 3]); // 虚线
                ctx.moveTo(lensX, axisY);
                ctx.lineTo(actualImageX, imageTop); // 使用正确的像位置
                ctx.stroke();
                ctx.setLineDash([]); // 重置为实线
            }
        } else {
            // 實像情况: 实线从物体顶部经过透镜中心延伸到像顶部
            ctx.beginPath();
            ctx.moveTo(objectTopX, objectTop);
            ctx.lineTo(lensX, axisY);
            
            if (isImageOnAxis(imageTop)) {
                // 像点在光轴上，直接延伸到轴上对应位置
                ctx.lineTo(imageX, axisY);
            } else {
                // 像点不在光轴上，延伸到像点顶部
                ctx.lineTo(imageX, imageTop);
            }
            ctx.stroke();
            
            // 物體到透鏡中心的箭頭
            if (objectTopX < lensX) { // 物體在左側
                const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                const midY1 = objectTop + (axisY - objectTop) * 0.5;
                drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
            } else { // 物體在右側
                const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                const midY1 = objectTop + (axisY - objectTop) * 0.5;
                drawArrow(objectTopX, objectTop, midX1, midY1, '#27ae60');
            }
            
            // 透鏡中心到像的箭頭 (實線部分)
            if (imageX > lensX) { // 像在右側
                const midX2 = lensX + (imageX - lensX) * 0.5;
                const midY2 = axisY + (imageTop - axisY) * 0.5;
                drawArrow(lensX, axisY, midX2, midY2, '#27ae60');
            } else { // 像在左側
                const midX2 = lensX - (lensX - imageX) * 0.5;
                const midY2 = axisY + (imageTop - axisY) * 0.5;
                drawArrow(lensX, axisY, midX2, midY2, '#27ae60');
            }
        }
    }
    
    // 規則3: 經過焦點→平行光線
    if (state.rules.rule3) {
        const absF = Math.abs(state.focalLength);
        const isConcave = state.lensType === 'concave';
        
        // 根據透鏡類型確定焦點位置 - 与规则1保持相同的计算方式
        const f1X = isConcave ? lensX - absF * pixelsPerCm : lensX + absF * pixelsPerCm; // 右焦點F
        const f2X = isConcave ? lensX + absF * pixelsPerCm : lensX - absF * pixelsPerCm; // 左焦點F
        
        ctx.strokeStyle = '#f39c12'; // 橙色
        ctx.lineWidth = 2;
        ctx.setLineDash([]); // 實線
        ctx.beginPath();
        
        // 判断是否为虚像且物体距离小于焦距
        const isWithinFocal = Math.abs(state.objectDistance) < state.focalLength;
        
        if (!isObjectOnRight) {
            // 物體在左側 - 原邏輯
            // 從物體頂部發出經過第二焦點的光線
            ctx.moveTo(objectTopX, objectTop);
            
            // 計算通過焦點的光線方向和穿過透鏡的點
            let throughY;
            
            if (objectTopX <= f2X) {
                // 如果物體在焦點之前或重合，使用不同的方法計算
                ctx.lineTo(f2X, axisY); // 先連到焦點
                
                // 計算從焦點到透鏡的直線方程
                const slopeAfterF = (objectTop - axisY) / (objectTopX - f2X);
                throughY = axisY + slopeAfterF * (lensX - f2X);
                
                // 從焦點連到透鏡
                ctx.lineTo(lensX, throughY);
            } else {
                // 計算從物體頂部到焦點的方向
                const dirX = f2X - objectTopX;
                const dirY = axisY - objectTop;
                
                // 如果物體在焦點之後，需要延長直線
                const slope = dirY / dirX;
                throughY = objectTop + slope * (lensX - objectTopX);
                
                // 連接到透鏡
                ctx.lineTo(lensX, throughY);
            }
            
            // 光線通過透鏡後平行於光軸
            if (!isVirtualImage) {
                // 實像：光線平行於光軸延伸到像點
                ctx.lineTo(imageX, throughY);
                ctx.lineTo(imageX, imageTop);
                ctx.stroke();
                
                // 繪製物體到透鏡的箭頭
                const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                const midY1 = objectTop + (throughY - objectTop) * 0.5;
                drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                
                // 繪製水平光線部分的箭頭
                const midX2 = lensX + (imageX - lensX) * 0.5;
                drawArrow(lensX, throughY, midX2, throughY, '#f39c12');
                
                // 如果像點不在同一水平線上，添加垂直箭頭
                if (Math.abs(throughY - imageTop) > 1) {
                    const midY2 = throughY + (imageTop - throughY) * 0.5;
                    drawArrow(imageX, throughY, imageX, midY2, '#f39c12');
                }
            } else {
                // 虛像：光線平行於光軸往右延伸，但似乎來自虛像
                
                // 检查是否是凹透镜或物距小于焦距
                if (isConcave || (isWithinFocal && objectTopX > f2X)) {
                    // 当是凹透镜或物距小于焦距且物体在透镜左侧时
                    
                    // 先绘制物体到透镜的实线部分
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([]); // 实线
                    ctx.moveTo(objectTopX, objectTop);
                    ctx.lineTo(lensX, throughY);
                    ctx.stroke();
                    
                    // 如果是凹透镜，连接到右侧焦点的线应为虚线
                    if (isConcave) {
                        // 凹透镜情况下，无论物体位置如何，始终连接到右侧焦点 f2X
                        ctx.beginPath();
                        ctx.strokeStyle = '#f39c12'; // 橙色
                        ctx.setLineDash([5, 3]); // 虚线
                        // 从透镜向右侧焦点延伸
                        ctx.moveTo(lensX, throughY);
                        ctx.lineTo(f2X, axisY); // 延伸到右侧焦点 f2X
                        ctx.stroke();
                        ctx.setLineDash([]); // 重置为实线
                    } else {
                        // 凸透镜情况下，物体在透镜左侧F以内，虚像在左侧。光线似乎从左侧F发出，通过物体顶部射向透镜。
                        // 因此，从透镜向左延伸到左侧焦点 f2X 应为虚线。
                        ctx.beginPath();
                        ctx.strokeStyle = '#f39c12'; // 橙色
                        ctx.setLineDash([5, 3]); // 虚线
                        // 如果物距小于焦距且在左侧，光线路径是 F2X -> ObjectTop -> Lens
                        // 绘制从透镜到左侧焦点的虚线，但这会覆盖 ObjectTop 到 Lens 的实线
                        // 更好的做法是只绘制 f2X 到 ObjectTop 的虚线
                        ctx.moveTo(f2X, axisY);
                        ctx.lineTo(objectTopX, objectTop);
                        ctx.stroke();
                        ctx.setLineDash([]); // 重置为实线
                    }
                    
                    // 绘制透镜右侧的平行光线（实线）
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([]); // 实线
                    const extendX = lensX + 200; // 向右延伸
                    ctx.moveTo(lensX, throughY);
                    ctx.lineTo(extendX, throughY);
                    ctx.stroke();
                    
                    // 从透镜到虚像的虚线
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虚线
                    ctx.moveTo(lensX, throughY);
                    
                    // 使用正确的像位置计算
                    let virtualImageX = imageX;
                    if (isConcave) {
                        virtualImageX = isObjectOnRight ? 
                            lensX - imageDistance * pixelsPerCm : // 物体在右侧
                            imageX; // 物体在左侧
                    }
                    
                    ctx.lineTo(virtualImageX, imageTop);
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置为实线
                    
                    // 物体到透镜的箭头
                    const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    const midY1 = objectTop + (throughY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                    
                    // 透镜右侧平行光线的箭头
                    const midX2 = lensX + 60;
                    drawArrow(lensX, throughY, midX2, throughY, '#f39c12');
                } else {
                    // 原始代码 - 物距不小于焦距或物体不在透镜左侧
                    const extendX = lensX + 200; // 足夠遠
                    ctx.lineTo(extendX, throughY);
                    ctx.stroke();
                    
                    // 從透鏡延伸的虛線到虛像
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虤線
                    ctx.moveTo(lensX, throughY);
                    
                    // 使用正确的像位置计算
                    let virtualImageX = imageX;
                    if (isConcave) {
                        virtualImageX = isObjectOnRight ? 
                            lensX - imageDistance * pixelsPerCm : // 物体在右侧
                            imageX; // 物体在左侧
                    }
                    
                    ctx.lineTo(virtualImageX, imageTop);
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置為實線
                    
                    // 繪製物體到透鏡的箭頭
                    const midX1 = objectTopX + (lensX - objectTopX) * 0.5;
                    const midY1 = objectTop + (throughY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                    
                    // 繪製水平光線部分的箭頭（實線部分）
                    const midX2 = lensX + 60;
                    drawArrow(lensX, throughY, midX2, throughY, '#f39c12');
                    
                    // 虤線部分不添加箭頭
                }
            }
        } else {
            // 物體在右側 - 從物體頂部出發
            
            // 計算光線穿過透鏡的位置
            const slopeToF = (axisY - objectTop) / (f1X - objectTopX);
            const throughY = objectTop + slopeToF * (lensX - objectTopX);
            
            if (isWithinFocal) {
                // 物體在焦點內側，形成虛像
                // 从物体顶部到透镜为实线
                ctx.moveTo(objectTopX, objectTop);
                ctx.lineTo(lensX, throughY);
                ctx.stroke();
                
                // 根据透镜类型处理
                if (isConcave) {
                    // 凹透镜情况 - 只连接到左侧焦点
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虚线
                    // 从透镜向左延伸到左侧焦点
                    ctx.moveTo(lensX, throughY);
                    ctx.lineTo(f1X, axisY); // 延伸到左侧焦点
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置为实线
                } else {
                    // 凸透镜原始逻辑
                    // 添加虚线部分 - 从透镜延伸到焦点
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虚线
                    ctx.moveTo(lensX, throughY);
                    ctx.lineTo(f1X, axisY); // 延伸到右侧焦点(凸透镜情况)
                    ctx.stroke();
                }
                
                // 从透镜向左延伸的平行光线（实线部分）
                ctx.beginPath();
                ctx.strokeStyle = '#f39c12'; // 橙色
                ctx.setLineDash([]); // 實線
                const extendX = lensX - 200; // 向左延伸
                ctx.moveTo(lensX, throughY);
                ctx.lineTo(extendX, throughY);
                ctx.stroke();
                
                // 从透镜到虚像的虚线部分
                ctx.beginPath();
                ctx.strokeStyle = '#f39c12'; // 橙色
                ctx.setLineDash([5, 3]); // 虤線
                ctx.moveTo(lensX, throughY);
                
                // 使用正确的像位置计算
                let actualImageX = imageX;
                if (isConcave && state.objectDistance < 0) { // 凹透镜且物体在右侧
                    actualImageX = lensX - imageDistance * pixelsPerCm; // 因为imageDistance是负的
                }
                
                ctx.lineTo(actualImageX, imageTop);
                ctx.stroke();
                ctx.setLineDash([]); // 重置為實線
                
                // 物體到透鏡的箭頭
                const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                const midY1 = objectTop + (throughY - objectTop) * 0.5;
                drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                
                // 左側平行光線的箭頭（實線部分）
                const midX3 = lensX - 60;
                drawArrow(lensX, throughY, midX3, throughY, '#f39c12');
                
                // 虤線部分不添加箭頭
            } else {
                // 物體在焦點外側，形成實像或在凹透镜右侧
                
                // 凹透镜特殊处理
                if (isConcave) {
                    // 物体在凹透镜右侧
                    
                    // 从物体顶部到透镜中点的实线
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([]); // 实线
                    ctx.moveTo(objectTopX, objectTop);
                    ctx.lineTo(lensX, throughY);
                    ctx.stroke();
                    
                    // 添加从物体顶端穿过透镜延长到左侧焦点的橙色虚线
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虚线
                    // 从透镜向左延伸到左侧焦点
                    ctx.moveTo(lensX, throughY);
                    ctx.lineTo(f1X, axisY); // 延伸到左侧焦点
                    ctx.stroke();
                    
                    // 从透镜向左延伸的平行光线（实线部分）
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([]); // 实线
                    const extendX = lensX - 200; // 向左延伸
                    ctx.moveTo(lensX, throughY);
                    ctx.lineTo(extendX, throughY);
                    ctx.stroke();
                    
                    // 添加从透镜到虚像的虚线
                    ctx.beginPath();
                    ctx.strokeStyle = '#f39c12'; // 橙色
                    ctx.setLineDash([5, 3]); // 虚线
                    ctx.moveTo(lensX, throughY);
                    
                    // 使用正确的像位置计算
                    let actualImageX = imageX;
                    if (state.objectDistance < 0) { // 物体在右侧
                        actualImageX = lensX - imageDistance * pixelsPerCm; // 因为imageDistance是负的
                    }
                    
                    ctx.lineTo(actualImageX, imageTop);
                    ctx.stroke();
                    ctx.setLineDash([]); // 重置为实线
                    
                    // 物体到透镜的箭头
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    const midY1 = objectTop + (throughY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                    
                    // 左侧平行光线的箭头
                    const midX3 = lensX - 60;
                    drawArrow(lensX, throughY, midX3, throughY, '#f39c12');
                    
                } else {
                    // 凸透鏡原始邏輯 - 物体在焦点外侧
                    // 從物體頂部開始繪製
                    ctx.moveTo(objectTopX, objectTop);
                    // 連到透鏡
                    ctx.lineTo(lensX, throughY);
                    // 穿過透鏡後平行於光軸（向左）
                    ctx.lineTo(imageX, throughY);
                    
                    // 沿著平行光線垂直連到像點
                    ctx.lineTo(imageX, imageTop);
                    ctx.stroke();
                    
                    // 物體到透鏡的箭頭
                    const midX1 = objectTopX - (objectTopX - lensX) * 0.5;
                    const midY1 = objectTop + (throughY - objectTop) * 0.5;
                    drawArrow(objectTopX, objectTop, midX1, midY1, '#f39c12');
                    
                    // 左側平行光線的箭頭
                    const midX3 = lensX - (lensX - imageX) * 0.5;
                    drawArrow(lensX, throughY, midX3, throughY, '#f39c12');
                    
                    // 垂直到像點的箭頭
                    if (Math.abs(throughY - imageTop) > 1) {
                        const midY3 = throughY + (imageTop - throughY) * 0.5;
                        drawArrow(imageX, throughY, imageX, midY3, '#f39c12');
                    }
                }
            }
        }
    }
    
    // Add animation effects for rays
    if (isVirtualImage) {
        // Add soft glow effect for virtual rays
        ctx.shadowColor = 'rgba(113, 128, 150, 0.4)';
        ctx.shadowBlur = 4;
    } else {
        // Add stronger glow effect for real rays
        ctx.shadowColor = 'rgba(229, 62, 62, 0.5)';
        ctx.shadowBlur = 6;
    }
    
    // Reset shadow effects
    ctx.shadowBlur = 0;
}

// 繪製光線箭頭
function drawArrow(fromX, fromY, toX, toY, color, isDashed = false) {
    const headLength = 10; // 增大箭頭大小使其更加明顯
    const headWidth = Math.PI/6; // 調整箭頭寬度
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // 如果是虛線箭頭，設置虛線樣式
    if (isDashed) {
        ctx.setLineDash([5, 3]);
    } else {
        ctx.setLineDash([]);
    }
    
    // 繪製箭頭線段
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // 繪製箭頭頭部
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - headWidth), 
               toY - headLength * Math.sin(angle - headWidth));
    ctx.lineTo(toX - headLength * Math.cos(angle + headWidth), 
               toY - headLength * Math.sin(angle + headWidth));
    ctx.closePath();
    ctx.fill();
    
    // 重置為實線
    ctx.setLineDash([]);
}

// 繪製虛線上的箭頭（簡化版本，只在虛線中間放置一個箭頭）
function drawArrowOnDashedLine(fromX, fromY, toX, toY, color) {
    // 繪製虛線
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]); // 虛線樣式
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // 計算虛線中點
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    // 箭頭參數
    const headLength = 10;
    const headWidth = Math.PI/6;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // 繪製中點的箭頭
    ctx.setLineDash([]); // 實線箭頭
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - headLength/2 * Math.cos(angle - headWidth),
               midY - headLength/2 * Math.sin(angle - headWidth));
    ctx.lineTo(midX - headLength/2 * Math.cos(angle + headWidth),
               midY - headLength/2 * Math.sin(angle + headWidth));
    ctx.closePath();
    ctx.fill();
    
    // 重置為實線
    ctx.setLineDash([]);
}

// 事件監聽器
function setupEventListeners() {
    // 物体选择单选按钮
    document.querySelectorAll('input[name="object"]').forEach(radio => {
        radio.addEventListener('change', function() {
            state.objectType = this.value;
            draw();
        });
    });
    
    // 物距滑块
    const objectDistanceSlider = document.getElementById('objectDistanceSlider');
    const objectDistanceInput = document.getElementById('objectDistanceInput');
    const objectDistanceValue = document.getElementById('objectDistanceValue');
    
    objectDistanceSlider.addEventListener('input', () => updateObjectDistance(objectDistanceSlider.value));
    objectDistanceInput.addEventListener('change', () => updateObjectDistance(objectDistanceInput.value));
    
    // 物高滑块
    const objectHeightSlider = document.getElementById('objectHeightSlider');
    const objectHeightInput = document.getElementById('objectHeightInput');
    const objectHeightValue = document.getElementById('objectHeightValue');
    
    objectHeightSlider.addEventListener('input', () => updateObjectHeight(objectHeightSlider.value));
    objectHeightInput.addEventListener('change', () => updateObjectHeight(objectHeightInput.value));
    
    // 焦距滑块
    const focalLengthSlider = document.getElementById('focalLengthSlider');
    const focalLengthInput = document.getElementById('focalLengthInput');
    const currentFocalLength = document.getElementById('currentFocalLength');
    
    focalLengthSlider.addEventListener('input', () => updateFocalLength(focalLengthSlider.value));
    focalLengthInput.addEventListener('change', () => updateFocalLength(focalLengthInput.value));
    
    // 透镜位置滑块
    const lensPositionSlider = document.getElementById('lensPositionSlider');
    const lensPositionInput = document.getElementById('lensPositionInput');
    const lensPositionValue = document.getElementById('lensPositionValue');
    
    lensPositionSlider.addEventListener('input', () => updateLensPosition(lensPositionSlider.value));
    lensPositionInput.addEventListener('change', () => updateLensPosition(lensPositionInput.value));
    
    // 光线规则复选框
    document.getElementById('rule1').addEventListener('change', function() {
        state.rules.rule1 = this.checked;
        draw();
    });
    
    document.getElementById('rule2').addEventListener('change', function() {
        state.rules.rule2 = this.checked;
        draw();
    });
    
    document.getElementById('rule3').addEventListener('change', function() {
        state.rules.rule3 = this.checked;
        draw();
    });
    
    // 显示选项复选框
    document.getElementById('showGrid').addEventListener('change', function() {
        state.display.grid = this.checked;
        draw();
    });
    
    document.getElementById('showMeasurements').addEventListener('change', function() {
        state.display.measurements = this.checked;
        // 當重新啟用測量時，確保立即更新數據
        if (state.display.measurements) {
            updateMeasurements();
        }
        draw();
    });
    
    document.getElementById('showImage').addEventListener('change', function() {
        state.display.image = this.checked;
        draw();
    });
    
    // 屏幕显示选项复选框
    document.getElementById('showScreen').addEventListener('change', function() {
        state.display.screen = this.checked;
        draw();
    });
    
    // 光束显示选项复选框
    document.getElementById('showBundleRays').addEventListener('change', function() {
        state.display.bundleRays = this.checked;
        draw();
    });
}

// 更新物距值
// Update object distance
function updateObjectDistance(value) {
    // 解析并限制物距值的范围
    value = parseFloat(value);
    
    // 验证值的有效性
    if (isNaN(value)) {
        value = state.objectDistance;
    }
    
    // 限制在允许范围内
    if (value < -30) value = -30;
    if (value > 30) value = 30;
    
    // 设置新的物距值
    const oldObjectDistance = state.objectDistance;
    state.objectDistance = value;
    
    // 更新物体的绝对位置，保持物距与镜头的相对位置关系正确
    state.objectPosition = state.lensPosition - state.objectDistance;
    
    // 如果是凹透镜，验证参数有效性
    if (state.lensType === 'concave') {
        validateConcaveParams(state.focalLength, state.objectDistance);
    }
    
    // 更新滑块和输入框的值
    const slider = document.getElementById('objectDistanceSlider');
    const input = document.getElementById('objectDistanceInput');
    
    slider.value = value;
    input.value = value.toFixed(1);
    
    // 更新物距显示
    document.getElementById('objectDistanceValue').textContent = value.toFixed(1) + ' cm';
    
    // 如果物距发生明显变化，更新测量数据
    if (Math.abs(oldObjectDistance - state.objectDistance) > 0.01) {
        updateMeasurements();
    }
    
    // 重新绘制
    draw();
}

// 凹透镜参数有效性检查函数
// Validate concave lens parameters
function validateConcaveParams(focalLength, objectDistance) {
    // 凹透镜焦距必须为负值
    if (focalLength >= 0) {
        console.warn('凹透镜焦距必须为负值，当前值：' + focalLength);
        return false;
    }
    
    // 检查物距（如果是负值表示物体在透镜右侧）
    if (objectDistance === 0) {
        console.warn('物距不能为零');
        return false;
    }
    
    return true;
}

// 更新焦距值
// Update focal length
function updateFocalLength(value) {
    // 确保数值有效并且转换为数字
    value = parseFloat(value);
    
    // 初始验证：如果不是数字，则使用当前焦距
    if (isNaN(value)) {
        value = Math.abs(state.focalLength);
    }
    
    // 确保值在允许范围内
    // 凹透镜: -15 ~ -3 cm, 凸透镜: 3 ~ 15 cm
    const minValue = 3;
    const maxValue = 15;
    
    // 限制在有效范围内
    value = Math.max(minValue, Math.min(maxValue, Math.abs(value)));
    
    // 根据透镜类型设置焦距
    const oldFocalLength = state.focalLength; // 保存旧值以便检测变化
    
    if (state.lensType === 'concave') {
        // 凹透镜是负焦距
        state.focalLength = -value;
        
        // 验证参数
        validateConcaveParams(state.focalLength, state.objectDistance);
    } else {
        // 凸透镜是正焦距
        state.focalLength = value;
    }
    
    // 更新UI显示
    const focalLengthInput = document.getElementById('focalLengthInput');
    const focalLengthValue = document.getElementById('focalLengthValue');
    const focalLengthSlider = document.getElementById('focalLengthSlider'); // 获取滑条元素
    const absF = Math.abs(state.focalLength).toFixed(1);
    
    focalLengthInput.value = absF;
    focalLengthSlider.value = absF; // 同步更新滑条位置
    
    // 在显示文本时添加正负号
    if (state.lensType === 'concave') {
        focalLengthValue.textContent = `-${absF} cm`;
        document.getElementById('currentFocalLength').textContent = `-${absF} cm`;
    } else {
        focalLengthValue.textContent = `${absF} cm`;
        document.getElementById('currentFocalLength').textContent = `${absF} cm`;
    }
    
    // 如果焦距发生明显变化，更新测量值
    if (Math.abs(oldFocalLength - state.focalLength) > 0.01) {
        updateMeasurements();
    }
    
    // 重绘场景
    draw();
}

// 更新透镜位置的函数 - 移到全局作用域
function updateLensPosition(value) {
    value = parseFloat(value);
    
    // 限制在允许范围内
    if (value < -15) value = -15;
    if (value > 15) value = 15;
    
    // 保存旧的透镜位置
    const oldLensPosition = state.lensPosition;
    
    // 更新状态
    state.lensPosition = parseFloat(value.toFixed(1));
    
    // 更新物距，保持物体的绝对位置不变
    state.objectDistance = state.lensPosition - state.objectPosition;
    
    // 限制物距在有效范围内
    if (state.objectDistance < -30) {
        state.objectDistance = -30;
        state.objectPosition = state.lensPosition + 30;
    } else if (state.objectDistance > 30) {
        state.objectDistance = 30;
        state.objectPosition = state.lensPosition - 30;
    }
    
    // 更新所有相关UI元素
    const lensPositionSlider = document.getElementById('lensPositionSlider');
    const lensPositionInput = document.getElementById('lensPositionInput');
    const lensPositionValue = document.getElementById('lensPositionValue');
    
    lensPositionSlider.value = value;
    lensPositionInput.value = value;
    lensPositionValue.textContent = value.toFixed(1) + ' cm';
    
    // 同时更新物距显示
    const objectDistanceSlider = document.getElementById('objectDistanceSlider');
    const objectDistanceInput = document.getElementById('objectDistanceInput');
    const objectDistanceValue = document.getElementById('objectDistanceValue');
    
    objectDistanceSlider.value = state.objectDistance;
    objectDistanceInput.value = state.objectDistance;
    objectDistanceValue.textContent = state.objectDistance.toFixed(1) + ' cm';
    
    // 更新测量数据并重绘
    updateMeasurements();
    draw();
}

// 添加UI交互处理函数
const CONTROL_PANEL_COLLAPSED_KEY = 'lens-control-panel-collapsed';
const MEASUREMENTS_COLLAPSED_KEY = 'lens-measurements-collapsed';

function setControlPanelCollapsed(controlPanel, togglePanelBtn, collapsed) {
    controlPanel.classList.toggle('collapsed', collapsed);
    togglePanelBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    const icon = togglePanelBtn.querySelector('i');
    icon.classList.toggle('fa-chevron-up', !collapsed);
    icon.classList.toggle('fa-chevron-down', collapsed);
    sessionStorage.setItem(CONTROL_PANEL_COLLAPSED_KEY, collapsed ? 'true' : 'false');
}

function syncMeasurementsGraphVisibility(dataCard, expandCardBtn) {
    const graphContainer = document.querySelector('.uv-graph-container');
    if (!graphContainer || !dataCard) return;

    const expanded = dataCard.classList.contains('expanded');
    const collapsed = dataCard.classList.contains('collapsed');
    const expandIcon = expandCardBtn?.querySelector('i');

    if (expandIcon) {
        expandIcon.classList.toggle('fa-compress-alt', expanded);
        expandIcon.classList.toggle('fa-expand-alt', !expanded);
    }

    if (state.lensType === 'concave' || collapsed || !expanded) {
        graphContainer.style.display = 'none';
    } else {
        graphContainer.style.display = '';
        drawUVGraph();
    }
}

function setMeasurementsGraphExpanded(dataCard, expandCardBtn, expanded) {
    dataCard.classList.toggle('expanded', expanded);
    syncMeasurementsGraphVisibility(dataCard, expandCardBtn);
}

function setMeasurementsCollapsed(dataCard, collapseCardBtn, expandCardBtn, collapsed) {
    dataCard.classList.toggle('collapsed', collapsed);
    collapseCardBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    const icon = collapseCardBtn.querySelector('i');
    icon.classList.toggle('fa-chevron-up', !collapsed);
    icon.classList.toggle('fa-chevron-down', collapsed);
    sessionStorage.setItem(MEASUREMENTS_COLLAPSED_KEY, collapsed ? 'true' : 'false');

    if (collapsed) {
        dataCard.classList.remove('expanded');
    }

    syncMeasurementsGraphVisibility(dataCard, expandCardBtn);
}

function setupUIInteractions() {
    // 向上折叠控制面板
    const togglePanelBtn = document.querySelector('.toggle-panel');
    const controlPanel = document.querySelector('.control-panel');

    setControlPanelCollapsed(
        controlPanel,
        togglePanelBtn,
        sessionStorage.getItem(CONTROL_PANEL_COLLAPSED_KEY) === 'true'
    );

    togglePanelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = !controlPanel.classList.contains('collapsed');
        setControlPanelCollapsed(controlPanel, togglePanelBtn, collapsed);
        setTimeout(resizeCanvas, 300);
    });
    
    // 数据卡片展开/折叠控制
    const expandCardBtn = document.querySelector('.expand-card');
    const collapseCardBtn = document.querySelector('.collapse-card');
    const dataCard = document.querySelector('.data-card');

    setMeasurementsCollapsed(
        dataCard,
        collapseCardBtn,
        expandCardBtn,
        sessionStorage.getItem(MEASUREMENTS_COLLAPSED_KEY) === 'true'
    );

    if (!dataCard.classList.contains('collapsed')) {
        setMeasurementsGraphExpanded(dataCard, expandCardBtn, true);
    }

    collapseCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = !dataCard.classList.contains('collapsed');
        setMeasurementsCollapsed(dataCard, collapseCardBtn, expandCardBtn, collapsed);
        setTimeout(resizeCanvas, 300);
    });
    
    expandCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dataCard.classList.contains('collapsed')) return;

        setMeasurementsGraphExpanded(dataCard, expandCardBtn, !dataCard.classList.contains('expanded'));
        setTimeout(drawUVGraph, 300);
    });
    
    // 使测量数据面板可拖动
    makeDraggable(document.getElementById('image-type-indicator'), {
        excludeDragStart: 'button, .collapse-card, .expand-card'
    });

    // 使控制面板可拖动
    const controlPanelEl = document.getElementById('ray-rules-container');
    if (controlPanelEl) {
        makeDraggable(controlPanelEl, {
            handle: '.control-panel-drag-handle',
            storageKey: 'lens-control-panel-pos',
            excludeDragStart: 'button, input, label, .toggle-panel, a, select, textarea'
        });
    }
    
    // 设置透镜类型切换按钮
    const lensTypeToggle = document.getElementById('lensTypeToggle');
    const lensTypeText = document.getElementById('lensTypeText');
    
    lensTypeToggle.addEventListener('click', () => {
        // 切换透镜类型
        state.lensType = state.lensType === 'convex' ? 'concave' : 'convex';
        
        // 更新按钮样式和文本
        if (state.lensType === 'concave') {
            lensTypeToggle.classList.add('concave');
            state.focalLength = -Math.abs(state.focalLength);
            syncMeasurementsGraphVisibility(document.querySelector('.data-card'), document.querySelector('.expand-card'));
        } else {
            lensTypeToggle.classList.remove('concave');
            state.focalLength = Math.abs(state.focalLength);
            syncMeasurementsGraphVisibility(document.querySelector('.data-card'), document.querySelector('.expand-card'));
        }
        
        updateLensTypeText();
        
        // 更新焦距显示
        const absF = Math.abs(state.focalLength);
        focalLengthValue.textContent = state.lensType === 'concave' ? `-${absF.toFixed(1)} cm` : `${absF.toFixed(1)} cm`;
        document.getElementById('currentFocalLength').textContent = state.lensType === 'concave' ? `-${absF.toFixed(1)} cm` : `${absF.toFixed(1)} cm`;
        
        applyDocumentTitle();
        
        // 在类型切换后强制更新测量
        updateMeasurements();
        
        // 重新绘制
        draw();
    });
    
    // 数值调整按钮控制
    const valueAdjustBtns = document.querySelectorAll('.value-adjust-btn');
    
    valueAdjustBtns.forEach(btn => {
        // 鼠标点击事件 - 简化为单击模式
        btn.addEventListener('click', function(e) {
            // 阻止事件冒泡和默认行为
            e.preventDefault();
            e.stopPropagation();
            
            // 获取目标参数和增减方向
            const target = this.getAttribute('data-target');
            const isIncrease = this.classList.contains('increase');
            
            
            // 单次调整值
            adjustValue(target, isIncrease);
        });
        
        // 触摸事件 - 简化为单击模式
        btn.addEventListener('touchstart', function(e) {
            // 阻止事件冒泡和默认行为
            e.preventDefault();
            e.stopPropagation();
        });
        
        // 触摸结束时执行一次调整
        btn.addEventListener('touchend', function(e) {
            // 阻止事件冒泡和默认行为
            e.preventDefault();
            e.stopPropagation();
            
            // 获取目标参数和增减方向
            const target = this.getAttribute('data-target');
            const isIncrease = this.classList.contains('increase');
            
            
            // 单次调整值
            adjustValue(target, isIncrease);
        });
    });
    
    // 处理数值调整的函数
    function adjustValue(target, isIncrease) {
        // 步长固定为0.1cm
        const step = 0.1;
        
        let value, minValue, maxValue;
        
        switch(target) {
            case 'objectDistance':
                value = parseFloat(document.getElementById('objectDistanceInput').value);
                minValue = -30;
                maxValue = 30;
                break;
                
            case 'focalLength':
                value = parseFloat(document.getElementById('focalLengthInput').value);
                minValue = 3;
                maxValue = 15;
                break;
                
            case 'lensPosition':
                value = parseFloat(document.getElementById('lensPositionInput').value);
                minValue = -15;
                maxValue = 15;
                break;
                
            case 'objectHeight':
                value = parseFloat(document.getElementById('objectHeightInput').value);
                minValue = 0.1;
                maxValue = 9;
                break;
        }
        
        // 计算新值（确保步长为0.1）
        let newValue = isIncrease ? value + step : value - step;
        
        // 确保没有浮点精度问题
        newValue = Math.round(newValue * 10) / 10;
        
        // 确保在允许范围内
        if (newValue >= minValue && newValue <= maxValue) {
            
            // 使用全局更新函数
            if (target === 'objectDistance') {
                updateObjectDistance(newValue);
            } else if (target === 'focalLength') {
                updateFocalLength(newValue);
            } else if (target === 'lensPosition') {
                updateLensPosition(newValue);
            } else if (target === 'objectHeight') {
                updateObjectHeight(newValue);
            }
        }
    }
}

// 添加键盘辅助功能
function setupKeyboardSupport() {
    // 为每个数值输入框添加键盘上下箭头支持
    const numberInputs = [
        { id: 'objectDistanceInput', target: 'objectDistance' },
        { id: 'focalLengthInput', target: 'focalLength' },
        { id: 'lensPositionInput', target: 'lensPosition' },
        { id: 'objectHeightInput', target: 'objectHeight' }
    ];

    numberInputs.forEach(input => {
        const inputElement = document.getElementById(input.id);
        if (!inputElement) return;

        inputElement.addEventListener('keydown', (e) => {
            // 上箭头键增加0.1，下箭头键减少0.1
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault(); // 阻止默认滚动行为
                const isIncrease = e.key === 'ArrowUp';
                
                // 直接调用全局更新函数
                const step = 0.1;
                const value = parseFloat(inputElement.value);
                const newValue = isIncrease ? value + step : value - step;
                const roundedValue = Math.round(newValue * 10) / 10;
                
                if (input.target === 'objectDistance') {
                    updateObjectDistance(roundedValue);
                } else if (input.target === 'focalLength') {
                    updateFocalLength(roundedValue);
                } else if (input.target === 'lensPosition') {
                    updateLensPosition(roundedValue);
                } else if (input.target === 'objectHeight') {
                    updateObjectHeight(roundedValue);
                }
            }
        });
    });
}

// 添加canvas的鼠标事件，用于拖动物体
function setupDraggableObject() {
    // 获取canvas元素
    const canvas = document.getElementById('lensCanvas');
    if (!canvas) return;
    
    // 使用全局变量存储拖动状态，便于物体拖动函数检查
    window.isDraggingObject = false;
    window.isDraggingObjectHeight = false; // 新增: 拖动调整物高状态
    let lastX, lastY;
    
    // 检查鼠标是否在物体绿色点上
    function isMouseOverObjectPoint(mouseX, mouseY) {
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const objectX = centerX + state.objectPosition * pixelsPerCm;
        
        const clickRadius = 15; // 点击区域半径(像素)
        return Math.abs(mouseX - objectX) <= clickRadius && Math.abs(mouseY - axisY) <= clickRadius;
    }
    
    // 检查鼠标是否在物体顶部点上（用于调整高度）
    function isMouseOverObjectTopPoint(mouseX, mouseY) {
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const objectX = centerX + state.objectPosition * pixelsPerCm;
        const objectTopY = axisY - state.objectHeight * pixelsPerCm;
        
        const clickRadius = 15; // 点击区域半径(像素)
        return Math.abs(mouseX - objectX) <= clickRadius && Math.abs(mouseY - objectTopY) <= clickRadius;
    }
    
    // 处理拖动物体
    function handleObjectDrag(e, isTouch = false) {
        if (!window.isDraggingObject && !window.isDraggingObjectHeight) return;
        
        const rect = canvas.getBoundingClientRect();
        let currentX, currentY;
        
        if (isTouch) {
            const touch = e.touches[0];
            currentX = touch.clientX - rect.left;
            currentY = touch.clientY - rect.top;
        } else {
            currentX = e.clientX - rect.left;
            currentY = e.clientY - rect.top;
        }
        
        if (window.isDraggingObject) {
            // 拖动物体位置
            const deltaX = (currentX - lastX) / pixelsPerCm;
            
            // 更新物体位置
            state.objectPosition += deltaX;
            
            // 从物体位置计算物距
            state.objectDistance = state.lensPosition - state.objectPosition;
            
            // 限制物距在有效范围内
            if (state.objectDistance < -30) {
                state.objectDistance = -30;
                state.objectPosition = state.lensPosition + 30;
            } else if (state.objectDistance > 30) {
                state.objectDistance = 30;
                state.objectPosition = state.lensPosition - 30;
            }
            
            // 更新UI
            document.getElementById('objectDistanceSlider').value = state.objectDistance;
            document.getElementById('objectDistanceInput').value = state.objectDistance;
            document.getElementById('objectDistanceValue').textContent = state.objectDistance.toFixed(1) + ' cm';
            
            // 更新测量数据
            updateMeasurements();
            
            // 更新lastX
            lastX = currentX;
        } else if (window.isDraggingObjectHeight) {
            // 拖动调整物体高度
            const axisY = canvas.height / 2;
            const deltaY = lastY - currentY; // 向上拖动为正，向下拖动为负
            
            // 将像素变化转换为厘米
            const deltaHeight = deltaY / pixelsPerCm;
            
            // 更新物体高度
            let newHeight = state.objectHeight + deltaHeight;
            
            // 限制高度在有效范围内
            if (newHeight < 0.1) newHeight = 0.1;
            if (newHeight > 9) newHeight = 9;
            
            state.objectHeight = newHeight;
            
            // 更新UI
            document.getElementById('objectHeightSlider').value = state.objectHeight;
            document.getElementById('objectHeightInput').value = state.objectHeight.toFixed(1);
            document.getElementById('objectHeightValue').textContent = state.objectHeight.toFixed(1) + ' cm';
            
            // 更新lastY
            lastY = currentY;
        }
        
        // 重绘场景
        draw();
        
        if (isTouch) {
            e.preventDefault(); // 防止页面滚动
        }
    }
    
    // 鼠标悬停事件处理
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 仅在不拖动时更改光标
        if (!window.isDraggingObject && !window.isDraggingObjectHeight && 
            !window.isDraggingLens && !window.isDraggingFocalPoint && !window.isDraggingScreen) {
            if (isMouseOverObjectPoint(mouseX, mouseY)) {
                canvas.style.cursor = 'grab'; // 悬停在物体点上时显示抓取光标
            } else if (isMouseOverObjectTopPoint(mouseX, mouseY)) {
                canvas.style.cursor = 'ns-resize'; // 悬停在物体顶部点上时显示上下调整光标
            } else {
                // 检查其他元素...
                // 保持其他悬停逻辑不变
            }
        }
        
        // 如果正在拖动，处理拖动逻辑
        if (window.isDraggingObject || window.isDraggingObjectHeight) {
            handleObjectDrag(e, false);
        }
    });
    
    // 鼠标按下事件
    canvas.addEventListener('mousedown', function(e) {
        // 如果正在拖动其他元素，则不处理物体拖动
        if (window.isDraggingLens || window.isDraggingFocalPoint || window.isDraggingScreen) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 使用封装的函数检查是否点击了物体点
        if (isMouseOverObjectPoint(mouseX, mouseY)) {
            window.isDraggingObject = true;
            lastX = mouseX;
            canvas.style.cursor = 'grabbing'; // 抓取中光标
        } else if (isMouseOverObjectTopPoint(mouseX, mouseY)) {
            window.isDraggingObjectHeight = true;
            lastY = mouseY;
            canvas.style.cursor = 'ns-resize'; // 上下调整光标
        }
    });
    
    // 鼠标释放事件
    canvas.addEventListener('mouseup', function() {
        if (window.isDraggingObject) {
            window.isDraggingObject = false;
            canvas.style.cursor = 'default';
        }
        if (window.isDraggingObjectHeight) {
            window.isDraggingObjectHeight = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 鼠标离开canvas事件
    canvas.addEventListener('mouseleave', function() {
        if (window.isDraggingObject) {
            window.isDraggingObject = false;
            canvas.style.cursor = 'default';
        }
        if (window.isDraggingObjectHeight) {
            window.isDraggingObjectHeight = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 添加触摸支持
    canvas.addEventListener('touchstart', function(e) {
        // 如果正在拖动其他元素，则不处理物体拖动
        if (window.isDraggingLens || window.isDraggingFocalPoint || window.isDraggingScreen) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // 检查是否触摸了物体的底部绿色点
        if (isMouseOverObjectPoint(touchX, touchY)) {
            window.isDraggingObject = true;
            lastX = touchX;
            e.preventDefault(); // 防止页面滚动
        } else if (isMouseOverObjectTopPoint(touchX, touchY)) {
            window.isDraggingObjectHeight = true;
            lastY = touchY;
            e.preventDefault(); // 防止页面滚动
        }
    });
    
    // 触摸移动事件
    canvas.addEventListener('touchmove', function(e) {
        if (window.isDraggingObject || window.isDraggingObjectHeight) {
            handleObjectDrag(e, true);
        }
    });
    
    // 触摸结束事件
    canvas.addEventListener('touchend', function(e) {
        if (window.isDraggingObject) {
            window.isDraggingObject = false;
            e.preventDefault();
        }
        if (window.isDraggingObjectHeight) {
            window.isDraggingObjectHeight = false;
            e.preventDefault();
        }
    });
    
    // 触摸取消事件
    canvas.addEventListener('touchcancel', function(e) {
        if (window.isDraggingObject) {
            window.isDraggingObject = false;
            e.preventDefault();
        }
        if (window.isDraggingObjectHeight) {
            window.isDraggingObjectHeight = false;
            e.preventDefault();
        }
    });
}

// 添加透镜拖动功能
function setupDraggableLens() {
    // 获取canvas元素
    const canvas = document.getElementById('lensCanvas');
    if (!canvas) return;
    
    // 使用全局变量存储拖动状态，便于物体拖动函数检查
    window.isDraggingLens = false;
    let lastX;
    
    // 检查鼠标是否在透镜中心位置上
    function isMouseOverLens(mouseX, mouseY) {
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const lensX = centerX + state.lensPosition * pixelsPerCm;
        
        const clickRadius = 15; // 点击区域半径(像素)
        return Math.abs(mouseX - lensX) <= clickRadius && Math.abs(mouseY - axisY) <= clickRadius;
    }
    
    // 处理拖动透镜
    function handleLensDrag(e, isTouch = false) {
        if (!window.isDraggingLens) return;
        
        const rect = canvas.getBoundingClientRect();
        let currentX;
        
        if (isTouch) {
            const touch = e.touches[0];
            currentX = touch.clientX - rect.left;
        } else {
            currentX = e.clientX - rect.left;
        }
        
        // 计算移动距离（以厘米为单位）
        const deltaX = (currentX - lastX) / pixelsPerCm;
        
        // 保存原来的物体位置
        const oldObjectPosition = state.objectPosition;
        
        // 更新透镜位置
        state.lensPosition += deltaX;
        
        // 限制透镜位置在有效范围内
        if (state.lensPosition < -15) state.lensPosition = -15;
        if (state.lensPosition > 15) state.lensPosition = 15;
        
        // 保持物体的绝对位置不变，更新物距
        state.objectDistance = state.lensPosition - state.objectPosition;
        
        // 限制物距在有效范围内
        if (state.objectDistance < -30) {
            state.objectDistance = -30;
            state.objectPosition = state.lensPosition + 30;
        } else if (state.objectDistance > 30) {
            state.objectDistance = 30;
            state.objectPosition = state.lensPosition - 30;
        }
        
        // 更新UI
        document.getElementById('lensPositionSlider').value = state.lensPosition;
        document.getElementById('lensPositionInput').value = state.lensPosition;
        document.getElementById('lensPositionValue').textContent = state.lensPosition.toFixed(1) + ' cm';
        
        // 同时更新物距显示
        document.getElementById('objectDistanceSlider').value = state.objectDistance;
        document.getElementById('objectDistanceInput').value = state.objectDistance;
        document.getElementById('objectDistanceValue').textContent = state.objectDistance.toFixed(1) + ' cm';
        
        // 更新测量数据
        updateMeasurements();
        
        // 更新lastX
        lastX = currentX;
        
        // 重绘场景
        draw();
        
        if (isTouch) {
            e.preventDefault(); // 防止页面滚动
        }
    }
    
    // 鼠标悬停事件处理 - 处理拖动逻辑
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 如果正在拖动物体或焦点，则不更改光标或处理透镜拖动
        if (window.isDraggingObject || window.isDraggingFocalPoint) return;
        
        // 仅在不拖动透镜时更改光标
        if (!window.isDraggingLens) {
            if (isMouseOverLens(mouseX, mouseY)) {
                canvas.style.cursor = 'grab'; // 悬停在透镜中心时显示抓取光标
            }
        }
        
        // 如果正在拖动透镜，处理拖动逻辑
        if (window.isDraggingLens) {
            handleLensDrag(e, false);
        }
    });
    
    // 鼠标按下事件
    canvas.addEventListener('mousedown', function(e) {
        // 如果正在拖动物体或焦点，则不处理透镜拖动
        if (window.isDraggingObject || window.isDraggingFocalPoint) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 检查是否点击了透镜
        if (isMouseOverLens(mouseX, mouseY)) {
            window.isDraggingLens = true;
            lastX = mouseX;
            canvas.style.cursor = 'grabbing'; // 抓取中光标
        }
    });
    
    // 鼠标释放事件
    canvas.addEventListener('mouseup', function() {
        if (window.isDraggingLens) {
            window.isDraggingLens = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 鼠标离开canvas事件
    canvas.addEventListener('mouseleave', function() {
        if (window.isDraggingLens) {
            window.isDraggingLens = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 添加触摸支持
    canvas.addEventListener('touchstart', function(e) {
        // 如果正在拖动物体，则不处理透镜拖动
        if (window.isDraggingObject) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // 检查是否触摸了透镜
        if (isMouseOverLens(touchX, touchY)) {
            window.isDraggingLens = true;
            lastX = touchX;
            e.preventDefault(); // 防止页面滚动
        }
    });
    
    // 触摸移动事件
    canvas.addEventListener('touchmove', function(e) {
        if (window.isDraggingLens) {
            handleLensDrag(e, true);
        }
    });
    
    // 触摸结束事件
    canvas.addEventListener('touchend', function(e) {
        if (window.isDraggingLens) {
            window.isDraggingLens = false;
            e.preventDefault();
        }
    });
    
    // 触摸取消事件
    canvas.addEventListener('touchcancel', function(e) {
        if (window.isDraggingLens) {
            window.isDraggingLens = false;
            e.preventDefault();
        }
    });
}

// 添加焦点拖动功能
function setupDraggableFocalPoint() {
    // 获取canvas元素
    const canvas = document.getElementById('lensCanvas');
    if (!canvas) return;
    
    // 使用全局变量存储拖动状态
    window.isDraggingFocalPoint = false;
    let lastX;
    
    // 检查鼠标是否在焦点上
    function isMouseOverFocalPoint(mouseX, mouseY) {
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const lensX = centerX + state.lensPosition * pixelsPerCm;
        const absF = Math.abs(state.focalLength);
        const isConcave = state.lensType === 'concave';
        
        // 计算焦点位置
        // 凹透镜: 使用右侧焦点（即在透镜左侧，标记为F的焦点）
        // 凸透镜: 使用左侧焦点（即在透镜左侧，标记为F的焦点）
        const focalX = lensX - pixelsPerCm * absF;
        
        const clickRadius = 15; // 点击区域半径(像素)
        return Math.abs(mouseX - focalX) <= clickRadius && Math.abs(mouseY - axisY) <= clickRadius;
    }
    
    // 处理拖动焦点
    function handleFocalPointDrag(e, isTouch = false) {
        if (!window.isDraggingFocalPoint) return;
        
        const rect = canvas.getBoundingClientRect();
        let currentX;
        
        if (isTouch) {
            const touch = e.touches[0];
            currentX = touch.clientX - rect.left;
        } else {
            currentX = e.clientX - rect.left;
        }
        
        // 计算移动距离（以厘米为单位）
        const deltaX = (currentX - lastX) / pixelsPerCm;
        
        // 计算中心点位置
        const centerX = canvas.width / 2;
        const lensX = centerX + state.lensPosition * pixelsPerCm;
        const isConcave = state.lensType === 'concave';
        
        // 根据透镜类型，计算新的焦距位置
        let newFocalLength;
        
        // 对于凹透镜和凸透镜，都是拖动左侧焦点（距离透镜越远，焦距越大）
        const newFocalPointX = lensX - pixelsPerCm * (Math.abs(state.focalLength) - deltaX);
        newFocalLength = (lensX - newFocalPointX) / pixelsPerCm;
        
        // 确保焦距符号正确（凹透镜为负，凸透镜为正）
        newFocalLength = isConcave ? -Math.abs(newFocalLength) : Math.abs(newFocalLength);
        
        // 限制焦距在有效范围内 (3cm - 15cm)
        if (Math.abs(newFocalLength) >= 3 && Math.abs(newFocalLength) <= 15) {
            // 使用全局的updateFocalLength函数更新焦距
            updateFocalLength(newFocalLength);
        }
        
        // 更新lastX
        lastX = currentX;
        
        if (isTouch) {
            e.preventDefault(); // 防止页面滚动
        }
    }
    
    // 鼠标悬停事件处理
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 如果正在拖动物体或透镜，则不处理焦点拖动
        if (window.isDraggingObject || window.isDraggingLens) return;
        
        // 仅在不拖动焦点时更改光标
        if (!window.isDraggingFocalPoint) {
            if (isMouseOverFocalPoint(mouseX, mouseY)) {
                canvas.style.cursor = 'grab'; // 悬停在焦点上时显示抓取光标
            } else {
                // 如果鼠标不再悬停在焦点上，恢复默认光标
                if (canvas.style.cursor === 'grab') {
                    canvas.style.cursor = 'default';
                }
            }
        }
        
        // 如果正在拖动焦点，处理拖动逻辑
        if (window.isDraggingFocalPoint) {
            handleFocalPointDrag(e, false);
        }
    });
    
    // 鼠标按下事件
    canvas.addEventListener('mousedown', function(e) {
        // 如果正在拖动物体或透镜，则不处理焦点拖动
        if (window.isDraggingObject || window.isDraggingLens) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 检查是否点击了焦点
        if (isMouseOverFocalPoint(mouseX, mouseY)) {
            window.isDraggingFocalPoint = true;
            lastX = mouseX;
            canvas.style.cursor = 'grabbing'; // 抓取中光标
        }
    });
    
    // 鼠标释放事件
    canvas.addEventListener('mouseup', function() {
        if (window.isDraggingFocalPoint) {
            window.isDraggingFocalPoint = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 鼠标离开canvas事件
    canvas.addEventListener('mouseleave', function() {
        if (window.isDraggingFocalPoint) {
            window.isDraggingFocalPoint = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 添加触摸支持
    canvas.addEventListener('touchstart', function(e) {
        // 如果正在拖动物体或透镜，则不处理焦点拖动
        if (window.isDraggingObject || window.isDraggingLens) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // 检查是否触摸了焦点
        if (isMouseOverFocalPoint(touchX, touchY)) {
            window.isDraggingFocalPoint = true;
            lastX = touchX;
            e.preventDefault(); // 防止页面滚动
        }
    });
    
    // 触摸移动事件
    canvas.addEventListener('touchmove', function(e) {
        if (window.isDraggingFocalPoint) {
            handleFocalPointDrag(e, true);
        }
    });
    
    // 触摸结束事件
    canvas.addEventListener('touchend', function(e) {
        if (window.isDraggingFocalPoint) {
            window.isDraggingFocalPoint = false;
            e.preventDefault();
        }
    });
    
    // 触摸取消事件
    canvas.addEventListener('touchcancel', function(e) {
        if (window.isDraggingFocalPoint) {
            window.isDraggingFocalPoint = false;
            e.preventDefault();
        }
    });
}

/** Convex / concave tab deep-link from S3_PHY embed (?defaultLens=) */
function applyDefaultLensFromEmbed() {
    const dl = typeof window !== 'undefined' ? window.__S3PHY_DEFAULT_LENS__ : null;
    if (dl !== 'concave' && dl !== 'convex') return;

    const lensTypeToggle = document.getElementById('lensTypeToggle');
    const lensTypeText = document.getElementById('lensTypeText');
    const focalLengthValue = document.getElementById('focalLengthValue');
    if (!lensTypeToggle || !lensTypeText) return;

    state.lensType = dl;
    if (dl === 'concave') {
        lensTypeToggle.classList.add('concave');
        state.focalLength = -Math.abs(state.focalLength);
        syncMeasurementsGraphVisibility(document.querySelector('.data-card'), document.querySelector('.expand-card'));
    } else {
        lensTypeToggle.classList.remove('concave');
        state.focalLength = Math.abs(state.focalLength);
        syncMeasurementsGraphVisibility(document.querySelector('.data-card'), document.querySelector('.expand-card'));
    }
    updateLensTypeText();
    const absF = Math.abs(state.focalLength);
    if (focalLengthValue) {
        focalLengthValue.textContent = dl === 'concave' ? `-${absF.toFixed(1)} cm` : `${absF.toFixed(1)} cm`;
    }
    const cfl = document.getElementById('currentFocalLength');
    if (cfl) {
        cfl.textContent = dl === 'concave' ? `-${absF.toFixed(1)} cm` : `${absF.toFixed(1)} cm`;
    }
    applyDocumentTitle();
}

// 修改init函数，添加透镜拖动功能初始化
function init() {
    initLangFromLocation();
    bindHubLangSync();
    applyDefaultLensFromEmbed();

    // 设置事件监听器
    setupEventListeners();
    
    // 调整UI布局 - 将透镜位置控件移到第一排
    adjustUILayout();
    
    // 设置UI交互
    setupUIInteractions();
    
    // 设置键盘辅助功能
    setupKeyboardSupport();
    
    // 设置物体拖动功能
    setupDraggableObject();
    
    // 设置透镜拖动功能
    setupDraggableLens();
    
    // 设置焦点拖动功能
    setupDraggableFocalPoint();
    
    // 设置屏幕拖动功能
    setupDraggableScreen();
    
    // 设置控制面板初始位置（可從 sessionStorage 還原）
    const controlPanel = document.getElementById('ray-rules-container');
    if (controlPanel) {
        controlPanel.style.position = 'absolute';
        setTimeout(() => {
            positionControlPanel(controlPanel);
        }, 50);
    }

    // 设置测量数据面板的初始位置
    const dataCard = document.getElementById('image-type-indicator');
    if (dataCard) {
        // 设置为绝对定位
        dataCard.style.position = 'absolute';
        // 设置初始位置 - 放在simulator-container的右上角
        setTimeout(() => {
            const simulatorContainer = document.querySelector('.simulator-container');
            if (simulatorContainer) {
                // 计算simulator-container的尺寸和位置
                const containerRect = simulatorContainer.getBoundingClientRect();
                const containerWidth = simulatorContainer.offsetWidth;
                
                // 测量数据面板默认放在右上角，距离边缘20px
                dataCard.style.right = 'auto';
                dataCard.style.bottom = 'auto';
                dataCard.style.top = '20px';
                dataCard.style.left = (containerWidth - dataCard.offsetWidth - 20) + 'px';
                
                // 确保面板在父容器中可见
                if (parseFloat(dataCard.style.left) < 0) {
                    dataCard.style.left = '20px';
                }
            } else {
                // 如果没有找到容器，则使用默认位置
                dataCard.style.right = 'auto';
                dataCard.style.bottom = 'auto';
                dataCard.style.top = '20px';
                dataCard.style.left = '20px';
            }
        }, 100); // 短暂延迟确保DOM已完全加载
    }
    
    // 设置初始值
    document.getElementById('objectDistanceSlider').value = state.objectDistance;
    document.getElementById('objectDistanceInput').value = state.objectDistance;
    document.getElementById('objectDistanceValue').textContent = state.objectDistance.toFixed(1) + ' cm';
    
    document.getElementById('objectHeightSlider').value = state.objectHeight;
    document.getElementById('objectHeightInput').value = state.objectHeight;
    document.getElementById('objectHeightValue').textContent = state.objectHeight.toFixed(1) + ' cm';
    
    const focalLenAbs = Math.abs(state.focalLength);
    document.getElementById('focalLengthSlider').value = focalLenAbs;
    document.getElementById('focalLengthInput').value = focalLenAbs;
    const focalDisp =
        state.lensType === 'concave' ? `-${focalLenAbs.toFixed(1)} cm` : `${focalLenAbs.toFixed(1)} cm`;
    document.getElementById('currentFocalLength').textContent = focalDisp;
    const flv = document.getElementById('focalLengthValue');
    if (flv) flv.textContent = focalDisp;
    
    document.getElementById('lensPositionSlider').value = state.lensPosition;
    document.getElementById('lensPositionInput').value = state.lensPosition;
    document.getElementById('lensPositionValue').textContent = state.lensPosition.toFixed(1) + ' cm';
    
    // 设置物体类型
    const radioButtons = document.querySelectorAll('input[name="object"]');
    radioButtons.forEach(radio => {
        if (radio.value === state.objectType) {
            radio.checked = true;
        }
    });
    
    applyDocumentTitle();
    updateLensTypeText();
    
    // 初始更新测量数据
    updateMeasurements();
    
    // 确保画布大小正确
    resizeCanvas();

    if (isS3phyEmbed()) {
        const cc = document.querySelector('.canvas-container');
        if (cc && typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => resizeCanvas()).observe(cc);
        }
    }

    // 开始动画循环
    animationLoop();
    
    // 功能：动画循环，使光线看起来更有活力
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        // 重绘可以在这里添加，如果需要连续的动画效果
    }
}

// 在頁面加載完成後初始化
// Initialize after page load
window.addEventListener('load', init);

function positionControlPanel(panel) {
    const simulatorContainer = document.querySelector('.simulator-container');
    if (!simulatorContainer || !panel) return;

    const storageKey = 'lens-control-panel-pos';
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
        try {
            const pos = JSON.parse(saved);
            if (typeof pos.left === 'number' && typeof pos.top === 'number') {
                panel.style.left = pos.left + 'px';
                panel.style.top = pos.top + 'px';
                panel.style.bottom = 'auto';
                panel.style.right = 'auto';
                return;
            }
        } catch (_) { /* ignore */ }
    }

    panel.style.left = '16px';
    panel.style.bottom = '16px';
    panel.style.top = 'auto';
    panel.style.right = 'auto';
}

// 使元素可拖动的函数
// Make element draggable function
function makeDraggable(element, options) {
    if (!element) return;

    options = options || {};
    const handleSelector = options.handle || null;
    const storageKey = options.storageKey || null;
    const excludeSelector = options.excludeDragStart || null;
    const defaultHeader = element.querySelector('.data-card-header');
    
    let offsetX, offsetY, isDragging = false;
    
    // 鼠标事件
    element.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // 触摸事件
    element.addEventListener('touchstart', startDragTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    function canStartDrag(e) {
        const target = e.target;
        if (excludeSelector && target.closest && target.closest(excludeSelector)) {
            return false;
        }
        if (handleSelector) {
            const handle = element.querySelector(handleSelector);
            return handle && (handle.contains(target) || target.closest(handleSelector));
        }
        if (defaultHeader) {
            return defaultHeader.contains(target) || target.closest('.data-card-header');
        }
        return true;
    }
    
    // 鼠标拖动开始
    function startDrag(e) {
        if (!canStartDrag(e)) return;
        
        e.preventDefault();
        
        // 获取鼠标相对于元素左上角的偏移量
        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        isDragging = true;
        
        // 增加拖动时的样式
        element.style.opacity = '0.8';
        element.style.zIndex = '1000'; // 确保拖动时在顶层
    }
    
    // 触摸拖动开始
    function startDragTouch(e) {
        if (!canStartDrag(e)) return;
        
        // 获取触摸相对于元素左上角的偏移量
        const rect = element.getBoundingClientRect();
        const touch = e.touches[0];
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        
        isDragging = true;
        
        // 增加拖动时的样式
        element.style.opacity = '0.8';
        element.style.zIndex = '1000'; // 确保拖动时在顶层
    }
    
    // 鼠标拖动
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        // 确保元素处于绝对定位
        if (element.style.position !== 'absolute') {
            element.style.position = 'absolute';
        }
        
        // 获取元素的父容器 - 应该是simulator-container
        const simulatorContainer = document.querySelector('.simulator-container');
        const rect = simulatorContainer ? simulatorContainer.getBoundingClientRect() : document.body.getBoundingClientRect();
        
        // 计算元素在父容器内的新位置
        const left = e.clientX - offsetX - rect.left;
        const top = e.clientY - offsetY - rect.top;
        
        // 获取元素和父容器的尺寸
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const containerWidth = simulatorContainer ? simulatorContainer.offsetWidth : window.innerWidth;
        const containerHeight = simulatorContainer ? simulatorContainer.offsetHeight : window.innerHeight;
        
        // 确保元素不超出父容器边界
        const boundedLeft = Math.max(0, Math.min(left, containerWidth - elementWidth));
        const boundedTop = Math.max(0, Math.min(top, containerHeight - elementHeight));
        
        // 应用新位置
        element.style.left = boundedLeft + 'px';
        element.style.top = boundedTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    // 触摸拖动
    function dragTouch(e) {
        if (!isDragging) return;
        
        // 确保元素处于绝对定位
        if (element.style.position !== 'absolute') {
            element.style.position = 'absolute';
        }
        
        // 获取元素的父容器 - 应该是simulator-container
        const simulatorContainer = document.querySelector('.simulator-container');
        const rect = simulatorContainer ? simulatorContainer.getBoundingClientRect() : document.body.getBoundingClientRect();
        
        // 获取触摸坐标
        const touch = e.touches[0];
        
        // 计算元素在父容器内的新位置
        const left = touch.clientX - offsetX - rect.left;
        const top = touch.clientY - offsetY - rect.top;
        
        // 获取元素和父容器的尺寸
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const containerWidth = simulatorContainer ? simulatorContainer.offsetWidth : window.innerWidth;
        const containerHeight = simulatorContainer ? simulatorContainer.offsetHeight : window.innerHeight;
        
        // 确保元素不超出父容器边界
        const boundedLeft = Math.max(0, Math.min(left, containerWidth - elementWidth));
        const boundedTop = Math.max(0, Math.min(top, containerHeight - elementHeight));
        
        // 应用新位置
        element.style.left = boundedLeft + 'px';
        element.style.top = boundedTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    // 结束拖动
    function endDrag() {
        if (isDragging) {
            isDragging = false;
            // 恢复透明度
            element.style.opacity = '1';
            // 恢复正常层级
            element.style.zIndex = element.classList.contains('control-panel') ? '60' : '50';
            if (storageKey) {
                const left = parseFloat(element.style.left);
                const top = parseFloat(element.style.top);
                if (!Number.isNaN(left) && !Number.isNaN(top)) {
                    sessionStorage.setItem(storageKey, JSON.stringify({ left, top }));
                }
            }
        }
    }
} 

window.addEventListener('load', () => {
    resizeCanvas();
    // 預設值按鈕事件
    const btn1 = document.getElementById('presetBtn1');
    const btn2 = document.getElementById('presetBtn2');
    if (btn1) {
        btn1.addEventListener('click', () => {
            // 确保正确设置参数顺序，防止相互影响
            updateLensPosition(8.0);     // 先设置透镜位置
            updateObjectDistance(30.0);  // 再设置物距
            updateFocalLength(7.5);      // 最后设置焦距
            
            // 确保屏幕位置合适
            if (state.screenPosition < 15.0) {
                state.screenPosition = 15.0;
            }
            
            draw(); // 刷新画面
        });
    }
    if (btn2) {
        btn2.addEventListener('click', () => {
            // 检查当前物高是否大于8cm
            if (state.objectHeight > 8.0) {
                // 如果物高大于8cm，记录当前物高
                const originalHeight = state.objectHeight;
                
                // 先设置其他参数
                updateLensPosition(-12.0);   // 先設定透鏡位置
                updateObjectDistance(10.0);  // 再設定物距，確保物體在左側
                updateFocalLength(7.5);      // 最後設定焦距
                
                // 不改变屏幕位置，保持原有位置
                
                // 恢复原始物高并确保测量值更新
                updateObjectHeight(originalHeight);
            } else {
                // 常规设置
                updateLensPosition(-12.0);   // 先設定透鏡位置
                updateObjectDistance(10.0);  // 再設定物距，確保物體在左側
                updateFocalLength(7.5);      // 最後設定焦距
                
                // 不改变屏幕位置，保持原有位置
            }
            
            draw(); // 刷新画面
        });
    }
});

// 绘制投影屏幕
function drawScreen() {
    const axisY = canvas.height / 2;
    const centerX = canvas.width / 2;
    const screenX = centerX + state.screenPosition * pixelsPerCm;
    
    // 设置屏幕线的样式
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]); // 实线
    
    let screenHeight;
    
    // 检查是否是预设值情况1或情况2
    if ((state.lensPosition === 8.0 && state.objectDistance === 30.0 && state.focalLength === 7.5) || // 预设值情况1
        (state.lensPosition === -12.0 && state.objectDistance === 10.0 && state.focalLength === 7.5)) { // 预设值情况2
        // 使用较小的屏幕高度，确保所有情况下显示一致
        screenHeight = canvas.height / 3;
    } else {
        // 默认屏幕高度
        screenHeight = canvas.height / 3;
    }
    
    // 绘制垂直屏幕线
    ctx.beginPath();
    ctx.moveTo(screenX, axisY - screenHeight);
    ctx.lineTo(screenX, axisY + screenHeight);
    ctx.stroke();
    
    // 添加拖动提示
    ctx.beginPath();
    ctx.arc(screenX, axisY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    ctx.fill();
    
    // 添加左右箭头表示可拖动
    ctx.beginPath();
    ctx.moveTo(screenX - 15, axisY);
    ctx.lineTo(screenX - 10, axisY);
    ctx.moveTo(screenX - 15, axisY);
    ctx.lineTo(screenX - 13, axisY - 2);
    ctx.moveTo(screenX - 15, axisY);
    ctx.lineTo(screenX - 13, axisY + 2);
    
    ctx.moveTo(screenX + 15, axisY);
    ctx.lineTo(screenX + 10, axisY);
    ctx.moveTo(screenX + 15, axisY);
    ctx.lineTo(screenX + 13, axisY - 2);
    ctx.moveTo(screenX + 15, axisY);
    ctx.lineTo(screenX + 13, axisY + 2);
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.7)';
    ctx.stroke();
    
    // 添加拖动文本提示
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(t('drag'), screenX, axisY + 20);
    
    // 显示屏幕位置，只显示文本，不显示数值和单位
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
    ctx.fillText(t('screenLabel'), screenX, axisY - screenHeight - 10);
}

// 添加屏幕拖动功能
function setupDraggableScreen() {
    // 获取canvas元素
    const canvas = document.getElementById('lensCanvas');
    if (!canvas) return;
    
    // 使用全局变量存储拖动状态
    window.isDraggingScreen = false;
    let lastX;
    
    // 检查鼠标是否在屏幕中心点上
    function isMouseOverScreen(mouseX, mouseY) {
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const screenX = centerX + state.screenPosition * pixelsPerCm;
        
        const clickRadius = 15; // 点击区域半径(像素)
        return Math.abs(mouseX - screenX) <= clickRadius && Math.abs(mouseY - axisY) <= clickRadius;
    }
    
    // 处理拖动屏幕
    function handleScreenDrag(e, isTouch = false) {
        if (!window.isDraggingScreen) return;
        
        const rect = canvas.getBoundingClientRect();
        let currentX;
        
        if (isTouch) {
            const touch = e.touches[0];
            currentX = touch.clientX - rect.left;
        } else {
            currentX = e.clientX - rect.left;
        }
        
        // 计算移动距离（以厘米为单位）
        const deltaX = (currentX - lastX) / pixelsPerCm;
        
        // 更新屏幕位置
        state.screenPosition += deltaX;
        
        // 限制屏幕位置在合理范围内
        if (state.screenPosition < -30) state.screenPosition = -30;
        if (state.screenPosition > 30) state.screenPosition = 30;
        
        // 更新lastX
        lastX = currentX;
        
        // 重绘场景
        draw();
        
        if (isTouch) {
            e.preventDefault(); // 防止页面滚动
        }
    }
    
    // 鼠标悬停事件处理
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 如果正在拖动物体、透镜或焦点，则不更改光标或处理屏幕拖动
        if (window.isDraggingObject || window.isDraggingLens || window.isDraggingFocalPoint) return;
        
        // 仅在不拖动屏幕时更改光标
        if (!window.isDraggingScreen) {
            if (isMouseOverScreen(mouseX, mouseY)) {
                canvas.style.cursor = 'grab'; // 悬停在屏幕中心时显示抓取光标
            }
        }
        
        // 如果正在拖动屏幕，处理拖动逻辑
        if (window.isDraggingScreen) {
            handleScreenDrag(e, false);
        }
    });
    
    // 鼠标按下事件
    canvas.addEventListener('mousedown', function(e) {
        // 如果正在拖动物体、透镜或焦点，则不处理屏幕拖动
        if (window.isDraggingObject || window.isDraggingLens || window.isDraggingFocalPoint) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 检查是否点击了屏幕
        if (isMouseOverScreen(mouseX, mouseY)) {
            window.isDraggingScreen = true;
            lastX = mouseX;
            canvas.style.cursor = 'grabbing'; // 抓取中光标
        }
    });
    
    // 鼠标释放事件
    canvas.addEventListener('mouseup', function() {
        if (window.isDraggingScreen) {
            window.isDraggingScreen = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 鼠标离开canvas事件
    canvas.addEventListener('mouseleave', function() {
        if (window.isDraggingScreen) {
            window.isDraggingScreen = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // 添加触摸支持
    canvas.addEventListener('touchstart', function(e) {
        // 如果正在拖动物体、透镜或焦点，则不处理屏幕拖动
        if (window.isDraggingObject || window.isDraggingLens || window.isDraggingFocalPoint) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // 检查是否触摸了屏幕
        if (isMouseOverScreen(touchX, touchY)) {
            window.isDraggingScreen = true;
            lastX = touchX;
            e.preventDefault(); // 防止页面滚动
        }
    });
    
    // 触摸移动事件
    canvas.addEventListener('touchmove', function(e) {
        if (window.isDraggingScreen) {
            handleScreenDrag(e, true);
        }
    });
    
    // 触摸结束事件
    canvas.addEventListener('touchend', function(e) {
        if (window.isDraggingScreen) {
            window.isDraggingScreen = false;
            e.preventDefault();
        }
    });
    
    // 触摸取消事件
    canvas.addEventListener('touchcancel', function(e) {
        if (window.isDraggingScreen) {
            window.isDraggingScreen = false;
            e.preventDefault();
        }
    });
}

// 更新物高值
function updateObjectHeight(value) {
    // 解析并限制物高值的范围
    value = parseFloat(value);
    
    // 验证值的有效性
    if (isNaN(value)) {
        value = state.objectHeight;
    }
    
    // 限制在允许范围内
    if (value < 0.1) value = 0.1;
    if (value > 9) value = 9;
    
    // 设置新的物高值
    state.objectHeight = value;
    
    // 更新滑块和输入框的值
    const slider = document.getElementById('objectHeightSlider');
    const input = document.getElementById('objectHeightInput');
    const valueDisplay = document.getElementById('objectHeightValue');
    
    slider.value = value;
    input.value = value.toFixed(1);
    valueDisplay.textContent = value.toFixed(1) + ' cm';
    
    // 更新测量数据
    updateMeasurements();
    
    // 重新绘制
    draw();
}

// 调整UI布局函数 - 将透镜位置控件移到第一排并删除第二排
function adjustUILayout() {
    // 使用更长的延迟确保DOM完全加载
    setTimeout(() => {
        
        try {
            // 更广泛的选择器来查找顶部控件容器
            const topControls = document.querySelector('.top-sliders-container') || 
                               document.querySelector('.top-controls') || 
                               document.querySelector('.sliders-container');
                               
            if (!topControls) {
                console.error("未找到顶部控件容器");
                return;
            }
            
            
            // 找到所有滑块控件
            const sliderControls = topControls.querySelectorAll('.slider-control');
            if (sliderControls.length < 4) {
                console.error("未找到足够的滑块控件: " + sliderControls.length);
                return;
            }
            
            
            // 查找透镜位置控件（使用多种选择方法确保找到）
            let lensPositionControl = null;
            
            // 方法1：通过标题文本查找
            for (const control of sliderControls) {
                const title = control.querySelector('.slider-title');
                if (title && (title.textContent.includes('透鏡位置') || title.textContent.includes('Lens Position'))) {
                    lensPositionControl = control;
                    break;
                }
            }
            
            // 方法2：通过输入ID查找
            if (!lensPositionControl) {
                for (const control of sliderControls) {
                    if (control.querySelector('#lensPositionSlider') || control.querySelector('#lensPositionInput')) {
                        lensPositionControl = control;
                        break;
                    }
                }
            }
            
            if (!lensPositionControl) {
                console.error("未找到透镜位置控件");
                return;
            }
            
            // 找到第一排控件的所有滑块
            const firstRowControls = [];
            const secondRowControls = [];
            
            // 区分第一排和第二排控件
            // 假设每行最多3个控件
            const maxControlsPerRow = 3;
            
            for (let i = 0; i < sliderControls.length; i++) {
                if (i < maxControlsPerRow) {
                    firstRowControls.push(sliderControls[i]);
                } else {
                    secondRowControls.push(sliderControls[i]);
                }
            }
            
            
            // 检查透镜位置控件是否已经在第一排
            let isLensPositionInFirstRow = false;
            for (const control of firstRowControls) {
                if (control === lensPositionControl) {
                    isLensPositionInFirstRow = true;
                    break;
                }
            }
            
            // 如果透镜位置控件在第二排，将其移动到第一排
            if (!isLensPositionInFirstRow) {
                
                // 将透镜位置控件添加到第一排末尾
                if (firstRowControls.length > 0) {
                    const lastControl = firstRowControls[firstRowControls.length - 1];
                    lastControl.parentNode.insertBefore(lensPositionControl, lastControl.nextSibling);
                } else {
                    // 如果第一排为空，直接添加到顶部控件容器
                    topControls.appendChild(lensPositionControl);
                }
                
                // 从第二排中移除透镜位置控件
                const index = secondRowControls.indexOf(lensPositionControl);
                if (index !== -1) {
                    secondRowControls.splice(index, 1);
                }
            }
            
            // 移除第二排的所有其他控件
            for (const control of secondRowControls) {
                if (control.parentNode) {
                    control.parentNode.removeChild(control);
                }
            }
            
            // 调整第一排的样式以容纳4个控件
            // 使用Grid布局实现更好的响应式设计
            topControls.style.display = 'grid';
            topControls.style.gridTemplateColumns = 'repeat(4, 1fr)';
            topControls.style.gap = '10px';
            topControls.style.padding = '10px';
            topControls.style.marginBottom = '5px';
            
            // 调整所有控件的样式
            for (const control of firstRowControls) {
                // 设置控件基本样式
                control.style.margin = '0';
                control.style.padding = '5px';
                control.style.width = 'auto';
                control.style.maxWidth = '100%';
                
                // 调整滑块样式
                const slider = control.querySelector('input[type="range"]');
                if (slider) {
                    slider.style.width = '100%';
                }
                
                // 调整输入框样式
                const input = control.querySelector('.number-input input');
                if (input) {
                    input.style.width = '35px';
                    input.style.padding = '2px';
                    input.style.fontSize = '11px';
                }
                
                // 调整标签样式
                const title = control.querySelector('.slider-title');
                if (title) {
                    title.style.fontSize = '11px';
                    title.style.whiteSpace = 'nowrap';
                    title.style.overflow = 'hidden';
                    title.style.textOverflow = 'ellipsis';
                    title.style.marginBottom = '5px';
                }
                
                // 调整按钮样式
                const buttons = control.querySelectorAll('.value-adjust-btn');
                buttons.forEach(btn => {
                    btn.style.padding = '3px 6px';
                    btn.style.minWidth = '25px';
                    btn.style.fontSize = '10px';
                });
                
                // 调整值显示样式
                const valueDisplay = control.querySelector('.slider-labels span:nth-child(2)');
                if (valueDisplay) {
                    valueDisplay.style.fontSize = '10px';
                }
            }
            
            // 更新画布大小以适应新布局
            setTimeout(resizeCanvas, 300);
            
        } catch (error) {
            console.error("调整UI布局时出错:", error);
        }
    }, 800); // 延迟800毫秒确保DOM完全加载
}

// 确保在窗口加载完成后执行
window.addEventListener('load', function() {
    // 在DOM完全加载后调用
    setTimeout(adjustUILayout, 1000);
    
    // 添加窗口大小改变时重新调整布局
    window.addEventListener('resize', function() {
        adjustUILayout();
    });
    
    // 设置悬停提示功能
    setTimeout(setupTooltips, 1200);
});

// 设置悬停提示功能
function setupTooltips() {
    
    // 获取关键元素
    const canvas = document.getElementById('lensCanvas');
    if (!canvas) {
        console.error("未找到canvas元素");
        return;
    }
    
    // 创建提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'lens-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none'; // 防止提示框干扰鼠标事件
    document.body.appendChild(tooltip);
    
    // 当前悬停的对象类型
    let hoverObject = null;
    
    // 监听鼠标移动事件
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 获取光学系统的关键位置
        const axisY = canvas.height / 2;
        const centerX = canvas.width / 2;
        const objectX = centerX + state.objectPosition * pixelsPerCm;
        
        // 只检查鼠标是否悬停在物体上
        if (Math.abs(mouseX - objectX) < 15 && mouseY < axisY && mouseY > axisY - state.objectHeight * pixelsPerCm) {
            // 悬停在物体上
            tooltip.textContent = `物体 Object (${Math.abs(state.objectDistance).toFixed(1)} cm, ${state.objectHeight.toFixed(1)} cm)`;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 10) + 'px';
            tooltip.style.top = (e.clientY + 10) + 'px';
            hoverObject = 'object';
        } else {
            // 不在物体上
            tooltip.style.display = 'none';
            hoverObject = null;
        }
    });
    
    // 鼠标离开画布时隐藏提示
    canvas.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
    });
    
}

// 繪製光束 (多條光線)
// Draw bundle of light rays
function drawBundleRays(imageDistance) {
    // 當物距為0或像距無窮大時，不繪製光束
    if (state.objectDistance === 0 || !isFinite(imageDistance)) return;
    
    // 計算透鏡在畫布上的x座標
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    
    // 計算物體位置座標
    const objectTopX = canvas.width / 2 + pixelsPerCm * state.objectPosition;
    const axisY = canvas.height / 2; // 光轴Y坐标
    
    // 使用state中的物体高度
    const objectHeight = state.objectHeight * pixelsPerCm;
    const objectTopY = canvas.height / 2 - objectHeight; // 物體頂部位置
    
    // 計算像的位置和高度
    const magnification = calculateMagnification(state.objectDistance, imageDistance);
    const imageHeight = objectHeight * Math.abs(magnification);
    const imageX = lensX + pixelsPerCm * imageDistance;
    
    // 確定透鏡類型
    const isConcave = state.lensType === 'concave';
    
    // 確定像的頂部位置
    let imageTopY;
    if (isConcave) {
        imageTopY = canvas.height / 2 - imageHeight;
    } else {
        const imageIsInverted = magnification < 0;
        if (imageIsInverted) {
            imageTopY = canvas.height / 2 + imageHeight; // 倒立像
        } else {
            imageTopY = canvas.height / 2 - imageHeight; // 正立像
        }
    }
    
    // 判斷是否為虛像
    let isVirtualImage;
    if (isConcave) {
        isVirtualImage = true;
    } else {
        isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < state.focalLength) || 
                         (state.objectDistance > 0 && imageDistance < 0);
    }
    
    // 統一設置光束樣式 - 解決粗度不一致問題
    const bundleLineWidth = 1.2; // 統一線條粗度
    const bundleStrokeStyle = isVirtualImage ? 
        'rgba(255, 215, 0, 0.7)' : // 虛像光束 - 增加透明度
        'rgba(255, 140, 0, 0.8)';  // 實像光束 - 增加透明度
    
    // 重置所有繪圖狀態
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    
    // 生成從物體頂部發出的錐形光束
    const numRays = 12; // 增加光線數量以獲得更完整的光束效果
    const maxAngle = 12; // 調整最大發散角度以獲得更好的視覺效果
    
    // 計算畫布邊界
    const canvasLeft = 0;
    const canvasRight = canvas.width;
    const canvasTop = 0;
    const canvasBottom = canvas.height;
    
    // 從物體頂部發出多條光線，形成錐形光束
    for (let i = 0; i < numRays; i++) {
        ctx.lineWidth = bundleLineWidth; // 統一線條粗度
        ctx.strokeStyle = bundleStrokeStyle;
        ctx.setLineDash([]); // 確保使用實線
        ctx.beginPath();
        
        // 計算光線的角度（相對於到透鏡中心的直線）
        const angleRange = maxAngle * (Math.PI / 180); // 轉換為弧度
        const baseAngle = Math.atan2(axisY - objectTopY, lensX - objectTopX); // 到透鏡中心的角度
        const rayAngle = baseAngle + (i - (numRays - 1) / 2) * (angleRange / (numRays - 1));
        
        // 計算光線與透鏡的交點
        const distance = Math.abs(lensX - objectTopX);
        const rayLensY = objectTopY + distance * Math.tan(rayAngle - baseAngle);
        
        // 從物體頂部到透鏡的光線
        ctx.moveTo(objectTopX, objectTopY);
        ctx.lineTo(lensX, rayLensY);
        
        if (isConcave) {
            // 凹透鏡：光線發散
            const divergenceSlope = (rayLensY - axisY) / (Math.abs(state.focalLength) * pixelsPerCm);
            
            // 計算光線延伸到畫布邊界的終點
            let extendX, extendY;
            if (state.objectDistance < 0) {
                // 物體在右側，光線向左延伸
                extendX = canvasLeft;
                extendY = rayLensY + divergenceSlope * (extendX - lensX);
                // 確保Y座標在畫布範圍內
                if (extendY < canvasTop) {
                    extendY = canvasTop;
                    extendX = lensX + (extendY - rayLensY) / divergenceSlope;
                } else if (extendY > canvasBottom) {
                    extendY = canvasBottom;
                    extendX = lensX + (extendY - rayLensY) / divergenceSlope;
                }
            } else {
                // 物體在左側，光線向右延伸
                extendX = canvasRight;
                extendY = rayLensY + divergenceSlope * (extendX - lensX);
                // 確保Y座標在畫布範圍內
                if (extendY < canvasTop) {
                    extendY = canvasTop;
                    extendX = lensX + (extendY - rayLensY) / divergenceSlope;
                } else if (extendY > canvasBottom) {
                    extendY = canvasBottom;
                    extendX = lensX + (extendY - rayLensY) / divergenceSlope;
                }
            }
            
            ctx.lineTo(extendX, extendY);
            ctx.stroke();
            
        } else {
            // 凸透鏡：光線會聚或發散
            if (isVirtualImage) {
                // 虛像：光線發散，但延長線會聚到虛像頂部
                const slopeToVirtual = (imageTopY - rayLensY) / (imageX - lensX);
                
                // 計算光線延伸到畫布邊界的終點
                let extendX, extendY;
                if (imageX > lensX) {
                    // 向右延伸
                    extendX = canvasRight;
                    extendY = rayLensY + slopeToVirtual * (extendX - lensX);
                    if (extendY < canvasTop || extendY > canvasBottom) {
                        extendY = extendY < canvasTop ? canvasTop : canvasBottom;
                        extendX = lensX + (extendY - rayLensY) / slopeToVirtual;
                    }
                } else {
                    // 向左延伸
                    extendX = canvasLeft;
                    extendY = rayLensY + slopeToVirtual * (extendX - lensX);
                    if (extendY < canvasTop || extendY > canvasBottom) {
                        extendY = extendY < canvasTop ? canvasTop : canvasBottom;
                        extendX = lensX + (extendY - rayLensY) / slopeToVirtual;
                    }
                }
                
                ctx.lineTo(extendX, extendY);
                ctx.stroke();
                
            } else {
                // 實像：光線會聚到像頂部
                ctx.lineTo(imageX, imageTopY);
                ctx.stroke();
            }
        }
    }
    
    // 繪製光束輪廓效果 - 統一樣式
    ctx.lineWidth = bundleLineWidth + 0.5; // 稍微加粗輪廓
    ctx.strokeStyle = isVirtualImage ? 
        'rgba(255, 215, 0, 0.9)' : 
        'rgba(255, 140, 0, 0.9)';
    ctx.setLineDash([]);
    
    // 繪製光束的上下邊界線
    const boundaryAngle = maxAngle * (Math.PI / 180) / 2;
    const baseAngle = Math.atan2(axisY - objectTopY, lensX - objectTopX);
    
    // 上邊界
    const upperAngle = baseAngle + boundaryAngle;
    const upperDistance = Math.abs(lensX - objectTopX);
    const upperLensY = objectTopY + upperDistance * Math.tan(upperAngle - baseAngle);
    
    // 下邊界  
    const lowerAngle = baseAngle - boundaryAngle;
    const lowerDistance = Math.abs(lensX - objectTopX);
    const lowerLensY = objectTopY + lowerDistance * Math.tan(lowerAngle - baseAngle);
    
    ctx.beginPath();
    ctx.moveTo(objectTopX, objectTopY);
    ctx.lineTo(lensX, upperLensY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(objectTopX, objectTopY);
    ctx.lineTo(lensX, lowerLensY);
    ctx.stroke();
    
    // 如果是實像，在像頂部添加聚焦效果
    if (!isVirtualImage && isFinite(imageX) && isFinite(imageTopY)) {
        ctx.beginPath();
        ctx.arc(imageX, imageTopY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 140, 0, 0.8)';
        ctx.fill();
    }
    
    // 重置所有繪圖狀態以避免影響其他繪圖函數
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

// 繪製規則1光束 (平行光線→經過焦點)
// Draw Rule 1 bundle rays (Parallel ray→Through focus)
function drawRule1BundleRays(imageDistance) {
    // 當物距為0或像距無窮大時，不繪製光束
    if (state.objectDistance === 0 || !isFinite(imageDistance)) return;
    
    // 計算透鏡在畫布上的x座標
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    
    // 計算物體位置座標
    const objectTopX = canvas.width / 2 + pixelsPerCm * state.objectPosition;
    const axisY = canvas.height / 2;
    
    // 使用state中的物体高度
    const objectHeight = state.objectHeight * pixelsPerCm;
    const objectTopY = canvas.height / 2 - objectHeight;
    
    // 判斷是否為虛像
    const isConcave = state.lensType === 'concave';
    let isVirtualImage;
    if (isConcave) {
        isVirtualImage = true;
    } else {
        isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < state.focalLength) || 
                         (state.objectDistance > 0 && imageDistance < 0);
    }
    
    // 設置光束樣式 - 規則1紅色主題
    const bundleLineWidth = 1.0;
    const bundleStrokeStyle = isVirtualImage ? 
        'rgba(231, 76, 60, 0.4)' : // 虛像光束 - 紅色半透明
        'rgba(231, 76, 60, 0.5)';  // 實像光束 - 紅色半透明
    
    // 重置繪圖狀態
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    
    // 生成平行光束
    const numRays = 8; // 光束中的光線數量
    const raySpacing = objectHeight / (numRays - 1); // 光線間距
    
    // 計算焦點位置
    const absF = Math.abs(state.focalLength);
    const f1X = isConcave ? lensX - absF * pixelsPerCm : lensX + absF * pixelsPerCm; // 右焦點
    
    // 從物體不同高度發出平行光線
    for (let i = 0; i < numRays; i++) {
        ctx.lineWidth = bundleLineWidth;
        ctx.strokeStyle = bundleStrokeStyle;
        ctx.setLineDash([]);
        ctx.beginPath();
        
        // 計算光線起點的Y座標
        const rayStartY = objectTopY + i * raySpacing;
        
        // 從物體發出平行於光軸的光線到透鏡
        ctx.moveTo(objectTopX, rayStartY);
        ctx.lineTo(lensX, rayStartY);
        
        if (isConcave) {
            // 凹透鏡：光線發散
            const slope = (rayStartY - axisY) / (f1X - lensX);
            const extendX = lensX + 300;
            const extendY = rayStartY - slope * (extendX - lensX);
            ctx.lineTo(extendX, extendY);
        } else {
            // 凸透鏡：光線聚焦到焦點
            if (!isVirtualImage) {
                ctx.lineTo(f1X, axisY);
            } else {
                const slope = (rayStartY - axisY) / (f1X - lensX);
                const extendX = lensX + 300;
                const extendY = rayStartY + slope * (extendX - lensX);
                ctx.lineTo(extendX, extendY);
            }
        }
        
        ctx.stroke();
    }
    
    // 重置繪圖狀態
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.setLineDash([]);
}

// 繪製規則2光束 (通過中心的光線)
// Draw Rule 2 bundle rays (Ray through center)
function drawRule2BundleRays(imageDistance) {
    // 當物距為0或像距無窮大時，不繪製光束
    if (state.objectDistance === 0 || !isFinite(imageDistance)) return;
    
    // 計算透鏡在畫布上的x座標
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    
    // 計算物體位置座標
    const objectTopX = canvas.width / 2 + pixelsPerCm * state.objectPosition;
    const axisY = canvas.height / 2;
    
    // 使用state中的物体高度
    const objectHeight = state.objectHeight * pixelsPerCm;
    const objectTopY = canvas.height / 2 - objectHeight;
    
    // 計算像的位置和高度
    const magnification = calculateMagnification(state.objectDistance, imageDistance);
    const imageHeight = objectHeight * Math.abs(magnification);
    const imageX = lensX + pixelsPerCm * imageDistance;
    
    // 確定像的頂部位置
    const isConcave = state.lensType === 'concave';
    let imageTopY;
    if (isConcave) {
        imageTopY = canvas.height / 2 - imageHeight;
    } else {
        const imageIsInverted = magnification < 0;
        imageTopY = imageIsInverted ? 
            canvas.height / 2 + imageHeight : 
            canvas.height / 2 - imageHeight;
    }
    
    // 判斷是否為虛像
    let isVirtualImage;
    if (isConcave) {
        isVirtualImage = true;
    } else {
        isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < state.focalLength) || 
                         (state.objectDistance > 0 && imageDistance < 0);
    }
    
    // 設置光束樣式 - 規則2綠色主題
    const bundleLineWidth = 1.0;
    const bundleStrokeStyle = isVirtualImage ? 
        'rgba(39, 174, 96, 0.4)' : // 虛像光束 - 綠色半透明
        'rgba(39, 174, 96, 0.5)';  // 實像光束 - 綠色半透明
    
    // 重置繪圖狀態
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    
    // 生成通過中心的光束
    const numRays = 8; // 光束中的光線數量
    const raySpacing = objectHeight / (numRays - 1); // 光線間距
    
    // 從物體不同高度發出通過透鏡中心的光線
    for (let i = 0; i < numRays; i++) {
        ctx.lineWidth = bundleLineWidth;
        ctx.strokeStyle = bundleStrokeStyle;
        ctx.setLineDash([]);
        ctx.beginPath();
        
        // 計算光線起點的Y座標
        const rayStartY = objectTopY + i * raySpacing;
        
        // 計算對應的像點Y座標
        const rayImageY = imageTopY + i * raySpacing * Math.abs(magnification) * (magnification < 0 ? -1 : 1);
        
        // 從物體通過透鏡中心到像
        ctx.moveTo(objectTopX, rayStartY);
        ctx.lineTo(lensX, axisY);
        
        if (!isVirtualImage) {
            // 實像：直接連到像點
            ctx.lineTo(imageX, rayImageY);
        } else {
            // 虛像：延伸到畫布邊界
            const slope = (rayImageY - axisY) / (imageX - lensX);
            let extendX, extendY;
            if (imageX > lensX) {
                extendX = canvas.width;
                extendY = axisY + slope * (extendX - lensX);
            } else {
                extendX = 0;
                extendY = axisY + slope * (extendX - lensX);
            }
            ctx.lineTo(extendX, extendY);
        }
        
        ctx.stroke();
    }
    
    // 重置繪圖狀態
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.setLineDash([]);
}

// 繪製規則3光束 (經過焦點→平行光線)
// Draw Rule 3 bundle rays (Through focus→Parallel ray)
function drawRule3BundleRays(imageDistance) {
    // 當物距為0或像距無窮大時，不繪製光束
    if (state.objectDistance === 0 || !isFinite(imageDistance)) return;
    
    // 計算透鏡在畫布上的x座標
    const lensX = canvas.width / 2 + pixelsPerCm * state.lensPosition;
    
    // 計算物體位置座標
    const objectTopX = canvas.width / 2 + pixelsPerCm * state.objectPosition;
    const axisY = canvas.height / 2;
    
    // 使用state中的物体高度
    const objectHeight = state.objectHeight * pixelsPerCm;
    const objectTopY = canvas.height / 2 - objectHeight;
    
    // 判斷是否為虛像
    const isConcave = state.lensType === 'concave';
    let isVirtualImage;
    if (isConcave) {
        isVirtualImage = true;
    } else {
        isVirtualImage = (state.objectDistance < 0 && Math.abs(state.objectDistance) < state.focalLength) || 
                         (state.objectDistance > 0 && imageDistance < 0);
    }
    
    // 設置光束樣式 - 規則3橙色主題
    const bundleLineWidth = 1.0;
    const bundleStrokeStyle = isVirtualImage ? 
        'rgba(243, 156, 18, 0.4)' : // 虛像光束 - 橙色半透明
        'rgba(243, 156, 18, 0.5)';  // 實像光束 - 橙色半透明
    
    // 重置繪圖狀態
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    
    // 生成經過焦點的光束
    const numRays = 8; // 光束中的光線數量
    const raySpacing = objectHeight / (numRays - 1); // 光線間距
    
    // 計算焦點位置
    const absF = Math.abs(state.focalLength);
    const f2X = isConcave ? lensX + absF * pixelsPerCm : lensX - absF * pixelsPerCm; // 左焦點
    
    // 從物體不同高度發出經過焦點的光線
    for (let i = 0; i < numRays; i++) {
        ctx.lineWidth = bundleLineWidth;
        ctx.strokeStyle = bundleStrokeStyle;
        ctx.setLineDash([]);
        ctx.beginPath();
        
        // 計算光線起點的Y座標
        const rayStartY = objectTopY + i * raySpacing;
        
        // 計算通過焦點的光線方向和穿過透鏡的點
        let throughY;
        
        if (objectTopX <= f2X) {
            // 物體在焦點之前
            const slopeAfterF = (rayStartY - axisY) / (objectTopX - f2X);
            throughY = axisY + slopeAfterF * (lensX - f2X);
        } else {
            // 物體在焦點之後
            const slope = (axisY - rayStartY) / (f2X - objectTopX);
            throughY = rayStartY + slope * (lensX - objectTopX);
        }
        
        // 從物體到透鏡
        ctx.moveTo(objectTopX, rayStartY);
        ctx.lineTo(lensX, throughY);
        
        // 光線通過透鏡後平行於光軸
        if (!isVirtualImage) {
            // 實像：平行延伸
            const extendX = lensX + 300;
            ctx.lineTo(extendX, throughY);
        } else {
            // 虛像：平行延伸到畫布邊界
            let extendX;
            if (state.objectDistance < 0) {
                extendX = 0; // 向左延伸
            } else {
                extendX = canvas.width; // 向右延伸
            }
            ctx.lineTo(extendX, throughY);
        }
        
        ctx.stroke();
    }
    
    // 重置繪圖狀態
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.setLineDash([]);
}