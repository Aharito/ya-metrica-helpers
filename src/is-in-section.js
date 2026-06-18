/**
 * Проверяет, принадлежит ли URL страницы целевому разделу
 * 
 * @param {string} pageUrl - Полный URL страницы (с протоколом и доменом) или путь (от корня)
 * @param {string} pathToSection - Путь к разделу от корня сайта (может быть со слешем в конце)
 * @returns {boolean} true - страница в разделе, false - вне раздела
 */
function isInSection(pageUrl, pathToSection) {
    // 1. Извлекаем путь из URL
    let path = pageUrl;
    
    // Если передан полный URL (с протоколом), берем только pathname
    if (pageUrl.startsWith('http://') || pageUrl.startsWith('https://')) {
        try {
            path = new URL(pageUrl).pathname;
        } catch (e) {
            path = pageUrl;
        }
    }
    
    // 2. Отрезаем query-параметры и якоря
    path = path.split('?')[0].split('#')[0];
    
    // 3. Удаляем расширение файла (.html, .xml, .php и т.д.)
    path = path.replace(/\.[^./]+$/, '');
    
    // 4. Нормализуем пути: убираем завершающий слеш у обоих путей
    const normalizedPath = path.replace(/\/+$/, '');
    const normalizedSection = pathToSection.replace(/\/+$/, '');
    
    // 5. Проверяем вхождение
    return normalizedPath === normalizedSection || 
           normalizedPath.startsWith(normalizedSection + '/');
}