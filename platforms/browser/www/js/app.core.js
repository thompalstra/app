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

            var transaction = app.database.db.transaction(['comments'], "readwrite");
            var objectStore = transaction.objectStore('comments');

            objectStore.clear();

            Comments.put({
                id: 1,
                data: availableComments
            });

            Remarks.put({
                id: 1,
                data: availableRemarks
            });

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

                var objectStore = db.createObjectStore('comments', { keyPath: "id" , autoIncrement: true});
                objectStore.createIndex("objIndex", ["id", "data"], { unique: false });

                var objectStore = db.createObjectStore('remarks', { keyPath: "id" , autoIncrement: true});
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
        answer: function(id, answer, question, callback){
            // var question = app.day['data'][app.appointmentIndex]['checkpoints'][app.checkpointIndex]['questions'][id];
            var type = question.type;

            var answer = (question.type == app.const.type_choice) ? answer : answer[0];

            if(app.question.validateAnswer(type, answer, question) == true){
                question.answer = answer;
                question.answered = true;

                app.appointment.completed = false;

                if(typeof callback == 'function'){
                    callback.call(this, null);
                }
            } else {
                var form = $('.question-form[question="'+id+'"]');

                $(form.parent()).addClass('error');
                var exp = form.find('.exception');
                exp.removeClass('hidden');


                var exception = question.errors.join("\n");

                exp.html( exception );
            }
        },
        validateAnswer(type, answer, question){
            question.errors = [];

            if( (answer == null || answer == "" || typeof answer == 'undefined' )  && question.required == true){
                question.errors.push("Antwoord mag niet leeg zijn!");
            }

            app.const.type_choice = 1;
            app.const.type_yn = 2;
            app.const.type_number = 3;
            app.const.type_text = 4;
            app.const.type_product = 5;

            switch(type){
                case app.const.type_choice:

                break;
                case app.const.type_yn:
                break;
                case app.const.type_number:
                    var min_value = question.hasOwnProperty('min_value') ? question.min_value : undefined;
                    var max_value = question.hasOwnProperty('max_value') ? question.max_value : undefined;

                    answer = parseInt(answer);

                    if( typeof min_value !== 'undefined' && answer < min_value ){
                        question.errors.push("Antwoord moet gelijk of meer zijn dan " + min_value);
                    }

                    if( typeof max_value !== 'undefined' && answer > max_value ){
                        question.errors.push("Antwoord moet gelijk of minder zijn dan " + max_value);
                    }

                break;
                case app.const.type_text:
                    // validate text
                    var min_value = question.hasOwnProperty('min_value') ? question.min_value : undefined;
                    var max_value = question.hasOwnProperty('max_value') ? question.max_value : undefined;
                    if( typeof min_value !== 'undefined' && answer.length < min_value ){
                        question.errors.push("Antwoord moet langer zijn dan " + min_value);
                    }

                    if( typeof max_value !== 'undefined' && answer.length > max_value ){
                        question.errors.push( "Antwoord moet korter zijn dan " + max_value);
                    }
                break;
                case app.const.type_product:

                break;
            };
            return (question.errors.length == 0) ? true : false;
        },
        createHTML: function(questionIndex, question){
            var type = question.type;
            var id = id;

            var str = "<form class='form question-form' question='"+questionIndex+"'>";
            str += "<div class='form-row question-row'>";
            str += "<h4>" + question.question + "</h4>";

            switch(type){
                case app.const.type_choice:

                    var subId = 0;

                    for(var c in question.choices){
                        var checked = '';
                        if(question.answer != undefined){
                            checked = (question.answer.includes(c) ? 'checked' : '');
                        }

                        str += "<div>";
                        str += "<input id='question_"+subId+"' type='checkbox' value='" + c + "' name='question_" + questionIndex + "' "+checked+">";
                        str += "<label for='question_"+subId+"'>"+question.choices[c]+"</label>";
                        str += "</div>";

                        subId++;
                    }
                break;
                case app.const.type_yn:

                isTrue = (question.answer == 1 ? 'checked' : '');
                str += "<div>";
                str += "<input id='question_"+questionIndex+"_1' type='radio' value='1' name='question_" + questionIndex + "' "+isTrue+" >"
                str += "<label for='question_"+questionIndex+"_1'>Ja</label>";
                str += "</div>";
                isFalse = (question.answer == 0 ? 'checked' : '');
                str += "<div>";
                str += "<input id='question_"+questionIndex+"_0' type='radio' value='0' name='question_" + questionIndex + "' "+isFalse+">"
                str += "<label for='question_"+questionIndex+"_0'>Nee</label>";
                str += "</div>";

                break;
                case app.const.type_number:

                str += "<input class='input' type='number' name='question_" + questionIndex + "' value='"+question.answer+"'>";

                break;
                case app.const.type_text:

                var val = (question.answer == undefined) ? "" : question.answer;
                str += "<input class='input' type='text' name='question_" + questionIndex + "' value='"+val+"'>";

                break;
                case app.const.type_product:

                str += "<select name='question_" + questionIndex + "' class='select'>";
                for(var i in question.products){
                    var selected = (question.answer == i) ? 'selected' : '';
                    str += "<option value='" + i + "' "+selected+">" + question.products[i] + "</option>";
                }
                str += "</select>";

                break;
            }
            str += "<button type='submit' class='btn btn-default wide action' mdot noselect>Beantwoorden</button>";
            str += "<label class='label label-default exception hidden'></label>"
            str += "</div>";
            str += "</form>";

            return str;
        }
    },
    actions: {
        navigateBack: function(e){
            app.navigate.back();
        },
        viewDebtor: function(e){
            app.navigate.to('views/debtor/view.html', function(e){

            });
        },
        sync: function(e){
            $('item[action="sync"] > .icon').addClass('syncing');
            $('.planning-list').html('');
            setTimeout(function(e){
                app.sync.start(function(e){
                    app.navigate.to('views/index.html');
                });
            }, 500);
        },
        viewAppointment: function(e){
            var day = $(this).attr('day');
            var appointment = $(this).attr('appointment');
            Day.find().findById(day, function(result){
                app.day = result;
                app.dayIndex = day;
                app.appointmentIndex = appointment;
                app.appointment = result.data[appointment];
                app.navigate.to('views/appointment/index.html');
            });
        },
        completeAppointment: function(e){
            var appointment = app.appointment;
            var join = [];
            var finished = true;
            for(var i in appointment.checkpoints){
                var sp = appointment.checkpoints[i];
                if(sp.unreachable == true){
                } else {
                    for(var q in sp.questions){
                        var spq = sp.questions[q];
                        if(spq.required === true && spq.answered !== true){
                            join.push(spq.question);
                            finished = false;
                        }
                    }
                }
            }
            if(finished){
                app.navigate.to('views/installations/index.html');
            } else {
                join = join.join('\n');
                alert('Er zijn nog openstaande vragen: \n' + join)
            }
        },
        viewCheckpoints: function(e){
            app.navigate.to('views/checkpoints/index.html');
        },
        viewCheckpoint: function(e){
            var checkpoint = $(this).attr('checkpoint');
            app.checkpoint = app.appointment.checkpoints[checkpoint];
            app.checkpointIndex = checkpoint;
            if(app.checkpoint){
                app.navigate.to('views/checkpoints/view.html');
            }
        },
        viewRemarks: function(e){
            app.navigate.to('views/remarks/index.html');
        },
        addRemark: function(e){
            app.navigate.to('views/remarks/create.html');
        },
        checkpointMarkUnreachable: function(e){
            if(confirm("Weet u zeker dat u dit punt wilt markeren als onbereikbaar?")){
                app.appointment.checkpoints[app.checkpointIndex].unreachable = true;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/index.html', function(e){

                    });
                });
            }
        },
        checkpointMarkReachable: function(e){
            if(confirm("Weet u zeker dat u dit punt wilt markeren als bereikbaar?")){
                app.appointment.checkpoints[app.checkpointIndex].unreachable = false;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/index.html', function(e){

                    });
                });
            }
        },
        checkpointEditName: function(e){
            var cp = app.appointment.checkpoints[app.checkpointIndex];
            var newname = prompt("Wijzigen naam: " + cp.name);
            if(newname){
                console.log(newname);
                cp.name = newname;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/view.html', function(e){

                    });
                });
            }
        },
        signAppointment: function(e){
            var appointment = app.appointment;

            var errors = [];

            for(var serviceTypeIndex in appointment.service_types){
                var st = appointment.service_types[serviceTypeIndex];

                if(st.state == null){
                    errors.push("Installatie " + st.name + " heeft geen status!");
                } else if(st.state == st.additional_questions.on){
                    for(var serviceTypeQuestionIndex in st.additional_questions.questions){
                        var additionalQuestion = st.additional_questions.questions[serviceTypeQuestionIndex];
                        if(additionalQuestion.required == true && additionalQuestion.answered == true){

                        } else {
                            errors.push("Openstaande vraag: " + additionalQuestion.question);
                        }
                    }
                }
            }

            for(var checkpointIndex in appointment.checkpoints){
                var cp = appointment.checkpoints[checkpointIndex];
                if(cp.unreachable == true){

                } else {
                    for(var questionindex in cp.questions){
                        var question = cp.questions[questionindex];
                        if(question.required == true && question.answered == true){

                        } else {
                            errors.push("Openstaande vraag: " + question.question);
                        }
                    }
                }
            }

            if(errors.length == 0){
                app.appointment.completed = true;
                app.day.update(function(e){
                    app.navigate.to('views/signature/index.html', function(e){

                    });
                });
            } else {
                alert(errors.join("\n"));
            }
        },
        moreShow: function(e){
            var list = $(this).find('.more-list');

            if(list.hasClass('hidden')){
                list.removeClass('hidden');
            } else {
                list.addClass('hidden');
            }
        },
        markRemarkComplete: function(e){
            var index = $(this).attr('remark');
            if(app.appointment.remarks[index]){
                var remark = app.appointment.remarks[index];
                remark.completed = true;
                app.day.update(function(e){
                    app.navigate.to('views/remarks/index.html', function(e){

                    });
                });
            }
        },
        markRemarkIncomplete: function(e){
            var index = $(this).attr('remark');
            if(app.appointment.remarks[index]){
                var remark = app.appointment.remarks[index];
                remark.completed = false;
                app.day.update(function(e){
                    app.navigate.to('views/remarks/index.html', function(e){

                    });
                });
            }
        },
        //https://github.com/szimek/signature_pad
        signatureReset: function(e){
            target = this.getAttribute('target');
            if(target == 'customer' && signaturePadCustomer){
                signaturePadCustomer.clear();
            } else {
                signaturePadInspector.clear();
            }
        },
        signatureSubmit: function(e){
            var cancel = false;
            if(signaturePadCustomer && signaturePadInspector){

                if(signaturePadCustomer.isEmpty()){
                    cancel = true;
                    alert("Klant handtekening mag niet leeg zijn!");
                }

                if(signaturePadInspector.isEmpty()){
                    cancel = true;
                    alert("Bestrijder handtekening mag niet leeg zijn");
                }

                if(!cancel){
                    app.appointment.signatures.customer = signaturePadCustomer.toData();
                    app.appointment.signatures.inspector = signaturePadInspector.toData();
                    app.day.update(function(e){
                        app.navigate.to('views/index.html', function(e){

                        });
                    });
                }
            }
            // if(signaturePad){
            //     if(!signaturePad.isEmpty()){
            //         app.appointment.signature = signaturePad.toData();
            //         app.day.update(function(e){
            //             app.navigate.to('views/index.html', function(e){
            //
            //             });
            //         });
            //     } else {
            //         alert("Handtekening mag niet leeg zijn!");
            //     }
            // }
        }
    }
};

app.initialize();

$(document).on('submit', '.form-create-remark', function(e){

    e.preventDefault();
    e.stopPropagation();

    var obj = {
        id: null,
        name: $('.form-create-remark textarea[name="name"]').val(),
        actionee_id: $('.form-create-remark select[name="actionee_id"]').val(),
        group_id: $('.form-create-remark select[name="group_id"]').val(),
        type_id: $('.form-create-remark select[name="type_id"]').val()
    };
    app.appointment.remarks.push(obj);
    app.day.update(function(){
        app.navigate.to('views/remarks/index.html', function(e){

        });
    });

});
$(document).on('submit', '.installation-list .question-list .question-form', function(e){

    e.preventDefault();
    e.stopPropagation();

    var questionIndex = this.getAttribute('question');

    var p = $($(this.parentNode.parentNode).prev());
    var on = $(this.parentNode.parentNode).attr('on');

    var serviceTypeIndex = $(this.parentNode.parentNode).attr('servicetype');

    var fd = new FormData( $('.question-list[servicetype="'+serviceTypeIndex+'"] form[question="'+questionIndex+'"]')[0] );
    var entries = fd.getAll('question_' + questionIndex);

    var question = app.appointment.service_types[serviceTypeIndex].additional_questions.questions[questionIndex];
    app.question.answer(questionIndex, entries, question, function(){
        app.day.update(function(){
            app.navigate.to('views/installations/index.html', function(e){
            });
        });
    });
});
$(document).on('submit', 'content > .question-list .question-form', function(e){

    e.preventDefault();
    e.stopPropagation();

    var questionIndex = this.getAttribute('question');

    var fd = new FormData( $('form[question="'+questionIndex+'"]')[0] );
    var entries = fd.getAll('question_' + questionIndex);
    var question = app.day['data'][app.appointmentIndex]['checkpoints'][app.checkpointIndex]['questions'][questionIndex];
    app.question.answer(questionIndex, entries, question, function(e){
        app.day.update(function(){
            app.navigate.to('views/checkpoints/view.html');
        });
    });
});
document.addEventListener('backbutton', function (evt) {
    app.navigate.back();
}, false);
$(document).on('submit', '#form-search-code', function(e){
    e.preventDefault();
    var searchValue = $('#form-search-code [name="value"]').val();

    $('.checkpoint-list li.item').each(function(i){
        var value = this.getAttribute('data-code');
        if(value.indexOf(searchValue) !== -1){
            $(this).removeClass('hidden');
        } else {
            $(this).addClass('hidden');
        }
    });

    if($('.checkpoint-list li.item.hidden').length == $('.checkpoint-list li.item').length){
        $('.checkpoint-list .no-results').removeClass('hidden');
    } else {
        $('.checkpoint-list .no-results').addClass('hidden');
    }
})
$(document).on('click', '.installation-list > li > label', function(e){
    var input = $($(this.parentNode).find('input:checked'));
    var value = input.val();
    var servicetype = $(this.parentNode).attr('servicetype');

    app.appointment.service_types[servicetype].state = value;
    app.day.update(function(e){
        app.navigate.to('views/installations/index.html', function(e){

        });
    });
});
$(document).on('mousedown touchstart', '[mdot]', function(e){
    var mdot = $(this).find('.mdot');
    if(mdot.length == 0){
        $(this).append( $('<span class="mdot"></span>') );
        mdot = $(this).find('.mdot');
    }

    var max = Math.max( $(this).height(), $(this).width() );

    var parentOffset = $(mdot).parent().offset();

    if(e.type === 'touchstart'){
        pageX = e.originalEvent.touches[0].pageX;
        pageY = e.originalEvent.touches[0].pageY;
    } else {
        pageX = e.pageX;
        pageY = e.pageY;
    }

    var relX = pageX - parentOffset.left - max / 2;
    var relY = pageY - parentOffset.top - max / 2;

    mdot.attr('style', "left: " + relX + "px; top: " + relY + "px; height: " + max + "px; width: " + max + "px;");

    mdot.removeClass('mousedown');
    mdot.removeClass('mouseup');
    mdot.removeClass('animate');

    setTimeout(function(e){
        mdot.addClass('animate');
        mdot.addClass('mousedown');
    }, 10);
});
$(document).on('mouseup touchend', '[mdot]', function(e){
    var mdot = $(this).find('.mdot');
    if(mdot.length > 0){
        mdot.css({
            opacity: mdot.css('opacity'),
            transform: "scale(" + mdot[0].getBoundingClientRect().width / mdot[0].offsetWidth + ")",
        });
        mdot.removeClass('mousedown');
        mdot.addClass('mouseup');
    }
});
$(document).on('click', '[action]', function(e){
    var action = $(this).attr('action');

    if(app.actions[action]){
        app.actions[action].call(this, e);
    }
});
