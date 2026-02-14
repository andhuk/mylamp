# Lampa API Documentation

> Повна документація API для розробки плагінів Lampa з прикладами та шаблонами

## Зміст

- [Основи](#основи)
- [Структура плагіна](#структура-плагіна)
- [Core API](#core-api)
- [UI Components](#ui-components)
- [Navigation & Menu](#navigation--menu)
- [Storage & Data](#storage--data)
- [Network & API](#network--api)
- [Шаблони](#шаблони)
- [Приклади](#приклади)

---

## Основи

### Мінімальний плагін

```javascript
(function () {
    'use strict';

    function startPlugin() {
        console.log('Plugin', 'Started');
        // Ваш код тут
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
```

### Manifest (опціонально)

```javascript
var manifest = {
    type: 'other',
    version: '1.0.0',
    name: 'Назва плагіна',
    description: 'Опис плагіна',
    component: 'my_plugin'
};

Lampa.Manifest.plugins = manifest;
```

---

## Core API

### Lampa.Listener

Система подій для відстеження змін в додатку.

```javascript
// Підписка на події
Lampa.Listener.follow('app', function (e) {
    if (e.type === 'ready') {
        console.log('App ready');
    }
});

// Події full (картка фільму)
Lampa.Listener.follow('full', function (e) {
    if (e.type === 'complite') {
        console.log('Card loaded', e.data.movie);
    }
});

// Події Storage
Lampa.Storage.listener.follow('change', function (e) {
    console.log('Storage changed', e.name, e.value);
});
```

**Основні події:**
- `app` - події додатку (ready, start)
- `full` - події картки фільму (complite)
- `activity` - зміна активності
- `timeline` - події таймлайну (update, view)

---

### Lampa.Activity

Навігація між екранами.

```javascript
// Відкрити нову активність
Lampa.Activity.push({
    url: '',
    title: 'Назва екрану',
    component: 'full',  // або custom component
    id: movie.id,
    method: 'movie',    // 'movie' або 'tv'
    card: movie
});

// Повернутися назад
Lampa.Activity.back();

// Замінити поточну активність
Lampa.Activity.replace({
    url: '',
    title: 'Новий екран',
    component: 'custom'
});
```

---

### Lampa.Storage

Локальне сховище даних.

```javascript
// Зберегти дані
Lampa.Storage.set('my_key', {data: 'value'});

// Отримати дані
var data = Lampa.Storage.get('my_key', defaultValue);

// Видалити дані
Lampa.Storage.remove('my_key');

// Підписка на зміни
Lampa.Storage.listener.follow('change', function (e) {
    if (e.name === 'my_key') {
        console.log('Value changed', e.value);
    }
});
```

---

### Lampa.Loading

Індикатор завантаження.

```javascript
// Показати
Lampa.Loading.start();

// Сховати
Lampa.Loading.stop();
```

---

### Lampa.Noty

Сповіщення (toast).

```javascript
// Показати повідомлення
Lampa.Noty.show('Текст повідомлення');

// З тривалістю
Lampa.Noty.show('Текст', 3000); // 3 секунди
```

---

## UI Components

### Lampa.Select

Діалог вибору.

```javascript
Lampa.Select.show({
    title: 'Виберіть опцію',
    items: [
        {title: 'Опція 1', value: 'opt1'},
        {title: 'Опція 2', value: 'opt2'},
        {title: 'Опція 3', value: 'opt3'}
    ],
    onSelect: function (item) {
        console.log('Selected', item);
    },
    onBack: function () {
        console.log('Cancelled');
    }
});
```

---

### Lampa.Modal

Модальне вікно.

```javascript
var modal = $('<div class="about"><div class="about__text">Контент</div></div>');

Lampa.Modal.open({
    title: 'Заголовок',
    html: modal,
    size: 'medium',  // 'small', 'medium', 'large'
    onBack: function () {
        Lampa.Modal.close();
    }
});
```

---

### Lampa.SettingsApi

Додавання налаштувань плагіна.

```javascript
// Додати компонент (розділ)
Lampa.SettingsApi.addComponent({
    component: 'my_plugin',
    icon: '<svg>...</svg>',
    name: 'Мій плагін'
});

// Додати параметр (кнопка)
Lampa.SettingsApi.addParam({
    component: 'my_plugin',
    param: {
        type: 'button'
    },
    field: {
        name: 'Назва кнопки',
        description: 'Опис'
    },
    onChange: function () {
        console.log('Button clicked');
    }
});

// Додати перемикач
Lampa.SettingsApi.addParam({
    component: 'my_plugin',
    param: {
        name: 'my_setting',
        type: 'trigger',
        default: false
    },
    field: {
        name: 'Увімкнути функцію'
    },
    onChange: function (value) {
        console.log('Setting changed', value);
    }
});

// Додати текстове поле
Lampa.SettingsApi.addParam({
    component: 'my_plugin',
    param: {
        name: 'my_text',
        type: 'input',
        default: ''
    },
    field: {
        name: 'Введіть текст',
        placeholder: 'Текст...'
    }
});

// Додати заголовок
Lampa.SettingsApi.addParam({
    component: 'my_plugin',
    param: {
        type: 'title'
    },
    field: {
        name: 'Розділ налаштувань'
    }
});

// Додати статичний текст
Lampa.SettingsApi.addParam({
    component: 'my_plugin',
    param: {
        type: 'static'
    },
    field: {
        name: 'Значення',
        description: 'Опис значення'
    }
});
```

---

## Navigation & Menu

### Додавання пункту в головне меню

```javascript
function addMenuItem() {
    var menuTimer = setInterval(function () {
        var menu = $('.menu .menu__list');
        if (menu.length) {
            clearInterval(menuTimer);
            
            // Видалити старий пункт
            $('.menu__item[data-action="my_action"]').remove();
            
            // Створити новий
            var icon = '<svg>...</svg>';
            var menuItem = $('<li class="menu__item selector" data-action="my_action">' +
                '<div class="menu__ico">' + icon + '</div>' +
                '<div class="menu__text">Назва</div>' +
                '</li>');
            
            // Обробник події
            menuItem.on('hover:enter', function() {
                console.log('Menu item clicked');
            });
            
            // Додати в меню
            menu.prepend(menuItem);  // На початок
            // або
            menu.append(menuItem);   // В кінець
        }
    }, 100);
}
```

---

### Додавання кнопки в шапку

```javascript
function addHeadButton() {
    var timer = setInterval(function () {
        var actions = $('.head__actions');
        if (actions.length) {
            clearInterval(timer);
            
            $('#my_button').remove();
            var button = '<div id="my_button" class="head__action selector">' +
                '<svg>...</svg>' +
                '</div>';
            
            $('.head__actions').append(button);
            
            $('#my_button').on('hover:enter hover:click hover:touch', function () {
                console.log('Button clicked');
            });
        }
    }, 100);
}
```

---

## Storage & Data

### Робота з закладками

```javascript
// Отримати закладки
var bookmarks = Lampa.Storage.get('bookmarks', []);

// Додати в закладки
function addToBookmarks(card) {
    var bookmarks = Lampa.Storage.get('bookmarks', []);
    bookmarks.push({
        id: card.id,
        title: card.title,
        img: card.img,
        type: card.type
    });
    Lampa.Storage.set('bookmarks', bookmarks);
}
```

---

### Timeline (історія перегляду)

```javascript
// Підписка на оновлення
Lampa.Timeline.listener.follow('update', function (e) {
    if (e.data) {
        var hash = e.data.hash;
        var percent = e.data.road.percent;
        var time = e.data.road.time;
        
        console.log('Progress', percent + '%', time + 's');
    }
});

// Підписка на перегляд
Lampa.Timeline.listener.follow('view', function (e) {
    console.log('Viewed', e);
});
```

---

## Network & API

### Lampa.Reguest

HTTP запити.

```javascript
var network = new Lampa.Reguest();

// GET запит
network.silent(url, 
    function (data) {
        // Success
        console.log('Data', data);
    },
    function (error) {
        // Error
        console.log('Error', error);
    }
);

// POST запит
network.silent(url,
    function (data) {
        console.log('Success', data);
    },
    function (error) {
        console.log('Error', error);
    },
    JSON.stringify({key: 'value'}),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }
);
```

---

### TMDB API

```javascript
// Через вбудоване джерело
var api = Lampa.Api.sources.tmdb;

// Створити URL
var params = {
    page: 1,
    language: api.language
};
var url = api.url('movie/popular', params);

// Зробити запит
var network = new Lampa.Reguest();
network.silent(url, function (data) {
    console.log('Movies', data.results);
});
```

---

### CORS Proxy

Для обходу CORS використовуйте проксі:

```javascript
// Google Apps Script proxy
var proxyUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

network.silent(proxyUrl,
    function (data) {
        console.log('Data', data);
    },
    function (error) {
        console.log('Error', error);
    },
    JSON.stringify({
        url: 'https://api.example.com/data',
        method: 'GET'
    }),
    {
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
        }
    }
);
```

---

## Шаблони

### 1. Плагін з меню навігації

```javascript
(function () {
    'use strict';

    function myAction() {
        Lampa.Noty.show('Дія виконана!');
    }

    function startPlugin() {
        console.log('MyPlugin', 'Starting...');

        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                
                $('.menu__item[data-action="my_plugin"]').remove();
                
                var icon = '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/></svg>';
                var menuItem = $('<li class="menu__item selector" data-action="my_plugin">' +
                    '<div class="menu__ico">' + icon + '</div>' +
                    '<div class="menu__text">Мій плагін</div>' +
                    '</li>');
                
                menuItem.on('hover:enter', myAction);
                menu.prepend(menuItem);
                
                console.log('MyPlugin', 'Menu item added');
            }
        }, 100);
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
```

---

### 2. Плагін з налаштуваннями

```javascript
(function () {
    'use strict';

    var manifest = {
        type: 'other',
        version: '1.0.0',
        name: 'Мій плагін',
        description: 'Опис плагіна',
        component: 'my_plugin'
    };

    function startPlugin() {
        Lampa.Manifest.plugins = manifest;

        // Додати розділ налаштувань
        Lampa.SettingsApi.addComponent({
            component: 'my_plugin',
            icon: '<svg>...</svg>',
            name: 'Мій плагін'
        });

        // Додати перемикач
        Lampa.SettingsApi.addParam({
            component: 'my_plugin',
            param: {
                name: 'enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Увімкнути плагін'
            },
            onChange: function (value) {
                console.log('Plugin enabled:', value);
            }
        });

        // Додати кнопку
        Lampa.SettingsApi.addParam({
            component: 'my_plugin',
            param: {
                type: 'button'
            },
            field: {
                name: 'Виконати дію',
                description: 'Натисніть для виконання'
            },
            onChange: function () {
                Lampa.Noty.show('Дія виконана!');
            }
        });
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
```

---

### 3. Плагін зі Storage

```javascript
(function () {
    'use strict';

    var STORAGE_KEY = 'my_plugin_data';

    function getData() {
        return Lampa.Storage.get(STORAGE_KEY, {
            items: [],
            settings: {}
        });
    }

    function saveData(data) {
        Lampa.Storage.set(STORAGE_KEY, data);
    }

    function addItem(item) {
        var data = getData();
        data.items.push(item);
        saveData(data);
        Lampa.Noty.show('Додано: ' + item.title);
    }

    function startPlugin() {
        // Підписка на зміни
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === STORAGE_KEY) {
                console.log('Data changed', e.value);
            }
        });

        // Приклад використання
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' && e.data && e.data.movie) {
                var movie = e.data.movie;
                addItem({
                    id: movie.id,
                    title: movie.title,
                    date: Date.now()
                });
            }
        });
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
```

---

### 4. Плагін з API запитами

```javascript
(function () {
    'use strict';

    var network = new Lampa.Reguest();

    function fetchData(callback) {
        Lampa.Loading.start();

        var api = Lampa.Api.sources.tmdb;
        var url = api.url('movie/popular', {
            page: 1,
            language: api.language
        });

        network.silent(url,
            function (data) {
                Lampa.Loading.stop();
                if (data && data.results) {
                    callback(data.results);
                } else {
                    Lampa.Noty.show('Помилка завантаження');
                }
            },
            function (error) {
                Lampa.Loading.stop();
                console.log('Error', error);
                Lampa.Noty.show('Помилка API');
            }
        );
    }

    function showMovies() {
        fetchData(function (movies) {
            console.log('Movies loaded', movies.length);
            Lampa.Noty.show('Завантажено ' + movies.length + ' фільмів');
        });
    }

    function startPlugin() {
        // Додати кнопку в меню
        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                
                var icon = '<svg>...</svg>';
                var menuItem = $('<li class="menu__item selector" data-action="fetch_movies">' +
                    '<div class="menu__ico">' + icon + '</div>' +
                    '<div class="menu__text">Завантажити</div>' +
                    '</li>');
                
                menuItem.on('hover:enter', showMovies);
                menu.append(menuItem);
            }
        }, 100);
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
```

---

## Приклади

### Випадковий фільм

```javascript
(function () {
    'use strict';

    function getRandomMovie() {
        Lampa.Select.show({
            title: 'Випадковий фільм',
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
                        var movies = data.results.filter(function(m) {
                            return m.vote_average >= 6.5;
                        });
                        
                        if (movies.length === 0) movies = data.results;
                        
                        var movie = movies[Math.floor(Math.random() * movies.length)];
                        
                        Lampa.Activity.push({
                            component: 'full',
                            id: movie.id,
                            method: item.type,
                            card: movie
                        });
                    }
                });
            }
        });
    }

    function startPlugin() {
        var menuTimer = setInterval(function () {
            var menu = $('.menu .menu__list');
            if (menu.length) {
                clearInterval(menuTimer);
                
                var icon = '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/></svg>';
                var menuItem = $('<li class="menu__item selector" data-action="random">' +
                    '<div class="menu__ico">' + icon + '</div>' +
                    '<div class="menu__text">Рандом</div>' +
                    '</li>');
                
                menuItem.on('hover:enter', getRandomMovie);
                menu.prepend(menuItem);
            }
        }, 100);
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
```

---

### Статистика перегляду

```javascript
(function () {
    'use strict';

    var STORAGE_KEY = 'watch_stats';

    function getStats() {
        return Lampa.Storage.get(STORAGE_KEY, {
            movies: {},
            total: 0
        });
    }

    function saveStats(stats) {
        Lampa.Storage.set(STORAGE_KEY, stats);
    }

    function trackMovie(movie) {
        var stats = getStats();
        var hash = Lampa.Utils.hash(movie.original_title || movie.title);
        
        if (!stats.movies[hash]) {
            stats.movies[hash] = {
                id: movie.id,
                title: movie.title,
                count: 0,
                lastWatch: null
            };
        }
        
        stats.movies[hash].count++;
        stats.movies[hash].lastWatch = Date.now();
        stats.total++;
        
        saveStats(stats);
    }

    function showStats() {
        var stats = getStats();
        var text = 'Всього переглядів: ' + stats.total + '\n';
        text += 'Унікальних фільмів: ' + Object.keys(stats.movies).length;
        
        var modal = $('<div class="about"><div class="about__text">' + 
            text.replace(/\n/g, '<br>') + 
            '</div></div>');
        
        Lampa.Modal.open({
            title: 'Статистика',
            html: modal,
            size: 'medium',
            onBack: function () {
                Lampa.Modal.close();
            }
        });
    }

    function startPlugin() {
        // Відстежувати перегляди
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' && e.data && e.data.movie) {
                trackMovie(e.data.movie);
            }
        });

        // Додати кнопку статистики
        Lampa.SettingsApi.addComponent({
            component: 'watch_stats',
            icon: '<svg>...</svg>',
            name: 'Статистика'
        });

        Lampa.SettingsApi.addParam({
            component: 'watch_stats',
            param: {
                type: 'button'
            },
            field: {
                name: 'Показати статистику'
            },
            onChange: showStats
        });
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
```

---

## Корисні утиліти

### Lampa.Utils

```javascript
// Хеш рядка
var hash = Lampa.Utils.hash('string');

// Копіювання в буфер
Lampa.Utils.copyTextToClipboard('text', function() {
    Lampa.Noty.show('Скопійовано');
});

// Парсинг часу
var time = Lampa.Utils.parseTime(timestamp);
// {full: "14.02.2025 12:30", short: "14.02.2025", time: "12:30"}
```

---

### jQuery селектори

```javascript
// Пошук елементів
var menu = $('.menu .menu__list');
var actions = $('.head__actions');

// Створення елементів
var element = $('<div class="my-class">Content</div>');

// Додавання обробників
element.on('hover:enter', function() {
    console.log('Clicked');
});

// Додавання в DOM
menu.append(element);   // В кінець
menu.prepend(element);  // На початок
element.insertAfter('.selector');  // Після елемента
```

---

## Best Practices

### 1. Завжди перевіряйте існування елементів

```javascript
var menuTimer = setInterval(function () {
    var menu = $('.menu .menu__list');
    if (menu.length) {
        clearInterval(menuTimer);
        // Ваш код
    }
}, 100);
```

### 2. Видаляйте старі елементи перед додаванням нових

```javascript
$('.menu__item[data-action="my_action"]').remove();
// Додати новий елемент
```

### 3. Використовуйте console.log для дебагу

```javascript
console.log('PluginName', 'Event', data);
```

### 4. Обробляйте помилки

```javascript
network.silent(url,
    function (data) {
        // Success
    },
    function (error) {
        Lampa.Loading.stop();
        console.log('Error', error);
        Lampa.Noty.show('Помилка');
    }
);
```

### 5. Використовуйте Storage для збереження даних

```javascript
// Завжди вказуйте значення за замовчуванням
var data = Lampa.Storage.get('key', defaultValue);
```

---

## Debugging

### Консоль Lampa

В лівому меню Lampa є пункт "Консоль" (внизу). Там можна переглядати логи плагіна.

### Browser DevTools

Відкрийте DevTools (F12) і перейдіть на вкладку Console для перегляду всіх логів.

### Типові помилки

1. **"X is not a function"** - метод не існує або не завантажився
2. **CORS error** - потрібен проксі для запитів
3. **Endless load** - помилка в коді, перевірте console.log

---

## Ресурси

- [Lampa Source](https://github.com/yumata/lampa-source) - вихідний код Lampa
- [and7ey/lampa](https://github.com/and7ey/lampa) - приклади плагінів
- [Lampa Plugins Store](https://lampaplugins.github.io/store/) - магазин плагінів

---

**Версія документації:** 1.0.0  
**Дата оновлення:** 14.02.2025
