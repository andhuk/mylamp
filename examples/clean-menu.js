(function () {
    'use strict';
    
    var PLUGIN_NAME = 'CleanMenu';
    var STORAGE_KEY = 'clean_menu_settings';
    
    function getSettings() {
        try {
            return Lampa.Storage.get(STORAGE_KEY, { hidden: [], order: [] });
        } catch (e) {
            console.error(PLUGIN_NAME, 'Error getting settings:', e);
            return { hidden: [], order: [] };
        }
    }
    
    function saveSettings(settings) {
        try {
            Lampa.Storage.set(STORAGE_KEY, settings);
            console.log(PLUGIN_NAME, 'Settings saved:', settings);
        } catch (e) {
            console.error(PLUGIN_NAME, 'Error saving settings:', e);
        }
    }
    
    function getSettingsItems() {
        var items = [];
        var settingsItems = $('.settings .settings-param[data-component]');
        
        console.log(PLUGIN_NAME, 'Found settings items:', settingsItems.length);
        
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
        
        console.log(PLUGIN_NAME, 'Processed items:', items);
        return items;
    }
    
    function applyMenuOrder() {
        var timer = setInterval(function() {
            var settingsMenu = $('.settings .settings-list');
            if (settingsMenu.length) {
                clearInterval(timer);
                
                console.log(PLUGIN_NAME, 'Applying menu order');
                
                var settings = getSettings();
                var items = settingsMenu.find('.settings-param');
                var hiddenSet = {};
                var i;
                
                console.log(PLUGIN_NAME, 'Settings:', settings);
                console.log(PLUGIN_NAME, 'Menu items found:', items.length);
                
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
                        console.log(PLUGIN_NAME, 'Hiding:', component);
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
                    
                    console.log(PLUGIN_NAME, 'Reordered', orderedItems.length, 'items');
                }
                
                console.log(PLUGIN_NAME, 'Settings order applied');
            }
        }, 300);
        
        // Clear timer after 10 seconds to prevent infinite loop
        setTimeout(function() {
            clearInterval(timer);
        }, 10000);
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
                console.warn(PLUGIN_NAME, 'No items found');
                return;
            }
            
            console.log(PLUGIN_NAME, 'Building menu editor with', items.length, 'items');
            
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
        }, 500);
    }
    
    function showMenuEditor(items) {
        console.log(PLUGIN_NAME, 'Showing menu editor');
        
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
        html.append('<div class="menu-editor__footer">Натисніть на чекбокс щоб показати/приховати, стрілки для зміни порядку</div>');
        
        var styles = $('<style id="clean-menu-styles">' +
            '.menu-editor { background: rgba(0,0,0,0.95); padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }' +
            '.menu-editor__title-bar { font-size: 24px; margin-bottom: 20px; text-align: center; color: white; font-weight: bold; }' +
            '.menu-editor__list { max-height: 400px; overflow-y: auto; }' +
            '.menu-editor__item { display: flex; align-items: center; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; cursor: pointer; transition: background 0.2s; }' +
            '.menu-editor__item:hover { background: rgba(255,255,255,0.2); }' +
            '.menu-editor__item.focus { background: rgba(255,255,255,0.3); }' +
            '.menu-editor__checkbox { width: 40px; font-size: 24px; color: white; user-select: none; cursor: pointer; }' +
            '.menu-editor__title { flex: 1; color: white; font-size: 16px; }' +
            '.menu-editor__arrows { display: flex; gap: 10px; }' +
            '.menu-editor__arrow { font-size: 20px; padding: 5px 10px; cursor: pointer; opacity: 0.6; color: white; user-select: none; transition: opacity 0.2s; }' +
            '.menu-editor__arrow:hover { opacity: 1; background: rgba(255,255,255,0.1); border-radius: 3px; }' +
            '.menu-editor__footer { margin-top: 15px; text-align: center; color: rgba(255,255,255,0.7); font-size: 14px; }' +
            '</style>');
        
        $('#clean-menu-styles').remove();
        $('body').append(styles);
        
        try {
            Lampa.Modal.open({
                title: '',
                html: html,
                onBack: function() {
                    console.log(PLUGIN_NAME, 'Modal closing, saving order');
                    saveMenuOrder();
                    Lampa.Modal.close();
                    $('#clean-menu-styles').remove();
                }
            });
            
            setupMenuEditorControls(list);
        } catch (e) {
            console.error(PLUGIN_NAME, 'Error opening modal:', e);
        }
    }
    
    function setupMenuEditorControls(list) {
        var items = list.find('.menu-editor__item');
        
        items.on('click', function (e) {
            // Don't toggle checkbox if clicking on arrows
            if ($(e.target).hasClass('menu-editor__arrow')) {
                return;
            }
            
            var checkbox = $(this).find('.menu-editor__checkbox');
            var isChecked = checkbox.text() === '☑';
            checkbox.text(isChecked ? '☐' : '☑');
            console.log(PLUGIN_NAME, 'Toggled item:', $(this).attr('data-id'), 'Hidden:', isChecked);
        });
        
        items.find('.menu-editor__arrow--up').on('click', function (e) {
            e.stopPropagation();
            var item = $(this).closest('.menu-editor__item');
            var prev = item.prev();
            if (prev.length) {
                item.insertBefore(prev);
                console.log(PLUGIN_NAME, 'Moved item up:', item.attr('data-id'));
            }
        });
        
        items.find('.menu-editor__arrow--down').on('click', function (e) {
            e.stopPropagation();
            var item = $(this).closest('.menu-editor__item');
            var next = item.next();
            if (next.length) {
                item.insertAfter(next);
                console.log(PLUGIN_NAME, 'Moved item down:', item.attr('data-id'));
            }
        });
        
        console.log(PLUGIN_NAME, 'Controls setup complete');
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
        
        console.log(PLUGIN_NAME, 'Saving order:', order);
        console.log(PLUGIN_NAME, 'Saving hidden:', hidden);
        
        saveSettings({ order: order, hidden: hidden });
        Lampa.Noty.show('Збережено');
        
        setTimeout(function() {
            applyMenuOrder();
        }, 100);
    }
    
    function resetSettings() {
        console.log(PLUGIN_NAME, 'Resetting settings');
        saveSettings({ hidden: [], order: [] });
        Lampa.Noty.show('Налаштування скинуто');
        
        setTimeout(function() {
            var items = $('.settings .settings-param');
            items.show();
            console.log(PLUGIN_NAME, 'All items shown');
        }, 100);
    }
    
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Starting plugin...');
        console.log(PLUGIN_NAME, 'Lampa available:', typeof Lampa !== 'undefined');
        console.log(PLUGIN_NAME, 'SettingsApi available:', typeof Lampa.SettingsApi !== 'undefined');
        console.log(PLUGIN_NAME, 'Storage available:', typeof Lampa.Storage !== 'undefined');
        
        try {
            // Add settings component
            Lampa.SettingsApi.addComponent({
                component: 'clean_menu',
                icon: '<svg height="36" viewBox="0 0 24 24" width="36"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>',
                name: 'Clean Menu'
            });
            
            console.log(PLUGIN_NAME, 'Component added');
            
            // Add title
            Lampa.SettingsApi.addParam({
                component: 'clean_menu',
                param: { type: 'title' },
                field: { name: 'Управління меню налаштувань' }
            });
            
            // Add manage button
            Lampa.SettingsApi.addParam({
                component: 'clean_menu',
                param: { 
                    type: 'button',
                    name: 'manage_sections'
                },
                field: {
                    name: 'Управління розділами',
                    description: 'Показати/приховати та змінити порядок розділів'
                },
                onChange: function() {
                    console.log(PLUGIN_NAME, 'Manage button clicked');
                    showManageDialog();
                }
            });
            
            // Add reset button
            Lampa.SettingsApi.addParam({
                component: 'clean_menu',
                param: { 
                    type: 'button',
                    name: 'reset_settings'
                },
                field: {
                    name: 'Скинути налаштування',
                    description: 'Показати всі розділи та скинути порядок'
                },
                onChange: function() {
                    console.log(PLUGIN_NAME, 'Reset button clicked');
                    resetSettings();
                }
            });
            
            console.log(PLUGIN_NAME, 'Params added');
            
            // Apply menu order on settings open
            Lampa.Listener.follow('activity', function (e) {
                if (e.component === 'settings') {
                    console.log(PLUGIN_NAME, 'Settings opened, applying order');
                    applyMenuOrder();
                }
            });
            
            console.log(PLUGIN_NAME, 'Listener added');
            console.log(PLUGIN_NAME, 'Plugin initialized successfully');
            
        } catch (e) {
            console.error(PLUGIN_NAME, 'Error during initialization:', e);
        }
    }
    
    // Start plugin when app is ready
    if (window.appready) {
        console.log(PLUGIN_NAME, 'App already ready, starting now');
        startPlugin();
    } else {
        console.log(PLUGIN_NAME, 'Waiting for app ready event');
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                console.log(PLUGIN_NAME, 'App ready event received');
                startPlugin();
            }
        });
    }
})();