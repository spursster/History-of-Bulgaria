document.addEventListener('DOMContentLoaded', function () {
  // ===== ЕЛЕМЕНТИ =====
  const form = document.querySelector('.searchbox');
  const input = document.getElementById('search');
  const results = document.getElementById('search-results');
  const article = document.querySelector('article');

  // ===== ДАННИ ЗА ВЛАДЕТЕЛИТЕ (зареждат се от JSON) =====
  let rulersData = [];
  let rulersLoaded = false;

  // Функция за зареждане на данните от JSON файл
  async function loadRulersData() {
    if (rulersLoaded) return rulersData;
    try {
      const response = await fetch('data/rulers.json');
      if (!response.ok) throw new Error('Неуспешно зареждане на rulers.json');
      rulersData = await response.json();
      rulersLoaded = true;
      return rulersData;
    } catch (error) {
      console.error('Грешка при зареждане на владетелите:', error);
      rulersData = [];
      rulersLoaded = true;
      return rulersData;
    }
  }

  // ===== POLLINATIONS.AI – иконки за владетели =====
  // Проверяваме дали pollinations.js вече е зареден (ако е включен чрез <script>)
  // Ако не е, ще го заредим динамично при нужда.
  let pollinationsLoaded = false;

  function loadPollinationsScript() {
    return new Promise((resolve, reject) => {
      // Ако вече е зареден, връщаме веднага
      if (typeof getRulerImageUrl !== 'undefined') {
        pollinationsLoaded = true;
        resolve();
        return;
      }
      // Ако скриптът вече е добавен, но все още не е изпълнен
      if (document.querySelector('script[src="pollinations.js"]')) {
        // Изчакваме да се зареди
        const checkLoaded = setInterval(() => {
          if (typeof getRulerImageUrl !== 'undefined') {
            clearInterval(checkLoaded);
            pollinationsLoaded = true;
            resolve();
          }
        }, 100);
        // Таймаут за изчакване
        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error('Времето за зареждане на pollinations.js изтече'));
        }, 10000);
        return;
      }
      // Добавяме скрипта
      const script = document.createElement('script');
      script.src = 'pollinations.js';
      script.onload = () => {
        pollinationsLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Неуспешно зареждане на pollinations.js'));
      };
      document.head.appendChild(script);
    });
  }

  // Функция за генериране на URL за иконка (използваме, ако pollinations.js не е зареден)
  function getFallbackImageUrl(name, page) {
    const prompt = encodeURIComponent(
      `portrait of ${name}, ${page} ruler, medieval character, detailed face, royal clothing, oil painting style`
    );
    return `https://image.pollinations.ai/prompt/${prompt}?width=128&height=128&nologo=true`;
  }

  // Зареждане на иконка в контейнер
  async function loadRulerIcon(name, page, container) {
    // Опитваме се да заредим pollinations.js
    try {
      await loadPollinationsScript();
    } catch (e) {
      console.warn('Pollinations не е зареден, използвам fallback URL');
    }

    // Кеш ключ
    const cacheKey = `ruler_icon_${name}_${page}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      // Ако има кеширано изображение (data URL или URL)
      container.innerHTML = `<img src="${cached}" alt="${name}" class="ruler-icon" loading="lazy">`;
      return;
    }

    // Генериране на URL – използваме функцията от pollinations.js, ако е налична
    let imageUrl;
    if (typeof getRulerImageUrl === 'function') {
      imageUrl = getRulerImageUrl(name, page);
    } else {
      imageUrl = getFallbackImageUrl(name, page);
    }

    // Предварително зареждане
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function () {
      // Запазваме като data URL за офлайн достъп
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(cacheKey, dataUrl);
        container.innerHTML = `<img src="${dataUrl}" alt="${name}" class="ruler-icon" loading="lazy">`;
      } catch (e) {
        // Ако не може да се запази като data URL, запазваме оригиналния URL
        localStorage.setItem(cacheKey, imageUrl);
        container.innerHTML = `<img src="${imageUrl}" alt="${name}" class="ruler-icon" loading="lazy">`;
      }
    };

    img.onerror = function () {
      // При грешка – показваме placeholder
      container.innerHTML = `<span class="ruler-icon-placeholder">${name.charAt(0)}</span>`;
      // Запазваме placeholder в кеша, за да не опитваме отново
      localStorage.setItem(cacheKey, 'placeholder');
    };

    img.src = imageUrl;
  }

  // Инициализиране на всички иконки на страницата
  async function initRulerIcons() {
    const containers = document.querySelectorAll('.ruler-icon-container');
    for (const container of containers) {
      const name = container.dataset.rulerName;
      const page = container.dataset.rulerPage || 'History';
      if (name) {
        // Проверка дали вече не е заредено
        if (container.querySelector('img, .ruler-icon-placeholder')) continue;
        await loadRulerIcon(name, page, container);
      }
    }
  }

  // ===== ФОРМАТИРАНЕ НА КАРТА ЗА СЛУЧАЕН ВЛАДЕТЕЛ (с иконка) =====
  function formatRulerCard(ruler) {
    return `
      <div class="ruler-icon-container" 
           data-ruler-name="${ruler.name}" 
           data-ruler-page="${ruler.page}"
           style="width:80px;height:80px;border-radius:50%;overflow:hidden;float:left;margin-right:15px;background:#f0f0f0;flex-shrink:0;">
      </div>
      <h2>${ruler.name}</h2>
      <p><strong>Източник:</strong> ${ruler.page}</p>
      <p>${ruler.description}</p>
    `;
  }

  // ===== ДЖАДЖА ЗА СЛУЧАЕН ВЛАДЕТЕЛ =====
  async function createRandomRulerWidget() {
    const header = document.getElementById('top');
    if (!header) return;

    const widget = document.createElement('div');
    widget.className = 'random-ruler-widget';
    widget.innerHTML = `
      <button type="button" class="random-ruler-button">Покажи случаен владетел</button>
      <div class="random-ruler-card" aria-live="polite">Натиснете бутона, за да видите случаен владетел и кратка информация за него.</div>
    `;

    header.appendChild(widget);

    const button = widget.querySelector('.random-ruler-button');
    const card = widget.querySelector('.random-ruler-card');

    button.addEventListener('click', async () => {
      // Зареждаме данните, ако все още не са заредени
      let data = rulersLoaded ? rulersData : await loadRulersData();
      if (!data || data.length === 0) {
        card.innerHTML = '<p>За съжаление няма налични данни за владетели.</p>';
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      const ruler = data[randomIndex];

      // Показваме картата с контейнер за иконка
      card.innerHTML = formatRulerCard(ruler);

      // Инициализираме иконката в новодобавеното съдържание
      const container = card.querySelector('.ruler-icon-container');
      if (container) {
        await loadRulerIcon(ruler.name, ruler.page, container);
      }

      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ===== ТЪРСЕНЕ И ХАЙЛАЙТ =====
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights() {
    const highlighted = article.querySelectorAll('.search-highlight');
    highlighted.forEach((span) => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  }

  function highlightMatches(query) {
    const regex = new RegExp(escapeRegExp(query), 'gi');
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let matchCount = 0;

    while ((node = walker.nextNode())) {
      if (!node.parentNode || node.parentNode.closest('.search-highlight')) {
        continue;
      }
      const text = node.nodeValue;
      if (regex.test(text)) {
        const matches = text.match(regex) || [];
        matchCount += matches.length;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(regex, (match, index) => {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
          const highlight = document.createElement('span');
          highlight.className = 'search-highlight';
          highlight.textContent = match;
          fragment.appendChild(highlight);
          lastIndex = index + match.length;
        });
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        node.parentNode.replaceChild(fragment, node);
      }
    }

    return matchCount;
  }

  function updateResults(count, query) {
    if (!query) {
      results.textContent = 'Въведете текст за търсене.';
      return;
    }
    if (count === 0) {
      results.textContent = `Няма намерени резултати за „${query}“.`;
    } else {
      results.textContent = `Намерени ${count} резултата за „${query}“.`;
      const firstHighlight = article.querySelector('.search-highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function performSearch(event) {
    if (event) event.preventDefault();
    const query = input.value.trim();
    clearHighlights();
    if (!query) {
      updateResults(0, query);
      return;
    }
    const count = highlightMatches(query);
    updateResults(count, query);
  }

  // ===== DEBOUNCE за input събитието =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== НАВИГАЦИЯ (scroll spy) =====
  function resetCurrentNav() {
    const currentNav = document.querySelectorAll('.mw-sidebar a.nav-button[aria-current="page"]');
    currentNav.forEach((link) => link.removeAttribute('aria-current'));
  }

  function activateNavLink(link) {
    if (!link) return;
    resetCurrentNav();
    link.setAttribute('aria-current', 'page');
  }

  function getHashFromHref(href) {
    const index = href.indexOf('#');
    return index >= 0 ? href.slice(index) : '';
  }

  function findNavLinkForHash(hash) {
    if (!hash) {
      return document.querySelector('.mw-sidebar a.nav-button[href="index.html"]');
    }
    const links = Array.from(document.querySelectorAll('.mw-sidebar a.nav-button'));
    return links.find((link) => getHashFromHref(link.getAttribute('href')) === hash);
  }

  function updateCurrentNavByHash() {
    const hash = window.location.hash;
    const matchingLink = findNavLinkForHash(hash);
    if (matchingLink) {
      activateNavLink(matchingLink);
      return;
    }
    if (!hash) {
      activateNavLink(document.querySelector('.mw-sidebar a.nav-button[href="index.html"]'));
    }
  }

  function initScrollSpy() {
    const sectionLinks = Array.from(document.querySelectorAll('.mw-sidebar a.nav-button[href*="#"]'));
    const sections = sectionLinks
      .map((link) => {
        const hash = getHashFromHref(link.getAttribute('href'));
        return hash ? document.getElementById(hash.slice(1)) : null;
      })
      .filter(Boolean);

    if (!sections.length) {
      updateCurrentNavByHash();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const activeLink = findNavLinkForHash(`#${visible.target.id}`);
        if (activeLink) {
          activateNavLink(activeLink);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    updateCurrentNavByHash();
    window.addEventListener('hashchange', updateCurrentNavByHash);
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  // 1. Зареждаме данните за владетелите на заден план
  loadRulersData();

  // 2. Създаваме джаджата за случаен владетел
  createRandomRulerWidget();

  // 3. Инициализираме scroll spy
  initScrollSpy();

  // 4. Ако съществуват форма и поле за търсене, добавяме евенти
  if (form && input && results && article) {
    form.addEventListener('submit', performSearch);

    const debouncedInput = debounce(function () {
      if (!input.value.trim()) {
        clearHighlights();
        updateResults(0, '');
      }
    }, 300);
    input.addEventListener('input', debouncedInput);

    updateResults(0, '');
  }

  // 5. Инициализираме иконките на всички владетели, които вече са на страницата
  // Изчакваме малко, за да се зареди pollinations.js, ако е включен статично
  setTimeout(() => {
    initRulerIcons();
  }, 500);
});

// ===== CHATANGO ЧАТ В СТРАНИЧНАТА ЛЕНТА =====
function loadChatango() {
    const sidebar = document.querySelector('.mw-sidebar');
    if (!sidebar) return;

    // Проверка дали чатът вече е добавен
    if (document.getElementById('chatango-container')) return;

    // Създаваме контейнер за чата
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatango-container';
    chatContainer.style.marginTop = '1.5rem';
    chatContainer.style.borderTop = '1px solid var(--border)';
    chatContainer.style.paddingTop = '1rem';

    // Заглавие над чата
    const chatTitle = document.createElement('p');
    chatTitle.style.fontWeight = 'bold';
    chatTitle.style.marginBottom = '0.5rem';
    chatTitle.textContent = '💬 Исторически чат';
    chatContainer.appendChild(chatTitle);

    // Създаваме скрипт елемент за Chatango
    const script = document.createElement('script');
    script.id = 'cid0020000443405969716';
    script.setAttribute('data-cfasync', 'false');
    script.async = true;
    script.src = '//st.chatango.com/js/gz/emb.js';
    script.style.width = '250px';
    script.style.height = '350px';
    // Конфигурацията на чата – подава се като текст
    script.textContent = JSON.stringify({
        handle: 'bulgariahistory',
        arch: 'js',
        styles: {
            a: '000000',
            b: 100,
            c: 'FFFFFF',
            d: 'FFFFFF',
            k: '000000',
            l: '000000',
            m: '000000',
            n: 'FFFFFF',
            p: '10',
            q: '000000',
            r: 100,
            fwtickm: 1
        }
    });

    chatContainer.appendChild(script);
    sidebar.appendChild(chatContainer);
}

// Извикваме функцията след като DOM е готов
document.addEventListener('DOMContentLoaded', function() {
    // ... останалият ви код ...
    loadChatango();
});
