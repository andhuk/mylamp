(function () {
    'use strict';

    function initRandomPlugin() {
        var network = new Lampa.Reguest();
        var api_url = 'https://api.themoviedb.org/3/';
        var api_key = '4ef66e126d2d9d59079589361de0f6ec';

        // User preference storage
        var UserPrefs = {
            get: function() {
                var data = localStorage.getItem('lampa_random_prefs');
                return data ? JSON.parse(data) : { liked: [], disliked: [], history: [] };
            },
            save: function(prefs) {
                localStorage.setItem('lampa_random_prefs', JSON.stringify(prefs));
            },
            addLike: function(movie) {
                var prefs = this.get();
                prefs.liked.push({ id: movie.id, genres: movie.genre_ids, rating: movie.vote_average });
                if (prefs.liked.length > 100) prefs.liked.shift(); // Keep last 100
                this.save(prefs);
            },
            addDislike: function(movie) {
                var prefs = this.get();
                prefs.disliked.push({ id: movie.id, genres: movie.genre_ids });
                if (prefs.disliked.length > 100) prefs.disliked.shift();
                this.save(prefs);
            },
            addHistory: function(movieId) {
                var prefs = this.get();
                if (!prefs.history.includes(movieId)) {
                    prefs.history.push(movieId);
                    if (prefs.history.length > 200) prefs.history.shift();
                    this.save(prefs);
                }
            }
        };

        // Calculate weighted rating (Bayesian average)
        function calculateScore(movie, userPrefs) {
            var C = 6.5; // Mean vote across all movies
            var m = 100; // Minimum votes required
            var R = movie.vote_average || 0;
            var v = movie.vote_count || 0;
            
            // Bayesian weighted rating
            var weightedRating = (v / (v + m)) * R + (m / (v + m)) * C;
            
            // User preference boost
            var prefBoost = 0;
            if (userPrefs.liked.length > 0) {
                var likedGenres = {};
                userPrefs.liked.forEach(function(item) {
                    (item.genres || []).forEach(function(g) {
                        likedGenres[g] = (likedGenres[g] || 0) + 1;
                    });
                });
                
                var matchScore = 0;
                (movie.genre_ids || []).forEach(function(g) {
                    if (likedGenres[g]) {
                        matchScore += likedGenres[g] / userPrefs.liked.length;
                    }
                });
                prefBoost = matchScore * 2; // Up to +2 points for genre match
            }
            
            return weightedRating + prefBoost;
        }

        // Fetch random movies with quality filtering
        function fetchQualityMovies(type, callback) {
            var prefs = UserPrefs.get();
            var pages = [1, 2, 3, 4, 5];
            var allMovies = [];
            var completed = 0;

            pages.forEach(function(page) {
                network.silent(
                    api_url + (type === 'tv' ? 'discover/tv' : 'discover/movie') + 
                    '?api_key=' + api_key + 
                    '&language=uk-UA' +
                    '&sort_by=vote_count.desc' +
                    '&vote_count.gte=100' +
                    '&page=' + page,
                    function(data) {
                        if (data && data.results) {
                            allMovies = allMovies.concat(data.results);
                        }
                        completed++;
                        if (completed === pages.length) {
                            // Filter out already seen
                            var filtered = allMovies.filter(function(m) {
                                return !prefs.history.includes(m.id);
                            });
                            
                            // Calculate scores and sort
                            filtered.forEach(function(m) {
                                m.score = calculateScore(m, prefs);
                            });
                            filtered.sort(function(a, b) { return b.score - a.score; });
                            
                            callback(filtered.slice(0, 15)); // Top 15 for swipe
                        }
                    },
                    function() {
                        completed++;
                        if (completed === pages.length) {
                            callback(allMovies.slice(0, 15));
                        }
                    }
                );
            });
        }

        // Swipe UI
        function showSwipeInterface(movies, type) {
            var currentIndex = 0;
            var swipeCount = 0;
            var minSwipes = 10;

            var html = '<div class="random-swipe-container">' +
                '<div class="random-swipe-header">' +
                    '<div class="random-swipe-counter">Картка <span class="current">1</span> з ' + movies.length + '</div>' +
                    '<div class="random-swipe-progress"><div class="random-swipe-progress-bar" style="width:0%"></div></div>' +
                '</div>' +
                '<div class="random-swipe-cards"></div>' +
                '<div class="random-swipe-buttons">' +
                    '<div class="random-swipe-btn random-swipe-dislike selector">✕<span>Не подобається</span></div>' +
                    '<div class="random-swipe-btn random-swipe-info selector">ℹ<span>Інфо</span></div>' +
                    '<div class="random-swipe-btn random-swipe-like selector">♥<span>Подобається</span></div>' +
                '</div>' +
                '<div class="random-swipe-footer">Оцініть мінімум ' + minSwipes + ' фільмів для кращих рекомендацій</div>' +
                '</div>';

            var $container = $(html);
            var $cards = $container.find('.random-swipe-cards');
            var $counter = $container.find('.current');
            var $progress = $container.find('.random-swipe-progress-bar');

            function renderCard(movie, index) {
                var posterUrl = movie.poster_path ? 
                    'https://image.tmdb.org/t/p/w500' + movie.poster_path : 
                    'https://via.placeholder.com/500x750?text=No+Poster';
                
                var rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                var year = movie.release_date || movie.first_air_date || '';
                year = year ? year.split('-')[0] : '';

                var card = $('<div class="random-swipe-card" data-index="' + index + '">' +
                    '<div class="random-swipe-card-inner">' +
                        '<img src="' + posterUrl + '" alt="' + (movie.title || movie.name) + '">' +
                        '<div class="random-swipe-card-info">' +
                            '<div class="random-swipe-card-title">' + (movie.title || movie.name) + '</div>' +
                            '<div class="random-swipe-card-meta">' +
                                '<span class="random-swipe-rating">⭐ ' + rating + '</span>' +
                                (year ? '<span class="random-swipe-year">' + year + '</span>' : '') +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');

                return card;
            }

            // Render initial cards (show top 3)
            for (var i = Math.min(2, movies.length - 1); i >= 0; i--) {
                $cards.append(renderCard(movies[i], i));
            }

            function updateUI() {
                $counter.text(currentIndex + 1);
                var progress = ((swipeCount / minSwipes) * 100);
                $progress.css('width', Math.min(progress, 100) + '%');
            }

            function swipeCard(direction) {
                if (currentIndex >= movies.length) return;

                var movie = movies[currentIndex];
                var $card = $cards.find('.random-swipe-card[data-index="' + currentIndex + '"]');

                if (direction === 'like') {
                    UserPrefs.addLike(movie);
                    $card.addClass('swiped-right');
                } else if (direction === 'dislike') {
                    UserPrefs.addDislike(movie);
                    $card.addClass('swiped-left');
                }

                UserPrefs.addHistory(movie.id);
                swipeCount++;
                currentIndex++;

                setTimeout(function() {
                    $card.remove();
                    
                    // Add next card to bottom of stack
                    if (currentIndex + 2 < movies.length) {
                        $cards.prepend(renderCard(movies[currentIndex + 2], currentIndex + 2));
                    }

                    updateUI();

                    if (currentIndex >= movies.length) {
                        finishSwipe();
                    }
                }, 300);
            }

            function finishSwipe() {
                if (swipeCount < minSwipes) {
                    Lampa.Noty.show('Оцініть ще ' + (minSwipes - swipeCount) + ' фільмів');
                    return;
                }

                Lampa.Modal.close();
                
                // Show random from liked
                var prefs = UserPrefs.get();
                if (prefs.liked.length > 0) {
                    var likedMovie = prefs.liked[prefs.liked.length - 1];
                    Lampa.Activity.push({
                        component: 'full',
                        id: likedMovie.id,
                        method: type === 'tv' ? 'tv' : 'movie',
                        card: likedMovie
                    });
                } else {
                    Lampa.Noty.show('Спробуйте ще раз!');
                }
            }

            // Button handlers
            $container.find('.random-swipe-like').on('hover:enter', function() {
                swipeCard('like');
            });

            $container.find('.random-swipe-dislike').on('hover:enter', function() {
                swipeCard('dislike');
            });

            $container.find('.random-swipe-info').on('hover:enter', function() {
                if (currentIndex < movies.length) {
                    var movie = movies[currentIndex];
                    Lampa.Modal.close();
                    Lampa.Activity.push({
                        component: 'full',
                        id: movie.id,
                        method: type === 'tv' ? 'tv' : 'movie',
                        card: movie
                    });
                }
            });

            Lampa.Modal.open({
                title: 'Оберіть що подобається',
                html: $container,
                size: 'medium',
                mask: true,
                onBack: function() {
                    Lampa.Modal.close();
                }
            });

            Lampa.Controller.add('modal', {
                toggle: function() {
                    Lampa.Controller.collectionSet($container.find('.selector'));
                    Lampa.Controller.collectionFocus(false, $container.find('.selector').eq(1));
                },
                left: function() {
                    Navigator.move('left');
                },
                right: function() {
                    Navigator.move('right');
                },
                up: function() {
                    Navigator.move('up');
                },
                down: function() {
                    Navigator.move('down');
                },
                back: function() {
                    Lampa.Modal.close();
                }
            });

            Lampa.Controller.toggle('modal');
        }

        // Main spin function
        function spin() {
            Lampa.Select.show({
                title: 'Рандомний вибір',
                items: [
                    { title: 'Фільм', type: 'movie' },
                    { title: 'Серіал', type: 'tv' },
                    { title: 'Swipe режим (Фільм)', type: 'movie', swipe: true },
                    { title: 'Swipe режим (Серіал)', type: 'tv', swipe: true }
                ],
                onSelect: function(item) {
                    if (item.swipe) {
                        Lampa.Loading.show();
                        fetchQualityMovies(item.type, function(movies) {
                            Lampa.Loading.hide();
                            if (movies.length > 0) {
                                showSwipeInterface(movies, item.type);
                            } else {
                                Lampa.Noty.show('Не вдалося завантажити фільми');
                            }
                        });
                    } else {
                        // Quick random (original functionality)
                        Lampa.Loading.show();
                        fetchQualityMovies(item.type, function(movies) {
                            Lampa.Loading.hide();
                            if (movies.length > 0) {
                                var movie = movies[Math.floor(Math.random() * Math.min(5, movies.length))];
                                UserPrefs.addHistory(movie.id);
                                Lampa.Activity.push({
                                    component: 'full',
                                    id: movie.id,
                                    method: item.type === 'tv' ? 'tv' : 'movie',
                                    card: movie
                                });
                            } else {
                                Lampa.Noty.show('Не вдалося завантажити фільми');
                            }
                        });
                    }
                }
            });
        }

        // Add CSS
        var style = document.createElement('style');
        style.textContent = `
            .random-swipe-container {
                padding: 2em;
                max-width: 600px;
                margin: 0 auto;
            }
            .random-swipe-header {
                margin-bottom: 2em;
                text-align: center;
            }
            .random-swipe-counter {
                font-size: 1.2em;
                margin-bottom: 0.5em;
            }
            .random-swipe-counter .current {
                color: #fff;
                font-weight: bold;
            }
            .random-swipe-progress {
                height: 4px;
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            .random-swipe-progress-bar {
                height: 100%;
                background: #e50914;
                transition: width 0.3s;
            }
            .random-swipe-cards {
                position: relative;
                height: 500px;
                margin-bottom: 2em;
            }
            .random-swipe-card {
                position: absolute;
                width: 100%;
                height: 100%;
                transition: transform 0.3s, opacity 0.3s;
            }
            .random-swipe-card:nth-child(1) {
                z-index: 3;
                transform: scale(1) translateY(0);
            }
            .random-swipe-card:nth-child(2) {
                z-index: 2;
                transform: scale(0.95) translateY(10px);
                opacity: 0.8;
            }
            .random-swipe-card:nth-child(3) {
                z-index: 1;
                transform: scale(0.9) translateY(20px);
                opacity: 0.6;
            }
            .random-swipe-card.swiped-right {
                transform: translateX(150%) rotate(20deg);
                opacity: 0;
            }
            .random-swipe-card.swiped-left {
                transform: translateX(-150%) rotate(-20deg);
                opacity: 0;
            }
            .random-swipe-card-inner {
                width: 100%;
                height: 100%;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                background: #1a1a1a;
            }
            .random-swipe-card-inner img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .random-swipe-card-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 1.5em;
                background: linear-gradient(transparent, rgba(0,0,0,0.9));
            }
            .random-swipe-card-title {
                font-size: 1.4em;
                font-weight: bold;
                margin-bottom: 0.5em;
            }
            .random-swipe-card-meta {
                display: flex;
                gap: 1em;
                font-size: 0.9em;
                opacity: 0.8;
            }
            .random-swipe-buttons {
                display: flex;
                justify-content: center;
                gap: 1em;
                margin-bottom: 1em;
            }
            .random-swipe-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: rgba(255,255,255,0.1);
                cursor: pointer;
                transition: all 0.2s;
                font-size: 2em;
            }
            .random-swipe-btn span {
                font-size: 0.3em;
                margin-top: 0.2em;
            }
            .random-swipe-btn.focus {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            .random-swipe-dislike {
                color: #ff4458;
            }
            .random-swipe-like {
                color: #00d66e;
            }
            .random-swipe-info {
                color: #4a9eff;
            }
            .random-swipe-footer {
                text-align: center;
                opacity: 0.6;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(style);

        // Add menu item
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
