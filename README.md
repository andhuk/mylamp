# Lampa Plugin Development Kit

> Повний набір інструментів, документації та шаблонів для розробки плагінів Lampa

## 📚 Структура проєкту

```
.
├── LAMPA_API.md              # Повна документація API
├── README.md                 # Цей файл
├── random.js                 # Робочий плагін "Рандом"
├── components/               # Атомарні компоненти
│   ├── menu-item.js         # Пункт меню
│   ├── head-button.js       # Кнопка в шапці
│   ├── settings-section.js  # Розділ налаштувань
│   ├── storage-manager.js   # Менеджер Storage
│   └── api-client.js        # API клієнт
└── templates/               # Шаблони плагінів
    ├── basic-plugin.js      # Базовий плагін
    ├── menu-plugin.js       # Плагін з меню
    └── settings-plugin.js   # Плагін з налаштуваннями
```

## 🚀 Швидкий старт

### 1. Базовий плагін

```javascript
(function () {
    'use strict';

    function startPlugin() {
        console.log('Plugin started');
        Lampa.Noty.show('Привіт!');
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

### 2. Використання шаблонів

Виберіть потрібний шаблон з папки `templates/`:

- `basic-plugin.js` - мінімальний плагін
- `menu-plugin.js` - плагін з пунктом меню
- `settings-plugin.js` - плагін з налаштуваннями

### 3. Використання компонентів

```javascript
// Підключити компонент
// <script src="components/menu-item.js"></script>

// Використати
createMenuItem({
    id: 'my_item',
    icon: '<svg>...</svg>',
    text: 'Мій пункт',
    onClick: function() {
        Lampa.Noty.show('Клік!');
    },
    position: 'prepend'
});
```

## 📖 Документація

Повна документація API знаходиться в файлі [LAMPA_API.md](./LAMPA_API.md)

### Основні розділи:

- **Core API** - базові функції Lampa
- **UI Components** - компоненти інтерфейсу
- **Navigation & Menu** - навігація та меню
- **Storage & Data** - робота з даними
- **Network & API** - мережеві запити
- **Шаблони** - готові рішення
- **Приклади** - робочі приклади

## 🧩 Атомарні компоненти

### Menu Item

Додає пункт в головне меню навігації.

```javascript
createMenuItem({
    id: 'random',
    icon: '<svg>...</svg>',
    text: 'Рандом',
    onClick: function() {
        // Ваша логіка
    },
    position: 'prepend'  // або 'append'
});
```

### Head Button

Додає кнопку в шапку додатку.

```javascript
createHeadButton({
    id: 'my_button',
    icon: '<svg>...</svg>',
    onClick: function() {
        // Ваша логіка
    }
});
```

### Settings Section

Створює розділ налаштувань.

```javascript
var component = createSettingsSection({
    component: 'my_plugin',
    name: 'Мій плагін',
    icon: '<svg>...</svg>'
});

addSettingsParam(component, 
    {name: 'enabled', type: 'trigger', default: true},
    {name: 'Увімкнути'},
    function(value) {
        console.log('Changed:', value);
    }
);
```

### Storage Manager

Спрощує роботу зі Storage.

```javascript
var storage = createStorageManager('my_data');

// Зберегти
storage.set({key: 'value'});

// Отримати
var data = storage.get({});

// Оновити
storage.update({newKey: 'newValue'});

// Підписатися на зміни
storage.watch(function(value) {
    console.log('Changed:', value);
});
```

### API Client

Спрощує API запити.

```javascript
var api = createApiClient();

// GET запит
api.get(url, 
    function(data) {
        console.log('Success', data);
    },
    function(error) {
        console.log('Error', error);
    }
);

// TMDB запит
api.tmdb('movie/popular', {page: 1},
    function(data) {
        console.log('Movies', data.results);
    }
);

// З індикатором завантаження
api.getWithLoading(url, onSuccess, onError);
```

## 🎯 Приклади використання

### Випадковий фільм

```javascript
function getRandomMovie() {
    var api = createApiClient();
    
    api.tmdb('movie/popular', {page: Math.floor(Math.random() * 10) + 1},
        function(data) {
            if (data && data.results && data.results.length) {
                var movie = data.results[Math.floor(Math.random() * data.results.length)];
                
                Lampa.Activity.push({
                    component: 'full',
                    id: movie.id,
                    method: 'movie',
                    card: movie
                });
            }
        }
    );
}

createMenuItem({
    id: 'random',
    text: 'Рандом',
    onClick: getRandomMovie
});
```

### Статистика перегляду

```javascript
var storage = createStorageManager('watch_stats');

Lampa.Listener.follow('full', function (e) {
    if (e.type === 'complite' && e.data && e.data.movie) {
        var stats = storage.get({total: 0, movies: []});
        stats.total++;
        stats.movies.push({
            id: e.data.movie.id,
            title: e.data.movie.title,
            date: Date.now()
        });
        storage.set(stats);
    }
});
```

## 🛠️ Розробка

### Налагодження

1. Відкрийте Lampa в браузері
2. Натисніть F12 для відкриття DevTools
3. Перейдіть на вкладку Console
4. Використовуйте `console.log()` для виведення інформації

### Тестування

1. Завантажте плагін в Lampa через Налаштування → Розширення
2. Перевірте консоль на наявність помилок
3. Протестуйте всі функції плагіна

### Публікація

1. Завантажте файл плагіна на GitHub Pages або інший хостинг
2. Переконайтеся, що файл доступний через HTTPS
3. Поділіться посиланням з користувачами

## 📝 Best Practices

### 1. Завжди використовуйте IIFE

```javascript
(function () {
    'use strict';
    // Ваш код
})();
```

### 2. Перевіряйте існування елементів

```javascript
var timer = setInterval(function () {
    var element = $('.selector');
    if (element.length) {
        clearInterval(timer);
        // Ваш код
    }
}, 100);
```

### 3. Видаляйте старі елементи

```javascript
$('.menu__item[data-action="my_action"]').remove();
// Додати новий елемент
```

### 4. Використовуйте console.log

```javascript
console.log('PluginName', 'Event', data);
```

### 5. Обробляйте помилки

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

## 🔗 Корисні посилання

- [Lampa Source](https://github.com/yumata/lampa-source) - вихідний код Lampa
- [and7ey/lampa](https://github.com/and7ey/lampa) - приклади плагінів
- [Lampa Plugins Store](https://lampaplugins.github.io/store/) - магазин плагінів

## 📄 Ліцензія

MIT License

## 🤝 Внесок

Вітаються pull requests! Для великих змін спочатку відкрийте issue для обговорення.

## 📧 Контакти

- GitHub: [andhuk/mylamp](https://github.com/andhuk/mylamp)
- Issues: [GitHub Issues](https://github.com/andhuk/mylamp/issues)

---

**Версія:** 1.0.0  
**Дата:** 14.02.2025
