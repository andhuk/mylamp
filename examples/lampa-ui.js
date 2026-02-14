(function () {
    'use strict';
    
    var PLUGIN_NAME = 'LampaUI';
    var STORAGE_KEY = 'lampa_ui_enabled';
    
    function isPluginEnabled() {
        try {
            return Lampa.Storage.get(STORAGE_KEY, true);
        } catch (e) {
            console.error(PLUGIN_NAME, 'Error getting settings:', e);
            return true;
        }
    }
    
    function togglePlugin() {
        var current = isPluginEnabled();
        Lampa.Storage.set(STORAGE_KEY, !current);
        Lampa.Noty.show('Lampa UI ' + (!current ? 'увімкнено' : 'вимкнено'));
        
        if (!current) {
            applyLampaUIStyles();
        } else {
            removeLampaUIStyles();
        }
    }
    
    function applyLampaUIStyles() {
        console.log(PLUGIN_NAME, 'Applying Lampa UI styles');
        
        // Create main CSS styles
        var style = document.createElement('style');
        style.id = 'lampa-ui-styles';
        style.innerHTML = `
            /* Netflix Dark Theme */
            body {
                background-color: #141414 !important;
                color: #ffffff !important;
            }
            
            .start,
            .start__background,
            .start__container {
                background-color: #141414 !important;
            }
            
            /* Hero Section - Full screen banner */
            .card__view {
                border-radius: 12px !important;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
            }
            
            .card__view:hover,
            .card__view:focus {
                transform: scale(1.05);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
                border: 3px solid #ffffff !important;
                z-index: 10;
            }
            
            /* Netflix Typography */
            .card__title,
            .full-card__title,
            .info__title {
                font-family: 'Netflix Sans', 'Helvetica Neue', Arial, sans-serif !important;
                font-weight: 600 !important;
                font-size: 1.2em !important;
                color: #ffffff !important;
            }
            
            .card__descr,
            .full-card__descr {
                font-family: 'Netflix Sans', 'Helvetica Neue', Arial, sans-serif !important;
                font-weight: 400 !important;
                color: #e5e5e5 !important;
                line-height: 1.4 !important;
            }
            
            /* Information Tags */
            .info__create,
            .info__data,
            .full-card__data {
                background: rgba(0, 0, 0, 0.7) !important;
                color: #ffffff !important;
                padding: 4px 8px !important;
                border-radius: 4px !important;
                font-size: 0.9em !important;
                backdrop-filter: blur(10px);
            }
            
            /* CTA Buttons */
            .button,
            .full-card__button,
            .button--primary {
                background: linear-gradient(180deg, #e50914 0%, #b20710 100%) !important;
                color: #ffffff !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 12px 24px !important;
                font-weight: 600 !important;
                font-family: 'Netflix Sans', Arial, sans-serif !important;
                transition: all 0.2s ease !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }
            
            .button:hover,
            .full-card__button:hover {
                background: linear-gradient(180deg, #f40612 0%, #c20814 100%) !important;
                transform: scale(1.05);
            }
            
            .button--secondary {
                background: rgba(109, 109, 110, 0.7) !important;
                backdrop-filter: blur(10px) !important;
            }
            
            .button--secondary:hover {
                background: rgba(109, 109, 110, 0.9) !important;
            }
            
            /* Horizontal Carousels */
            .scroll,
            .cards-scroll {
                background: transparent !important;
                padding: 20px 0 !important;
            }
            
            .cards__item {
                border-radius: 8px !important;
                overflow: hidden;
                margin-right: 10px !important;
                transition: all 0.3s ease;
            }
            
            .cards__item:hover,
            .cards__item:focus {
                transform: scale(1.05);
                border: 2px solid #ffffff !important;
                z-index: 5;
            }
            
            /* Sidebar Navigation */
            .menu,
            .sidebar {
                background: linear-gradient(180deg, #141414 0%, #000000 100%) !important;
                width: 60px !important;
                border-right: 1px solid #333333 !important;
            }
            
            .menu__item,
            .sidebar__item {
                padding: 20px 10px !important;
                text-align: center !important;
                color: #b3b3b3 !important;
                transition: all 0.2s ease !important;
            }
            
            .menu__item:hover,
            .menu__item.active,
            .sidebar__item:hover,
            .sidebar__item.active {
                color: #ffffff !important;
                background: rgba(229, 9, 20, 0.1) !important;
                border-left: 3px solid #e50914 !important;
            }
            
            .menu__item svg,
            .sidebar__item svg {
                width: 24px !important;
                height: 24px !important;
                fill: currentColor !important;
            }
            
            /* Top Navigation */
            .head,
            .header {
                background: linear-gradient(180deg, #141414 0%, rgba(20, 20, 20, 0.9) 100%) !important;
                backdrop-filter: blur(20px) !important;
                border-bottom: 1px solid #333333 !important;
            }
            
            .head__left,
            .head__right {
                color: #ffffff !important;
            }
            
            /* Categories */
            .filter,
            .categories {
                background: rgba(0, 0, 0, 0.5) !important;
                backdrop-filter: blur(10px) !important;
                border-radius: 8px !important;
                padding: 10px !important;
                margin: 10px !important;
            }
            
            .filter__item,
            .categories__item {
                color: #b3b3b3 !important;
                padding: 8px 16px !important;
                margin: 0 5px !important;
                border-radius: 20px !important;
                transition: all 0.2s ease !important;
                background: transparent !important;
                border: 1px solid #333333 !important;
            }
            
            .filter__item:hover,
            .filter__item.active,
            .categories__item:hover,
            .categories__item.active {
                color: #ffffff !important;
                background: #e50914 !important;
                border-color: #e50914 !important;
            }
            
            /* Modal windows */
            .modal,
            .settings {
                background: #141414 !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
            }
            
            .settings__title,
            .modal__title {
                color: #ffffff !important;
                font-family: 'Netflix Sans', Arial, sans-serif !important;
                font-weight: 600 !important;
            }
            
            .settings-param {
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 8px !important;
                margin: 5px 0 !important;
                transition: all 0.2s ease !important;
            }
            
            .settings-param:hover {
                background: rgba(255, 255, 255, 0.1) !important;
            }
            
            .settings-param__name {
                color: #ffffff !important;
            }
            
            .settings-param__value {
                color: #b3b3b3 !important;
            }
            
            /* Loading and progress */
            .loading,
            .progress {
                background: #e50914 !important;
            }
            
            /* Scrollbar */
            ::-webkit-scrollbar {
                width: 8px !important;
            }
            
            ::-webkit-scrollbar-track {
                background: #141414 !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #333333 !important;
                border-radius: 4px !important;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #555555 !important;
            }
            
            /* Netflix Red Accent */
            .selected,
            .active,
            .focus {
                color: #e50914 !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // Add gradient overlays for better text readability
        addGradientOverlays();
        
        console.log(PLUGIN_NAME, 'Lampa UI styles applied successfully');
    }
    
    function removeLampaUIStyles() {
        console.log(PLUGIN_NAME, 'Removing Lampa UI styles');
        
        var styles = document.getElementById('lampa-ui-styles');
        if (styles) {
            styles.remove();
        }
        
        var gradients = document.getElementById('lampa-gradient-overlays');
        if (gradients) {
            gradients.remove();
        }
        
        console.log(PLUGIN_NAME, 'Lampa UI styles removed');
    }
    
    function addGradientOverlays() {
        var gradientStyle = document.createElement('style');
        gradientStyle.id = 'lampa-gradient-overlays';
        gradientStyle.innerHTML = `
            .card__view::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50%;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                pointer-events: none;
            }
            
            .full-card__poster::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 70%;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
                pointer-events: none;
            }
        `;
        document.head.appendChild(gradientStyle);
    }
    
    function createSettingsItem() {
        var settingsItem = Lampa.Template.get('settings_param');
        settingsItem.find('.settings-param__name').text('Lampa UI');
        settingsItem.find('.settings-param__value').text(isPluginEnabled() ? 'Увімкнено' : 'Вимкнено');
        
        settingsItem.on('hover:enter', function () {
            togglePlugin();
            settingsItem.find('.settings-param__value').text(isPluginEnabled() ? 'Увімкнено' : 'Вимкнено');
        });
        
        return settingsItem;
    }
    
    function addToSettings() {
        Lampa.Listener.follow('settings', function (e) {
            if (e.type === 'render') {
                e.body.append(createSettingsItem());
            }
        });
    }
    
    function startPlugin() {
        console.log(PLUGIN_NAME, 'Plugin starting');
        
        if (isPluginEnabled()) {
            applyLampaUIStyles();
        }
        
        addToSettings();
        
        Lampa.Noty.show('Lampa UI плагін завантажено');
    }
    
    // Auto-start when Lampa is ready
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
