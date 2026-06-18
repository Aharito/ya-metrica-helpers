const testCases = [
    // === Базовые случаи (раздел без слеша) ===
    { url: '/polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Точное совпадение' },
    { url: '/polikarbonat-dlya-teplic/', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Слеш в URL' },
    { url: '/polikarbonat-dlya-teplic.html', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Расширение .html' },
    { url: '/polikarbonat-dlya-teplic.xml', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Расширение .xml' },
    { url: 'https://site.ru/polikarbonat-dlya-teplic/teplichnyj-polikarbonat-botanica', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Полный URL, вложенная страница' },
    { url: '/polikarbonat-dlya-teplic/teplichnyj-polikarbonat-botanica?param=1', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Вложенная с query-параметрами' },
    { url: '/dostavka/polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic', expected: false, desc: 'Совпадение в подпапке (ложное)' },
    { url: '/polikarbonat-teplic2', section: '/polikarbonat-dlya-teplic', expected: false, desc: 'Похожее название (ложное)' },
    { url: '/polikarbonat-dlya-teplic2/teplichnyj-polikarbonat-botanica', section: '/polikarbonat-dlya-teplic', expected: false, desc: 'Префиксное совпадение (ложное)' },
    { url: '/polikarbonat-dlya-teplic.php', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Расширение .php' },

    // === Раздел задан со слешем на конце ===
    { url: '/polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: точное совпадение' },
    { url: '/polikarbonat-dlya-teplic/', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: оба со слешем' },
    { url: '/polikarbonat-dlya-teplic.html', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: .html' },
    { url: '/polikarbonat-dlya-teplic.xml', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: .xml' },
    { url: 'https://site.ru/polikarbonat-dlya-teplic/teplichnyj-polikarbonat-botanica', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: полный URL' },
    { url: '/polikarbonat-dlya-teplic/teplichnyj-polikarbonat-botanica?param=1', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: query-параметры' },
    { url: '/dostavka/polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic/', expected: false, desc: 'Раздел со слешем: подпапка (ложное)' },
    { url: '/polikarbonat-teplic2', section: '/polikarbonat-dlya-teplic/', expected: false, desc: 'Раздел со слешем: похожее название (ложное)' },
    { url: '/polikarbonat-dlya-teplic2/teplichnyj-polikarbonat-botanica', section: '/polikarbonat-dlya-teplic/', expected: false, desc: 'Раздел со слешем: префиксное (ложное)' },
    { url: '/polikarbonat-dlya-teplic.php', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Раздел со слешем: .php' },

    // === Дополнительные edge-cases ===
    { url: '/polikarbonat.dlya/teplichnyj', section: '/polikarbonat.dlya', expected: true, desc: 'Точка в названии папки (точное совпадение)' },
    { url: '/polikarbonat.dlya.teplic/teplichnyj', section: '/polikarbonat', expected: false, desc: 'Точка в папке (защита от регулярки)' },
    { url: '/polikarbonat-dlya-teplic///', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Множественные слеши в конце URL' },
    { url: '/polikarbonat-dlya-teplic/#reviews', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Хэш со слешем перед ним' },
    { url: '/polikarbonat-dlya-teplic#reviews', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Хэш без слеша перед ним' },
    { url: '/polikarbonat-dlya-teplic/page#section', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Хэш во вложенной странице' },
    { url: '/polikarbonat-dlya-teplic/?q=1#top', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Query и хэш одновременно' },
    { url: 'https://user:pass@site.ru:8080/polikarbonat-dlya-teplic/?q=1#top', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'Сложный URL (auth, port, query, hash)' },
    { url: '/Polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic', expected: false, desc: 'Чувствительность к регистру' },
    { url: '/', section: '/', expected: true, desc: 'Корень сайта' },
    { url: '/polikarbonat-dlya-teplic/index.php', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Вложенный index.php' },
    { url: '/polikarbonat-dlya-teplic', section: '/polikarbonat-dlya-teplic/', expected: true, desc: 'URL без слеша, раздел со слешем' },
    { url: 'https://site.ru/', section: '/', expected: true, desc: 'Полный URL корня сайта' },
    { url: '/polikarbonat-dlya-teplic/page.html', section: '/polikarbonat-dlya-teplic', expected: true, desc: 'Вложенная страница с расширением' },
];

function runTests() {
    let passed = 0;
    let failed = 0;
    const results = [];

    testCases.forEach((test, index) => {
        const actual = isInSection(test.url, test.section);
        const status = actual === test.expected ? 'PASS' : 'FAIL';
        
        if (actual === test.expected) {
            passed++;
        } else {
            failed++;
        }
        
        results.push({
            id: index + 1,
            desc: test.desc,
            url: test.url,
            section: test.section,
            expected: test.expected,
            actual: actual,
            status: status
        });
    });

    // Вывод в консоль
    console.log('%c=== Результаты тестов isInSection ===', 'font-size: 16px; font-weight: bold;');
    console.table(results);
    console.log(
        `%cИтого: ${passed} пройдено, ${failed} провалено из ${testCases.length}`,
        `font-size: 14px; color: ${failed === 0 ? 'green' : 'red'}; font-weight: bold;`
    );

    // Вывод на страницу для наглядности
    renderToPage(results, passed, failed);
}

function renderToPage(results, passed, failed) {
    const container = document.getElementById('test-results');
    if (!container) return;

    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.innerHTML = `<h2>Итого: ${passed} пройдено, ${failed} провалено из ${testCases.length}</h2>`;
    container.appendChild(summary);

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>№</th>
                <th>Описание</th>
                <th>URL</th>
                <th>Раздел</th>
                <th>Ожидалось</th>
                <th>Факт</th>
                <th>Статус</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    results.forEach(r => {
        const row = document.createElement('tr');
        row.className = r.status === 'PASS' ? 'pass' : 'fail';
        row.innerHTML = `
            <td>${r.id}</td>
            <td>${r.desc}</td>
            <td><code>${r.url}</code></td>
            <td><code>${r.section}</code></td>
            <td>${r.expected}</td>
            <td>${r.actual}</td>
            <td><strong>${r.status}</strong></td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

// Автозапуск после загрузки страницы
document.addEventListener('DOMContentLoaded', runTests);