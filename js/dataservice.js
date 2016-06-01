//dataservice for finreport

//extends arrays
Array.prototype.indexOfValue = function (property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
}
//delete item from array if found its value
Array.prototype.deleteByValue = function (property, value) {
    var index = this.indexOfValue(property,value);
    if(index > -1) this.splice(index,1);
    return index;
}

//check is var is assigned
function Assigned(_val){
    return (typeof _val !== "undefinded" && _val);
}

dataService = {
    //data structure
    data: {
        trips:[],

        demotrips: [
                {
                    id: "2015-12-15 20:00",
                    name: "My first trip",
                    comment: "my comment 11111",
                    audiocomment: "voicecomment.arm",
                    closed: false,
                    triplegs:[
                        {   id:"2015-12-15 20:01",
                            from: "Moscow",
                            fromru: true,
                            dtfrom: "2015-12-15T20:01",
                            to: "Kostroma",
                            toru: true,
                            dtto: "2015-12-15T20:01",
                            end: false,
                            dtarrave: "2015-12-16T10:01"
                        },
                        {   id:"2015-12-16 20:01",
                            from: "Kostroma",
                            fromru: true,
                            dtfrom: "2015-12-16T20:01",
                            to: "Vladimir",
                            toru: true,
                            dtto: "2015-12-16T20:01",
                            end: false,
                            dtarrave: "2015-12-16T10:01"
                        }
                    ]

                },
                {
                    id: "2015-12-16 20:00",
                    name: "Second trip 2222",
                    comment: "my comment 2222",
                    audiocomment: "voicecomment.arm",
                    closed: true,
                    triplegs:[
                        {   id:"2015-12-15 20:01",
                            trip: "2015-12-15T20:00",
                            from: "Kostroma",
                            fromru: true,
                            dtfrom: "2015-12-15T20:01",
                            to: "Moscow",
                            toru: true,
                            dtto: "2015-12-15T20:01",
                            endtripleg: false,
                            dtarrave: "2015-12-16T10:01"
                        }
                    ]
                }
            ],

        expenses: [],

        currentTripId: "",
        trip:{},
        currentExpenseId: "",
        expense:{}
    },


    currentExpenseIndex: -1,
    currentTripIndex: -1,
    currentTripName:"",
    currentTripComment:"",
    selectedTrip: -1,
    tripAction: "new",
    expenseAction: "new",

    appPrefix: "fr-",

    //sem services move them to parent class
    init: function(_prefix) {
      this.appPrefix = _prefix;
    },
    loadData: function(_key) {
        { return JSON.parse(localStorage.getItem(this.appPrefix + _key)); }
    },
    saveData: function(_key, _obj) {
        localStorage.setItem(this.appPrefix + _key, JSON.stringify(_obj));
    },
    deleteData: function(_key) {
        { localStorage.removeItem(this.appPrefix + _key); }
    },
    genId: function(){
      return new Date().toISOString();//.replace("T"," "); //+ Math.random();
    },




    loadObj: function(_name, _id) {
        this.data[_name] = this.loadData(_name);
        if(Assigned(this.data[_name])) {
            var ind = this.data[_name].indexOfValue("id", _id);
            if (ind > -1) {
                return this.data[_name][ind];
            }
        }
        return {};
    },

    saveObj: function(_name, _obj) {
        var ind = -1;
        if(_obj){
            if(_obj.id) { //this is a new expense - gen id
                ind = this.data[_name].indexOfValue("id", _obj.id);
            } else { //save stored expense - find it before
                _obj.id = this.genId();
            }
            console.log(_name);
            console.log(this.data);
            if(ind > -1) {
                this.data[_name][ind] = _obj; //update element
            } else {

                this.data[_name].push(_obj); //add new element
            }

            this.saveData(_name, this.data[_name]);
            return 1;

        } else {
            return 0;
        }


    },

    //expenses function
    loadExpense: function(_id){
        if(Assigned(_id)) {
            return this.loadObj("expenses", _id) || {};
        } else {
            return {};
        }

    },

    saveExpense: function(_exp) {
        this.saveObj("expenses", _exp);
        
    },

    saveExpenses: function() {
        this.saveData("expenses", this.data.expenses);
    },

    loadExpenses: function() {
        this.data.expenses = this.loadData("expenses") || [];
    },

    //end expenses function


    //trip functions

    loadTrip: function(_id){
        if(Assigned(_id)) {
            return this.loadObj("trips", _id) || this.data.demotrips[0];
        } else {
            return {};
        }

    },

    saveTrip: function(_trip){
        this.saveObj("trips",_trip);
    },

    ////////////default trips methods
    saveTripAsDefault: function(_trip) {
        this.saveData("curtrip", _trip.id);
    },

    loadDefaultTrip: function(){
        //this.loadTrips(); //check if it required
        this.data.currentTripId = this.loadData("curtrip") || "";
        if(this.data.currentTripId !== ""){
            var ind = this.data.trips.indexOfValue("id",this.data.currentTripId);
            if(ind > -1) {
                return this.data.trips[ind];
            }
        }
        return {};
    },
    getDefaultTripId: function(){
        return this.data.currentTripId || this.loadData("curtrip");
    },
    clearDefaultTrip: function(){
        this.data.currentTripId = "";
        this.saveData("curtrip", this.data.currentTripId);
    },
    ////////////default trips methods
    //trips services
    addTrip: function(_id, _name, _comment) {
        this.data.trips.push({id:_id, name:_name, comment:_comment});
        this.saveTrips();
    },
    updateTrip: function(_id, _name, _comment) {
        var index = this.data.trips.indexOfValue("id",_id);
        if(index > -1 ) {
            this.data.trips[index] = {id:_id, name:_name, comment:_comment};
            this.saveTrips();
        }
    },
    deleteTrip: function(_trip){
        //find _id in the trips list to find index and save if real value was found
        if(this.data.trips.deleteByValue("id",_trip.id) > -1) {
            if(_trip.id == this.currentTripId) {
                this.currentTripId = "";
                this.currentTripName = "";
                this.currentTripComment = "";
            }
            this.saveTrips();
        }

    },

    loadTrips: function () {
        this.data.trips = this.loadData("trips") || [];

    },
    saveTrips: function () {
        saveData("trips", dataService.data.trips);
    }




}


