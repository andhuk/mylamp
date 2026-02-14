(function () {
    'use strict';

    function RandomMovieSpinner() {
        var network = new Lampa.Reguest(); // Використовуємо внутрішній клас запитів Lampa
        var api_url = 'https://api.themoviedb.org/3/';
        var api_key = '4ef66e126d2d9d59079589361de0f6ec'; // Стандартний ключ Lampa

        // Головна функція підбору
        this.spin = function () {
            Lampa.Select.show({
                title: 'Обираємо рандом...',
                items: [
                    { title: 'Будь-який популярний', type: 'movie' },
                    { title: 'Тільки серіали', type: 'tv' },
                    { title: 'Високий рейтинг (8+)', type: 'top' }
                ],
                onSelect: function (item) {
                    Lampa.Loading.show();
                    findRandom(item);
                }
            });
        };

        function findRandom(item) {
            // Крок 1: Визначаємо випадкову сторінку (від 1 до 50)
            var page = Math.floor(Math.random() * 50) + 1;
            var url = api_url + (item.type === 'tv' ? 'tv/popular' : 'movie/popular');
            
            if (item.type === 'top') {
                url = api_url + 'movie/top_rated';
            }

            network.silent(url + '?api_key=' + api_key + '&language=uk-UA&page=' + page, function (data) {
                if (data && data.results && data.results.length > 0) {
                    // Крок 2: Обираємо випадковий об'єкт з масиву результатів
                    var random_index = Math.floor(Math.random() * data.results.length);
                    var movie = data.results[random_index];

                    Lampa.Loading.hide();

                    // Крок 3: Відкриваємо картку фільму в Lampa
                    Lampa.Activity.push({
                        url: '',
                        title: 'Перегляд',
                        component: 'full', // Компонент повної інформації
                        id: movie.id,
                        method: item.type === 'tv' ? 'tv' : 'movie',
                        card: movie
                    });
                } else {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Не вдалося знайти нічого цікавого. Спробуй ще раз!');
                }
            }, function () {
                Lampa.Loading.hide();
                Lampa.Noty.show('Помилка мережі. TMDB сьогодні не в дусі.');
            });
        }

        // Додаємо кнопку в меню
        this.addToMenu = function () {
            var menu_item = $(`
                <div class="menu__item selector" data-action="random_spinner">
                    <div class="menu__item-icon">
                        <svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="white"/></svg>
                    </div>
                    <div class="menu__item-title">Рандом</div>
                </div>
            `);

            menu_item.on('hover:enter', this.spin);
            $('.menu .menu__list').append(menu_item);
        };
    }

    // Чекаємо на повну готовність Lampa
    if (window.appready) {
        var spinner = new RandomMovieSpinner();
        spinner.addToMenu();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                var spinner = new RandomMovieSpinner();
                spinner.addToMenu();
            }
        });
    }
})();
