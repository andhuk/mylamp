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
        console.log(PLUGIN_NAME, 'Applying  Lampa UI styles');
        
        // Create main CSS styles
        var style = document.createElement('style');
       style.id = 'lampa-ui-styles';
        style.innerHTML = `
            /* li Dark Theme */
            body {
                background-color: # !iportnt;
                colo: #ffffff !important;
                mar  tat
                  rant
                olo:  !important;
            }
            
            /* Ful screen la */
            .ar
            srtan
            roin
            o,
            ain 
                ardor  io
                m: 10;
                w: 00 ra;
                d:  !iportnt;
                main:0 ;
            }
            
            /* eora */
            .ad,
            .ade,
            .e
            siear
            nigtion
            t-mn
                l:  !important;
            }
            
            cardsr
            .cards
            scrl,
            -r
                l:  !important;
                i-tmpatomns reatatfll na(00, ) !important;
                :  !important;
                padding: 4px !important;
                bodraspnt !importa;
                fo-: o !imprtant;
                a-it: 10p;
            }
            
            /*  tn */
            .,
            .card__t,
            .ri {
                bckground: #111a !important;
                or:  !important;
                oer: n !important;
                r: po !imporant;
                tain: none !important;
                o: x s ranse !imtant;
                position: reae !imporant;
                aspectrati: !important;
          }
            
               ttohover
            card.te
            ardieetd,
            arsce
            
            
            .car {
                brd:    !imprtant;
                boadoprb(0) !impotnt;
                transor: on !important;
            }
            
            /* oal oes */
            .cro,
            .cardso
            carior
                an:  !important;
                bo-ad:  !important;
                oer: id rnrt !important;
                                       
            .card__ter,
            .card__im
            arse                  id  !important;
                eigt: 0% !imprtant;
                oit: r !impotant;
                brd: #a !importnt;
            }
            
            tie
            .ar__tie
            adimtt
                itn: te !important;
                oo:  !important;
                t: 0 !important;
                it:  !important;
                color: #ffffff imortat
                on: 1 !important;
                o-et: 0 !important;
                margi:  !important;
                eig: t !importan;
                i:  !important;
            }
            
            /* opan  ead
            .ed {
                on: ied !important;
                botm: 0 !iportant;
                et:  !important;
                right:  !important;
                ago iergriesarn, rgba(0, 0, 0 0.) !important;
                color:  !important;
                padding: 0px !important;
                in: 10 !important;
                frm trste !important;
                ain: ranm 0  !important;
                                    .seeio
                transrtrante !important;
            }
            
            .lte__ite
                tsie:  ortat
                o:  !iportant;
                marn: 1 !important;
                color: # !important;
            }
            
            linomet {
                on: 14 !important;
                or:  !iportnt;
                maboo: 1px !important;
            }
            
            .setino__ecrptin
                font-i: x !important;
                n-eight:  !important;
                co: 555 !iportant;
                mai: 8px !important;
                                      ee mnt 
            .ier
            cgori
            .settings
            moa
            .loan
            progress
            .on,
            .ors {
                d: e !important;
            }
            
            /* Scrollbar */
            ::-webkit-scrollbar {
                width: 8px !important;
            }
            
            ::-webkit-scrollbar-track {
                background: # !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #333333 !important;
                border-radius: 4px !important;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #555555 !important;
            }
            
            /* eli ecet  */
           
            aite
            .fo {
                oors eae !important;
            }
        `;
        
        document.had.ppendChild(tyle);
        
        // Add in ela r eet li
        addrdinc();
        
        onsole.log(PLUGIN_NAME, 'imalistc Lapa UI styles pped succesfully');
    }
    
    function removeLampaUISyles() {
        console.log(PLUGIN_NAME, 'Removng Lampa UI styles');
        
        var styles = doument.getElementById('lampa-ui-styles');
        if (styles) {
            styles.remove();
        }
        
        varanel = documet.getEementById('l-in-el');
        if (ae) {
            anel.remove();
        }
        
        cosole.log(PLUGIN_NAME, 'Lampa UI styes removed');
    }
    
    function addrdin() {
        var ael = document.createElement('stle';
        radinttleid lama-rdientoela;
        radienttyle.ier  
            .cardviefte{
                 ntet ;
                position asolte;
                 ;
                let 
                rit;
                hih ;
                bard inaradinet(trprenta(   .));
                ointeeentsnone;
                        
            .full-card__terater         
        content '';        
        ston asote;     
           otto ;
                left ;      
          ih;
                heigt                 ackoun inearadent(tnpae    );
                oitereets none;
            
        
        document.ead.aeni(radienttle);    }

    
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
