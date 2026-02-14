# Lampa API Quick Reference

> Швидкий довідник для розробки плагінів Lampa

## 🚀 Базова структура

```javascript
(function () {
    'use strict';
    
    function startPlugin() {
        // Ваш код
    }
    
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
```

## 📦 Core API

### Listener (Події)
```javascript
// App ready
Lampa.Listener.follow('app', function (e) {
    if (e.type === 'ready') { }
});

// Картка фільму
Lampa.Listener.follow('full', function (e) {
    if (e.type === 'complite') {
        var movie = e.data.movie;
    }
});

// Timeline
Lampa.Timeline.listener.follow('update', function (e) {
    var percent = e.data.road.percent;
});
```

### Activity (Навігація)
```javascript
// Відкрити картку
Lampa.Activity.push({
    component: 'full',
    id: movie.id,
    method: 'movie',  // або 'tv'
    card: movie
});

// Назад
Lampa.Activity.back();
```

### Storage
```javascript
// Зберегти
Lampa.Storage.set('key', value);

// Отримати
var data = Lampa.Storage.get('key', defaultValue);

// Видалити
Lampa.Storage.remove('key');

// Підписка
Lampa.Storage.listener.follow('change', function (e) {
    if (e.name === 'key') { }
});
```

### UI
```javascript
// Завантаження
Lampa.Loading.start();
Lampa.Loading.stop();

// Повідомлення
Lampa.Noty.show('Текст');

// Діалог вибору
Lampa.Select.show({
    title: 'Заголовок',
    items: [{title: 'Опція', value: 'val'}],
    onSelect: function (item) { }
});

// Модальне вікно
Lampa.Modal.open({
    title: 'Заголовок',
    html: $('<div>Контент</div>'),
    size: 'medium',
    onBack: function () {
        Lampa.Modal.close();
    }
});
```

## 🎨 UI Components

### Меню навігації
```javascript
var menuTimer = setInterval(function () {
    var menu = $('.menu .menu__list');
    if (menu.length) {
        clearInterval(menuTimer);
        
        var icon = '<svg>...</svg>';
        var item = $('<li class="menu__item selector" data-action="id">' +
            '<div class="menu__ico">' + icon + '</div>' +
            '<div class="menu__text">Текст</div>' +
            '</li>');
        
        item.on('hover:enter', function() { });
        menu.prepend(item);  // або append
    }
}, 100);
```

### Кнопка в шапці
```javascript
var timer = setInterval(function () {
    var actions = $('.head__actions');
    if (actions.length) {
        clearInterval(timer);
        
        var button = $('<div id="btn" class="head__action selector">' +
            '<svg>...</svg>' +
            '</div>');
        
        button.on('hover:enter hover:click hover:touch', function() { });
        actions.append(button);
    }
}, 100);
```

### Налаштування
```javascript
// Розділ
Lampa.SettingsApi.addComponent({
    component: 'id',
    icon: '<svg>...</svg>',
    name: 'Назва'
});

// Перемикач
Lampa.SettingsApi.addParam({
    component: 'id',
    param: {
        name: 'setting',
        type: 'trigger',
        default: false
    },
    field: {
        name: 'Назва'
    },
    onChange: function (value) { }
});

// Кнопка
Lampa.SettingsApi.addParam({
    component: 'id',
    param: {type: 'button'},
    field: {name: 'Назва'},
    onChange: function () { }
});

// Текст
Lampa.SettingsApi.addParam({
    component: 'id',
    param: {
        name: 'text',
        type: 'input',
        default: ''
    },
    field: {
        name: 'Назва',
        placeholder: 'Текст...'
    }
});

// Заголовок
Lampa.SettingsApi.addParam({
    component: 'id',
    param: {type: 'title'},
    field: {name: 'Заголовок'}
});

// Статичний текст
Lampa.SettingsApi.addParam({
    component: 'id',
    param: {type: 'static'},
    field: {
        name: 'Значення',
        description: 'Опис'
    }
});
```

## 🌐 Network

### HTTP запити
```javascript
var network = new Lampa.Reguest();

// GET
network.silent(url,
    function (data) {
        // Success
    },
    function (error) {
        // Error
    }
);

// POST
network.silent(url,
    function (data) { },
    function (error) { },
    JSON.stringify({key: 'value'}),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }
);
```

### TMDB API
```javascript
var api = Lampa.Api.sources.tmdb;
var url = api.url('movie/popular', {
    page: 1,
    language: api.language
});

var network = new Lampa.Reguest();
network.silent(url, function (data) {
    var movies = data.results;
});
```

## 🛠️ Utilities

### Lampa.Utils
```javascript
// Хеш
var hash = Lampa.Utils.hash('string');

// Копіювання
Lampa.Utils.copyTextToClipboard('text', function() {
    Lampa.Noty.show('Скопійовано');
});

// Час
var time = Lampa.Utils.parseTime(timestamp);
// {full: "14.02.2025 12:30", short: "14.02.2025", time: "12:30"}
```

### jQuery
```javascript
// Пошук
var element = $('.selector');

// Створення
var div = $('<div class="class">Text</div>');

// Події
element.on('hover:enter', function() { });

// DOM
menu.append(element);
menu.prepend(element);
element.insertAfter('.selector');
element.remove();
```

## 📋 Типові патерни

### Чекати елемент
```javascript
var timer = setInterval(function () {
    var element = $('.selector');
    if (element.length) {
        clearInterval(timer);
        // Код
    }
}, 100);
```

### Видалити старий елемент
```javascript
$('.menu__item[data-action="id"]').remove();
// Додати новий
```

### Обробка помилок
```javascript
network.silent(url,
    function (data) {
        if (data && data.results) {
            // OK
        } else {
            Lampa.Noty.show('Помилка');
        }
    },
    function (error) {
        Lampa.Loading.stop();
        console.log('Error', error);
        Lampa.Noty.show('Помилка API');
    }
);
```

### Storage з об'єктом
```javascript
function getData() {
    return Lampa.Storage.get('key', {
        items: [],
        settings: {}
    });
}

function saveData(data) {
    Lampa.Storage.set('key', data);
}

function addItem(item) {
    var data = getData();
    data.items.push(item);
    saveData(data);
}
```

## 🎯 Швидкі рецепти

### Випадковий фільм
```javascript
function randomMovie() {
    var api = Lampa.Api.sources.tmdb;
    var page = Math.floor(Math.random() * 10) + 1;
    var url = api.url('movie/popular', {page: page});
    
    var network = new Lampa.Reguest();
    network.silent(url, function (data) {
        if (data && data.results && data.results.length) {
            var movie = data.results[Math.floor(Math.random() * data.results.length)];
            Lampa.Activity.push({
                component: 'full',
                id: movie.id,
                method: 'movie',
                card: movie
            });
        }
    });
}
```

### Відстежити перегляд
```javascript
Lampa.Listener.follow('full', function (e) {
    if (e.type === 'complite' && e.data && e.data.movie) {
        var movie = e.data.movie;
        console.log('Viewed:', movie.title);
        
        // Зберегти
        var history = Lampa.Storage.get('history', []);
        history.push({
            id: movie.id,
            title: movie.title,
            date: Date.now()
        });
        Lampa.Storage.set('history', history);
    }
});
```

### Прогрес перегляду
```javascript
Lampa.Timeline.listener.follow('update', function (e) {
    if (e.data) {
        var hash = e.data.hash;
        var percent = e.data.road.percent;
        var time = e.data.road.time;
        
        console.log('Progress:', percent + '%');
        
        if (percent >= 90) {
            console.log('Movie finished!');
        }
    }
});
```

### Показати список
```javascript
function showList(items) {
    Lampa.Select.show({
        title: 'Виберіть',
        items: items.map(function(item) {
            return {
                title: item.title,
                value: item.id
            };
        }),
        onSelect: function (selected) {
            console.log('Selected:', selected);
        }
    });
}
```

## 🐛 Debugging

### Console
```javascript
console.log('PluginName', 'Event', data);
console.log('PluginName', 'Error:', error);
```

### Перевірка існування
```javascript
if (window.Lampa && Lampa.Activity && Lampa.Activity.push) {
    // OK
}
```

### Try-Catch
```javascript
try {
    // Код
} catch (e) {
    console.log('Error:', e);
    Lampa.Noty.show('Помилка');
}
```

## 📝 Checklist

- [ ] IIFE обгортка `(function () { ... })()`
- [ ] `'use strict';`
- [ ] Перевірка `window.appready`
- [ ] Listener для `app.ready`
- [ ] Таймер для DOM елементів
- [ ] Видалення старих елементів
- [ ] Обробка помилок
- [ ] console.log для дебагу
- [ ] Коментарі в коді
- [ ] Версія плагіна

## 🔗 Посилання

- [Повна документація](./LAMPA_API.md)
- [Компоненти](./components/)
- [Шаблони](./templates/)
- [Іконки](./icons.md)

---

**Версія:** 1.0.0  
**Дата:** 14.02.2025
