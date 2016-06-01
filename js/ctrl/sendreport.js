
//controller for sendReport
alight.ctrl.sendReport = function(ss, el){

    ss.ds = dataService;
    ss.businessTripId = 0;
    ss.tripinfo = "";
    ss.currentTripIndex = 0;
    ss.reportSrc = ""; //default report

    ss.trip = {};
    ss.dtstart = "";
    ss.dtend = "";

    ss.report = "";
    ss.tripleg = {};

    ss.expenses = [];
    ss.expense = {};
    ss.currentExpenseId = "";
    ss.currentExpenseIndex = 0;


    ss.selectedExpenseIndex = 0;
    ss.selectedExpense = {}
    ss.selectedExpenseId = "";
    ss.expensecomment="";

    ss.attaches =  [];
    ss.previewAttaches = "";



    ss.typereport = "";
    ss.reportName = "";

    ss.init = function(){

        //ss.reportSrc = "reports/trip.html"; //default report
        ss.ds.loadTrips();
        ss.ds.loadExpenses();
        ss.currentTripIndex = 0;
        showTripInfo();
        $$("#tripinfo").trigger("change");

        ss.ds.loadExpenses();
        ss.selectedExpenseIndex = 0;
        ss.updateExpenseFields();



    };

    ss.changeExpense = function(){
        //sc.selectedExpenseIndex = $$("#expenses-correction")[0].value;
        console.log(ss.selectedExpenseId);
        ss.updateExpenseFields();

    };

    ss.updateExpenseFields = function(){
        //sc.selectedExpense = sc.ds.data.expenses[sc.selectedExpenseIndex] || {};
        var ind = ss.ds.data.expenses.indexOfValue("id", ss.selectedExpenseId);
        if(ind == -1) {
            ind = 0; //set first element
        }
        if(ind > -1) {
            ss.selectedExpenseIndex = ind;
            ss.selectedExpense = ss.ds.data.expenses[ind] || {};
            if (ss.selectedExpense) {
                ss.selectedExpenseId = ss.selectedExpense.id;
                //get extended expense info from template...

                ss.expensecomment = ss.selectedExpense.comment;
                $$("#expense-report").trigger("change");
            }
        }
    };


    ss.fltExpenses = function() {
        alert('processing!');
        ss.ds.data.fltExp = {};
        for (k in ss.ds.data.expenses) {
            ss.ds.data.fltExp[k] = ss.ds.data.expenses[k];
        }
    }



    ss.openReport = function(_type) {
        ss.typereport = _type;
        //get classname as source of evenent - expense or trip
        myApp.popover(".popover-report", "."+ss.typereport+"-icon");

    };

    //set handlers for report actions
    //turn off handler before set new to prevent multiple event firing.

    ss.genReportPreview = function() {
        var item = $$(".send-from-preview");
        if(item.hasClass("report-se-email")){
            item.removeClass("report-se-email");
        }
        item.addClass("report-email");
        ss.genReport("preview");
    }

    ss.genReportEmail = function(){
        ss.genReport("email");
    }

    //don't works...
    //$$(".report-preview").off("click", genReportPreview);
    if(!$$(".report-preview").hasClass("has-handler")) {
        $$(".report-preview").addClass("has-handler");
        $$(document).on("click",".report-preview",ss.genReportPreview);
    }

    if(!$$(".report-email").hasClass("has-handler")) {
        $$(".report-email").addClass("has-handler");
        $$(document).on("click",".report-email", ss.genReportEmail);
    }
    //send report from preview - email or show list of target types





    ss.genReport = function(_target) {



        //console.log(ss.typereport);
        if(ss.typereport == "trip") {

            ss.trip = ss.ds.data.trips[ss.currentTripIndex];
            if(Assigned(ss.trip)) {
                //calc start and end
                if (Assigned(ss.trip.triplegs)) {
                    for (var i = 0; i < ss.trip.triplegs.length; i++) {
                        ss.tripleg = ss.trip.triplegs[i];
                        //console.log(ss.trip.triplegs[i].dtfrom);
                        ss.tripleg.expenses = [];
                        for (var j = 0; j < ss.ds.data.expenses.length; j++) {
                            var expense = ss.ds.data.expenses[j];
                            if (ss.tripleg.dtfrom <= expense.datetime && expense.datetime <= ss.tripleg.dtto) {
                                //console.log(expense);
                                ss.tripleg.expenses.push(expense);

                            }

                        }


                    }
                }

                ss.reportName = "Trip " + ss.trip.name;
            }
            ss.reportSrc = "reports/trip.html"; //default report


        }

        if(ss.typereport == "expense") {

            ss.expense = ss.ds.data.expenses[ss.selectedExpenseIndex];

            //clearr report attaches
            ss.attaches =  [];
            ss.previewAttaches = "";
            //check if images exist
            if(Assigned(ss.expense.images)) {
                for (var i = 0; i < ss.expense.images.length; i++) {
                    ss.attaches.push(ss.expense.images[i]);
                }
            }

            if(ss.expense.audioUrl !== ""){
                ss.attaches.push(ss.expense.audioUrl);
            }

            if(_target == "preview") {
                for(var i = 0; i< ss.attaches.length; i++) {
                    //console.log("attach", ss.attaches[i]);
                    ss.previewAttaches += ss.attaches[i] + "\n";
                }
            }
            //

            if(!ss.previewAttaches) {
                ss.previewAttaches = "";
            }


            ss.reportSrc = "reports/expense.html"; //default report
            ss.reportName = "Expense report " + ss.expense.datetime;
        }

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
                    attaches:[]
                }, "email");


            }


            div = null;
        });



    }






    ss.sendReport = function(){
        ss.trip = ss.ds.data.trips[ss.currentTripIndex];

        //use innerHTML to get rendered content
        var report = $$("#report")[0].textContent;
        //console.log(report);


    };




    ss.changeTrip = function(){
        ss.currentTripIndex = $$("#business-trips")[0].value;
        showTripInfo();
        //log("index " + ss.currentTripIndex);
    };

    function showTripInfo() {
        ss.trip = ss.ds.data.trips[ss.currentTripIndex];

        if(Assigned(ss.trip)) {
            ss.tripinfo = ss.trip.name + "\n" + ss.trip.comment;
            //console.log(ss.tripinfo);
            //update text area
            //$$("#tripinfo").trigger("change");
            myApp.resizeTextarea("#tripinfo");
        }
    }

}; //ctrl.sendReport

alight.filters.tripexists = (function() {
  function JD() {}

  JD.prototype.watchMode = 'deep';

  JD.prototype.onChange = function(value) {
    //alert(value);
    vd = new Array();
    for (k in value) {
      if(value[k].trip === null) {
          vd.push(value[k]);
      }
    }
    
    return this.setValue(vd);
  };

  return JD;

})();