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
    
    function applyMenuOrder() {
        var timer = setInterval(function () {
            var settingsMenu = $('.settings .settings-list');
            if (settingsMenu.length) {
                clearInterval(timer);
                
                var settings = getSettings();
                var items = settingsMenu.find('.settings-param');
                
                // Hide items
                var i;
                for (i = 0; i < settings.hidden.length; i++) {
                    var hiddenId = settings.hidden[i];
                    items.filter('[data-component="' + hiddenId + '"]').hide();
                }
                
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
                    for (i = 0; i < items.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < orderedItems.length; j++) {
                            if (orderedItems[j] === items[i]) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            orderedItems.push(items[i]);
                        }
                    }
                    
                    // Apply order
                    for (i = 0; i < orderedItems.length; i++) {
                        settingsMenu.append(orderedItems[i]);
                    }
                }
                
                console.log(PLUGIN_NAME, 'Menu order applied');
            }
        }, 300);
    }
    
    function showManageDialog() {
        console.log(PLUGIN_NAME, 'showManageDialog called');
        
        // Go back to main settings first
        Lampa.Activity.back();
        
        setTimeout(function () {
            var settings = getSettings();
            var items = [];
            
            // Collect all settings components
            var timer = setInterval(function () {
                var settingsItems = $('.settings .settings-param[data-component]');
                console.log(PLUGIN_NAME, 'Found settings items:', settingsItems.length);
                
                if (settingsItems.length) {
                    clearInterval(timer);
                    
                    var i;
                    for (i = 0; i < settingsItems.length; i++) {
                        var item = $(settingsItems[i]);
                        var component = item.attr('data-component');
                        var name = item.find('.settings-param__name').text() || component;
                        
                        if (component && component !== 'clean_menu') {
                            var isHidden = false;
                            var j;
                            for (j = 0; j < settings.hidden.length; j++) {
                                if (settings.hidden[j] === component) {
                                    isHidden = true;
                                    break;
                                }
                            }
                            
                            items.push({
                                title: name + (isHidden ? ' [Приховано]' : ''),
                                component: component,
                                hidden: isHidden
                            });
                        }
                    }
                    
                    console.log(PLUGIN_NAME, 'Collected items:', items.length);
                    
                    if (items.length === 0) {
                        Lampa.Noty.show('Розділи не знайдено');
                        return;
                    }
                    
                    Lampa.Select.show({
                        title: 'Управління меню',
                        items: items,
                        onSelect: function (item) {
                            toggleItemVisibility(item.component);
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('settings');
                        }
                    });
                }
            }, 100);
        }, 300);
    }
    
    function toggleItemVisibility(component) {
        var settings = getSettings();
        var index = -1;
        var i;
        
        for (i = 0; i < settings.hidden.length; i++) {
            if (settings.hidden[i] === component) {
                index = i;
                break;
            }
        }
        
        if (index >= 0) {
            settings.hidden.splice(index, 1);
            Lampa.Noty.show('Розділ показано');
        } else {
            settings.hidden.push(component);
            Lampa.Noty.show('Розділ приховано');
        }
        
        saveSettings(settings);
        applyMenuOrder();
        
        setTimeout(function () {
            showManageDialog();
        }, 300);
    }
    
    function resetSettings() {
        saveSettings({
            hidden: [],
            order: []
        });
        Lampa.Noty.show('Налаштування скинуто');
        
        var timer = setInterval(function () {
            var items = $('.settings .settings-param');
            if (items.length) {
                clearInterval(timer);
                items.show();
            }
        }, 100);
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
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
