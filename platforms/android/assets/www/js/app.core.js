var app = {
    appointment: null,
    appointmentIndex: null,
    checkpoint: null,
    checkpointIndex: null,
    floorplan: null,
    floorplanIndex: null,
    user: null,
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

        if(device && device.available === true){
            if(device.platform == 'Android'){
                app.imei = device.uuid;
            } else if(device.platform == 'browser'){
                app.imei = 'browser';
            }
        }

        app.scanner = scanner;
        app.scanner.register();

        app.database.prepare();
        app.database.open(function(){
            setCategories();

            // read product categories
            function setCategories(){
                var c = new Category();
                app.categories = {};

                c.find().all(function(categoryList){
                    for(var categoryIndex in categoryList){
                        app.categories[categoryIndex] = categoryList[categoryIndex].data;
                    }
                    setProducts();
                });
            }

            // read products
            function setProducts(){
                var p = new Product();
                app.products = {};

                p.find().all(function(productList){
                    for(var productIndex in productList){
                        app.products[productIndex] = productList[productIndex].data;
                    }
                    finish();
                });
            }

            function finish(){
                app.user = new User();
                if(app.user.isGuest == true){
                    app.protocol.guest();
                } else {
                    app.protocol.user();
                }
            }
        });
    },
    log: function(str){
        console.log(str);
    },
    protocol: {
        user: function(){
            app.navigate.to('views/index.html');
        },
        guest: function(){
            app.navigate.to('views/login.html');
        },

    },
    image: {
        download: function(source, destination, successCallback, errorCallback){
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(source);
            var store = cordova.file.dataDirectory + "img/";
            var fileName = destination;
            window.resolveLocalFileSystemURL(store + fileName, exists, download);

            function download(){
                var fileTransfer = new FileTransfer();
                // console.log("About to start transfer from " + uri);
                fileTransfer.download(uri, store + fileName,
                    function(entry){
                        successCallback(entry)
                    },
                    function(error){
                        errorCallback(error)
                    },
                    true,{})

            }

            function exists(){
                alert("File eixsts!");
                errorCallback(true);
            }


        },
        delete: function(source){

        },
        deleteAll: function(folder, callback){
            app.log('attempting to delete ' + folder);
            var store = cordova.file.dataDirectory + folder;
            app.log('deleteing from path: ' + store);
            window.resolveLocalFileSystemURL(store, function(entry) {
                entry.removeRecursively(function(){
                    app.log('success! deleted: '+folder);
                    callback(this, null);
                }, function(){
                    app.log('error deleting ' + folder);
                    callback(this, null);
                });
            }, function(err){
                callback(this, null);
            });
        }
    },
    sync: {
        progressBar: {
            text: function(val){
                if(typeof val == 'undefined'){
                    return $('#sync-text').html();
                } else {
                    console.log(val);
                    $('#sync-text').html(val);
                }
            },
            max: function(val){
                if(typeof val == 'undefined'){
                    return $('#sync-progress').attr('max');
                } else {
                    $('#sync-progress').attr('max', val);
                }
            },
            min: function(val){
                if(typeof val == 'undefined'){
                    return $('#sync-progress').attr('min');
                } else {
                    $('#sync-progress').attr('min', val);
                }
            },
            value: function(val){
                if(typeof val == 'undefined'){
                    return $('#sync-progress').attr('value');
                } else {
                    $('#sync-progress').attr('value', val);
                }
            },
            increment: function(){
                var value = parseFloat($('#sync-progress').attr('value'));
                $('#sync-progress').val( ++value );
            },
        },
        ping: function(){
            var result = false;

            $.ajax({
                url: app.restClient.ping,
                dataType: 'json',
                success: function(resp){
                    if(resp.result === true){
                        if(resp.message === 'pong'){
                            result = true;
                        }
                    }
                },
                error: function(err){
                    result = false;
                },
                async: false
            });

            return result;
        },
        start: function(callback){
            if(app.sync.ping()){



                var date = new Date();
                var mo = ( (parseInt(date.getMonth()) + 1) < 10) ? "0"+(parseInt(date.getMonth()) + 1) : (parseInt(date.getMonth()) + 1);
                var s = (date.getSeconds() < 10) ? "0"+date.getSeconds() : date.getSeconds();
                var mi = (date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes();
                var h = (date.getHours() < 10) ? "0"+date.getHours() : date.getHours();
                var value = date.getDate()+"-"+mo+"-"+date.getFullYear()+" "+h+":"+mi+":"+s;

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
            } else {
                alert("Server onbereikbaar. Controleer internetverbinding.");
                callback.call(this, null);
            }
        },
        getFiles: function(){

            var files = [];

            var data = {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            };

            console.log(data);

            $.ajax({
                url: app.restClient.getFiles,
                method: 'POST',
                dataType: 'json',
                data: data,
                success: function(resp){
                    if(resp.result === true){
                        files = resp.data;
                    }
                },
                error: function(err){

                },
                async: false
            });

            return files;
        },
        perf: function(callback){
            var files = app.sync.getFiles();

            index = 0;

            app.sync.progressBar.min(0);
            app.sync.progressBar.max( files.length );
            app.sync.progressBar.value( index );



            app.image.deleteAll("img/", function(resp){
                getFile(index);
            });


            function getFile(index){
                if(index < files.length){

                    app.sync.progressBar.text( "Bestanden ophalen: (" + (index + 1) + "/" + app.sync.progressBar.max() + ")" );
                    app.sync.progressBar.increment();

                    app.image.download(
                        files[index].path,
                        files[index].name,
                    // success
                    function(result){
                        // index++;
                        if(index < files.length){
                            index++;

                            //setTimeout(function(e){
                                getFile(index);
                            //}, 2000);


                        } else {
                            getDays();
                        }
                    },
                    // error
                    function(error){
                        if(error != true){
                            console.log("Error getting file: " + files[index].name + " skipping...");
                        }
                        // index++;
                        if(index < files.length){
                            index++
                            //setTimeout(function(e){
                                getFile(index);
                            //}, 2000);
                        } else {
                            //setTimeout(function(e){
                                getDays();
                            //}, 2000);
                        }
                    });
                } else {
                    //setTimeout(function(e){
                        getDays();
                    //}, 2000);
                }

            }

            function getDays(i){
                app.sync.progressBar.min(0);
                app.sync.progressBar.max( data.length );
                app.sync.progressBar.value( 0 );


                var transaction = app.database.db.transaction(['day'], "readwrite");
                var objectStore = transaction.objectStore('day');

                objectStore.clear();

                var index = 0;
                d = new Day();
                data = d.sync();

                for(var i in data){
                    if(i == 'length'){ continue; }

                    app.sync.progressBar.text( "Jobs ophalen: (" + (index + 1) + "/" + app.sync.progressBar.max() + ")" );
                    app.sync.progressBar.increment();

                    var d = new Day();
                    index++;
                    d.put({id: i, data: data[i]});
                }

                var transaction = app.database.db.transaction(['comments'], "readwrite");
                var objectStore = transaction.objectStore('comments');

                objectStore.clear();

                app.sync.progressBar.min(0);
                app.sync.progressBar.max( 3 );
                app.sync.progressBar.value( 1 );
                app.sync.progressBar.text( "Opmerkingen ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                var c = new Comments();
                c.put({
                    id: 1,
                    data: c.sync()
                });
                app.sync.progressBar.increment();
                app.sync.progressBar.text( "Opmerkingen ophalen: (" + app.sync.progressBar.value()  + "/" + app.sync.progressBar.max() + ")" );

                var r = new Remarks();
                r.put({
                    id: 1,
                    data: r.sync()
                });

                app.sync.progressBar.text( "Product categorieën ophalen" );

                var transaction = app.database.db.transaction(['category'], "readwrite");
                var objectStore = transaction.objectStore('category');

                objectStore.clear();

                var c = new Category();
                var categories = c.sync();

                for(var i in categories){
                    var category = categories[i];
                    c.put({
                        id: i,
                        data: category
                    });
                }

                var transaction = app.database.db.transaction(['product'], "readwrite");
                var objectStore = transaction.objectStore('product');

                objectStore.clear();

                app.sync.progressBar.text( "Producten ophalen" );

                var p = new Product();
                var products = p.sync();

                for(var i in products){
                    var product = products[i];
                    p.put({
                        id: i,
                        data: product
                    });
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

                var objectStore = db.createObjectStore('product', { keyPath: "id" , autoIncrement: true});
                objectStore.createIndex("objIndex", ["id", "data"], { unique: false });

                var objectStore = db.createObjectStore('category', { keyPath: "id" , autoIncrement: true});
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
        validateAnswer: function(type, answer, question){
            question.errors = [];

            if( (answer == null || answer == "" || typeof answer == 'undefined' )  && question.is_required == true){
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
                        if(question.answer != undefined && question.answer != 'undefined'){
                            checked = (question.answer.includes(c) ? 'checked' : '');
                        }

                        str += "<div style='margin: 10px 0'>";
                        str += "<input id='question_"+subId+"' type='checkbox' value='" + c + "' name='question_" + questionIndex + "' "+checked+">";
                        str += "<label for='question_"+subId+"'>"+question.choices[c]+"</label>";
                        str += "</div>";

                        subId++;
                    }
                break;
                case app.const.type_yn:

                isTrue = (question.answer == 1 ? 'checked' : '');
                str += "<div style='margin: 10px 0'>";
                str += "<input id='question_"+questionIndex+"_1' type='radio' value='1' name='question_" + questionIndex + "' "+isTrue+" >"
                str += "<label for='question_"+questionIndex+"_1'>Ja</label>";
                str += "</div>";
                isFalse = (question.answer == 0 ? 'checked' : '');
                str += "<div style='margin: 10px 0'>";
                str += "<input id='question_"+questionIndex+"_0' type='radio' value='0' name='question_" + questionIndex + "' "+isFalse+">"
                str += "<label for='question_"+questionIndex+"_0'>Nee</label>";
                str += "</div>";

                break;
                case app.const.type_number:

                str += "<input class='input' type='number' name='question_" + questionIndex + "' value='"+question.answer+"'>";

                break;
                case app.const.type_text:

                var val = (question.answer == undefined || question.answer == 'undefined') ? "" : question.answer;
                str += "<input class='input' type='text' name='question_" + questionIndex + "' value='"+val+"'>";

                break;
                case app.const.type_product:

                str += "<select name='question_" + questionIndex + "' class='select'>";
                for(var i in question.products){
                    var name = "question_" + questionIndex;
                    var product = app.products[i];
                    var selected = (question.answer == i) ? 'selected' : '';
                    str += "<option value='" + i + "' "+selected+">" + product.name + "</option>";


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
        toggleRemark: function(e){
            $(this).html( ( $(this.parentNode.parentNode.parentNode).attr('toggled') == 'true' ) ? 'Verbergen' : 'Weergeven' );
            $(this.parentNode.parentNode.parentNode).attr('toggled', (  $(this.parentNode.parentNode.parentNode).attr('toggled') == 'true' ) ? 'false' : 'true' );
        },
        viewFloorplan: function(e){
            app.floorplanIndex = this.getAttribute('floorplan');
            app.floorplan = app.appointment.floorplan[app.floorplanIndex];
            app.navigate.to('views/floorplan/view.html', function(e){

            });
        },
        navigateBack: function(e){
            app.navigate.back();
        },
        viewDebtor: function(e){
            app.navigate.to('views/debtor/view.html', function(e){

            });
        },
        viewHome: function(e){
            $('app').removeClass('sync');
            app.navigate.to('views/index.html', function(e){

            });
        },
        sync: function(e){
            $('item[action="sync"] > .icon').addClass('syncing');
            $('.planning-list').html('');
            $('app').addClass('sync');
            setTimeout(function(e){
                app.sync.start(function(e){
                    $('.sync-container').removeClass('collapsed');
                    $('[action="sync"] > .icon').removeClass('syncing');
                    $('.sync-container').html( "<button class='btn btn-default success wide' action='viewHome'>opnieuw laden</button>" );
                });
            }, 500);
        },
        viewAppointment: function(e){
            var day = $(this).attr('day');
            var appointment = $(this).attr('appointment');
            var d = new Day();
            d.find().findById(day, function(result){
            // Day.find().findById(day, function(result){
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
                        if(spq.is_required === true && spq.answered !== true){
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
                        if(additionalQuestion.is_required == true && additionalQuestion.answered == true){

                        } else {
                            errors.push("Openstaande vraag: " + additionalQuestion.question);
                        }
                    }
                }
            }

            for(var checkpointIndex in appointment.checkpoints){
                var cp = appointment.checkpoints[checkpointIndex];

                if(cp.is_required == true && cp.unreachable == false){
                    for(var questionindex in cp.questions){
                        var question = cp.questions[questionindex];
                        if(question.is_required == true && question.answered == true){

                        } else {
                            errors.push("Openstaande vraag: " + question.question);
                        }
                    }
                }
            }

            if(errors.length == 0){
                app.navigate.to('views/signature/index.html', function(e){

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
                remark.is_completed = true;
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
                remark.is_completed = false;
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

                var customerFirstName = $('#customer-first-name').val();
                if(empty(customerFirstName)){
                    cancel = true;
                    alert("Klant voornaam mag niet leeg zijn");
                }

                var customerLastName = $('#customer-last-name').val();
                if(empty(customerLastName)){
                    cancel = true;
                    alert("Klant achternaam mag niet leeg zijn");
                }

                if(!cancel){
                    app.appointment.signatures.customer_first_name = customerFirstName;
                    app.appointment.signatures.customer_last_name = customerLastName;
                    app.appointment.signatures.customer = signaturePadCustomer.toData();
                    app.appointment.signatures.inspector = signaturePadInspector.toData();
                    app.appointment.completed = true;
                    app.day.update(function(e){
                        app.navigate.to('views/index.html', function(e){

                        });
                    });
                }
            }
        }
    },
    exceptions: {
        serverError: "Er ging iets mis. Probeer het opnieuw later en/of start de applicatie opnieuw",
    },
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
        type_id: $('.form-create-remark select[name="type_id"]').val(),
        is_private: $('.form-create-remark input[name="is_private"]').val() == "on" ? true : false,
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


    var question = app.appointment.service_types[serviceTypeIndex].additional_questions[questionIndex];

    app.question.answer(questionIndex, entries, question, function(){
        app.day.update(function(){
            var scrollTop = $('content')[0].scrollTop;
            app.navigate.to('views/installations/index.html', function(e){
                $('content')[0].scrollTop = scrollTop;
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
            var scrollTop = $('content')[0].scrollTop;
            app.navigate.to('views/checkpoints/view.html', function(e){
                $('content')[0].scrollTop = scrollTop;
            });
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



$(document).on('submit', '#form-login-form', function(e){

    e.preventDefault();

    $('#login-exception').addClass('hidden');
    $('#login-exception').html('');

    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();

    app.user.login(
        username,
        password,
        function(resp){
            if(resp.result === true){
                app.navigate.to('views/index.html', function(e){

                });
            } else if(resp.result === false){
                $('.exception').removeClass('hidden');
                $('.exception').html( resp.message );
            } else {
                app.notification.show(app.exceptions.serverError);
            }
        },
        function(){
            alert("Server onbereikbaar");
        }
    )
});
$(document).on('click', '[action]', function(e){
    var action = $(this).attr('action');

    if(app.actions[action]){
        app.actions[action].call(this, e);
    }
});

$(document).on('click', '#sync-toggler', function(e){
    $(this.parentNode).toggleClass('collapsed');
})
var baseUrl = "http://thom.at01.app.yii2.dev03.netzozeker.info";
// var baseUrl = "https://at01.app.yii2.projecten03.netzozeker.info";
// var baseUrl = "https://at01-acc.app.yii2.projecten03.netzozeker.info/";

app.restClient = {
    ping: baseUrl + '/ping',
    userLogin: baseUrl + '/user/login',
    userAuth: baseUrl + '/user/auth',

    getFiles: baseUrl + '/job/get-files',
    getComments: baseUrl + '/job/get-comments',
    getRemarks: baseUrl + '/job/get-remarks',
    getDays: baseUrl + '/job/get-jobs',
    getProducts: baseUrl + '/job/get-products',
    getCategories: baseUrl + '/job/get-categories'
};


$(document).on('change', '#default-remarks', function(e){
    // get opt
    var option = $(this).find(':selected');

    console.log(option);

    var actionee_id = $(option).attr('actionee_id');

    if(actionee_id){
        var group_id = $(option).attr('group_id');
        var type_id = $(option).attr('type_id');
        var name = $(option).attr('name');

        $('[name="actionee_id"]').val(actionee_id);
        $('[name="actionee_id"]').attr('disabled', '');
        $('[name="type_id"]').val(type_id);
        $('[name="type_id"]').attr('disabled', '');
        $('[name="group_id"]').val(group_id);
        $('[name="group_id"]').attr('disabled', '');
        $('[name="name"]').val(name);
        $('[name="name"]').attr('disabled', '');
    } else {
        $('[name="actionee_id"]').attr('disabled', false);
        $('[name="type_id"]').attr('disabled', false);
        $('[name="group_id"]').attr('disabled', false);
        $('[name="name"]').attr('disabled', false);
    }
});
// $(document).on('click', '.remark-list > li[toggled]:not(item)', function(e){
//     var remark = $(this).attr('remark');
//     var state = $('[remark="'+remark+'"]').attr('toggled');
//     if(state == 'true'){
//         $(this).attr('toggled', 'false');
//     } else {
//         $(this).attr('toggled', 'true');
//     }
// });
