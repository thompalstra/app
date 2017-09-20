var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {

        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#002c50");
        }


        app.scanner = scanner;
        app.scanner.register();

        app.database.prepare();
        app.database.open(function(){
            var transaction = app.database.db.transaction(['day'], "readwrite");
            var objectStore = transaction.objectStore('day');

            objectStore.clear();
            app.procedure.user();
        });
    },
    procedure: {
        user: function(){
            app.navigate.to('views/index.html');
        },
        guest: function(){
            app.navigate.to('views/login.html');
        }
    },
    sync: {
        start: function(callback){
            var date = new Date();
            var m = (date.getMonth() < 10) ? "0"+date.getMonth() : date.getMonth();
            var s = (date.getSeconds() < 10) ? "0"+date.getSeconds() : date.getSeconds();
            var m = (date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes();
            var h = (date.getHours() < 10) ? "0"+date.getHours() : date.getHours();
            var value = date.getDate()+"-"+m+"-"+date.getFullYear()+" "+h+":"+m+":"+s;

            localStorage.setItem('lastsync', value);

            if(cordova.exec){
                cordova.exec(function(){
                    // success
                    app.sync.perf(callback);
                }, function(){
                    // error
                    app.sync.perf(callback);
                }, "nzzPlugin", "showStartSyncToast", []);
            } else {
                app.sync.perf(callback);
            }



        },
        perf: function(callback){
            var transaction = app.database.db.transaction(['day'], "readwrite");
            var objectStore = transaction.objectStore('day');

            objectStore.clear();

            for(var i in data){
                if(i == 'length'){ continue; }
                Day.put({id: i, data: data[i]});
            }

            if(cordova.exec){
                cordova.exec(function(){
                    // success
                    callback.call(this, null);
                }, function(){
                    // error
                    callback.call(this, null);
                }, "nzzPlugin", "showEndSyncToast", []);
            } else {
                callback.call(this, null);
            }
        }
    },
    database: {
        version: 1,
        name: "MyDatabase",
        // storeName: "MyStore",
        db: null,
        prepare: function(){
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

            if (!window.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            }
        },
        open: function(callback){
            var request = window.indexedDB.open(app.database.name, app.database.version);
            request.onerror = function(event) {
            };
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                var objectStore = db.createObjectStore('day', { keyPath: "id" , autoIncrement: true});
                objectStore.createIndex("objIndex", ["id", "data"], { unique: false });
            };
            request.onsuccess = function(event) {
                app.database.db = event.target.result;
                app.database.db.onerror = function(event) {
                    alert("Database error: " + event.target.error.message);
                };
                callback();
            };
        }
    },
    timestamp: {

        months: {
            0: {'NL': 'January'},
            1: {'NL': 'Februari'},
            2: {'NL': 'Februari'},
            3: {'NL': 'Februari'},
            4: {'NL': 'Februari'},
            5: {'NL': 'Februari'},
            6: {'NL': 'Februari'},
            7: {'NL': 'Februari'},
            8: {'NL': 'Februari'},
            9: {'NL': 'Februari'},
            10: {'NL': 'Februari'},
            11: {'NL': 'Februari'}
        },
        days: {
            0: {'NL': 'Zondag'},
            1: {'NL': 'Maandag'},
            2: {'NL': 'Dinsdag'},
            3: {'NL': 'Woensdag'},
            4: {'NL': 'Donderdag'},
            5: {'NL': 'Vrijdag'},
            6: {'NL': 'Zaterdag'},
        },

        toDate: function(timestamp){
            timestamp = timestamp * 1000;

            // Maandag 25 Februari 2017
            var date = new Date(timestamp);
            var dayName = app.timestamp.days[date.getDay()][app.language];
            var dayNumber = date.getDate();
            var monthName = app.timestamp.months[date.getMonth()][app.language];
            var year = date.getFullYear();

            return dayName+' '+dayNumber+' '+monthName+' '+year;
        },
    },
    currentDay: null,
    language: 'NL',

    navigate: {
        history: [],
        timeout: null,
        to: function(url, callback){
            $('app view').load(url, function(e){
                if(typeof callback == 'function'){
                    callback.call(this, null);
                }
            });
        },
    },
};

app.initialize();


$(document).on('click', '[action="navigateBack"]', function(e){
    app.navigate.back();
});
$(document).on('click', '[action="viewDebtor"]', function(e){
    app.navigate.to('views/debtor/view.html', function(e){

    });
});
$(document).on('click', '[action="sync"]', function(e){
    $('item[action="sync"] > .icon').addClass('syncing');
    $('content')[0].innerHTML = '';
    setTimeout(function(e){
        app.sync.start(function(e){
            app.navigate.to('views/index.html');
        });
    }, 500);

});
$(document).on('click', '[action="viewAppointment"]', function(e){
    var day = $(this).attr('day');
    var appointment = $(this).attr('appointment');
    Day.find().findById(day, function(result){
        app.day = result;
        app.appointment = result.data[appointment];
        app.navigate.to('views/appointment/index.html');
    });
});

document.addEventListener('backbutton', function (evt) {
    app.navigate.back();
}, false);
