/**
 * Приклад: Випадковий фільм
 * 
 * Додає пункт "Рандом" в меню, який відкриває випадковий популярний фільм
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'RandomMovie';

    /**
     * Отримати випадковий фільм
     */
    function getRandomMovie() {
        Lampa.Select.show({
            title: 'Випадковий вибір',
            items: [
                {title: 'Фільм', type: 'movie'},
                {title: 'Серіал', type: 'tv'}
            ],
            onSelect: function (item) {
                Lampa.Loading.start();
                
                var api = Lampa.Api.sources.tmdb;
                var page = Math.floor(Math.random() * 10) + 1;
                var url = api.url(item.type + '/popular', {
                    page: page,
                    language: api.language
                });
                
                var network = new Lampa.Reguest();
                network.silent(url, function (data) {
                    Lampa.Loading.stop();
                    
                    if (data && data.results && data.results.length) {
                        // Фільтрувати за рейтингом
                        var movies = data.results.filter(function(m) {
                            return m.vote_average >= 6.5;
                        });
                        
                        if (movies.length === 0) movies = data.results;
                        
                        // Вибрати випадковий
                        var movie = movies[Math.floor(Math.random() * movies.length)];
                        
                        // Відкрити картку
                        Lampa.Activity.push({
                            component: 'full',
                            id: movie.id,
                            method: item.type,
                            card: movie
                        });
                    } else {
                        Lampa.Noty.show('Помилка завантаження');
                    }
                }, function (error) {
                    Lampa.Loading.stop();
                    console.log(PLUGIN_NAME, 'Error:', error);
                    Lampa.Noty.show('Помилка API');
                });
            }
        });
    }

    /**
     * Додати пункт в меню
     */
    function addMenuItem() {
        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                
                $('.menu__item[data-action="random"]').remove();
                
                var icon = '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>' +
                    '</svg>';
                
                var menuItem = $('<li class="menu__item selector" data-action="random">' +
                    '<div class="menu__ico">' + icon + '</div>' +
                    '<div class="menu__text">Рандом</div>' +
                    '</li>');
                
                menuItem.on('hover:enter', getRandomMovie);
                menu.prepend(menuItem);
                
                console.log(PLUGIN_NAME, 'Menu item added');
            }
        }, 100);
    }

    /**
     * Ініціалізація
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
