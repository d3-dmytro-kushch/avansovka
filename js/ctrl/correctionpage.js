
alight.ctrl.correctionPage = function(sc, cd) {

    sc.ds = dataService;
    sc.tripcomment = "";
    sc.tripclosed = false;
    sc.selectedTripId = "";
    sc.selectedTrip = {};
    sc.selectedTripIndex = 0;

    //scope.ds.currentTrip = 0;
    sc.selected = 0;//scope.ds.data.trips[scope.ds.data.currentTrip];

    sc.selectedExpenseIndex = 0;
    sc.selectedExpense = {}
    sc.selectedExpenseId = "";
    sc.expensecomment="";




    sc.init = function() {
        sc.ds.loadExpenses();
        sc.selectedExpenseIndex = 0;
        sc.updateExpenseFields();

        sc.ds.loadTrips();
        sc.selectedTripIndex = 0;
        updateTripFields();

        //console.log(scope.ds.data.trips);

    };

    sc.changeExpense = function(){
        //sc.selectedExpenseIndex = $$("#expenses-correction")[0].value;
        console.log(sc.selectedExpenseId);
        sc.updateExpenseFields();

    };

    sc.updateExpenseFields = function(){
        //sc.selectedExpense = sc.ds.data.expenses[sc.selectedExpenseIndex] || {};
        var ind = sc.ds.data.expenses.indexOfValue("id", sc.selectedExpenseId);
        if(ind == -1) {
            ind = 0; //set first element
        }
        if(ind > -1) {
            sc.selectedExpenseIndex = ind;
            sc.selectedExpense = sc.ds.data.expenses[ind] || {};
            if (sc.selectedExpense) {
                sc.selectedExpenseId = sc.selectedExpense.id;
                //get extended expense info from template...

                sc.expensecomment = sc.selectedExpense.comment;
                $$("#expense-comment").trigger("change");
            }
        }
    };

    sc.editExpense = function() {
        sc.ds.currentExpenseIndex = sc.selectedExpenseIndex;
        mainView.router.load({url:"tmpl/single_expense.html"});
    };


    sc.changeTrip = function(){
        sc.selectedTripIndex = $$("#trips-correction")[0].value;
        updateTripFields();
    };

    function updateTripFields(){
        sc.selectedTrip = sc.ds.data.trips[sc.selectedTripIndex];
        //log(scope.selectedTripIndex);
        if(Assigned(sc.selectedTrip)) {
            sc.selectedTripId = sc.selectedTrip.id;
            sc.tripcomment = sc.selectedTrip.comment;
            sc.tripclosed = sc.selectedTrip.closed;
        }
    }

    sc.editTrip = function() {
        sc.ds.currentTripIndex = sc.selectedTripIndex;
        mainView.router.load({url:"tmpl/trip_manager.html"});
    };

    sc.deleteTrip = function() {

        sc.selectedTrip = sc.ds.data.trips[sc.selectedTripIndex];

        if(sc.selectedTrip.id == sc.ds.getDefaultTripId()) {
            sc.ds.clearDefaultTrip();
        }

        sc.ds.deleteTrip(sc.selectedTrip);

        sc.selectedTripIndex = 0;
        //update drum
        $("#trips-correction").drum("setIndex", sc.selectedTripIndex);
        $("#trips-correction").drum("updateData");






    };


    sc.closeTrip = function() {
        //TODO make it opened???
        sc.selectedTrip = sc.ds.data.trips[sc.selectedTripIndex];
        sc.selectedTrip.closed = true;
        //save selected trip
        sc.ds.saveTrip(sc.selectedTrip);

        //if it current trip - clear it to start new trip
        //log("CLEAR DEFAULT TRIP " + sc.selectedTrip.id+" =="+ sc.ds.getDefaultTripId());
        if(sc.selectedTrip.id == sc.ds.getDefaultTripId()) {


            sc.ds.clearDefaultTrip();

        }




    };




}