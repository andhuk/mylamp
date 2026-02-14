# AI Agent Guidelines

> Інструкції для AI-асистента при роботі з Lampa Plugin Development Kit

## 🤖 Workflow перед кожним комітом

### 1. Перевірка коду
- [ ] ES5 only (no arrow functions, let/const, template literals)
- [ ] IIFE wrapper: `(function () { 'use strict'; ... })()`
- [ ] Error handling added
- [ ] console.log для дебагу

### 2. Оновлення документації
- [ ] README.md - додати/оновити плагін з GitHub Pages URL
- [ ] agent-guidelines.md - додати нові правила/помилки/рішення

### 3. Git commit
```bash
git add -A
git commit -m "feat: [feature]" # або fix:/docs:/refactor:
git push origin main
```

## 🔧 Stack

- JavaScript ES5 (no ES6+)
- jQuery (built-in)
- Lampa API

## ⚠️ Заборонено

- ES6+ (arrow functions, let/const, template literals, async/await)
- ES5.1+ methods that may not work (.filter, .map, .forEach - use for loops)
- External dependencies
- Promises (use callbacks)

## 📝 Code Patterns

### Plugin Structure
```javascript
(function () {
    'use strict';
    var PLUGIN_NAME = 'MyPlugin';
    
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Started');
    }
    
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') startPlugin();
    });
})();
```

### Menu Item
```javascript
var menuTimer = setInterval(function () {
    var menu = $('.menu .menu__list');
    if (menu.length) {
        clearInterval(menuTimer);
        $('.menu__item[data-action="id"]').remove();
        var menuItem = $('<li class="menu__item selector" data-action="id">' +
            '<div class="menu__ico"><svg>...</svg></div>' +
            '<div class="menu__text">Text</div></li>');
        menuItem.on('hover:enter', function() { });
        menu.prepend(menuItem);
    }
}, 100);
```

### API Request
```javascript
var api = Lampa.Api.sources.tmdb;
var url = api.url('movie/popular', {page: 1, language: api.language});
var network = new Lampa.Reguest();
network.silent(url, 
    function (data) { /* success */ },
    function (error) { /* error */ }
);
```

## 🐛 Common Issues

### "X is not a function"
Check if method exists:
```javascript
if (Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb) {
    var api = Lampa.Api.sources.tmdb;
}
```

### CORS Error
Use `Lampa.Api.sources.tmdb.url()` instead of direct URLs

### Element not found
Use timer to wait for DOM:
```javascript
var timer = setInterval(function () {
    var element = $('.selector');
    if (element.length) {
        clearInterval(timer);
        // code
    }
}, 100);
```

## 📊 Commit Checklist

- [ ] Code works (tested in browser)
- [ ] No ES6+ syntax
- [ ] Error handling added
- [ ] README.md updated
- [ ] agent-guidelines.md updated
- [ ] Git commit with correct message

---

**Last updated:** 2025-02-15

## 📝 Learning Log

### 2025-02-15 (Update 3)
- **Fixed:** Script error in random-movie.js
- **Issue:** Used `.filter()` method (ES5.1) - not compatible with all Lampa versions
- **Solution:** Replaced with ES5 `for` loop + added API availability check
- **Added:** `onBack` handler for Select dialog

### 2025-02-15 (Update 2)
- **Fixed:** Removed duplicate `random.js` (conflicted with `examples/random-movie.js`)
- **Issue:** Both files used same `data-action="random"` causing script errors
- **Solution:** Keep only `examples/random-movie.js` as reference implementation

### 2025-02-15 (Update 1)
- Fixed duplicate plugins: `random.js` and `examples/random-movie.js` were identical
- Simplified agent-guidelines.md to focus on AI workflow only
- All code patterns use ES5 syntax with proper error handling
