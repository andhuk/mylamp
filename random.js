(function () {
    'use strict';

    function spin() {
        Lampa.Select.show({
            title: 'Рандомний вибір',
            items: [
                {title: 'Фільм', type: 'movie'},
                {title: 'Серіал', type: 'tv'}
            ],
            onSelect: function (item) {
                Lampa.Loading.start();
                
                // Використовуємо вбудований API через sources
                var api = Lampa.Api.sources.tmdb;
                var page = Math.floor(Math.random() * 10) + 1;
                
                var params = {
                    page: page,
                    language: api.language
                };
                
                var url = item.type === 'movie' 
                    ? api.url('movie/popular', params)
                    : api.url('tv/popular', params);
                
                var network = new Lampa.Reguest();
                
                network.silent(url, function (data) {
                    Lampa.Loading.stop();
                    if (data && data.results && data.results.length) {
                        var movies = data.results;
                        var topMovies = [];
                        
                        for (var i = 0; i < movies.length; i++) {
                            if (movies[i].vote_average >= 6.5) {
                                topMovies.push(movies[i]);
                            }
                        }
                        
                        if (topMovies.length === 0) topMovies = movies;
                        
                        var movie = topMovies[Math.floor(Math.random() * topMovies.length)];
                        
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
                    console.log('Random', 'API Error:', error);
                    Lampa.Noty.show('Помилка API');
                });
            }
        });
    }

    function startPlugin() {
        console.log('Random', 'Starting plugin...');

        // Додаємо пункт в головне меню навігації
        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                console.log('Random', 'Menu found, adding item...');
                
                // Видаляємо старий пункт якщо є
                $('.menu__item[data-action="random"]').remove();
                
                // Створюємо новий пункт меню
                var icon = '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/></svg>';
                var menuItem = $('<li class="menu__item selector" data-action="random"><div class="menu__ico">' + icon + '</div><div class="menu__text">Рандом</div></li>');
                
                // Додаємо обробник події
                menuItem.on('hover:enter', function() {
                    spin();
                });
                
                // Вставляємо на перше місце
                menu.prepend(menuItem);
                
                console.log('Random', 'Menu item added');
            }
        }, 100);
    }

    if (window.appready) {
        console.log('Random', 'App already ready');
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                console.log('Random', 'App ready');
                startPlugin();
            }
        });
    }
})();
