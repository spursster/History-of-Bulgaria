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
      // Връщаме празен масив или fallback данни (ако искате, може да вградите няколко)
      rulersData = [];
      rulersLoaded = true;
      return rulersData;
    }
  }

  // ===== СЛУЧАЕН ВЛАДЕТЕЛ =====
  function formatRulerCard(ruler) {
    return `
      <h2>${ruler.name}</h2>
      <p><strong>Източник:</strong> ${ruler.page}</p>
      <p>${ruler.description}</p>
    `;
  }

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
      card.innerHTML = formatRulerCard(ruler);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
// В началото на script.js – зареждане на pollinations.js
// (ако използвате модули)
// import { initRulerIcons, showRulerWithIcon } from './pollinations.js';

// Или с динамично зареждане на скрипта
function loadPollinationsScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'pollinations.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Променете функцията за случаен владетел
button.addEventListener('click', async () => {
    // Зареждаме pollinations.js, ако все още не е зареден
    if (typeof loadRulerIcon === 'undefined') {
        await loadPollinationsScript();
    }
    
    let data = rulersLoaded ? rulersData : await loadRulersData();
    if (!data || data.length === 0) {
        card.innerHTML = '<p>За съжаление няма налични данни за владетели.</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * data.length);
    const ruler = data[randomIndex];
    
    // Показване на владетеля с иконка
    card.innerHTML = ''; // Изчистваме картата
    if (typeof showRulerWithIcon === 'function') {
        showRulerWithIcon(ruler, card);
    }
    card.innerHTML += `
        <h2>${ruler.name}</h2>
        <p><strong>Източник:</strong> ${ruler.page}</p>
        <p>${ruler.description}</p>
    `;
    
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
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
  // 1. Зареждаме данните за владетелите на заден план (без да чакаме)
  loadRulersData();

  // 2. Създаваме джаджата за случаен владетел
  createRandomRulerWidget();

  // 3. Инициализираме scroll spy
  initScrollSpy();

  // 4. Ако съществуват форма и поле за търсене, добавяме евенти
  if (form && input && results && article) {
    form.addEventListener('submit', performSearch);

    // Дебоунс за input – изчистване на highlights при празно поле
    const debouncedInput = debounce(function () {
      if (!input.value.trim()) {
        clearHighlights();
        updateResults(0, '');
      }
    }, 300);
    input.addEventListener('input', debouncedInput);

    // Инициализираме съобщението за търсене
    updateResults(0, '');
  }
});
