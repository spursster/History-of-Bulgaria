// js/bundle.js

// 1. Зареждане на Hypothesis (ако не е вече зареден)
(function loadHypothesis() {
  if (!document.querySelector('script[src*="hypothes.is/embed.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://hypothes.is/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }
})();

// 2. Зареждане на Pollinations (иконки)
(function loadPollinations() {
  if (!document.querySelector('script[src="pollinations.js"]')) {
    const script = document.createElement('script');
    script.src = 'pollinations.js';
    script.async = true;
    document.head.appendChild(script);
  }
})();

// 3. Зареждане на основния script.js (с търсене, случаен владетел, чат и т.н.)
(function loadMainScript() {
  if (!document.querySelector('script[src="script.js"]')) {
    const script = document.createElement('script');
    script.src = 'script.js';
    script.defer = true;
    document.head.appendChild(script);
  }
})();

// 4. Зареждане на компонентите (header, sidebar, footer) – ако има контейнери
document.addEventListener('DOMContentLoaded', function() {
  const headerContainer = document.getElementById('header-container');
  const sidebarContainer = document.getElementById('sidebar-container');
  const footerContainer = document.getElementById('footer-container');

  if (headerContainer) {
    fetch('includes/header.html')
      .then(res => res.text())
      .then(html => { headerContainer.innerHTML = html; });
  }
  if (sidebarContainer) {
    fetch('includes/sidebar.html')
      .then(res => res.text())
      .then(html => { sidebarContainer.innerHTML = html; });
  }
  if (footerContainer) {
    fetch('includes/footer.html')
      .then(res => res.text())
      .then(html => { footerContainer.innerHTML = html; });
  }
});
