

alight.ctrl.paymentType = function(scope, cd) {
    scope.paytypes = [];
    scope.name = "paytype";

    scope.updateEnabled = function() {
        scope.update();
    }

    scope.updateChecked = function(index) {

        scope.update();
    }

    scope.init = function() {
        scope.newvalue = "";
    }

    scope.addnewvalue = function(keycode) {

        if (scope.newvalue && keycode == 13) {
            scope.paytypes.push({title: scope.newvalue, checked: true, whopay: 0});
            scope.update();
            scope.newvalue = '';

        }


    }

    scope.remove = function (i) {
        scope.paytypes.splice(i, 1);
        scope.update();
    };
    scope.update = function () {

        saveData(scope.name, scope.paytypes);
    };


    scope.paytypes = loadData(scope.name) || predefinedPaymentType;
    scope.update();


}


alight.ctrl.expCatProject = function(scope, cd) {
    scope.expcat = {};
    scope.name = "expcatpro";

    scope.updateEnabled = function() {
        scope.update();
    }

    scope.updateChecked = function(index) {

        scope.update();
    }

    scope.init = function() {
        scope.newvalue = "";
    }

    scope.addnewvalue = function(keycode) {

        if (scope.newvalue && keycode == 13) {
            scope.expcat.list.push({title: scope.newvalue, checked: true});
            scope.update();
            scope.newvalue = '';

        }


    }

    scope.remove = function (i) {
        scope.expcat.list.splice(i, 1);
        scope.update();
    };
    scope.update = function () {

        saveData(scope.name, scope.expcat);
    };
    scope.empty = function () {
        //destroy('list');
        //scope.list = [];
        //scope.update();
    };


    scope.expcat = loadData(scope.name) || predefinedExpCatProject;
    scope.update();


}

//
alight.ctrl.expCatBusiness = function(scope, cd) {

    scope.expcat = {};
    scope.name = "expcatbus";

    scope.updateEnabled = function() {
        log(scope.expcat.enabled);
        scope.update();
    }

    scope.updateChecked = function(index) {
        scope.update();
    }

    scope.init = function() {
        scope.newvalue = "";
    }

    scope.addnewvalue = function(keycode) {

        if (scope.newvalue && keycode == 13) {
            scope.expcat.list.push({title: scope.newvalue, checked: true});
            scope.update();
            scope.newvalue = '';

        }
    }

    scope.remove = function (i) {
        scope.expcat.list.splice(i, 1);
        scope.update();
    };
    scope.update = function () {
        saveData(scope.name, scope.expcat);
    };
    scope.empty = function () {
        //destroy('list');
        //scope.list = [];
        //scope.update();
    };


    scope.expcat = loadData(scope.name) || predefinedExpCatBusiness;
    scope.update();


}


alight.ctrl.expCatAcc = function(scope, cd) {
    scope.expcat = {};
    scope.name = "expcatacc";

    scope.updateEnabled = function() {
        log(scope.expcat.enabled);
        scope.update();
    }

    scope.updateChecked = function(index) {
        scope.update();
    }

    scope.init = function() {
        scope.newvalue = "";
    }

    scope.addnewvalue = function(keycode) {

        if (scope.newvalue && keycode == 13) {
            scope.expcat.list.push({title: scope.newvalue, checked: true});
            scope.update();
            scope.newvalue = '';

        }
    }

    scope.remove = function (i) {
        scope.expcat.list.splice(i, 1);
        scope.update();
    };
    scope.update = function () {

        saveData(scope.name, scope.expcat);
    };
    scope.empty = function () {
        //destroy('list');
        //scope.list = [];
        //scope.update();
    };

    scope.expcat = loadData(scope.name) || predefinedExpCatAcc;
    scope.update();


}


//manage currency list with 3 undeletable values
alight.ctrl.currencyList = function(ss, cd) {
    ss.currency = [];
    ss.name = "currency";
    ss.newvalue = "";

    ss.updateEnabled = function() {
        ss.update();
    };

    ss.updateChecked = function(index) {
        ss.update();
    }

    ss.init = function() {
        ss.newvalue = "";
    }

    ss.addnewvalue = function(keycode) {

        if (ss.newvalue && keycode == 13) {
            ss.currency.push({title: ss.newvalue, checked: true});
            ss.update();
            ss.newvalue = '';

        }
    }

    ss.remove = function (i) {
        ss.currency.splice(i, 1);
        ss.update();
    };
    ss.update = function () {

        saveData(ss.name, ss.currency);
    };

    ss.currency = loadData(ss.name) || predefinedCurrency;
    ss.update();


};

//control under per diem settings
alight.ctrl.perDiemSettings = function(ss, cd) {
    ss.useStandardDiems = true;

    ss.initPerDiemSettings = function () {
        var settings =  JSON.parse(localStorage.getItem("f7form-fr-per-diem-setting"));
        ss.useStandardDiems = settings["use-standard-diems"][0]=="on";
    };

};


