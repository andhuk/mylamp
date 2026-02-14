/**
 * Приклад: Історія переглядів
 * 
 * Зберігає історію переглянутих фільмів та показує статистику
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'WatchHistory';
    var STORAGE_KEY = 'watch_history';

    /**
     * Отримати історію
     */
    function getHistory() {
        return Lampa.Storage.get(STORAGE_KEY, {
            movies: [],
            total: 0,
            lastUpdate: null
        });
    }

    /**
     * Зберегти історію
     */
    function saveHistory(history) {
        history.lastUpdate = Date.now();
        Lampa.Storage.set(STORAGE_KEY, history);
    }

    /**
     * Додати фільм в історію
     */
    function addToHistory(movie) {
        var history = getHistory();
        
        // Перевірити чи вже є
        var exists = history.movies.find(function(m) {
            return m.id === movie.id;
        });
        
        if (!exists) {
            history.movies.push({
                id: movie.id,
                title: movie.title || movie.name,
                original_title: movie.original_title || movie.original_name,
                poster: movie.poster_path,
                type: movie.seasons ? 'tv' : 'movie',
                date: Date.now()
            });
            
            history.total++;
            saveHistory(history);
            
            console.log(PLUGIN_NAME, 'Added to history:', movie.title);
        }
    }

    /**
     * Показати статистику
     */
    function showStats() {
        var history = getHistory();
        
        if (history.total === 0) {
            Lampa.Noty.show('Історія порожня');
            return;
        }
        
        var text = '<div style="padding: 20px;">';
        text += '<p>Всього переглядів: <b>' + history.total + '</b></p>';
        text += '<p>Унікальних фільмів: <b>' + history.movies.length + '</b></p>';
        
        if (history.lastUpdate) {
            var date = Lampa.Utils.parseTime(history.lastUpdate);
            text += '<p>Останнє оновлення: <b>' + date.full + '</b></p>';
        }
        
        text += '<br><p><b>Останні 5 фільмів:</b></p><ul>';
        
        var recent = history.movies.slice(-5).reverse();
        recent.forEach(function(movie) {
            var date = Lampa.Utils.parseTime(movie.date);
            text += '<li>' + movie.title + ' (' + date.short + ')</li>';
        });
        
        text += '</ul></div>';
        
        var modal = $('<div class="about">' + text + '</div>');
        
        Lampa.Modal.open({
            title: 'Історія переглядів',
            html: modal,
            size: 'medium',
            onBack: function () {
                Lampa.Modal.close();
            }
        });
    }

    /**
     * Очистити історію
     */
    function clearHistory() {
        Lampa.Storage.set(STORAGE_KEY, {
            movies: [],
            total: 0,
            lastUpdate: null
        });
        Lampa.Noty.show('Історію очищено');
    }

    /**
     * Створити налаштування
     */
    function createSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'watch_history',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/></svg>',
            name: 'Історія'
        });
        
        Lampa.SettingsApi.addParam({
            component: 'watch_history',
            param: {
                type: 'button'
            },
            field: {
                name: 'Показати статистику',
                description: 'Переглянути історію переглядів'
            },
            onChange: showStats
        });
        
        Lampa.SettingsApi.addParam({
            component: 'watch_history',
            param: {
                type: 'button'
            },
            field: {
                name: 'Очистити історію',
                description: 'Видалити всі записи'
            },
            onChange: function() {
                Lampa.Select.show({
                    title: 'Підтвердження',
                    items: [
                        {title: 'Так, очистити', value: true},
                        {title: 'Скасувати', value: false}
                    ],
                    onSelect: function(item) {
                        if (item.value) {
                            clearHistory();
                        }
                    }
                });
            }
        });
    }

    /**
     * Відстежувати перегляди
     */
    function trackViews() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' && e.data && e.data.movie) {
                addToHistory(e.data.movie);
            }
        });
    }

    /**
     * Ініціалізація
     */
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Starting...');
        createSettings();
        trackViews();
        console.log(PLUGIN_NAME, 'Started successfully');
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
