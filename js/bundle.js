// ======================================================
// BUNDLE.JS – ЦЕНТРАЛИЗИРАНО ЗАРЕЖДАНЕ НА ВСИЧКИ ЗАВИСИМОСТИ
// ======================================================

(function() {
  // 0. Зареждане на Hypothesis (анотации) – винаги, веднага
  function loadHypothesis() {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="hypothes.is/embed.js"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://hypothes.is/embed.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        console.warn('Hypothesis не се зареди, но сайтът ще продължи.');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // 1. Зареждане на Pollinations (иконки)
  function loadPollinations() {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="pollinations.js"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'pollinations.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        console.warn('Pollinations не се зареди, но сайтът ще продължи.');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // 2. Зареждане на основния script.js (който съдържа функцията initHistorySite)
  function loadMainScript() {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="script.js"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'script.js';
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        console.error('Неуспешно зареждане на script.js');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // 3. Зареждане на компонентите (header, sidebar, footer) – ако има контейнери
  function loadComponents() {
    const headerContainer = document.getElementById('header-container');
    const sidebarContainer = document.getElementById('sidebar-container');
    const footerContainer = document.getElementById('footer-container');

    const promises = [];

    if (headerContainer) {
      promises.push(
        fetch('includes/header.html')
          .then(res => res.text())
          .then(html => { headerContainer.innerHTML = html; })
          .catch(err => console.warn('Грешка при зареждане на header:', err))
      );
    }

    if (sidebarContainer) {
      promises.push(
        fetch('includes/sidebar.html')
          .then(res => res.text())
          .then(html => { sidebarContainer.innerHTML = html; })
          .catch(err => console.warn('Грешка при зареждане на sidebar:', err))
      );
    }

    if (footerContainer) {
      promises.push(
        fetch('includes/footer.html')
          .then(res => res.text())
          .then(html => { footerContainer.innerHTML = html; })
          .catch(err => console.warn('Грешка при зареждане на footer:', err))
      );
    }

    return Promise.all(promises);
  }

  // 4. Стартиране на сайта
  async function init() {
    // Зареждаме Hypothesis веднага (преди всичко останало)
    await loadHypothesis();

    // Зареждаме компонентите (header, sidebar, footer) – те са независими от скриптовете
    await loadComponents();

    // Зареждаме Pollinations
    await loadPollinations();

    // Зареждаме основния скрипт (който дефинира window.initHistorySite)
    await loadMainScript();

    // След като всичко е заредено, извикваме инициализацията
    if (typeof window.initHistorySite === 'function') {
      window.initHistorySite();
    } else {
      console.error('initHistorySite не е дефинирана. Проверете дали script.js е зареден правилно.');
    }
  }

  // Стартираме, когато DOM е готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
