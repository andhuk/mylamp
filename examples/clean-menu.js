(function () {
    'use strict';
    
    var PLUGIN_NAME = 'CleanMenu';
    var STORAGE_KEY = 'clean_menu_settings';
    
    function getSettings() {
        return Lampa.Storage.get(STORAGE_KEY, { hidden: [], order: [] });
    }
    
    function saveSettings(settings) {
        Lampa.Storage.set(STORAGE_KEY, settings);
    }
    
    function getSettingsItems() {
        var items = [];
        var settingsItems = $('.settings .settings-param[data-component]');
        
        settingsItems.each(function() {
            var item = $(this);
            var component = item.attr('data-component');
            var name = item.find('.settings-param__name').text();
            
            if (component && component !== 'clean_menu' && name) {
                items.push({
                    id: component,
                    title: name
                });
            }
        });
        
        return items;
    }
    
    function applyMenuOrder() {
        var timer = setInterval(function() {
            var settingsMenu = $('.settings .settings-list');
            if (settingsMenu.length) {
                clearInterval(timer);
                
                var settings = getSettings();
                var items = settingsMenu.find('.settings-param');
                var hiddenSet = {};
                var i;
                
                // Build hidden set
                for (i = 0; i < settings.hidden.length; i++) {
                    hiddenSet[settings.hidden[i]] = true;
                }
                
                // Hide items
                items.each(function() {
                    var item = $(this);
                    var component = item.attr('data-component');
                    
                    if (component && hiddenSet[component]) {
                        item.hide();
                    } else {
                        item.show();
                    }
                });
                
                // Reorder items
                if (settings.order.length > 0) {
                    var orderedItems = [];
                    
                    for (i = 0; i < settings.order.length; i++) {
                        var orderId = settings.order[i];
                        var item = items.filter('[data-component="' + orderId + '"]');
                        if (item.length) {
                            orderedItems.push(item[0]);
                        }
                    }
                    
                    // Append remaining items
                    items.each(function() {
                        var found = false;
                        for (var j = 0; j < orderedItems.length; j++) {
                            if (orderedItems[j] === this) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            orderedItems.push(this);
                        }
                    });
                    
                    // Apply order
                    for (i = 0; i < orderedItems.length; i++) {
                        settingsMenu.append(orderedItems[i]);
                    }
                }
                
                console.log(PLUGIN_NAME, 'Settings order applied');
            }
        }, 300);
    }
    
    function showManageDialog() {
        console.log(PLUGIN_NAME, 'showManageDialog called');
        
        // Go back to main settings first
        Lampa.Activity.back();
        
        setTimeout(function() {
            var settings = getSettings();
            var items = getSettingsItems();
            var hiddenSet = {};
            var itemMap = {};
            var orderedItems = [];
            var i;
            
            if (items.length === 0) {
                Lampa.Noty.show('Розділи не знайдено. Відкрийте налаштування спочатку.');
                return;
            }
            
            // Build hidden set
            for (i = 0; i < settings.hidden.length; i++) {
                hiddenSet[settings.hidden[i]] = true;
            }
            
            // Build item map
            for (i = 0; i < items.length; i++) {
                itemMap[items[i].id] = items[i];
            }
            
            // Build ordered items list
            var orderedSet = {};
            for (i = 0; i < settings.order.length; i++) {
                var orderId = settings.order[i];
                if (itemMap[orderId]) {
                    orderedItems.push({
                        title: itemMap[orderId].title,
                        id: orderId,
                        hidden: !!hiddenSet[orderId]
                    });
                    orderedSet[orderId] = true;
                }
            }
            
            // Add remaining items not in order
            for (i = 0; i < items.length; i++) {
                if (!orderedSet[items[i].id]) {
                    orderedItems.push({
                        title: items[i].title,
                        id: items[i].id,
                        hidden: !!hiddenSet[items[i].id]
                    });
                }
            }
            
            showMenuEditor(orderedItems);
        }, 300);
    }
    
    function showMenuEditor(items) {
        var html = $('<div class="menu-editor"></div>');
        var list = $('<div class="menu-editor__list"></div>');
        var i;
        
        for (i = 0; i < items.length; i++) {
            var item = items[i];
            var row = $('<div class="menu-editor__item" data-id="' + item.id + '"></div>');
            var checkbox = $('<div class="menu-editor__checkbox">' + (item.hidden ? '☐' : '☑') + '</div>');
            var title = $('<div class="menu-editor__title">' + item.title + '</div>');
            var arrows = $('<div class="menu-editor__arrows">' +
                '<span class="menu-editor__arrow menu-editor__arrow--up">▲</span>' +
                '<span class="menu-editor__arrow menu-editor__arrow--down">▼</span>' +
                '</div>');
            
            row.append(checkbox).append(title).append(arrows);
            list.append(row);
        }
        
        html.append('<div class="menu-editor__title-bar">Редагувати налаштування</div>');
        html.append(list);
        
        var styles = $('<style id="clean-menu-styles">' +
            '.menu-editor { background: rgba(0,0,0,0.9); padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }' +
            '.menu-editor__title-bar { font-size: 24px; margin-bottom: 20px; text-align: center; color: white; }' +
            '.menu-editor__list { max-height: 400px; overflow-y: auto; }' +
            '.menu-editor__item { display: flex; align-items: center; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; cursor: pointer; }' +
            '.menu-editor__item.focus { background: rgba(255,255,255,0.3); }' +
            '.menu-editor__checkbox { width: 40px; font-size: 24px; color: white; user-select: none; }' +
            '.menu-editor__title { flex: 1; color: white; }' +
            '.menu-editor__arrows { display: flex; gap: 10px; }' +
            '.menu-editor__arrow { font-size: 20px; padding: 5px 10px; cursor: pointer; opacity: 0.6; color: white; user-select: none; }' +
            '.menu-editor__arrow:hover { opacity: 1; }' +
            '</style>');
        
        $('#clean-menu-styles').remove();
        $('body').append(styles);
        
        Lampa.Modal.open({
            title: '',
            html: html,
            onBack: function() {
                saveMenuOrder();
                Lampa.Modal.close();
                $('#clean-menu-styles').remove();
            }
        });
        
        setupMenuEditorControls(list);
    }
    
    function setupMenuEditorControls(list) {
        var items = list.find('.menu-editor__item');
        
        items.on('click', function () {
            var checkbox = $(this).find('.menu-editor__checkbox');
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
        
        items.each(function(_, el) {
            var item = $(el);
            var id = item.attr('data-id');
            var isHidden = item.find('.menu-editor__checkbox').text() === '☐';
            
            order.push(id);
            if (isHidden) {
                hidden.push(id);
            }
        });
        
        saveSettings({ order: order, hidden: hidden });
        Lampa.Noty.show('Збережено');
        
        setTimeout(function() {
            applyMenuOrder();
        }, 100);
    }
    
    function resetSettings() {
        saveSettings({ hidden: [], order: [] });
        Lampa.Noty.show('Налаштування скинуто');
        
        setTimeout(function() {
            var items = $('.settings .settings-param');
            items.show();
        }, 100);
    }
    
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Started');
        
        Lampa.Manifest.plugins = {
            type: 'other',
            version: '1.2.0',
            name: 'Clean Menu',
            description: 'Управління порядком та видимістю розділів налаштувань',
            component: 'clean_menu'
        };
        
        Lampa.SettingsApi.addComponent({
            component: 'clean_menu',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>',
            name: 'Clean Menu'
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: { type: 'title' },
            field: { name: 'Управління меню налаштувань' }
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: { type: 'button' },
            field: {
                name: 'Управління розділами',
                description: 'Показати/приховати та змінити порядок розділів'
            },
            onChange: showManageDialog
        });
        
        Lampa.SettingsApi.addParam({
            component: 'clean_menu',
            param: { type: 'button' },
            field: {
                name: 'Скинути налаштування',
                description: 'Показати всі розділи та скинути порядок'
            },
            onChange: resetSettings
        });
        
        // Apply menu order on settings open
        Lampa.Listener.follow('activity', function (e) {
            if (e.component === 'settings') {
                applyMenuOrder();
            }
        });
        
        console.log(PLUGIN_NAME, 'Initialized');
    }
    
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
