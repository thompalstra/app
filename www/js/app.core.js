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

        app.const.type_choice = 1;
        app.const.type_yn = 2;
        app.const.type_number = 3;
        app.const.type_text = 4;
        app.const.type_product = 5;


        app.scanner = scanner;
        app.scanner.register();

        app.database.prepare();
        app.database.open(function(){
            var transaction = app.database.db.transaction(['day'], "readwrite");
            var objectStore = transaction.objectStore('day');

            // objectStore.clear();
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
    const: {},
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

    question: {
        error: null,
        answer: function(id, answer){
            var question = app.day['data'][app.appointmentIndex]['checkpoints'][app.checkpointIndex]['questions'][id];
            var answerType = question.answerType;
            if(app.question.validateAnswer(answerType, answer) == true){
                question.answer = answer;
                question.answered = true;

                app.day.update(function(){
                    app.navigate.to('views/checkpoints/view.html');
                });
            } else {
                var form = $('.question-form[question="'+id+'"]');

                console.log(form);

                $(form.parent()).addClass('error');
                var exp = form.find('.exception');
                exp.removeClass('hidden');
                exp.html(app.question.error);
            }
        },
        validateAnswer(answerType, answer){
            switch(answerType){
                case app.const.type_text:
                    if(answer.length > 0){
                        return true;
                    } else {
                        app.question.error = "Antwoord mag niet leeg zijn";
                        return false;
                    }
                break;
            }

            return true;
        },
        createHTML: function(questionIndex, question){
            var answerType = question.answerType;
            var id = id;

            app.const.type_choice = 1;
            app.const.type_yn = 2;
            app.const.type_number = 3;
            app.const.type_text = 4;
            app.const.type_product = 5;

            var str = "<form class='form question-form' question='"+questionIndex+"'>";
            str += "<div class='form-row question-row'>";
            str += "<h4>" + question.question + "</h4>";

            switch(answerType){
                case app.const.type_choice:

                break;
                case app.const.type_yn:

                str += "<input type='radio' value='1' name=question_" + questionIndex + ">"
                str += "<label>Ja</label>";
                str += "<input type='radio' value='0' name=question_" + questionIndex + ">"
                str += "<label>Nee</label>";

                break;
                case app.const.type_number:

                break;
                case app.const.type_text:

                str += "<input class='input' type='text' name='question_" + questionIndex + "' value='"+question.answer+"'>";

                break;
                case app.const.type_product:

                break;
            }
            str += "<button type='submit' class='btn btn-default wide action'>Beantwoorden</button>";
            str += "<label class='label label-default exception hidden'></label>"
            str += "</div>";
            str += "</form>";

            return str;
        }
    }
};

app.initialize();

$(document).on('submit', '.question-form', function(e){

    e.preventDefault();

    var questionIndex = this.getAttribute('question');
    var fd = new FormData( this );
    fd.forEach(function(el){
          var answer = el;
    });

    app.question.answer(questionIndex, answer);
});


$(document).on('click', '[action="navigateBack"]', function(e){
    app.navigate.back();
});
$(document).on('click', '[action="viewDebtor"]', function(e){
    app.navigate.to('views/debtor/view.html', function(e){

    });
});
$(document).on('click', '[action="sync"]', function(e){
    $('item[action="sync"] > .icon').addClass('syncing');
    $('.planning-list').html('');
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
        app.dayIndex = day;
        app.appointmentIndex = appointment;
        app.appointment = result.data[appointment];
        app.navigate.to('views/appointment/index.html');
    });
});

$(document).on('click', '[action="viewCheckpoints"]', function(e){
    app.navigate.to('views/checkpoints/index.html');
});

$(document).on('click', '[action="viewCheckpoint"]', function(e){
    var checkpoint = $(this).attr('checkpoint');
    app.checkpoint = app.appointment.checkpoints[checkpoint];
    app.checkpointIndex = checkpoint;
    if(app.checkpoint){
        app.navigate.to('views/checkpoints/view.html');
    }
});

document.addEventListener('backbutton', function (evt) {
    app.navigate.back();
}, false);


$(document).on('click', '[action="completeAppointment"]', function(e){

    var appointment = app.appointment;

    var join = [];
    var finished = true;

    for(var i in appointment.checkpoints){
        var sp = appointment.checkpoints[i];
        for(var q in sp.questions){
            var spq = sp.questions[q];
            console.log( (spq.required === true && spq.answered !== true) )
            if(spq.required === true && spq.answered !== true){
                join.push(spq.question);
                finished = false;
            }
        }
    }

    if(finished){
        alert('COMPLETD');
    } else {
        join = join.join('\n');
        alert('Er zijn nog openstaande vragen: \n' + join)
    }
});
$(document).on('submit', '#form-search-code', function(e){
    e.preventDefault();
    var searchValue = $('#form-search-code [name="value"]').val();
    $('.checkpoint-list ul').each(function(i){
        var value = this.getAttribute('data-code');
        if(value.indexOf(searchValue) !== -1){
            $(this).removeClass('hidden');
        } else {
            $(this).addClass('hidden');
        }
    });
})
