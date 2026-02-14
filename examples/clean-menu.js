(function () {
    'use strict';
    
    var PLUGIN_NAME = 'CleanMenu';
    var STORAGE_KEY = 'clean_menu_settings';
    
    function getSettings() {
        return Lampa.Storage.get(STORAGE_KEY, {
            hidden: [],
            order: []
        });
    }
    
    function saveSettings(settings) {
        Lampa.Storage.set(STORAGE_KEY, settings);
    }
    
    function getMenuItems() {
        var items = [];
        var menuItems = Lampa.Menu.items();
        
        for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i];
            items.push({
                id: item.id || item.title,
                title: item.title,
                icon: item.icon
            });
        }
        
        return items;
    }
    
    function applyMenuOrder() {
        var settings = getSettings();
        var menuItems = Lampa.Menu.items();
        
        // Hide items
        for (var i = 0; i < settings.hidden.length; i++) {
            var hiddenId = settings.hidden[i];
            for (var j = 0; j < menuItems.length; j++) {
                var itemId = menuItems[j].id || menuItems[j].title;
                if (itemId === hiddenId) {
                    Lampa.Menu.hide(itemId);
                    break;
                }
            }
        }
        
        // Reorder items
        if (settings.order.length > 0) {
            for (var k = 0; k < settings.order.length; k++) {
                var orderId = settings.order[k];
                Lampa.Menu.moveTo(orderId, k);
            }
        }
        
        console.log(PLUGIN_NAME, 'Menu order applied');
    }
    
    function showManageDialog() {
        console.log(PLUGIN_NAME, 'showManageDialog called');
        
        var settings = getSettings();
        var menuItems = getMenuItems();
        var items = [];
        
        // Build items list with current order
        var orderedIds = settings.order.length > 0 ? settings.order : [];
        var processedIds = {};
        
        // Add ordered items first
        for (var i = 0; i < orderedIds.length; i++) {
            var orderId = orderedIds[i];
            for (var j = 0; j < menuItems.length; j++) {
                if (menuItems[j].id === orderId) {
                    var isHidden = settings.hidden.indexOf(orderId) >= 0;
                    items.push({
                        title: menuItems[j].title,
                        id: orderId,
                        hidden: isHidden,
                        icon: menuItems[j].icon
                    });
                    processedIds[orderId] = true;
                    break;
                }
            }
        }
        
        // Add remaining items
        for (var k = 0; k < menuItems.length; k++) {
            var menuItem = menuItems[k];
            if (!processedIds[menuItem.id]) {
                var isHidden = settings.hidden.indexOf(menuItem.id) >= 0;
                items.push({
                    title: menuItem.title,
                    id: menuItem.id,
                    hidden: isHidden,
                    icon: menuItem.icon
                });
            }
        }
        
        if (items.length === 0) {
            Lampa.Noty.show('Розділи не знайдено');
            return;
        }
        
        showMenuEditor(items);
    }
    
    function showMenuEditor(items) {
        var html = $('<div class="menu-editor"></div>');
        var list = $('<div class="menu-editor__list"></div>');
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var row = $('<div class="menu-editor__item" data-id="' + item.id + '"></div>');
            
            var checkbox = $('<div class="menu-editor__checkbox">' + 
                (item.hidden ? '☐' : '☑') + '</div>');
            
            var title = $('<div class="menu-editor__title">' + item.title + '</div>');
            
            var arrows = $('<div class="menu-editor__arrows">' +
                '<span class="menu-editor__arrow menu-editor__arrow--up">▲</span>' +
                '<span class="menu-editor__arrow menu-editor__arrow--down">▼</span>' +
                '</div>');
            
            row.append(checkbox).append(title).append(arrows);
            list.append(row);
        }
        
        html.append('<div class="menu-editor__title-bar">Редагувати</div>');
        html.append(list);
        
        var styles = $('<style>' +
            '.menu-editor { background: rgba(0,0,0,0.9); padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }' +
            '.menu-editor__title-bar { font-size: 24px; margin-bottom: 20px; text-align: center; }' +
            '.menu-editor__list { max-height: 400px; overflow-y: auto; }' +
            '.menu-editor__item { display: flex; align-items: center; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; cursor: pointer; }' +
            '.menu-editor__item.focus { background: rgba(255,255,255,0.3); }' +
            '.menu-editor__checkbox { width: 40px; font-size: 24px; }' +
            '.menu-editor__title { flex: 1; }' +
            '.menu-editor__arrows { display: flex; gap: 10px; }' +
            '.menu-editor__arrow { font-size: 20px; padding: 5px 10px; cursor: pointer; opacity: 0.6; }' +
            '.menu-editor__arrow:hover { opacity: 1; }' +
            '</style>');
        
        $('body').append(styles);
        
        Lampa.Modal.open({
            title: '',
            html: html,
            onBack: function () {
                saveMenuOrder();
                Lampa.Modal.close();
                styles.remove();
            }
        });
        
        setupMenuEditorControls(list);
    }
    
    function setupMenuEditorControls(list) {
        var items = list.find('.menu-editor__item');
        var currentIndex = 0;
        
        function updateFocus() {
            items.removeClass('focus');
            $(items[currentIndex]).addClass('focus');
        }
        
        updateFocus();
        
        items.on('click', function () {
            var item = $(this);
            var checkbox = item.find('.menu-editor__checkbox');
            var isChecked = checkbox.text() === '☑';
            checkbox.text(isChecked ? '☐' : '☑');
        });
        
        items.find('.menu-editor__arrow--up').on('click', function (e) {
            e.stopPropagation();
            var item = $(this).closest('.menu-editor__item');
            var prev = item.prev();
            if (prev.length) {
                item.insertBefore(prev);
            }
        });
        
        items.find('.menu-editor__arrow--down').on('click', function (e) {
            e.stopPropagation();
            var item = $(this).closest('.menu-editor__item');
            var next = item.next();
            if (next.length) {
                item.insertAfter(next);
            }
        });
    }
    
    function saveMenuOrder() {
        var items = $('.menu-editor__item');
        var order = [];
        var hidden = [];
        
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            var id = item.attr('data-id');
            var isHidden = item.find('.menu-editor__checkbox').text() === '☐';
            
            order.push(id);
            if (isHidden) {
                hidden.push(id);
            }
        }
        
        saveSettings({
            order: order,
            hidden: hidden
        });
        
        Lampa.Noty.show('Збережено');
        applyMenuOrder();
    }
    

    
    function resetSettings() {
        saveSettings({
            hidden: [],
            order: []
        });
        Lampa.Noty.show('Налаштування скинуто');
        
        // Show all menu items
        var menuItems = Lampa.Menu.items();
        for (var i = 0; i < menuItems.length; i++) {
            var itemId = menuItems[i].id || menuItems[i].title;
            Lampa.Menu.show(itemId);
        }
    }
    
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Started');
        
        var manifest = {
            type: 'other',
            version: '1.0.0',
            name: 'Clean Menu',
            description: 'Управління порядком та видимістю розділів налаштувань',
            component: 'clean_menu'
        };
        
        Lampa.Manifest.plugins = manifest;
        
        // Add settings section
        Lampa.SettingsApi.addComponent({
            component: 'clean_menu',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>',
            name: 'Clean Menu'
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: {
                type: 'title'
            },
            field: {
                name: 'Управління меню налаштувань'
            }
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: {
                type: 'button'
            },
            field: {
                name: 'Управління розділами',
                description: 'Показати/приховати розділи меню'
            },
            onChange: showManageDialog
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: {
                type: 'button'
            },
            field: {
                name: 'Скинути налаштування',
                description: 'Показати всі розділи'
            },
            onChange: resetSettings
        });
        
        // Apply menu order on app start
        setTimeout(function () {
            applyMenuOrder();
        }, 1000);
        
        console.log(PLUGIN_NAME, 'Initialized');
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
