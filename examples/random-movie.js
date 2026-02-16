(function () {
    'use strict';

    Lampa.Plugins.add('random_dice_recommender', function () {
        
        // Додаємо кнопку в бокове меню
        Lampa.Main.add({
            id: 'random_dice',
            title: 'Random',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white"/></svg>',
            onSelect: function () {
                var history = Lampa.Storage.cache('history', 500, []);
                var favorites = Lampa.Storage.cache('favorite', 500, []);
                var pool = [].concat(history, favorites);

                // Фільтруємо валідні об'єкти
                var validPool = pool.filter(function(item) {
                    return item && item.id && (item.title || item.name);
                });

                if (validPool.length === 0) {
                    Lampa.Noty.show('Історія або Обране порожні!');
                    return;
                }

                var seed = validPool[Math.floor(Math.random() * validPool.length)];
                fetchSimilar(seed);
            }
        });

        function fetchSimilar(seed) {
            // Визначаємо тип (фільм чи серіал)
            var type = seed.type || (seed.name ? 'tv' : 'movie');
            var lang = Lampa.Storage.get('language', 'uk');
            var api_key = Lampa.TMDB.key();
            
            // URL без зайвих пробілів і об'єктів
            var url = 'https://api.themoviedb.org/3/' + type + '/' + seed.id + '/recommendations?api_key=' + api_key + '&language=' + lang;

            Lampa.Loading.show();

            fetch(url)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    Lampa.Loading.hide();
                    
                    if (data.results && data.results.length > 0) {
                        var result = data.results[Math.floor(Math.random() * data.results.length)];
                        
                        // ФІКС: Створюємо чистий об'єкт карти, щоб Lampa не "впала"
                        var cleanCard = {
                            id: result.id,
                            title: result.title || result.name || '',
                            name: result.name || result.title || '',
                            img: result.poster_path ? 'https://image.tmdb.org/t/p/w500' + result.poster_path : '',
                            background_image: result.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + result.backdrop_path : '',
                            vote_average: result.vote_average || 0,
                            release_date: result.release_date || result.first_air_date || '0000-00-00'
                        };

                        // ВАЖЛИВО: url має бути саме порожнім РЯДКОМ '', а не undefined
                        Lampa.Activity.push({
                            url: '', 
                            title: 'Подробиці',
                            component: 'full',
                            id: cleanCard.id,
                            method: type,
                            card: cleanCard,
                            source: 'tmdb'
                        });
                    } else {
                        Lampa.Noty.show('Нічого схожого не знайшли.');
                    }
                })
                .catch(function() {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Помилка мережі TMDB');
                });
        }
    });
})();
