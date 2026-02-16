(function () {
    'use strict';

    Lampa.Plugins.add('random_dice_recommender', function () {
        
        // 1. Створюємо кнопку в меню
        Lampa.Main.add({
            id: 'random_dice',
            title: 'Random',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white"/></svg>',
            onSelect: function () {
                startRandomSearch();
            }
        });

        function startRandomSearch() {
            // Безпечне отримання даних (якщо null - поверне [])
            var history = Lampa.Storage.cache('history', 500, []);
            var favorites = Lampa.Storage.cache('favorite', 500, []);
            
            // Зливаємо докупи
            var pool = [].concat(history, favorites);

            // Жорстка фільтрація: прибираємо все, де немає ID або назви
            var validPool = pool.filter(function(item) {
                return item && item.id && (item.title || item.name);
            });

            if (validPool.length === 0) {
                Lampa.Noty.show('Історія порожня. Подивись хоч щось!');
                return;
            }

            // Рандомний вибір "насіння" для рекомендацій
            var seed = validPool[Math.floor(Math.random() * validPool.length)];
            fetchRecommendations(seed);
        }

        function fetchRecommendations(seed) {
            var type = seed.type || (seed.name ? 'tv' : 'movie');
            var api_key = Lampa.TMDB.key();
            var lang = Lampa.Storage.get('language', 'uk');
            
            // Формуємо URL до TMDB
            var url = 'https://api.themoviedb.org/3/' + type + '/' + seed.id + '/recommendations?api_key=' + api_key + '&language=' + lang;

            Lampa.Loading.show();

            // Використовуємо вбудований метод Lampa для обходу CORS (якщо треба) або звичайний fetch
            fetch(url)
                .then(function(response) { 
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json(); 
                })
                .then(function(data) {
                    Lampa.Loading.hide();
                    
                    if (data.results && data.results.length > 0) {
                        var result = data.results[Math.floor(Math.random() * data.results.length)];
                        
                        // Відкриваємо картку знайденого фільму
                        Lampa.Activity.push({
                            url: '',
                            title: 'Подробиці',
                            component: 'full',
                            id: result.id,
                            method: type,
                            card: result,
                            source: 'tmdb'
                        });
                    } else {
                        Lampa.Noty.show('Схожого контенту не знайдено.');
                    }
                })
                .catch(function(err) {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Помилка запиту: ' + err.message);
                });
        }
    });
})();
