(function () {
    'use strict';

    function initRandomPlugin() {
        var network = new Lampa.Reguest();
        var api_url = 'https://api.themoviedb.org/3/';
        var api_key = '4ef66e126d2d9d59079589361de0f6ec';

        // User preferences storage
        var UserPrefs = {
            get: function() {
                try {
                    var data = localStorage.getItem('lampa_random_prefs');
                    return data ? JSON.parse(data) : { liked: [], disliked: [], history: [] };
                } catch(e) {
                    return { liked: [], disliked: [], history: [] };
                }
            },
            save: function(prefs) {
                try {
                    localStorage.setItem('lampa_random_prefs', JSON.stringify(prefs));
                } catch(e) {}
            },
            addLike: function(movie) {
                var prefs = this.get();
                prefs.liked.push({ id: movie.id, genres: movie.genre_ids || [], rating: movie.vote_average || 0 });
                if (prefs.liked.length > 50) prefs.liked.shift();
                this.save(prefs);
            },
            addDislike: function(movie) {
                var prefs = this.get();
                prefs.disliked.push({ id: movie.id, genres: movie.genre_ids || [] });
                if (prefs.disliked.length > 50) prefs.disliked.shift();
                this.save(prefs);
            },
            addHistory: function(movieId) {
                var prefs = this.get();
                var index = prefs.history.indexOf(movieId);
                if (index === -1) {
                    prefs.history.push(movieId);
                    if (prefs.history.length > 100) prefs.history.shift();
                    this.save(prefs);
                }
            }
        };

        // Calculate score with user preferences
        function calculateScore(movie, userPrefs) {
            var rating = movie.vote_average || 0;
            var votes = movie.vote_count || 0;
            
            // Weighted rating
            var score = (votes / (votes + 50)) * rating + (50 / (votes + 50)) * 6.5;
            
            // Boost based on liked genres
            if (userPrefs.liked.length > 0) {
                var likedGenres = {};
                for (var i = 0; i < userPrefs.liked.length; i++) {
                    var genres = userPrefs.liked[i].genres || [];
                    for (var j = 0; j < genres.length; j++) {
                        likedGenres[genres[j]] = (likedGenres[genres[j]] || 0) + 1;
                    }
                }
                
                var movieGenres = movie.genre_ids || [];
                for (var k = 0; k < movieGenres.length; k++) {
                    if (likedGenres[movieGenres[k]]) {
                        score += (likedGenres[movieGenres[k]] / userPrefs.liked.length) * 1.5;
                    }
                }
            }
            
            return score;
        }

        // Swipe interface
        function showSwipeMode(type) {
            Lampa.Loading.show();
            
            var page = Math.floor(Math.random() * 10) + 1;
            network.silent(
                api_url + 'discover/' + type + 
                '?api_key=' + api_key + 
                '&language=uk-UA' +
                '&sort_by=vote_count.desc' +
                '&vote_count.gte=100' +
                '&page=' + page,
                function(data) {
                    Lampa.Loading.hide();
                    if (data && data.results && data.results.length) {
                        var prefs = UserPrefs.get();
                        var movies = [];
                        
                        // Filter and score
                        for (var i = 0; i < data.results.length; i++) {
                            var m = data.results[i];
                            if (prefs.history.indexOf(m.id) === -1) {
                                m.score = calculateScore(m, prefs);
                                movies.push(m);
                            }
                        }
                        
                        movies.sort(function(a, b) { return b.score - a.score; });
                        movies = movies.slice(0, 12);
                        
                        if (movies.length > 0) {
                            openSwipeUI(movies, type);
                        } else {
                            Lampa.Noty.show('Немає нових фільмів');
                        }
                    } else {
                        Lampa.Noty.show('Помилка завантаження');
                    }
                },
                function() {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Помилка API');
                }
            );
        }

        function openSwipeUI(movies, type) {
            var currentIndex = 0;
            var swipeCount = 0;
            var minSwipes = 10;
            
            var html = '<div class="random-swipe-wrap">' +
                '<div class="random-swipe-info-top">' +
                    '<div class="random-swipe-counter"><span id="swipe-current">1</span> / ' + movies.length + '</div>' +
                    '<div class="random-swipe-bar"><div class="random-swipe-bar-fill" id="swipe-bar"></div></div>' +
                '</div>' +
                '<div class="random-swipe-card-area" id="card-area"></div>' +
                '<div class="random-swipe-actions">' +
                    '<div class="random-swipe-action selector" id="swipe-dislike"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#ff4458" stroke-width="2" stroke-linecap="round"/></svg><div>Ні</div></div>' +
                    '<div class="random-swipe-action selector" id="swipe-info"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4a9eff" stroke-width="2"/><path d="M12 16v-4m0-4h.01" stroke="#4a9eff" stroke-width="2" stroke-linecap="round"/></svg><div>Інфо</div></div>' +
                    '<div class="random-swipe-action selector" id="swipe-like"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#00d66e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div>Так</div></div>' +
                '</div>' +
                '<div class="random-swipe-hint">Оцініть мінімум ' + minSwipes + ' для рекомендацій</div>' +
                '</div>';
            
            var $wrap = $(html);
            var $cardArea = $wrap.find('#card-area');
            var $counter = $wrap.find('#swipe-current');
            var $bar = $wrap.find('#swipe-bar');
            
            function renderCard(movie) {
                var poster = movie.poster_path ? 
                    'https://image.tmdb.org/t/p/w500' + movie.poster_path : '';
                var title = movie.title || movie.name || 'Без назви';
                var rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                var year = (movie.release_date || movie.first_air_date || '').split('-')[0];
                
                var card = '<div class="random-swipe-card">' +
                    (poster ? '<img src="' + poster + '" alt="' + title + '">' : '<div class="random-swipe-no-poster">Немає постера</div>') +
                    '<div class="random-swipe-card-details">' +
                        '<div class="random-swipe-title">' + title + '</div>' +
                        '<div class="random-swipe-meta">' +
                            '<span class="random-swipe-rating">★ ' + rating + '</span>' +
                            (year ? '<span class="random-swipe-year">' + year + '</span>' : '') +
                        '</div>' +
                    '</div>' +
                '</div>';
                
                return $(card);
            }
            
            function showCard() {
                if (currentIndex < movies.length) {
                    $cardArea.empty().append(renderCard(movies[currentIndex]));
                    $counter.text(currentIndex + 1);
                    var progress = Math.min((swipeCount / minSwipes) * 100, 100);
                    $bar.css('width', progress + '%');
                }
            }
            
            function handleSwipe(action) {
                if (currentIndex >= movies.length) return;
                
                var movie = movies[currentIndex];
                
                if (action === 'like') {
                    UserPrefs.addLike(movie);
                    $cardArea.find('.random-swipe-card').addClass('swipe-right');
                } else if (action === 'dislike') {
                    UserPrefs.addDislike(movie);
                    $cardArea.find('.random-swipe-card').addClass('swipe-left');
                } else if (action === 'info') {
                    Lampa.Modal.close();
                    Lampa.Activity.push({
                        component: 'full',
                        id: movie.id,
                        method: type,
                        card: movie
                    });
                    return;
                }
                
                UserPrefs.addHistory(movie.id);
                swipeCount++;
                currentIndex++;
                
                setTimeout(function() {
                    if (currentIndex >= movies.length) {
                        finishSwipe();
                    } else {
                        showCard();
                    }
                }, 300);
            }
            
            function finishSwipe() {
                if (swipeCount < minSwipes) {
                    Lampa.Noty.show('Потрібно ще ' + (minSwipes - swipeCount) + ' оцінок');
                    Lampa.Modal.close();
                    return;
                }
                
                Lampa.Modal.close();
                var prefs = UserPrefs.get();
                
                if (prefs.liked.length > 0) {
                    var lastLiked = prefs.liked[prefs.liked.length - 1];
                    Lampa.Activity.push({
                        component: 'full',
                        id: lastLiked.id,
                        method: type,
                        card: lastLiked
                    });
                } else {
                    Lampa.Noty.show('Дякуємо за оцінки!');
                }
            }
            
            $wrap.find('#swipe-like').on('hover:enter', function() { handleSwipe('like'); });
            $wrap.find('#swipe-dislike').on('hover:enter', function() { handleSwipe('dislike'); });
            $wrap.find('#swipe-info').on('hover:enter', function() { handleSwipe('info'); });
            
            showCard();
            
            Lampa.Modal.open({
                title: 'Swipe режим',
                html: $wrap,
                size: 'medium',
                mask: true,
                onBack: function() {
                    Lampa.Modal.close();
                }
            });
            
            Lampa.Controller.add('modal', {
                toggle: function() {
                    Lampa.Controller.collectionSet($wrap.find('.selector'));
                    Lampa.Controller.collectionFocus(false, $wrap.find('.selector').eq(1));
                },
                left: function() {
                    Navigator.move('left');
                },
                right: function() {
                    Navigator.move('right');
                },
                back: function() {
                    Lampa.Modal.close();
                }
            });
            
            Lampa.Controller.toggle('modal');
        }

        // Quick random
        function quickRandom(type) {
            Lampa.Loading.show();
            var page = Math.floor(Math.random() * 20) + 1;
            
            network.silent(
                api_url + 'discover/' + type + 
                '?api_key=' + api_key + 
                '&language=uk-UA' +
                '&sort_by=vote_count.desc' +
                '&vote_count.gte=100' +
                '&page=' + page,
                function(data) {
                    Lampa.Loading.hide();
                    if (data && data.results && data.results.length) {
                        var prefs = UserPrefs.get();
                        var movies = [];
                        
                        for (var i = 0; i < data.results.length; i++) {
                            var m = data.results[i];
                            m.score = calculateScore(m, prefs);
                            movies.push(m);
                        }
                        
                        movies.sort(function(a, b) { return b.score - a.score; });
                        var movie = movies[Math.floor(Math.random() * Math.min(5, movies.length))];
                        
                        UserPrefs.addHistory(movie.id);
                        Lampa.Activity.push({
                            component: 'full',
                            id: movie.id,
                            method: type,
                            card: movie
                        });
                    } else {
                        Lampa.Noty.show('Помилка завантаження');
                    }
                },
                function() {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Помилка API');
                }
            );
        }

        // Main menu
        function spin() {
            Lampa.Select.show({
                title: 'Рандомний вибір',
                items: [
                    { title: 'Фільм', type: 'movie', mode: 'quick' },
                    { title: 'Серіал', type: 'tv', mode: 'quick' },
                    { title: 'Swipe: Фільм', type: 'movie', mode: 'swipe' },
                    { title: 'Swipe: Серіал', type: 'tv', mode: 'swipe' }
                ],
                onSelect: function(item) {
                    if (item.mode === 'swipe') {
                        showSwipeMode(item.type);
                    } else {
                        quickRandom(item.type);
                    }
                }
            });
        }

        // Add styles
        var style = document.createElement('style');
        style.textContent = '.random-swipe-wrap{padding:1.5em;max-width:500px;margin:0 auto}' +
            '.random-swipe-info-top{margin-bottom:1.5em;text-align:center}' +
            '.random-swipe-counter{font-size:1.1em;margin-bottom:0.5em;color:#fff}' +
            '.random-swipe-bar{height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden}' +
            '.random-swipe-bar-fill{height:100%;background:#e50914;transition:width 0.3s}' +
            '.random-swipe-card-area{height:450px;margin-bottom:1.5em;position:relative}' +
            '.random-swipe-card{width:100%;height:100%;border-radius:12px;overflow:hidden;background:#1a1a1a;box-shadow:0 8px 32px rgba(0,0,0,0.6);position:relative;transition:transform 0.3s,opacity 0.3s}' +
            '.random-swipe-card.swipe-left{transform:translateX(-120%) rotate(-15deg);opacity:0}' +
            '.random-swipe-card.swipe-right{transform:translateX(120%) rotate(15deg);opacity:0}' +
            '.random-swipe-card img{width:100%;height:100%;object-fit:cover}' +
            '.random-swipe-no-poster{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;font-size:1.2em}' +
            '.random-swipe-card-details{position:absolute;bottom:0;left:0;right:0;padding:1.5em;background:linear-gradient(transparent,rgba(0,0,0,0.95))}' +
            '.random-swipe-title{font-size:1.3em;font-weight:bold;margin-bottom:0.5em;color:#fff}' +
            '.random-swipe-meta{display:flex;gap:1em;font-size:0.9em;color:rgba(255,255,255,0.8)}' +
            '.random-swipe-rating{color:#ffd700}' +
            '.random-swipe-actions{display:flex;justify-content:center;gap:1.5em;margin-bottom:1em}' +
            '.random-swipe-action{display:flex;flex-direction:column;align-items:center;gap:0.5em;padding:1em;border-radius:50%;background:rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s}' +
            '.random-swipe-action.focus{background:rgba(255,255,255,0.2);transform:scale(1.1)}' +
            '.random-swipe-action div{font-size:0.85em;color:#fff}' +
            '.random-swipe-hint{text-align:center;font-size:0.85em;color:rgba(255,255,255,0.6)}';
        document.head.appendChild(style);

        // Add menu button
        var icon = '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="white"/></svg>';
        var item = $('<div class="menu__item selector" data-action="random"><div class="menu__item-icon">' + icon + '</div><div class="menu__item-title">Рандом</div></div>');
        item.on('hover:enter', spin);
        $('.menu .menu__list').append(item);
    }

    if (window.appready) initRandomPlugin();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') initRandomPlugin();
    });
})();
