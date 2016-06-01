
alight.ctrl.tripManager = function(sc, cd) {

    sc.ds = dataService;

    sc.trip = {};

    sc.trip.id = "";
    sc.trip.name = "";
    sc.trip.comment = "";
    sc.trip.audiocomment = "";
    sc.trip.closed = false;
    sc.trip.triplegs = [];

    //vars for tripplegs
    sc.from = "";
    sc.to = "";
    sc.dtfrom = getDateNow();
    sc.dtto = getDateNow();
    sc.cbfromru = false;
    sc.cbtoru = false;
    sc.triplegid = "";




    sc.selected = 0;//scope.ds.data.trips[scope.ds.data.currentTrip];
    sc.selectedTripleg= -1;
    sc.currentTripleg = {};


    sc.emptyTrip = function(){

        sc.trip = {};

        sc.trip.id = "";
        sc.trip.name = "";
        sc.trip.comment = "";
        sc.trip.audiocomment = "";
        sc.trip.audioUrl = "";
        sc.trip.closed = false;
        sc.trip.triplegs = [];

        //vars for tripplegs
        sc.from = "";
        sc.to = "";
        sc.dtfrom = getDateNow();
        sc.dtto = getDateNow();
        sc.cbfromru = false;
        sc.cbtoru = false;
        sc.triplegid = "";

        return sc.trip;

    };
    
     sc.recordTripAudioComment = function() {

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


    sc.init = function() {

        //3 state - add new, edit current, edit selected (corrected)
        //TODO check if trips is already loaded
        //load all trips
        sc.ds.loadTrips();

        //check if it loaded to edit
        //console.log("trip id " + sc.ds.currentTripIndex);
        sc.emptyTrip();
        if(sc.ds.currentTripIndex > -1) {

            sc.trip = sc.ds.data.trips[sc.ds.currentTripIndex];
            //clear flag for next action
            sc.ds.currentTripIndex = -1;

        } else {

            sc.ds.data.currentTripId = sc.ds.getDefaultTripId();
            if(sc.ds.data.currentTripId !="") {
                sc.trip = sc.ds.loadDefaultTrip();
            }
        }

        //show last tripleg
        if(sc.trip.triplegs.length > 0){

            //sc.selectedTripleg = sc.trip.triplegs.length - 1;
            //set zero for find solution how set any value
            sc.selectedTripleg = 0;
            sc.currentTripleg = sc.trip.triplegs[sc.selectedTripleg];
        }
        /*
         if(sc.trip.id == "") {
         sc.trip.id = sc.ds.genId();
         }
         */

        //console.log(sc.trip)
        sc.showTripleg();

        //console.log("+"+sc.trip.name+"+")


    };


    sc.deleteTripleg = function() {
        log("Current tripleg " + sc.selectedTripleg);
        //ask user to delete this tripleg
        if(sc.selectedTripleg > -1) {
            sc.trip.triplegs.splice(sc.selectedTripleg, 1);

            //update state

            sc.selectedTripleg = 0;
            ////fix redraw page without reloading
            sc.$scan();
            $("#triplegs").drum("updateData");
            $("#triplegs").drum("setIndex",sc.selectedTripleg);
            //empyt field for last deleted tripleg
            sc.ds.saveTrips();

        }

    };




    sc.changeTripleg = function(){
        //log("change tripleg");

        //scope.selectedTripleg = $$("triplegs").selectedIndex;
        //todo fix for ie where value is not working - get value from array by selectedIndex index
        sc.selectedTripleg = $$("#triplegs")[0].value;
        //console.log("hey,  mine was changed to ", scope.selectedTripleg);
        if(sc.selectedTripleg == -1) {
            sc.currentTripleg = {};
        } else {
            sc.currentTripleg = sc.trip.triplegs[sc.selectedTripleg];
        }

        sc.showTripleg();
    };

    //TODO check on mobile - possible is fastClick issue
    sc.showTripleg = function(){

        //log(sc.currentTripleg + " = " + sc.selectedTripleg);

        if(sc.currentTripleg && sc.selectedTripleg > -1) {
            sc.triplegid = sc.currentTripleg.id;
            sc.from = sc.currentTripleg.from;
            sc.to = sc.currentTripleg.to;
            sc.fromru = sc.currentTripleg.fromru;
            sc.dtfrom = sc.currentTripleg.dtfrom;
            sc.dtto = sc.currentTripleg.dtto;
            sc.toru = sc.currentTripleg.toru;
            sc.dtarrave = sc.currentTripleg.dtarrave;
            sc.endtripleg = sc.currentTripleg.end;
        } else {
            //new triplegs
            sc.triplegid = "";
            sc.from = "";
            sc.to = "";
            sc.fromru = false;
            sc.dtfrom = getDateNow();
            sc.dtto = getDateNow();
            sc.toru = false;
            sc.dtarrave = "";
            sc.endtripleg = false;

        }

    }

    sc.saveTrip = function() {

        this.saveCurrentTrip();
        // scope.ds.saveTrip();

    }

    sc.addBackToStart = function() {


        //try to store current tripleg to apply new
        //if(this.saveCurrentTripleg()) {
        if(true) {
            //log("stored tripleg");

            var last  = sc.trip.triplegs.length - 1;
            //show last tripleg in drum
            $("#triplegs").drum("setIndex",last);

            if(last > -1) {
                sc.triplegid = "";
                sc.from = sc.trip.triplegs[last].to;
                sc.fromru = sc.trip.triplegs[last].toru;
                sc.dtfrom = sc.trip.triplegs[last].dtfrom;
                sc.to = sc.trip.triplegs[0].from;
                sc.dtto = getDateNow();
                sc.toru = sc.trip.triplegs[0].fromru;
                sc.endtripleg = true;
                sc.dtarrave = "";
            }


        }


        //mainView.router.refreshPage();
    };


    sc.clearError = function(_id) {
        hideErrorField(_id);
    };

    sc.saveCurrentTripleg = function() {
        //check form data
        var dataCorrect = true;
        if(sc.from == "") {
            dataCorrect = false;
            showErrorField("#input-from");

        }

        if(sc.dtfrom == "") {
            dataCorrect = false;
            showErrorField("#input-dtfrom");
        }

        if(sc.to == "") {
            dataCorrect = false;
            showErrorField("#input-to");
        }

        if(sc.dtto == "") {
            dataCorrect = false;
            showErrorField("#input-dtto");
        }

        if(dataCorrect) {
            //store current tripleg

            //add new...
            //todo what about correct?
            console.log(sc.trip);
            if(sc.triplegid == "") {
                if(!Assigned(sc.trip.triplegs)) {
                    sc.trip.triplegs = [];
                }
                sc.trip.triplegs.push({
                    id: sc.ds.genId(),
                    from: sc.from,
                    to: sc.to,
                    dtfrom: sc.dtfrom,
                    dtto: sc.dtto,
                    fromru: sc.fromru,
                    toru: sc.toru,
                    dtarrave: sc.dtarrave,
                    end: sc.endtripleg

                });

                sc.selectedTripleg = sc.trip.triplegs.length - 1;
                ////fix redraw page without reloading
                sc.$scan();
                $("#triplegs").drum("updateData");
                $("#triplegs").drum("setIndex",sc.selectedTripleg);


            } else {
                //log("save edited tripleg");
                //get id for tirpleg
                var ind = this.trip.triplegs.indexOfValue("id", sc.triplegid);
                if(ind > -1) {
                    //this.triplegs[ind]
                    log("store new values");
                    this.trip.triplegs[ind].from = sc.from;
                    this.trip.triplegs[ind].dtfrom = sc.dtfrom;
                    this.trip.triplegs[ind].fromru = sc.fromru;
                    this.trip.triplegs[ind].to = sc.to;
                    this.trip.triplegs[ind].dtto = sc.dtto;
                    this.trip.triplegs[ind].toru = sc.toru;
                    this.trip.triplegs[ind].dtarrave = sc.dtarrave;
                    this.trip.triplegs[ind].end = sc.endtripleg;

                } else {
                    log("Error. Not found this tripleg");
                }

            }
            //make it current
            //do commit
            sc.ds.saveTrips();

        } else {
            //show error message for user
        }

        //return true if data was stored, false - if gotten error
        return dataCorrect;
    };

    sc.saveTripleg = function() {
        this.saveCurrentTripleg();
    }

    sc.saveCurrentTrip = function() {
        var dataCorrect = true;
        if(sc.trip.name == ""){
            dataCorrect = false;
            showErrorField("#input-tripname");
        }
        //console.log(sc.trip);
        if(dataCorrect){

            sc.ds.saveTrip(sc.trip);
            //set last edited and not closed trip as default (open to edit).
            if(!sc.trip.closed) {
                sc.ds.saveTripAsDefault(sc.trip);
            }
            //console.log(scope.ds.data.trips);

        }else{
            //show error
        }
    };

    sc.moreTriplegs = function() {

        //try to store current tripleg to apply new
        if(this.saveCurrentTripleg()) {
            //log("stored tripleg");

            var last  = sc.trip.triplegs.length - 1;
            //show last tripleg in drum
            $("#triplegs").drum("setIndex",last);

            if(last > -1) {
                sc.triplegid = "";
                sc.from = sc.trip.triplegs[last].to;
                sc.fromru = sc.trip.triplegs[last].toru;
                sc.dtfrom = sc.trip.triplegs[last].dtto;
                sc.to = "";
                sc.dtto = getDateNow();
                sc.toru = sc.fromru;
                sc.endtripleg = false;
                sc.dtarrave = "";

            }


        }

    }


} //end ctrl.tripManager

