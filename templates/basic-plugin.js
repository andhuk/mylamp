/**
 * Базовий шаблон плагіна Lampa
 * 
 * Використання:
 * 1. Змініть назву плагіна
 * 2. Додайте свою логіку в startPlugin()
 * 3. Завантажте плагін в Lampa
 */

(function () {
    'use strict';

    // Конфігурація плагіна
    var PLUGIN_NAME = 'MyPlugin';
    var PLUGIN_VERSION = '1.0.0';

    /**
     * Головна функція плагіна
     */
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Version:', PLUGIN_VERSION);
        console.log(PLUGIN_NAME, 'Started successfully');
        
        // TODO: Додайте свою логіку тут
        
        // Приклад: показати повідомлення
        Lampa.Noty.show(PLUGIN_NAME + ' завантажено!');
    }

    /**
     * Ініціалізація плагіна
     */
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
