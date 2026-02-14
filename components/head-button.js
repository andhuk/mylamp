/**
 * Атомарний компонент: Кнопка в шапці
 * 
 * @param {Object} options - Налаштування
 * @param {string} options.id - Унікальний ID
 * @param {string} options.icon - SVG іконка
 * @param {Function} options.onClick - Обробник кліку
 */

function createHeadButton(options) {
    var defaults = {
        id: 'head_button',
        icon: '<svg height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
        onClick: function() {}
    };
    
    var config = Object.assign({}, defaults, options);
    
    var timer = setInterval(function () {
        var actions = $('.head__actions');
        if (actions.length) {
            clearInterval(timer);
            
            // Видалити стару кнопку
            $('#' + config.id).remove();
            
            // Створити нову
            var button = $('<div id="' + config.id + '" class="head__action selector">' +
                config.icon +
                '</div>');
            
            // Додати обробник
            button.on('hover:enter hover:click hover:touch', config.onClick);
            
            // Додати в шапку
            actions.append(button);
            
            console.log('HeadButton', 'Added:', config.id);
        }
    }, 100);
}

// Експорт для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createHeadButton;
}
