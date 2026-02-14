/**
 * Атомарний компонент: Пункт меню навігації
 * 
 * @param {Object} options - Налаштування
 * @param {string} options.id - Унікальний ID
 * @param {string} options.icon - SVG іконка
 * @param {string} options.text - Текст пункту меню
 * @param {Function} options.onClick - Обробник кліку
 * @param {string} options.position - 'prepend' або 'append'
 */

function createMenuItem(options) {
    var defaults = {
        id: 'menu_item',
        icon: '<svg height="36" viewBox="0 0 24 24" width="36"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
        text: 'Пункт меню',
        onClick: function() {},
        position: 'append'
    };
    
    var config = Object.assign({}, defaults, options);
    
    var menuTimer = setInterval(function () {
        var menu = $('.menu .menu__list');
        if (menu.length) {
            clearInterval(menuTimer);
            
            // Видалити старий пункт
            $('.menu__item[data-action="' + config.id + '"]').remove();
            
            // Створити новий
            var menuItem = $('<li class="menu__item selector" data-action="' + config.id + '">' +
                '<div class="menu__ico">' + config.icon + '</div>' +
                '<div class="menu__text">' + config.text + '</div>' +
                '</li>');
            
            // Додати обробник
            menuItem.on('hover:enter', config.onClick);
            
            // Додати в меню
            if (config.position === 'prepend') {
                menu.prepend(menuItem);
            } else {
                menu.append(menuItem);
            }
            
            console.log('MenuItem', 'Added:', config.id);
        }
    }, 100);
}

// Експорт для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createMenuItem;
}
