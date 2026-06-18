window.YaMetricaHelpers = window.YaMetricaHelpers || {};
window.YaMetricaHelpers.utils = window.YaMetricaHelpers.utils || {};

/**
 * Проверяет, принадлежит ли URL страницы целевому разделу
 * 
 * @param {string} pageUrl - Полный URL страницы (с протоколом и доменом) или путь (от корня)
 * @param {string} pathToSection - Путь к разделу от корня сайта (может быть со слешем в конце)
 * @returns {boolean} true - страница в разделе, false - вне раздела
 * @version 1.0.0
 */
window.YaMetricaHelpers.utils.isInSection = function(pageUrl, pathToSection) {
    // 1. Извлекаем путь из URL
    let path = pageUrl;
    
    // Если передан полный URL (с протоколом), берем только pathname
    if (pageUrl.startsWith('http://') || pageUrl.startsWith('https://')) {
        try {
            path = new URL(pageUrl).pathname;
        } catch (e) {
            // При некорректном URL используем исходную строку как путь
            path = pageUrl;
        }
    }
    
    // 2. Отрезаем query-параметры и якоря
    path = path.split('?')[0].split('#')[0];
    
    // 3. Удаляем расширение файла (.html, .xml, .php и т.д.)
    // Регулярное выражение: точка + любые символы (кроме точки и слеша) в конце строки
    path = path.replace(/\.[^./]+$/, '');
    
    // 4. Нормализуем пути: убираем завершающий слеш у обоих путей
    const normalizedPath = path.replace(/\/+$/, '');
    const normalizedSection = pathToSection.replace(/\/+$/, '');
    
    // 5. Проверяем вхождение:
    //    - normalizedPath === normalizedSection: точное совпадение (сам раздел)
    //    - normalizedPath.startsWith(normalizedSection + '/'): вложенная страница
    return normalizedPath === normalizedSection || 
           normalizedPath.startsWith(normalizedSection + '/');
};
