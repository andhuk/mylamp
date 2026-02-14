/**
 * Better UI — Netflix-style Lampa interface
 * Hero section, typography, info tags, CTA, carousels, sidebar, cards, dark theme.
 * ES5 compatible.
 */
(function () {
    'use strict';

    var PLUGIN_NAME = 'BetterUI';
    var STORAGE_KEY = 'better_ui_enabled';
    var STYLE_ID = 'better-ui-netflix-styles';
    var NETFLIX_RED = '#e50914';
    var NETFLIX_DARK = '#141414';
    var NETFLIX_DARK_SOFT = '#1a1a1a';
    var NETFLIX_CARD_BG = '#181818';

    function isEnabled() {
        try {
            return Lampa.Storage.get(STORAGE_KEY, true);
        } catch (e) {
            console.error(PLUGIN_NAME, e);
            return true;
        }
    }

    function setEnabled(value) {
        try {
            Lampa.Storage.set(STORAGE_KEY, value);
        } catch (e) {
            console.error(PLUGIN_NAME, e);
        }
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.innerHTML = getNetflixCSS();
        document.head.appendChild(style);
        addGradientOverlayStyle();
        console.log(PLUGIN_NAME, 'Netflix-style styles applied');
    }

    function getNetflixCSS() {
        var s = [];
        // Dark theme base
        s.push('body, .app { background-color: ' + NETFLIX_DARK + ' !important; color: #ffffff !important; }');
        s.push('.view--full, .full, [class*="full"] { background-color: ' + NETFLIX_DARK + ' !important; }');

        // Top navigation (Top Navigation)
        s.push('.head, .head__middle, .head__actions { background: ' + NETFLIX_DARK + ' !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }');
        s.push('.head__action.selector, .head__action { color: #ffffff !important; }');
        s.push('.head__action.selector.focus, .head__action.focus { color: ' + NETFLIX_RED + ' !important; outline: 2px solid ' + NETFLIX_RED + ' !important; outline-offset: 2px !important; border-radius: 4px !important; }');

        // Sidebar (minimal icons)
        s.push('.menu { background: ' + NETFLIX_DARK + ' !important; width: 60px !important; min-width: 60px !important; }');
        s.push('.menu__list { padding: 12px 0 !important; }');
        s.push('.menu__item, .menu__ico { color: rgba(255,255,255,0.8) !important; }');
        s.push('.menu__item.selector.focus, .menu__item.focus { color: #ffffff !important; background: rgba(255,255,255,0.1) !important; border-radius: 8px !important; }');
        s.push('.menu__item.selector.focus .menu__ico, .menu__item.focus .menu__ico { color: ' + NETFLIX_RED + ' !important; }');
        s.push('.menu__text { font-size: 11px !important; }');

        // Card system: rounded corners, focus state (white border + scale)
        s.push('.cards-scroll .card, .card.selector, .card[class*="card"] { border-radius: 8px !important; overflow: hidden !important; transition: transform 0.2s ease, box-shadow 0.2s ease !important; }');
        s.push('.card.selector.focus, .card.focus, .card.selector:hover { transform: scale(1.05) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; border: 2px solid #ffffff !important; border-radius: 8px !important; z-index: 2 !important; }');
        s.push('.card__poster, .card__image, .card img, [class*="card__"] img { border-radius: 8px !important; }');
        s.push('.cards-scroll { padding: 4px 0 !important; }');

        // Hero section: full-width media + gradient under text
        s.push('.full-card, .full__media, .view--full .full__media, [class*="full-card"] { position: relative !important; width: 100% !important; min-height: 50vh !important; background-size: cover !important; background-position: center !important; }');
        s.push('.full-card__info, .full__info, [class*="full-card__"] { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; background: linear-gradient(transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.95) 100%) !important; padding: 60px 40px 40px !important; pointer-events: none !important; }');
        s.push('.full-card__info *, .full__info * { pointer-events: auto !important; }');
        s.push('.full-card__title, .full__title { font-size: 2.5rem !important; font-weight: 700 !important; text-shadow: 0 2px 8px rgba(0,0,0,0.8) !important; margin-bottom: 12px !important; }');
        s.push('.full-card__desc, .full__desc, .full-card__text { font-size: 1rem !important; line-height: 1.4 !important; max-width: 480px !important; text-shadow: 0 1px 4px rgba(0,0,0,0.9) !important; color: rgba(255,255,255,0.9) !important; }');

        // Info tags (rating, seasons, year, genres)
        s.push('.full-card__meta, .full__meta, [class*="full-card__meta"], .info-badges span { display: inline-flex !important; align-items: center !important; gap: 8px !important; flex-wrap: wrap !important; margin-bottom: 16px !important; }');
        s.push('.full-card__meta span, .info-tag, [class*="badge"] { background: rgba(255,255,255,0.2) !important; color: #ffffff !important; padding: 4px 10px !important; border-radius: 4px !important; font-size: 12px !important; font-weight: 600 !important; }');
        s.push('.full-card__meta .rating, .rating-tag { background: ' + NETFLIX_RED + ' !important; }');

        // CTA: Play & More info
        s.push('.full-card__buttons, .full__buttons, .full-card .selector[data-action*="play"], .full .selector[data-action*="play"] { display: flex !important; gap: 12px !important; margin-top: 16px !important; }');
        s.push('.full-card .selector.focus[data-action*="play"], .full .selector.focus[data-action*="play"], .button--play, [class*="play"] { background: #ffffff !important; color: ' + NETFLIX_DARK + ' !important; border: none !important; padding: 10px 28px !important; border-radius: 4px !important; font-weight: 600 !important; font-size: 1rem !important; }');
        s.push('.full-card .selector.focus[data-action*="play"]:hover, .button--play:hover { background: rgba(255,255,255,0.9) !important; }');
        s.push('.full-card .selector[data-action*="info"], .full .selector[data-action*="info"], .button--more { background: rgba(255,255,255,0.2) !important; color: #ffffff !important; border: 1px solid rgba(255,255,255,0.5) !important; padding: 10px 24px !important; border-radius: 4px !important; font-weight: 500 !important; }');
        s.push('.full-card .selector.focus[data-action*="info"], .full .selector.focus[data-action*="info"] { background: rgba(255,255,255,0.3) !important; border-color: #ffffff !important; }');

        // Horizontal carousels (row titles)
        s.push('.category__title, .cards__title, [class*="category-title"], .section-title { font-size: 1.4rem !important; font-weight: 600 !important; color: #ffffff !important; margin-bottom: 12px !important; padding-left: 4px !important; }');
        s.push('.category, .cards-block { margin-bottom: 32px !important; }');

        // Typography: clear hierarchy
        s.push('.card__title, .card-title { font-weight: 600 !important; font-size: 14px !important; color: #ffffff !important; }');
        s.push('.settings-param__name, .head__title { font-weight: 600 !important; color: #ffffff !important; }');
        s.push('.settings-param__description { color: rgba(255,255,255,0.6) !important; }');

        // Scrollbar
        s.push('::-webkit-scrollbar { width: 8px !important; height: 8px !important; }');
        s.push('::-webkit-scrollbar-track { background: ' + NETFLIX_DARK + ' !important; }');
        s.push('::-webkit-scrollbar-thumb { background: #333 !important; border-radius: 4px !important; }');
        s.push('::-webkit-scrollbar-thumb:hover { background: #555 !important; }');

        // Modals & overlays
        s.push('.modal, .about { background: ' + NETFLIX_CARD_BG + ' !important; border-radius: 12px !important; color: #ffffff !important; }');
        s.push('.selector.focus { outline: 2px solid #ffffff !important; outline-offset: 2px !important; border-radius: 4px !important; }');
        return s.join('\n');
    }

    function addGradientOverlayStyle() {
        if (document.getElementById('better-ui-gradient-overlay')) {
            return;
        }
        var style = document.createElement('style');
        style.id = 'better-ui-gradient-overlay';
        style.innerHTML = [
            '.card-view .full-card__media::after, .card-view .full__media::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: linear-gradient(transparent, rgba(0,0,0,0.85)); pointer-events: none; }',
            '.view--full .full__backdrop::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,0.98) 0%, transparent 50%); pointer-events: none; }'
        ].join('\n');
        document.head.appendChild(style);
    }

    function removeStyles() {
        var el = document.getElementById(STYLE_ID);
        if (el) el.remove();
        el = document.getElementById('better-ui-gradient-overlay');
        if (el) el.remove();
        console.log(PLUGIN_NAME, 'Styles removed');
    }

    function toggle() {
        var next = !isEnabled();
        setEnabled(next);
        if (next) {
            injectStyles();
        } else {
            removeStyles();
        }
        Lampa.Noty.show('Better UI (Netflix) ' + (next ? 'увімкнено' : 'вимкнено'));
    }

    function createSettingsItem() {
        var template = Lampa.Template.get('settings_param');
        if (!template || !template.length) {
            return null;
        }
        template.find('.settings-param__name').text('Better UI (Netflix)');
        template.find('.settings-param__value').text(isEnabled() ? 'Увімкнено' : 'Вимкнено');
        template.on('hover:enter', function () {
            toggle();
            template.find('.settings-param__value').text(isEnabled() ? 'Увімкнено' : 'Вимкнено');
        });
        return template;
    }

    function addToSettings() {
        Lampa.Listener.follow('settings', function (e) {
            if (e.type === 'render' && e.body && e.body.append) {
                var item = createSettingsItem();
                if (item) e.body.append(item);
            }
        });
    }

    function startPlugin() {
        console.log(PLUGIN_NAME, 'starting');
        if (isEnabled()) {
            injectStyles();
        }
        addToSettings();
        Lampa.Noty.show('Better UI (Netflix) завантажено');
    }

    if (window.appready) {
        startPlugin();
    } else if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
