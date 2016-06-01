jQuery(function() {
    // alert()
});

var firstStart, LANGUAGE, data, urlFileLang;

var appVersion = "0.0.3";


/**************************/
//DATA Model - predefined values
predefinedExpCatAcc = {
    "enabled": true,
    list: [{title: "Hotel and Accomentation", checked: true},
        {title: "Taxi", checked: true},
        {title: "Tickets and other", checked: true},
        {title: "Phone", checked: true},
        {title: "Representation Expenses", checked: true},
        {title: "Other Purchases", checked: true}]
};

predefinedExpCatBusiness = {"enabled":true,
    list:
    [{title:"New Sales",checked: true},
    {title:"Current Clients",checked: true},
    {title:"Employees",checked: true},
    {title:"Partners",checked: true},
    {title:"Project Development",checked: true}]
};


predefinedExpCatProject = {"enabled":true,
    list:[{title:"Project cost",checked: true}]
};

predefinedPaymentType = [
    {title:"Cash",checked: true, whopay: 0},
    {title:"Private Credit Card 1",checked: true, whopay: 0},
    {title:"Corportate Credit Card 1",checked: true, whopay: 0},
    {title:"Private Credit Card 2",checked: true, whopay: 0},
    {title:"Corportate Credit Card 2",checked: true, whopay: 0},
    {title:"Company to pay",checked: true, whopay: 0},
    {title:"Company paid",checked: true, whopay: 1}
];


predefinedCurrency = [
    {title: "Rub", checked: true},
    {title: "Euro", checked: true},
    {title: "USD", checked: true}
];

/**************************/


var myApp,$$, mainView;

// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos
};


onLoad();



function onLoad() {



    //intel.xdk.isnative - ran on device

    if (window.cordova && (/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        //TODO Check is under cordova
        //runApp();
        //alert(1);
        document.addEventListener('deviceready', runApp, false);
        //document.addEventListener("intel.xdk.device.ready", runApp, false);
    } else {
        //for browser
        document.addEventListener("DOMContentLoaded", runApp, false);
        ///alert(123);
    }



}

function runApp() {
    //place here? is it correct?
    document.addEventListener('backbutton', function (e) { $$(".back").click(); e.preventDefault(); }, false);
    document.addEventListener('menubutton', function (e) {
        //TODO popover shows in any page - needs only index
        //TODO hide panel if it is visible
        //myApp.openPanel("left");

        mainView.router.load({url:"tmpl/setup.html"});
        //e.preventDefault();
    }, false);


    var statusBarSupport = false;
    if(window.cordova) {
        statusBarSupport = !!(/(iphone|ipad|ipod)/i.test(navigator.userAgent)) && !!!(/(Android|IEMobile|Edge|Windows Phone)/i.test(navigator.userAgent));
    }


    var fastClickSupport = true;
    if((navigator.userAgent.match(/AppleWebKit\/534/) && navigator.userAgent.match(/Android/)) || typeof intel !== "undefined") { // may be better 53... for include 536
        fastClickSupport = false;
    }

    /*if(typeof intel !== "undefined") {
        console.log(intel.xdk.isxdk);
    }*/
    //TODO apply this for slow devices
    //animatePages: false, sortable: false,swipeBackPageAnimateShadow: false,swipeBackPageAnimateOpacity: false,
    //smartSelectInPopup:true,
    //TODO fastClicks: false for oldwebkit devices for turn on innertia in the listbox


// Initialize your app
    myApp = new Framework7({
        fastClicks: fastClickSupport, //enable fastClicks for desktop (chrome ?) browser only
        animateNavBackIcon: true,
        material: isAndroid ? true : false,
        template7Pages: false,
        cache: false,
        statusbarOverlay: statusBarSupport //remove statusBar under WP8.0

    });

// Export selectors engine
    $$ = Dom7;


//test blur/focus for keyboard fix
    /*
     $$(document).on("focus","input", function(){
     myApp.addNotification({
     title: 'Framework7',
     message: 'Focus!'
     });

     }, true);

     */


// Add main View
    mainView = myApp.addView('.view-main', {
        // Enable dynamic Navbar
        dynamicNavbar: false,
        // Enable Dom Cache so we can use all inline pages
        domCache: false
    });


    alight.autostart = false;
//alight.bootstrap("#index-page", scope);
//call pageInit for index.html
    myApp.onPageInit('index', function (page) {
        //Do something here with home page
        //FIX - log isn't shown.. Why???
        //log('initialized');
        alight.bootstrap("#index-page", scope);
    }).trigger();



//call PageInit for all pages to vue process them
    myApp.onPageInit('*', function (page) {
        log(page.name + ' initialized');

        alight.bootstrap("#page", scope);

    });



    //try to implement js fix for input/text area and mobile screen keyboard
    //use class or element name
    //$$(document).on("focus","input,textarea", function(e){
    $$(document).on("focus","input, textarea", function(e){
        var el = $$(e.target);
        var page = el.closest(".page-content");
        var elTop = el.offset().top;
        //do correction if input at near or below middle of screen
        if(elTop > page.height() / 2 - 20 ){
            var delta = page.offset().top +  elTop - $$(".statusbar-overlay").height() * (myApp.device.ios?2:1) - $$(".navbar").height(); //minus navbar height??? 56 fot MD
            var kbdfix = page.find("#keyboard-fix");
            if(kbdfix.length == 0) { //create kbdfix element
                page.append("<div id='keyboard-fix'></div>");
            }

            $$("#keyboard-fix").css("height", delta * 2 + "px");
            page.scrollTop( delta, 300);

        }
    }, true);

    //$$(document).on("blur","input,textarea", function(e){
    //call this code in the Back button handler - when it fired for keyboard hidding.
    $$(document).on("blur","input, textarea", function(e){
        //reduce all fixes
        $$("#keyboard-fix").css("height", "0px");
    }, true);




//alight.autostart = false;
//var tag = document.querySelector('#alApp');  // take the tag
//alight.bootstrap([tag]);

//Hammer.plugins.fakeMultitouch();




//== LANGUAGE ==========================\
LANGUAGE = localStorage.getItem('language'); // RU EN DE
    LANGUAGE ="EN";
if (LANGUAGE == null) {
  //== LOCATION =============\
    $.get("http://ipinfo.io", function(response) {
        if (response) {
          log('IP INFO: ', response);
          localStorage.setItem('language', response.country);
          LANGUAGE = response.country;

          if (LANGUAGE == 'RU') { urlFileLang  = 'data/lang_ru.json'; }
          if (LANGUAGE == 'DE') { urlFileLang  = 'data/lang_de.json'; }
          if (LANGUAGE == 'EN') { urlFileLang  = 'data/lang_en.json'; }

          startCodeApp();
        }
        else {
          log('NO IP INFO: ', response);

          mainView.router.loadPage('tmpl/language_setting.html');
          mainView.router.load('tmpl/language_setting.html');
        }


    }, "jsonp");
//=================/
}
else {
  if (LANGUAGE == 'RU') { urlFileLang  = 'data/lang_ru.json'; }
  if (LANGUAGE == 'DE') { urlFileLang  = 'data/lang_de.json'; }
  if (LANGUAGE == 'EN') { urlFileLang  = 'data/lang_en.json'; }

  startCodeApp();
}
log('LANGUAGE: ', LANGUAGE);
//====================================/


// RESET SETTINGS
    $$(document).on("click",'#reset-lang', function(event) {
        localStorage.removeItem('language');
        myApp.alert('Reset language', 'Success!');
    });
    $$(document).on("click","#reset-first-start", function(event) {
        localStorage.clear();
        //localStorage.removeItem('first_start');

        myApp.alert('Reset first load.<br>Now application will reloaded.', 'Success!', function() {
            // mainView.router.loadPage('index.html');
            // mainView.router.load({url: 'index.html'});
            document.location.href = "index.html";

        });
    });



    //other global handlers
    //set handler to call new single expense instead direct link
    $$(document).on("click",'.new-single-expense', function(e) {

        dataService.currentExpenseIndex = -1; //out of array
        mainView.router.load({url:"tmpl/single_expense.html"});
    });




}


window.onload = function() {
  log('onload');

  $.getJSON(urlFileLang, function(data) {
    log('onload getJSON: ', data);
    index(data)
  });
}



////////////////// model vars ////////////

//define scope
scope = {
    model: {}

};

//define data model
scope.model = {
    message: "hello, world!"
};


function showErrorField(_id) {
    $$(_id).addClass("errorfield");
}

function hideErrorField(_id) {
    $$(_id).removeClass("errorfield");
}






/////////////////////////////////////////////

//global function to work with localstorage\WebSQL from any controllers
function loadData(key)  { return JSON.parse(localStorage.getItem("fr-" + key)); }
function saveData(key,list) { localStorage.setItem("fr-" + key, JSON.stringify(list)); }
function destroyData(key)   { localStorage.removeItem("fr-" + key); }

function getDateNow() {
    //return new Date().toISOString().substr(0, 16);
   var d = new Date();
    // Получаем из браузера временную зону
    // Конвертируем её в секунды (* 60000)
    // Отнимаем от времени временную зону,
    // и получаем время по гринвичу
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);


    var newdt =  new Date(utc).toISOString().substr(0, 16);
    //console.log(newdt);
    return newdt;
}

function saveCurrentExpense() {
    
}

function getCurrentCurrency() {
    return "Rub";
}


/* FIX for DRUM + AL working together*/
function updateDrumValue(_id) {

    //todo don't working on android device!
    var select = $(_id)[0];
    console.log("Drum value : ",$(_id).drum("getIndex"));
    return select.options[select.selectedIndex].title;
    //return select.options[Number(select.value.substr(1)) - 1].title;
}






//////////////////////////////////////////////
function sendReport(_reportObj, _transport) {
    //console.log(_reportObj);
    if(_transport == "email") {
        //call cordova plugin
        if (window.cordova) {
            if (cordova.plugins !== undefined) {
                if (cordova.plugins.email !== undefined) {
                    var attaches = [];

                    cordova.plugins.email.open({
                        app: "mailto",
                        to: _reportObj["to"],
                        cc: _reportObj["cc"],
                        subject: _reportObj["subject"],
                        body: _reportObj["body"],
                        attachments: _reportObj["attaches"],
                        isHtml: false
                    }, function () { //this is callback, not error function
                         //myApp.alert('No email client found');
                    });
                } else {
                    myApp.alert("No email composer plugin installed");
                }
            } else {
                myApp.alert("Cordova plugins are not supported");
            }

        } else { myApp.alert("No Cordova environment detected");}
    }

}


///datetime filter for correct display UTC datetime
(function () {
    var d2, makeDate;
    d2 = function (x) {
        if (x < 10) {
            return '0' + x;
        }
        return '' + x;
    };
    makeDate = function (exp, value) {
        var d, i, len, r, x;
        if (!value) {
            return '';
        }
        //remove all UTC properties
        value = value.replace("T", " ").substr(0, 19);
        value = new Date(value);
        x = [[/yyyy/g, value.getFullYear()], [/mm/g, d2(value.getMonth() + 1)], [/dd/g, d2(value.getDate())], [/HH/g, d2(value.getHours())], [/MM/g, d2(value.getMinutes())], [/SS/g, d2(value.getSeconds())]];
        r = exp;
        for (i = 0, len = x.length; i < len; i++) {
            d = x[i];
            r = r.replace(d[0], d[1]);
        }
        return r;
    };
    return alight.filters.datetime = function (value, exp) {
        return makeDate(exp, value);
    };
})();

/////////////////////////
alight.directives.al.navbar = function(s,el,value) {
        value = value || "#";
        el.innerHTML = //'<div class="navbar">'+
        '<div class="navbar-inner">'+
        '<div class="left">'+
        '<a href="#" class="back link" data-ignore-cache1="true"  data-reload-previous1="true" data-force="true"><i class="fa fa-chevron-left"></i></a>'+
        '</div>'+
        '<div class="center">'+
        '<a href="index.html" class="link"><i class="fa fa-chevron-up"></i></a>'+
        '</div>'+
        '<div class="right">'+
        '<a href="'+value+ '" class="link"><i class="fa fa-chevron-right"></i></a>'+
        '</div></div>';


};

alight.directives.al.toolbar = function(s,el,value) {
    value = value || "tmpl/description.html";
         el.innerHTML = '<div class="toolbar toolbar-bottom toolbar-bottom-fix1">'+
        '<div class="toolbar-inner">'+
        '<a href="'+value+'" class="link"><i class="fa fa-question-circle"></i></a>'+
        '<a href="index.html" class="link"><i class="fa fa-plus-circle"></i></a>'+
        '<a href="#" class="link new-single-expense"><i class="fa fa-rub"></i></a>'+
        '<a href="tmpl/setup.html"  class="link"><i class="fa fa-cog"></i></a>'+
        '</div></div>';

};


alight.directives.al.marked = function(s,el,value) {
    var code = el.textContent;

    //code = '# Marked in browser\n\nRendered by **marked**.';
    // console.log(code);
    el.innerHTML = marked(code);
};





/*
 <select al-selecto="selected">
 <option al-repeat="item in list" al-optiono="item">{{item.name}}</option>
 <optgroup label="Linux">
 <option al-repeat="linux in list2" al-option="linux">Linux {{linux.codeName}}</option>
 </optgroup>
 </select>
 */
(function() {
    var Mapper;
    if (window.Map) {
        Mapper = function() {
            this.idByItem = new Map;
            this.itemById = {};
            this.index = 1;
            return this;
        };
        Mapper.prototype.acquire = function(item) {
            var id;
            //id = "i" + (this.index++);
            id = item;
            this.idByItem.set(item, id);
            this.itemById[id] = item;
            return id;
        };
        Mapper.prototype.release = function(id) {
            var item;
            item = this.itemById[id];
            delete this.itemById[id];
            this.idByItem["delete"](item);
        };
        Mapper.prototype.replace = function(id, item) {
            var old;
            old = this.itemById[id];
            this.idByItem["delete"](old);
            this.idByItem.set(item, id);
            this.itemById[id] = item;
        };
        Mapper.prototype.getId = function(item) {
            return this.idByItem.get(item);
        };
        Mapper.prototype.getItem = function(id) {
            return this.itemById[id] || null;
        };
    } else {
        Mapper = function() {
            this.itemById = {
                'i#null': null
            };
            return this;
        };
        Mapper.prototype.acquire = function(item) {
            var id;
            if (item === null) {
                return 'i#null';
            }
            if (typeof item === 'object') {
                id = item.$alite_id;
                if (!id) {
                    item.$alite_id = id = alight.utils.getId();
                }
            } else {
                id = '' + item;
            }

            id = '' + item;

            this.itemById[id] = item;

            return id;
        };
        Mapper.prototype.release = function(id) {
            delete this.itemById[id];
        };
        Mapper.prototype.replace = function(id, item) {
            this.itemById[id] = item;
        };
        Mapper.prototype.getId = function(item) {
            if (item === null) {
                return 'i#null';
            }
            if (typeof item === 'object') {
                return item.$alite_id;
            } else {
                return '' + item;
            }
        };
        Mapper.prototype.getItem = function(id) {
            return this.itemById[id] || null;
        };
    }
    alight.d.al.selecto = {
        priority: 20,
        link: function(scope, element, key, env) {
            var cd, lastValue, mapper, onChangeDOM, setValueOfElement, watch;
            cd = env.changeDetector["new"]();
            env.stopBinding = true;
            cd.$select = {
                mapper: mapper = new Mapper
            };
            lastValue = null;
            cd.$select.change = function() {
                return setValueOfElement(lastValue);
            };
            setValueOfElement = function(value) {
                var id;
                id = mapper.getId(value);
                if (id) {
                    return element.value = id;
                } else {
                    return element.selectedIndex = -1;
                }
            };
            watch = cd.watch(key, function(value) {
                lastValue = value;
                return setValueOfElement(value);
            });
            onChangeDOM = function(event) {
                lastValue = mapper.getItem(event.target.value);
                cd.setValue(key, lastValue);
                return cd.scan({
                    skipWatch: watch
                });
            };
            alight.f$.on(element, 'input', onChangeDOM);
            alight.f$.on(element, 'change', onChangeDOM);
            cd.watch('$destroy', function() {
                alight.f$.off(element, 'input', onChangeDOM);
                return alight.f$.off(element, 'change', onChangeDOM);
            });
            return alight.bind(cd, element, {
                skip_attr: env.skippedAttr()
            });
        }
    };
    return alight.d.al.optiono = function(scope, element, key, env) {
        var cd, i, id, j, mapper, select, step;
        cd = step = env.changeDetector;
        for (i = j = 0; j <= 4; i = ++j) {
            select = step.$select;
            if (select) {
                break;
            }
            step = step.parent || {};
        }
        if (!select) {
            alight.exceptionHandler('', 'Error in al-option - al-select is not found', {
                cd: cd,
                scope: cd.scope,
                element: element,
                value: key
            });
            return;
        }
        mapper = select.mapper;
        id = null;
        cd.watch(key, function(item) {

            if (id) {
                if (mapper.getId(item) !== id) {
                    mapper.release(id);
                    id = mapper.acquire(item);
                    element.value = id;
                    select.change();
                } else {
                    mapper.replace(id, item);
                }
            } else {
                id = mapper.acquire(item);
                element.value = id;
                select.change();
            }
        });
        cd.watch('$destroy', function() {
            mapper.release(id);
            return select.change();
        });
    };
})();


////////////////////////

alight.filters.onlyselected = function (value) {

    if (Array.isArray(value)) { //fix for mobile platforms
        return value.filter(function (x) { return x.checked });
    } else {
        return value;
    }

}








//////////////////////////////////



alight.ctrl.mainPage = function(ss, el) {


}






//3d party function
//comment console.log to stop logging
function log(st, st2) {
    console.log(st + " " + (typeof st2 != "undefined" ? st2 : ""));
}


function index(data) {
 /* $('.content-block-title').text(data.pages.page30.title);

  $('.Trip_Management').text(data.pages.page30.Trip_Management);
  $('.Corrections').text(data.pages.page30.Corrections);
  $('.Single_Expense').text(data.pages.page30.Single_Expense);
  $('.Reports').text(data.pages.page30.Reports);
*/
  $("#country").drum({
    panelCount: 12,
    // dail_w: 75,
    // dail_h: 20,
    // dail_stroke_color: '#810000',
    // dail_stroke_width: 3,
    onChange : function (e) {
      log('onChange: ', e.value);
    }
  });

}

function startCodeApp() {
  // log('urlFileLang: ', urlFileLang);
  $.getJSON(urlFileLang, function(data) {

    log('data: ', data);

    // FIRST START PAGE ======================\
    firstStart = localStorage.getItem('first_start'); // boolean
    // log('firstStart: ', firstStart);
    if (firstStart == null) {
          mainView.router.loadPage('tmpl/start_page.html');
          mainView.router.load('tmpl/start_page.html');

          setTimeout(function() {
              // mainView.router.back();
              mainView.router.loadPage('index.html');
              mainView.router.load('index.html');

              $$('.toolbar').removeAttr('disabled');

              localStorage.setItem('first_start', 'true');
          }, 8000);
    }
    //===================/

    //
    $$(document).on('pageInit', function (e) {
      var page = e.detail.page;
      log('page', page.name);

      LANGUAGE = "EN";//localStorage.getItem('language');
      if (LANGUAGE == 'RU') { urlFileLang  = 'data/lang_ru.json'; }
      if (LANGUAGE == 'DE') { urlFileLang  = 'data/lang_de.json'; }
      if (LANGUAGE == 'EN') { urlFileLang  = 'data/lang_en.json'; }

      log('LANGUAGE: ', LANGUAGE);

      $.getJSON(urlFileLang, function(data) {
        log('getJSON: ', data);
        data = data;



        if (page.name === 'payment_type') { paymentTypePage(data); }
        if (page.name === 'setup') { setupPage(data); }
        if (page.name === 'language_setting') { laguageSettingsPage(data); }
        if (page.name === 'start_page') { startPage(data); }
        if (page.name === 'language_setting') { laguageSettingsPage(data); }
        if (page.name === 'descript_navbar') { descriptNavbarPage(data); }
        if (page.name === 'single_expense') { single_expense(data); }
        if (page.name === 'send_report') { send_report(data); }
        if (page.name === 'trip_manager') { trip_manager(data); }
        if (page.name === 'start_chose') { start_chose(data); }
        if (page.name === 'index') { index(data); }
        if (page.name === 'description') { description(data); }
        if (page.name === 'correction') { correction(data); }
        if (page.name === 'expense_category_account') { expense_category_account(data); }
        //if (page.name === 'currency') { currency(data); }

      });
    });

    //== functions =============================\



    function correction(data) {

        $("#expenses-correction").drum({
            panelCount: 12,
            onChange: function (e) {
                //log('onChange: ', e.value);
                $$("#expenses-correction").trigger("change")
            }
        });
        $("#trips-correction").drum({
            panelCount: 12,
            onChange: function (e) {
                $$("#trips-correction").trigger("changed");
                //log('onChange: ', e.value);
            }
        });
        $("#comments").drum({
            panelCount: 12,
            onChange: function (e) {
                log('onChange: ', e.value);
                $$('#additionalcomment').text(e.value);
            }
        });

    }


      function send_report(data) {



          $("#business-trips").drum({
              panelCount: 12,
              onChange : function (e) {
                  log('onChange: ', e.value);
                  $$("#business-trips").trigger("changed");
              }
          });

          $("#expenses-report").drum({
              panelCount: 12,
              onChange : function (e) {
                  //log('onChange: ', e.value);
                  $$("#expenses-report").trigger("change");
              }
          });
          //console.log("myMethod", $("#triplegs").drum('myMethod'));

      }



      function trip_manager(data) {



           $("#triplegs").drum({
              panelCount: 12,
              onChange : function (e) {
                  log('onChange: ', e.value);
                  $$("#triplegs").trigger("changed");
              }
          });
          //console.log("myMethod", $("#triplegs").drum('myMethod'));

      }


      function expense_category_account(data)  {
      // $("#exp-cat-account").drum({
      //   panelCount: 6,
      //   onChange : function (e) {
      //     log('onChange: ', e.value);
      //   }
      // });
    }


    function paymentTypePage(data) {
        // ...
    }

    function setupPage(data)  {
      console.log('setupPage data: ', data);
      //$('[data-name="setupHeader"]').text(data.pages.page6.title);

       $.each(data.pages.page6.listItems, function (i, value) {
          // console.log('value: ', value);
          var item = '<li><a href="'+value.link+'" class="item-link item-content"><div class="item-inner"><div class="item-title">'+value.title+'</div></div></a></li>';
          $('.body-list-setup').append(item);
       });
    }

    function startPage(data) {
        //$('.toolbar').attr('disabled', true);

        //$('[data-page="start_page"] .content-block-title').text(data.pages.page1.title);
        //$('[data-page="start_page"] .page-content h3').text(data.pages.page1.Welcome);
    }

    function laguageSettingsPage(data) {
      //error - text setted to all instance of .c-b-t... .last() решает подобную проблему, но только в текущей версии кода
      //$('.content-block-title').text(data.pages.page2a.title);
      //$('.lang-text').text(data.pages.page2a.Prefered_language_2a);

      if (firstStart != null) {
        $('#select-language a').attr('href', 'tmpl/setup.html');
      }
      $('a[data-lang]').click(function() {
          var lang = $(this).data('lang');
          log('setup lang:' , lang);

          localStorage.setItem('language', lang);
          LANGUAGE = lang;
          // location.reload();
          // mainView.router.loadPage('tmpl/start_chose.html');
          // mainView.router.load('tmpl/start_chose.html');
          // startCodeApp();
      });
    }

    function descriptNavbarPage(data) {
        $$('.toolbar').removeAttr('disabled');

        // $('.page-content h3').text(data.pages.page1.Welcome);
    }

    function single_expense(data) {
        log('function single_expense()', getTime('date'));

        $$('#year-single').text(getTime('date'));
        $$('#time-single').text(getTime('time'));


        $("#opentrips").drum({
            panelCount: 8,
            onChange : function (e) {
                //log('onChange: ', e.value);
                $$("#opentrips").trigger("change");

            }
        });
        $("#currency").drum({
            panelCount: 8,
            onChange : function (e) {
                //log('onChange: ', e.value);
                $$("#currency").trigger("change");

            }
        });

        $("#payment-type").drum({
          panelCount: 8,
          onChange : function (e) {
//            log('onChange: ' + e);
              //fire event for update value
              $$("#payment-type").trigger("change");
          }
        });

        $("#add-to-trip").drum({
          panelCount: 8,
          onChange : function (e) {
            log('onChange: ' + e.value);
          }
        });

        $("#accounting-expense").drum({
          panelCount: 8,
          onChange : function (e) {
            //log('onChange: '+ e.value);
              $$("#accounting-expense").trigger("change");

          }
        });

        $("#business-expense").drum({
          panelCount: 8,
          onChange : function (e) {
            //log('onChange: ' + e.value);
              $$("#business-expense").trigger("change");
          }
        });

        $("#project-expense").drum({
          panelCount: 8,
          onChange : function (e) {
            //log('onChange: ' + e.value);
              $$("#project-expense").trigger("change");
          }
        });
    }

    function start_chose(data) {
    //  $('.content-block-title').text(data.pages.page3.title);

     // $('#read_information').text(data.pages.page3.read_information);
     // $('#setup_app').text(data.pages.page3.setup_app);
     // $('#Just_start').text(data.pages.page3.Just_start);

//      $('#Press_One').text(data.pages.page3.Press_One);
    }

    function description(data) {
//      $('.content-block-title').text(data.pages.page5.title);
  //    $('.DESCRIPTION_From').text(data.pages.page5.DESCRIPTION_From);
   //   $('.GENERAL_INFORMATION_SOURCES').text(data.pages.page5.GENERAL_INFORMATION_SOURCES);
    }
    //===============================/
   }); // get json
};




// Time
function getTime(item) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

    var time = hours +":"+ minutes;
    var date = day+"."+month+"."+year;
    var datetime = date+"&nbsp;&nbsp;&nbsp;"+time;

    if (item == 'time') { return time; }; // (15:24)
    if (item == 'date') { return date; };
    if (item == 'datetime') { return datetime; };
}
