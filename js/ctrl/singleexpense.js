
alight.ctrl.singleExpense = function(ss, cd) {



    //load drums content
    ss.expcatacc = loadData("expcatacc") || predefinedExpCatAcc;
    ss.expcatbus = loadData("expcatbus") || predefinedExpCatBusiness;
    ss.expcatpro = loadData("expcatpro") || predefinedExpCatProject;
    ss.paytypes = loadData("paytype") || predefinedPaymentType;

    ss.currency = loadData("currency") || predefinedCurrency;

    //console.log(scope.expcat.list);


    ss.ds = dataService; //define dataService
    ss.expense = {}; //get expense object

    //define expense fields
    ss.expense.id = "";
    ss.expense.imageUrl = "";
    ss.expense.images = [];
    ss.expense.audioUrl = "";
    ss.expense.datetime = "";
    ss.expense.paytype = "";
    ss.expense.expacc = "";
    ss.expense.expbus = "";
    ss.expense.exppro = "";
    ss.expense.trip ="";
    ss.expense.comment = "";
    ss.expense.amount = null;
    ss.expense.currency = getCurrentCurrency();//"rub"; //TODO get from settings
    //end expense fields

    ss.settings = {};
    ss.reportId = "123456";
    ss.emailTo = "";
    ss.emailCC = "";

    ss.paytype="";

    ss.opentrip = "";

    ss.attaches=[]; //store attaches here for report
    ss.previewAttaches = "";//string implementation for report preview

    ss.images = []; //empty list
    //["demo/demo1.jpg", "demo/demo2.jpg", "demo/demo3.jpg"];



    ss.fillTextArea = function(){
        myApp.resizeTextarea("#comment");
    }



    ss.init = function() {




        ss.settings =  JSON.parse(localStorage.getItem("f7form-fr-reporting-setup"));
        if(ss.settings) {
            ss.emailTo = ss.settings["email-1"] || "";
            ss.emailCC = ss.settings["email-2"] || "";
        }


        //log("id " + ss.ds.currentExpenseId);

        //default action - new, add new expense
        if(ss.ds.currentExpenseIndex < 0) {


            //gen it here or in save procedure
            //define id in the save procedure
            //ss.expense.id = ss.ds.genId();
            //ss.expense
            ss.expense.datetime = getDateNow();
            ss.expense.currency = getCurrentCurrency();
        } else {
            ss.ds.loadExpenses();
            ss.expense = ss.ds.data.expenses[ss.ds.currentExpenseIndex];
            //log("loaded" + dataService.currentExpenseIndex);
            //ss.paytype = ss.expense.paytype;
            ss.images = ss.expense.images || [];

        }

        //get a first value as initial value without checking is it enabled
        //TODO fix it

        if(ss.expense.paytype == "") {
            //TODO set as prefered payment type
            //ss.expense.paytype = ss.paytypes[0].title;
            ss.expense.paytype = null;
        }

        if(ss.expense.expacc == "") {
            //ss.expense.expacc = ss.expcatacc.list[0].title;
            ss.expense.expacc = null;
        }
        if(ss.expense.expbus == "") {
            //ss.expense.expbus = ss.expcatbus.list[0].title;
            ss.expense.expbus = null;
        }
        if(ss.expense.exppro == "") {
            //ss.expense.exppro = ss.expcatpro.list[0].title;
            ss.expense.exppro = null;
        }

        if(ss.expense.currency == "") {
            ss.expense.currency = getCurrentCurrency();//ss.currency[0].title;
        }

        // console.log(ss.expense.trip + "12313123")
        if(ss.expense.trip == "") {
            ss.expense.trip = null;
        }







        //for Trips drum
        ss.ds.loadTrips();


    };

    ss.setIndex = function(_name, _index) {

    };

    //
    ss.saveExpense = function(){


        //ss.expense.paytype =  updateDrumValue("#payment-type");
        //ss.expense.trip =  updateDrumValue("#opentrips"); //TODO check how it will works!
        // ss.expense.expacc =  updateDrumValue("#accounting-expense");
        //ss.expense.expbus =  updateDrumValue("#business-expense");
        //ss.expense.exppro =  updateDrumValue("#project-expense");
        //ss.expense.currency =  updateDrumValue("#currency");

        //log(ss.expense.currency);

        ss.expense.images = ss.images;
        //No clear expense to get report... or change working with report
        //ss.clearExpense();
        ss.ds.saveExpense(ss.expense);
        myApp.alert('Saved!');
        ss.clearExpense();
        mainView.router.reloadPage('tmpl/single_expense.html')

    };

    ss.clearExpense = function() {

        ss.expense = {}; //get expense object

        //define expense fields
        ss.expense.id = "";
        ss.expense.imageUrl = "";
        ss.expense.images = [];
        ss.expense.audioUrl = "";
        ss.expense.datetime = "";
        ss.expense.paytype = "";
        ss.expense.expacc = "";
        ss.expense.expbus = "";
        ss.expense.exppro = "";
        ss.expense.trip ="";
        ss.expense.comment = "";
        ss.expense.amount = null;
        ss.expense.currency = getCurrentCurrency();//"rub"; //TODO get from settings
        //end expense fields


        ss.paytype="";
        ss.opentrip = "";

        ss.attaches=[]; //store attaches here for report
        ss.previewAttaches = "";//string implementation for report preview

        ss.images = []; //empty list

    };


    ss.recordAudioComment = function() {

        var options = {
            limit: 1,
            duration: 10
        };

        if(typeof navigator.device !== "undefined") {
            if(typeof navigator.device.capture !== "undefined") {
                navigator.device.capture.captureAudio(onSuccess, onError, options);
            }
        }

        function onSuccess(mediaFiles) {
            var i, path, len;

            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                console.log(mediaFiles);
                ss.expense.audioUrl = path;
            }
        }


        function onError(error) {
            myApp.alert('Error code: ' + error.code, 'Capture Error');
        }

    }
    
    ss.recordTripAudioComment = function() {

        var options = {
            limit: 1,
            duration: 10
        };

        if(typeof navigator.device !== "undefined") {
            if(typeof navigator.device.capture !== "undefined") {
                navigator.device.capture.captureAudio(onSuccess, onError, options);
            }
        }

        function onSuccess(mediaFiles) {
            var i, path, len;

            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                console.log(mediaFiles);
                //ss.trip.audioUrl = path;
            }
        }


        function onError(error) {
            myApp.alert('Error code: ' + error.code, 'Capture Error');
        }

    }


    //remove just one image
    ss.removeImage = function(_index) {
        ss.images.splice(_index, 1);
        ss.$scan();

        //console.log(scope.images);

    }

    ss.addImage = function(_pathToImage) {
        ss.images.push(_pathToImage);
        ss.$scan();
    }



    ss.getPhoto = function(_sourceType) {
        //myApp.alert("Get Photo");
        if(navigator.camera) { //check camera plugin installed
            var sourceType;
            if (_sourceType == 0) { //get photo
                sourceType = Camera.PictureSourceType.CAMERA;
            } else { //get image from album
                sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            }
            navigator.camera.getPicture(function (imageUrl) {
                    //TODO check if it works anywhere!
                    //if(_sourceType == 0) scope.imageUrl = imageUrl
                    //else scope.imageUrl = imageUrl;
                    ss.addImage(imageUrl);
                },
                function (message) {
                    myApp.alert('Failed because: ' + message);},
                {
                    quality: 80, //TODO  make this parameter configurable
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: sourceType
                });


        } else {
            // myApp.alert("No camera plugin found");
            ss.addImage("demo/demo3.jpg");
            //console.log( ss.images);
        }
    }



    ss.sendSingleExpense = function() {

        if(!$$(".report-se-preview").hasClass("has-se-handler")) {
            $$(".report-se-preview").addClass("has-se-handler");
            $$(document).on("click",".report-se-preview", ss.genReportPreview);
        }

        if(!$$(".report-se-email").hasClass("has-se-handler")) {
            $$(".report-se-email").addClass("has-se-handler");
            $$(document).on("click",".report-se-email", ss.genReportEmail);
        }

        myApp.popover(".popover-se-report",".button-report");



    };

    ss.genReportEmail= function() {
        ss.genReport("email");
    }

    ss.genReportPreview =  function() {
        var item = $$(".send-from-preview");
        if(item.hasClass("report-email")){
            item.removeClass("report-email");
        }
        item.addClass("report-se-email");
        ss.genReport("preview");
    }



    ss.genReport = function(_target) {
        //save expense befor gen report
        ss.saveExpense();


        ss.reportSrc = "reports/single-expense.html"; //default report
        ss.reportName = "Single expense " + ss.expense.datetime;

        //clearr report attaches
        ss.attaches =  [];
        ss.previewAttaches = "";

        for(var i = 0; i < ss.images.length; i++) {
            ss.attaches.push(ss.images[i]);
        }

        if(ss.expense.audioUrl !== ""){
            ss.attaches.push(ss.expense.audioUrl);
        }

        if(_target == "preview") {
            for(var i = 0; i< ss.attaches.length; i++) {
                console.log("attach", ss.attaches[i]);
                ss.previewAttaches += ss.attaches[i] + "\n";
            }
        }
        //

        if(!ss.previewAttaches) {
            ss.previewAttaches = "";
        }

        //ss.previewAttaches = "";
        //console.log("preview attaches", ss.previewAttaches);

        $.get(ss.reportSrc, function(data){

            var div = document.createElement("div");

            div.innerHTML = data;
            alight.bootstrap(div, ss);
            //console.log(div.textContent);


            if(_target == "preview") {

                $$("#preview-content").html(div.textContent);
                myApp.popup(".popup-preview");
            }
            if(_target == "email") {
                //call global method to send report - report and transport as parameters

                //get emails to send
                var settings =  JSON.parse(localStorage.getItem("f7form-fr-reporting-setup"));
                var emailTo = "";
                var emailCC = "";
                if(settings) {
                    emailTo = settings["email-1"] || "";
                    emailCC = settings["email-2"] || "";
                }



                //sendReportdiv.textContent;
                sendReport({subject:ss.reportName,
                    body: div.textContent,
                    to:emailTo,
                    cc:emailCC,
                    attaches:ss.attaches
                }, "email");


            }


            div = null;
        });



    }








}
