document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.searchbox');
  const input = document.getElementById('search');
  const results = document.getElementById('search-results');
  const article = document.querySelector('article');

  if (!form || !input || !results || !article) {
    return;
  }

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
        matchCount += (text.match(regex) || []).length;
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

  initScrollSpy();

  form.addEventListener('submit', performSearch);
  input.addEventListener('input', function () {
    if (!input.value.trim()) {
      clearHighlights();
      updateResults(0, '');
    }
  });
  updateResults(0, '');
});
