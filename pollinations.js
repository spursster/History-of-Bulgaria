// pollinations.js - Генериране на иконки за владетели чрез Pollinations.ai
// Безплатно, без API ключ, без регистрация

const POLLINATIONS_CONFIG = {
    baseUrl: 'https://image.pollinations.ai/prompt/',
    defaultWidth: 128,
    defaultHeight: 128,
    defaultModel: 'flux', // или 'turbo', 'openai'
    cacheKey: 'ruler_icons_cache'
};

/**
 * Генерира URL за изображение на владетел
 * @param {string} name - Име на владетеля
 * @param {string} page - Държава/период (за контекст)
 * @param {Object} options - Настройки за изображението
 * @returns {string} URL към генерираното изображение
 */
function getRulerImageUrl(name, page, options = {}) {
    const width = options.width || POLLINATIONS_CONFIG.defaultWidth;
    const height = options.height || POLLINATIONS_CONFIG.defaultHeight;
    const model = options.model || POLLINATIONS_CONFIG.defaultModel;
    
    // Подготовка на prompt – описание на владетеля
    const prompt = encodeURIComponent(
        `portrait of ${name}, ${page} ruler, historical medieval character, ` +
        `detailed face, royal clothing, crown, majestic, oil painting style, ` +
        `cinematic lighting, high quality, 8k`
    );
    
    return `${POLLINATIONS_CONFIG.baseUrl}${prompt}?width=${width}&height=${height}&model=${model}&nologo=true`;
}

/**
 * Зарежда иконка за владетел и я кешира в localStorage
 * @param {string} name - Име на владетеля
 * @param {string} page - Държава/период
 * @param {HTMLElement} targetElement - Елемент, в който да се постави изображението
 */
async function loadRulerIcon(name, page, targetElement) {
    // Проверка за кеш
    const cacheKey = `ruler_icon_${name}_${page}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        // Ако има кеширано изображение, използваме го
        targetElement.innerHTML = `<img src="${cached}" alt="${name}" class="ruler-icon" loading="lazy">`;
        return;
    }
    
    // Генериране на ново изображение
    const imageUrl = getRulerImageUrl(name, page);
    
    // Предварително зареждане на изображението
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        // Запазване в кеш (като data URL за офлайн достъп)
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            localStorage.setItem(cacheKey, dataUrl);
        } catch (e) {
            // Ако не може да се запази като data URL, запазваме оригиналния URL
            localStorage.setItem(cacheKey, imageUrl);
        }
        
        targetElement.innerHTML = `<img src="${imageUrl}" alt="${name}" class="ruler-icon" loading="lazy">`;
    };
    
    img.onerror = function() {
        // При грешка – показваме placeholder
        targetElement.innerHTML = `<span class="ruler-icon-placeholder">${name.charAt(0)}</span>`;
    };
    
    img.src = imageUrl;
}

/**
 * Обновява всички иконки на владетели на страницата
 * Търси елементи с клас 'ruler-icon-container' и data-attributes за име и страница
 */
function initRulerIcons() {
    const containers = document.querySelectorAll('.ruler-icon-container');
    
    containers.forEach(container => {
        const name = container.dataset.rulerName;
        const page = container.dataset.rulerPage || 'History';
        
        if (name) {
            loadRulerIcon(name, page, container);
        }
    });
}

/**
 * Генерира и показва иконка за случаен владетел (за джаджата)
 * @param {Object} ruler - Обект с данни за владетеля { name, page, description }
 * @param {HTMLElement} targetElement - Елемент, в който да се покаже
 */
function showRulerWithIcon(ruler, targetElement) {
    if (!ruler) return;
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'ruler-icon-container';
    iconContainer.dataset.rulerName = ruler.name;
    iconContainer.dataset.rulerPage = ruler.page;
    iconContainer.style.display = 'inline-block';
    iconContainer.style.width = '80px';
    iconContainer.style.height = '80px';
    iconContainer.style.marginRight = '15px';
    iconContainer.style.float = 'left';
    iconContainer.style.borderRadius = '50%';
    iconContainer.style.overflow = 'hidden';
    iconContainer.style.background = '#f0f0f0';
    
    // Зареждане на иконката
    loadRulerIcon(ruler.name, ruler.page, iconContainer);
    
    // Добавяне към картата на владетеля
    const card = targetElement;
    card.prepend(iconContainer);
}

// Експорт на функциите (за използване в script.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getRulerImageUrl, loadRulerIcon, initRulerIcons, showRulerWithIcon };
}
