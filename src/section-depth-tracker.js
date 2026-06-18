/**
 * Отслеживает глубину просмотра страниц в заданном разделе сайта
 * 
 * Счетчик глубины хранится в sessionStorage и увеличивается при каждом переходе
 * на новую страницу внутри раздела. При достижении порога отправляется цель в Яндекс Метрику.
 * Использует новый API ym() для надежной отправки данных независимо от скорости загрузки счетчика.
 * 
 * @param {string} pathToSection - Путь к разделу от корня сайта (например, '/catalog/')
 * @param {number} depthEventLimit - Порог глубины для срабатывания цели (например, 3)
 * @param {string} depthEventName - Имя цели в Яндекс Метрике (например, 'depthOver3')
 * @param {boolean} depthResetOnExit - Сбрасывать счетчик при выходе из раздела
 * @param {boolean} depthSendAsVisitParam - Передавать фактическую глубину как параметр визита
 * @param {number} counterId - Номер счетчика Яндекс Метрики (например, 12345678)
 * @version 1.0.0
 */
function trackSectionDepth(pathToSection, depthEventLimit, depthEventName, depthResetOnExit, depthSendAsVisitParam, counterId) {
    // 1. Нормализуем путь: убираем завершающие слеши, чтобы /cat и /cat/ имели один ключ
    const normalizedPath = pathToSection.replace(/\/+$/, '');

    // 2. Генерируем уникальный ключ. 
    // Заменяем '-' на 'D' и '_' на 'U', чтобы избежать коллизий между разными разделами.
    // Остальные спецсимволы (включая начальный слеш) удаляем.
    let safePath = normalizedPath.replace(/-/g, 'D').replace(/_/g, 'U');
    const storageKey = 'ym_depth_' + safePath.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '');
    
    const firedKey = storageKey + '_fired';       // Ключ для флага отправки цели
    const lastPathKey = storageKey + '_last_path'; // Ключ для хранения последнего просмотренного пути

    // Получаем текущий путь страницы (без домена)
    const currentPath = window.location.pathname;

    // Проверяем, находится ли пользователь в целевом разделе
    const inSection = isInSection(currentPath, pathToSection);

    if (inSection) {
        // === ПОЛЬЗОВАТЕЛЬ В РАЗДЕЛЕ ===
        
        // Получаем текущее значение глубины или инициализируем нулем
        let currentDepth = parseInt(sessionStorage.getItem(storageKey), 10);
        
        // Защита от некорректных данных в sessionStorage (NaN)
        if (isNaN(currentDepth)) {
            currentDepth = 0;
        }

        // Получаем путь последней засчитанной страницы
        const lastPath = sessionStorage.getItem(lastPathKey);

        // Увеличиваем счетчик только если это новая страница (защита от F5)
        if (currentPath !== lastPath) {
            currentDepth++;
            sessionStorage.setItem(storageKey, currentDepth);
            sessionStorage.setItem(lastPathKey, currentPath);
        }

        // Если включена передача глубины как параметра визита
        if (depthSendAsVisitParam) {
            // Используем ym(..., 'params', ...) для обновления параметров текущего визита без отправки нового хита
            ym(counterId, 'params', {
                section_depth: currentDepth,      // Текущая глубина
                section_prefix: pathToSection     // Путь к разделу
            });
        }

        // Проверяем, достигнута ли глубина порога
        if (currentDepth >= depthEventLimit) {
            // Проверяем, не отправляли ли уже цель за текущую сессию
            const isAlreadyFired = sessionStorage.getItem(firedKey) === 'true';

            // Отправляем цель только один раз за визит при достижении порога
            if (!isAlreadyFired) {
                ym(counterId, 'reachGoal', depthEventName, {
                    section_depth: currentDepth      // Передаем глубину как параметр цели
                });
                
                // Устанавливаем флаг, чтобы повторно не отправлять
                sessionStorage.setItem(firedKey, 'true');
            }
        }
    } else if (depthResetOnExit) {
        // === ПОЛЬЗОВАТЕЛЬ ВНЕ РАЗДЕЛА ===
        // Сбрасываем счетчик только если включена опция сброса при выходе
        sessionStorage.removeItem(storageKey);   // Удаляем значение глубины
        sessionStorage.removeItem(firedKey);     // Удаляем флаг отправки цели
        sessionStorage.removeItem(lastPathKey);  // Удаляем путь последней страницы
    }
}

// ============================================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ
// ============================================================

trackSectionDepth(
    '/polikarbonat-dlya-teplic/',  // Путь к разделу
    3,                              // Порог глубины
    'sectionSpkDepthOver3',         // Имя цели
    true,                           // Сбрасывать при выходе
    true,                           // Передавать глубину как параметр
    12345678                        // ID счетчика Яндекс Метрики
);