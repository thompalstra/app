var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        app.scanner = scanner;
        app.scanner.register();

        app.database.prepare();
        app.database.open(function(){
            app.sync.start(function(){
                app.procedure.user();
            });
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

            var transaction = app.database.db.transaction(['day'], "readwrite");
            var objectStore = transaction.objectStore('day');

            objectStore.clear()

            for(var i in data){
                if(i == 'length'){ continue; }
                Day.put({id: i, data: data[i]});
            }

            callback.call(this, null);
        },
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
        toDate: function(timestamp){
            timestamp = timestamp * 1000;
            var todate=new Date(timestamp).getDate();
            var tomonth=new Date(timestamp).getMonth()+1;
            var toyear=new Date(timestamp).getFullYear();
            return tomonth+' '+todate+' '+toyear;
        },
    },
    currentDay: null,

    navigate: {
        history: [],
        to: function(url, callback){
            if(app.navigate.history.length >= 5){
                app.navigate.history.splice(1, 1);
            }
            app.navigate.history.push(url);

            console.log(app.navigate.history);

            $('app view').load(url, function(e){
                if(typeof callback == 'function'){
                    callback.call(this, null);
                }
            });
        },
        back: function(callback){
            if(app.navigate.history.length >= 1){
                app.navigate.history.pop();
                var length = app.navigate.history.length - 1;
                lastUrl = app.navigate.history[length];
                console.log('last url: ' + lastUrl);
                $('app view').load(lastUrl, function(e){
                    if(typeof callback == 'function'){
                        callback.call(this, null);
                    }
                });
            }
        },
    },
};

app.initialize();


$(document).on('click', '[action="navigateBack"]', function(e){
    app.navigate.back();
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
