/**
 * Шаблон плагіна з налаштуваннями
 * 
 * Додає розділ налаштувань в Lampa
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'SettingsPlugin';
    var COMPONENT_ID = 'my_settings';
    
    // Manifest
    var manifest = {
        type: 'other',
        version: '1.0.0',
        name: 'Мій плагін',
        description: 'Опис плагіна',
        component: COMPONENT_ID
    };
    
    // SVG іконка
    var ICON = '<svg height="36" viewBox="0 0 24 24" width="36">' +
        '<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" fill="currentColor"/>' +
        '</svg>';

    /**
     * Створити налаштування
     */
    function createSettings() {
        Lampa.Manifest.plugins = manifest;
        
        // Додати розділ
        Lampa.SettingsApi.addComponent({
            component: COMPONENT_ID,
            icon: ICON,
            name: manifest.name
        });
        
        // Заголовок
        Lampa.SettingsApi.addParam({
            component: COMPONENT_ID,
            param: {
                type: 'title'
            },
            field: {
                name: 'Основні налаштування'
            }
        });
        
        // Перемикач
        Lampa.SettingsApi.addParam({
            component: COMPONENT_ID,
            param: {
                name: 'enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Увімкнути плагін',
                description: 'Увімкнути або вимкнути функціонал'
            },
            onChange: function (value) {
                console.log(PLUGIN_NAME, 'Enabled:', value);
                Lampa.Noty.show('Плагін ' + (value ? 'увімкнено' : 'вимкнено'));
            }
        });
        
        // Текстове поле
        Lampa.SettingsApi.addParam({
            component: COMPONENT_ID,
            param: {
                name: 'api_key',
                type: 'input',
                default: ''
            },
            field: {
                name: 'API ключ',
                placeholder: 'Введіть ключ...'
            },
            onChange: function (value) {
                console.log(PLUGIN_NAME, 'API Key:', value);
            }
        });
        
        // Кнопка
        Lampa.SettingsApi.addParam({
            component: COMPONENT_ID,
            param: {
                type: 'button'
            },
            field: {
                name: 'Виконати дію',
                description: 'Натисніть для виконання'
            },
            onChange: function () {
                console.log(PLUGIN_NAME, 'Button clicked');
                Lampa.Noty.show('Дія виконана!');
            }
        });
        
        // Статичний текст
        Lampa.SettingsApi.addParam({
            component: COMPONENT_ID,
            param: {
                type: 'static'
            },
            field: {
                name: manifest.version,
                description: 'Версія плагіна'
            }
        });
    }

    /**
     * Ініціалізація плагіна
     */
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Starting...');
        createSettings();
        console.log(PLUGIN_NAME, 'Settings created');
    }

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
