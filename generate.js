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

// ===== ГЕНЕРИРАНЕ НА СТРАНИЦА "ПЕЧАТИ" =====
function generateSealsPage() {
  const sealsPath = path.join(__dirname, 'data', 'seals.json');
  const sealsData = JSON.parse(fs.readFileSync(sealsPath, 'utf8'));

  let sealsHTML = '';
  sealsData.seals.forEach((seal) => {
    sealsHTML += `
      <div class="seal-item" style="display:inline-block; width:200px; margin:1rem; text-align:center; border:1px solid var(--border); border-radius:8px; padding:1rem;">
        <img src="${seal.image}" alt="${seal.title}" style="width:100%; height:auto; border-radius:4px;">
        <h3 style="margin:0.5rem 0 0.25rem;">${seal.ruler}</h3>
        <p style="font-size:0.85rem; color:var(--muted);">${seal.title}</p>
        <p style="font-size:0.8rem; color:var(--text);">${seal.description}</p>
      </div>
    `;
  });

  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Сборник от исторически печати на българските владетели.">
  <title>Исторически печати на владетелите</title>
  <base href="/History-of-Bulgaria/">
  <link rel="stylesheet" href="styles.css">
  <script src="js/bundle.js" defer></script>
</head>
<body>
  <div id="page">
    <a class="skip-link" href="#content">Прескочи към съдържанието</a>
    <div id="header-container"></div>
    <div class="mw-body">
      <div id="sidebar-container"></div>
      <main class="mw-content" id="content">
        <article>
          <header class="mw-page-header">
            <h1>📜 Исторически печати на владетелите</h1>
          </header>
          <section class="intro">
            <p>Тук са събрани изображения на оловни печати (моливдовули) на българските владетели от различни периоди.</p>
          </section>
          <section style="margin-top:2rem; text-align:center;">
            ${sealsHTML}
          </section>
          <section class="references">
            <h2>Източници</h2>
            <ol>
              <li>Археологически находки от Плиска, Преслав и други центрове.</li>
              <li>Нумизматични и сфрагистични изследвания.</li>
            </ol>
          </section>
        </article>
      </main>
    </div>
    <div id="footer-container"></div>
  </div>
</body>
</html>`;

  const outputPath = path.join(__dirname, 'seals.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log('✅ Генерирана страница: seals.html');
}

// Извикваме функцията след генерирането на основните страници
generateSealsPage();

console.log('🎉 Всички страници са генерирани успешно!');
