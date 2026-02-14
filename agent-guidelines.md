# Agent Guidelines

> Документація стеку, залежностей, правил та best practices для розробки плагінів Lampa

## 🎯 Мета проєкту

Створити атомарний, легко кастомізований набір інструментів для швидкої розробки плагінів Lampa.

## 📚 Стек технологій

### Основні

- **JavaScript ES5** - для сумісності з усіма платформами
- **jQuery** - вбудований в Lampa
- **Lampa API** - внутрішній API додатку

### Інструменти

- **Git** - контроль версій
- **GitHub Pages** - хостинг плагінів
- **VS Code** - рекомендований редактор

## 🏗️ Архітектура

### Атомарний підхід

Кожен компонент:
- ✅ Незалежний (можна використовувати окремо)
- ✅ Має одну відповідальність
- ✅ Легко кастомізується
- ✅ Добре задокументований

### Структура компонента

```javascript
/**
 * Опис компонента
 * 
 * @param {Object} options - Налаштування
 */
function createComponent(options) {
    var defaults = { /* значення за замовчуванням */ };
    var config = Object.assign({}, defaults, options);
    
    // Логіка компонента
    
    return /* API компонента */;
}
```

## 📋 Правила коду

### 1. Структура плагіна

```javascript
(function () {
    'use strict';
    
    // Константи
    var PLUGIN_NAME = 'MyPlugin';
    var VERSION = '1.0.0';
    
    // Функції
    function myFunction() { }
    
    // Ініціалізація
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Started');
    }
    
    // Запуск
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
```

### 2. Іменування

**Змінні:**
- camelCase: `myVariable`, `userName`
- Константи: `PLUGIN_NAME`, `API_KEY`

**Функції:**
- camelCase: `startPlugin()`, `getData()`
- Дієслово + іменник: `createMenuItem()`, `showDialog()`

**ID елементів:**
- snake_case: `my_button`, `menu_item`
- Префікс плагіна: `myplugin_button`

### 3. Коментарі

```javascript
/**
 * Опис функції
 * 
 * @param {string} param1 - Опис параметра
 * @param {Object} param2 - Опис параметра
 * @returns {boolean} Опис результату
 */
function myFunction(param1, param2) {
    // Логіка
}
```

### 4. Обробка помилок

```javascript
// Завжди обробляйте помилки
network.silent(url,
    function (data) {
        if (data && data.results) {
            // OK
        } else {
            console.log(PLUGIN_NAME, 'Invalid data');
            Lampa.Noty.show('Помилка даних');
        }
    },
    function (error) {
        console.log(PLUGIN_NAME, 'Error:', error);
        Lampa.Noty.show('Помилка API');
    }
);
```

### 5. Логування

```javascript
// Формат: [PluginName] Event: data
console.log('MyPlugin', 'Started');
console.log('MyPlugin', 'Data loaded:', data);
console.log('MyPlugin', 'Error:', error);
```

## 🔧 Lampa API

### Основні модулі

```javascript
// Події
Lampa.Listener.follow('app', callback);
Lampa.Listener.follow('full', callback);
Lampa.Timeline.listener.follow('update', callback);

// Навігація
Lampa.Activity.push(params);
Lampa.Activity.back();

// Storage
Lampa.Storage.set(key, value);
Lampa.Storage.get(key, defaultValue);
Lampa.Storage.listener.follow('change', callback);

// UI
Lampa.Loading.start();
Lampa.Loading.stop();
Lampa.Noty.show(message);
Lampa.Select.show(params);
Lampa.Modal.open(params);

// Налаштування
Lampa.SettingsApi.addComponent(params);
Lampa.SettingsApi.addParam(params);

// Network
var network = new Lampa.Reguest();
network.silent(url, onSuccess, onError);

// TMDB
var api = Lampa.Api.sources.tmdb;
var url = api.url(endpoint, params);
```

### Типові події

```javascript
// App ready
if (e.type === 'ready') { }

// Картка фільму
if (e.type === 'complite' && e.data && e.data.movie) {
    var movie = e.data.movie;
}

// Прогрес перегляду
if (e.data) {
    var percent = e.data.road.percent;
    var time = e.data.road.time;
}
```

## 🎨 UI Patterns

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

### Створити елемент

```javascript
var element = $('<div class="class">' +
    '<span>Text</span>' +
    '</div>');

element.on('hover:enter', function() { });
parent.append(element);
```

## 📦 Залежності

### Вбудовані в Lampa

- jQuery
- Lampa API
- TMDB API (через Lampa)

### Зовнішні (опціонально)

Не використовуємо зовнішні залежності для максимальної сумісності.

## 🔒 Безпека

### 1. Не зберігайте чутливі дані

```javascript
// ❌ Погано
var API_KEY = 'secret_key_123';

// ✅ Добре
var API_KEY = Lampa.Storage.get('api_key', '');
```

### 2. Валідація даних

```javascript
// Завжди перевіряйте дані
if (data && data.results && Array.isArray(data.results)) {
    // OK
}
```

### 3. Екранування HTML

```javascript
// ❌ Погано
element.html(userInput);

// ✅ Добре
element.text(userInput);
```

## 🚀 Продуктивність

### 1. Мінімізуйте DOM операції

```javascript
// ❌ Погано
for (var i = 0; i < items.length; i++) {
    menu.append('<li>' + items[i] + '</li>');
}

// ✅ Добре
var html = '';
for (var i = 0; i < items.length; i++) {
    html += '<li>' + items[i] + '</li>';
}
menu.append(html);
```

### 2. Кешуйте селектори

```javascript
// ❌ Погано
$('.menu').addClass('active');
$('.menu').show();

// ✅ Добре
var menu = $('.menu');
menu.addClass('active');
menu.show();
```

### 3. Очищуйте таймери

```javascript
var timer = setInterval(function () {
    if (condition) {
        clearInterval(timer);
    }
}, 100);
```

## 📱 Сумісність

### Платформи

- ✅ Web (Chrome, Firefox, Safari)
- ✅ Android TV
- ✅ Smart TV (Samsung, LG)
- ✅ iOS (Safari)

### Обмеження

- Використовуйте ES5 (не ES6+)
- Уникайте стрілкових функцій
- Не використовуйте `let`, `const` (тільки `var`)
- Не використовуйте template literals

```javascript
// ❌ Погано (ES6)
const api = () => `https://api.com/${id}`;

// ✅ Добре (ES5)
var api = function(id) {
    return 'https://api.com/' + id;
};
```

## 🧪 Тестування

### Чеклист перед релізом

- [ ] Код працює в браузері
- [ ] Немає помилок в консолі
- [ ] Працює на TV (якщо можливо)
- [ ] Сумісний з іншими плагінами
- [ ] Додано обробку помилок
- [ ] Додано логування
- [ ] Код задокументований

### Тестування на різних платформах

1. **Web**: Chrome DevTools (F12)
2. **Android TV**: Через браузер або емулятор
3. **Smart TV**: Якщо є доступ до пристрою

## 📝 Документація

### Структура документації

```
README.md              # Загальний огляд
LAMPA_API.md          # Повна документація API
agent-guidelines.md   # Цей файл
icons.md              # Колекція іконок
```

### Документування компонента

```javascript
/**
 * Назва компонента
 * 
 * Опис що робить компонент
 * 
 * @param {Object} options - Налаштування
 * @param {string} options.id - Унікальний ID
 * @param {string} options.text - Текст
 * @param {Function} options.onClick - Обробник кліку
 * 
 * @example
 * createComponent({
 *     id: 'my_id',
 *     text: 'Text',
 *     onClick: function() { }
 * });
 */
```

## 🔄 Версіонування

### Semantic Versioning

- **MAJOR** (1.0.0): Несумісні зміни API
- **MINOR** (0.1.0): Нова функціональність (сумісна)
- **PATCH** (0.0.1): Виправлення помилок

### Приклад

```javascript
var manifest = {
    version: '1.2.3',
    // 1 - major
    // 2 - minor
    // 3 - patch
};
```

## 🤝 Contribution Guidelines

### Pull Request

1. Fork репозиторію
2. Створіть гілку: `git checkout -b feature/my-feature`
3. Зробіть зміни
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Створіть Pull Request

### Commit Messages

```
feat: Add new component
fix: Fix API error
docs: Update documentation
refactor: Refactor code
test: Add tests
```

## 🐛 Типові помилки

### 1. "X is not a function"

**Причина**: Метод не існує або не завантажився

**Рішення**: Перевірте правильність назви та версію Lampa

### 2. CORS Error

**Причина**: Браузер блокує запити

**Рішення**: Використовуйте HTTPS хостинг або проксі

### 3. Endless Load

**Причина**: Помилка в коді

**Рішення**: Перевірте console.log та синтаксис

### 4. Element not found

**Причина**: Елемент ще не створений

**Рішення**: Використовуйте таймер для очікування

## 📊 Метрики якості

### Код

- Читабельність: 9/10
- Підтримуваність: 9/10
- Продуктивність: 8/10
- Сумісність: 10/10

### Документація

- Повнота: 9/10
- Зрозумілість: 9/10
- Приклади: 10/10

## 🎯 Roadmap

### v1.1.0

- [ ] TypeScript definitions
- [ ] Більше компонентів
- [ ] Більше прикладів
- [ ] Testing framework

### v1.2.0

- [ ] CLI tool
- [ ] Plugin generator
- [ ] Debug panel
- [ ] Performance monitor

## 📞 Контакти

- **GitHub**: https://github.com/andhuk/mylamp
- **Issues**: https://github.com/andhuk/mylamp/issues

---

**Версія**: 1.0.0  
**Дата**: 14.02.2025  
**Автор**: andhuk
