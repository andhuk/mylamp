minimalistic Minimastic000000margin:0!imporn;padding:0!impot;verfw-xhiddenlyoutstt,.ta__bckgroud,.stat__cntaer,.cntent.m{bckgoun-clo:#000000!mprtant;in-height0vh !importantidth1%!impotntpading0marg !importantRmve heades ndnavigation hehermnu,.db,.ava,.opeu {dispaynone/* Big  gid layout */,.ol.cardsscoll {dispaygridgrdele-clu:ep(uo-i,mimx3px1fr)gap20px0ackgrun: tnarentoverlwyautomxhegh0vh !imortant Individualcardsyligcardsiemcad__vewaaabrder-adius8pxvflowhiddecursointertrnsitobrder2polidtparntporltivt-o2/3   /*Selectedcardsae - n  effects */.selecd,.cs__tem.slce.cd__view.eletd,.card:focus,.cards__item:focus,d__view:focusoer2pxsolid#ffffffox-shw: 0 0 20x ga255, 255, 255, .3rafmneRemve lhvr effectad:hver__item:hver,.d__vew:hve {trsformnonexshownonebrd2px soltaspaen}

/*Cardimages*/posg,.cd__itmimg{
wth:100%hh7object-fcoverackgoun2a2a2a/* Card tls */cdtl,.crs__te-ile {posioabsolubttm10pxlef1pxrgh10px!pn;ft-size6pxfntwigh60n0txt-alnleftz-ndex2Inf elforselectd cr */select-infopositifxtomlf00bckrund:lna-adnt(tranpet,9)#ffffff4z-dex0transo:anlaY(100%)trnsitotsfor.3sease}

elctd-nfo.shw {fom: slaY(0)seecd-infotl {fon-z32px!impn;fnt-weight700mgi-bottom0pxffffff.seected-f__aft-sizepxclo#b3b3b3margin-ttm5leced-fdsio {sze16plieh1.5lor#eeemx-wdth00}

/*Hideunncssaryelees*/flt,.atees,,.dl,dig,.,buttscntolisplaynonstyling 000000Rmove al transtionsxpfor info panel * {    trnsion: non !important;}
            
            selected-intransitin: transfm 0.3seasfopan ndcadslcionogcCaSelectoLogicMinimalistic infoPnlseectedfopaninfoPnlinfoPnlCaSelectoLogic
        // Create info panelinfoPn'div');
        infoPanel.id = eleced-info-panel';
        infoPanel.className = 'seectd-infoinfoPanel.inneHTML = `
            <div clss="selecte-fo__i"></dv>
            <ivcss="selected-info__eta"></div>
            <div clss="selectedinfo__desciption"></v>
        `;
        docum.bdy.appndChid(infoPnel)
           //Addclickhandles to crs
        setTmout(fucion() {
            var cards = documen.querSectorAll('.card, cards__tm, .cad__view');
          cardsforEach(function(card) {
                d.adEentLstenr('click', uncion()    e.preveDfaul();
                   e.stopPropagation()
                          //Removerevius electon
                    cards.forEach(func(c) {
                       c.clssLit.remve('seecd')   })              
          // Add secionto clicked card    cad.classLs.add('selected')    
                    // Sow nfo panel
                    sowCardInfo(card);
               })
                // Add keyonavgatio
                cd.dEventLster('keydown', funcione) {
                    if (e.key === 'Ene' || e.key === ' ') {
                        e.veDefult);
                     cardclick(;
                    }
                }});
    }, 1000);
    }
    
    functin showCardInfo(card) {
        var foPanel = documen.gtElmById('elected-if-pal')if(!infoPanel)return;

  // Get card informationvartitle=card.querySelector('.card__title,cards__item-title, .itl') || cad;
        vr itlText = title.textContent || title.getAttibute('data-title')|| 'Невідомий заголовок';
var meta = ard.querySelectr('.card__meta, .ifo__daa, .full-card__data') || card;
        var mtaText = meta.textCoent|| 2024 • TV-MA • 1 сезон
var decr = card.querySelecr('.card__descr, .ifo__descr, .full-card__descr') || card;
       vr descrText = decr.textCnnt || 'Опис цього контенту тимчасово недоступний.'
           //Updateinfopanel
infoPanel.querySelector('.selected-inf__title').exCntent =titleText  infoPanel.querySelector('.selected-info__meta').textContent=metaText;
infoPanel.querySelector('.seectd-ino__description').textConten =descrText
          //Showpanel
infoPanel.classLst.add('sow')   
//Hidepanelwn clickn ouside
    setTimeout(function(){
document.ddEventListener('cli', hideInfPanel);
        }, 100);
    }
    
    fnctiohdeInfoPael() {
        v infoPnel = ocument.getElemById'seleced-ifo-nl');
     if(!infoPanel return   
if(!e.target.closest('.card')&&!e.target.clsest('.cards__em') && !.tagt.closs('.elected-info')) {
           ifPael.classList.remov('show')        //Removeselectionfromcards    querySelctorAll('.cr, crds__itm').forEach(fuctoncad) {
                cr.classLst.remove('selected');
            });
            
            document.removeEvLisener('cick', hideInfoPanl
        }