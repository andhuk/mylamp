/**
 * Шаблон плагіна з пунктом меню
 * 
 * Додає пункт в головне меню навігації Lampa
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'MenuPlugin';
    var MENU_ID = 'my_menu_item';
    var MENU_TEXT = 'Мій пункт';
    
    // SVG іконка (замініть на свою)
    var MENU_ICON = '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>' +
        '</svg>';

    /**
     * Обробник кліку на пункт меню
     */
    function onMenuClick() {
        console.log(PLUGIN_NAME, 'Menu clicked');
        
        // TODO: Додайте свою логіку
        Lampa.Noty.show('Клік на ' + MENU_TEXT);
    }

    /**
     * Додати пункт в меню
     */
    function addMenuItem() {
        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                
                // Видалити старий пункт
                $('.menu__item[data-action="' + MENU_ID + '"]').remove();
                
                // Створити новий
                var menuItem = $('<li class="menu__item selector" data-action="' + MENU_ID + '">' +
                    '<div class="menu__ico">' + MENU_ICON + '</div>' +
                    '<div class="menu__text">' + MENU_TEXT + '</div>' +
                    '</li>');
                
                // Додати обробник
                menuItem.on('hover:enter', onMenuClick);
                
                // Додати в меню (на початок)
                menu.prepend(menuItem);
                
                console.log(PLUGIN_NAME, 'Menu item added');
            }
        }, 100);
    }

    /**
     * Ініціалізація плагіна
     */
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Starting...');
        addMenuItem();
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
