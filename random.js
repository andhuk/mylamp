(function () {
    'use strict';

    function initRandomPlugin() {
        var network = new Lampa.Request();
        var api_url = 'https://api.themoviedb.org/3/';
        var api_key = '4ef66e126d2d9d59079589361de0f6ec';

        function spin() {
            Lampa.Select.show({
                title: 'Рандомний вибір',
                items: [
                    {title: 'Фільм', type: 'movie'},
                    {title: 'Серіал', type: 'tv'}
                ],
                onSelect: function (item) {
                    Lampa.Loading.show();
                    var page = Math.floor(Math.random() * 20) + 1;
                    
                    network.silent(
                        api_url + 'discover/' + item.type + 
                        '?api_key=' + api_key + 
                        '&language=uk-UA' +
                        '&sort_by=vote_count.desc' +
                        '&vote_count.gte=200' +
                        '&page=' + page,
                        function (data) {
                            Lampa.Loading.hide();
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
                        },
                        function () {
                            Lampa.Loading.hide();
                            Lampa.Noty.show('Помилка API');
                        }
                    );
                }
            });
        }

        var icon = '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="white"/></svg>';
        var item = $('<div class="menu__item selector" data-action="random"><div class="menu__item-icon">' + icon + '</div><div class="menu__item-title">Рандом</div></div>');
        item.on('hover:enter', spin);
        $('.menu .menu__list').append(item);
    }

    if (window.appready) initRandomPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') initRandomPlugin();
    });
})();
