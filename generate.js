// generate.js – Генерира HTML страници от data/pages.json
const fs = require('fs');
const path = require('path');

// 1. Зареждаме pages.json
const pagesPath = path.join(__dirname, 'data', 'pages.json');
const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

// 2. Шаблон за HTML страница
function generatePageHTML(pageKey, pageData) {
  // Генерираме TOC (съдържание) от секциите
  let tocItems = '';
  pageData.sections.forEach((section, index) => {
    tocItems += `<li><a href="#${section.id}">${index + 1} ${section.title}</a></li>\n`;
  });

  // Генерираме секциите
  let sectionsHTML = '';
  pageData.sections.forEach((section) => {
    sectionsHTML += `
      <section id="${section.id}">
        <h2>${section.title}</h2>
        ${section.content}
      </section>
    `;
  });

  // HTML шаблон
  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${pageData.description || 'Историческа страница'}">
  <title>${pageData.title}</title>
  <base href="/History-of-Bulgaria/">
  <link rel="stylesheet" href="styles.css">
  <script src="js/bundle.js" defer></script>
</head>
<body>
  <div id="page">
    <a class="skip-link" href="#content">Прескочи към съдържанието</a>

    <!-- ХЕДЪР -->
    <div id="header-container"></div>

    <div class="mw-body">
      <!-- СТРАНИЧНА ЛЕНТА -->
      <div id="sidebar-container"></div>

      <!-- ОСНОВНО СЪДЪРЖАНИЕ -->
      <main class="mw-content" id="content">
        <article>
          <header class="mw-page-header">
            <p class="hatnote">${pageData.hatnote || ''}</p>
            <h1>${pageData.title}</h1>
          </header>

          <section class="intro">
            <p>${pageData.intro || ''}</p>
          </section>

          <nav class="toc" aria-label="Съдържание">
            <h2>Съдържание</h2>
            <ul>
              ${tocItems}
            </ul>
          </nav>

          ${sectionsHTML}

          <section class="references">
            <h2>Източници</h2>
            <ol>
              ${(pageData.references || []).map(ref => `<li>${ref}</li>`).join('\n')}
            </ol>
          </section>
        </article>
      </main>
    </div>

    <!-- ФУТЪР -->
    <div id="footer-container"></div>

  </div>
</body>
</html>`;
}

// 3. Генерираме всички страници
Object.keys(pagesData.pages).forEach((pageKey) => {
  const pageData = pagesData.pages[pageKey];
  const html = generatePageHTML(pageKey, pageData);
  const outputPath = path.join(__dirname, `${pageKey}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✅ Генерирана страница: ${pageKey}.html`);
});

console.log('🎉 Всички страници са генерирани успешно!');
