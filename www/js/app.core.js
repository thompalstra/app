var PRIO_JOB_REGULAR = 1;
var PRIO_JOB_NUISANCE = 2;
var PRIO_JOB_REGULAR_RISK = 3;
var PRIO_JOB_REGULAR_NUISANCE = 4;

var QUESTION_TYPE_CHOICE = 1;
var QUESTION_TYPE_YN = 2;
var QUESTION_TYPE_NUMBER = 3;
var QUESTION_TYPE_TEXT = 4;
var QUESTION_TYPE_PRODUCT = 5;

$.fn.sort_select_box = function(){
    var my_options = $("#" + this.attr('id') + ' option');
    my_options.sort(function(a,b) {
        if (a.text > b.text) return 1;
        else if (a.text < b.text) return -1;
        else return 0
    })
   return my_options;
}

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

        app.const.prio_job = {
            1: 'Regulier',
            2: 'Overlast',
            3: 'Regulier + Risico',
            4: 'Regulier + Overlast'
        };
        app.const.states = {
            1: 'Overlast',
            2: 'Risico',
            3: 'Geen overlast'
        };

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

            app.setCategories(function(e){
                app.setProducts(function(e){
                    app.setCheckpointTypes(function(e){
                        app.finish();
                    });
                })
            });

        });
    },
    handleError: function(error){
        switch(error.status){
            case 401:
                alert("U bent niet bevoegd deze actie uit te voeren. U wordt teruggestuurd naar het login scherm.");
                localStorage.removeItem('imei');
                localStorage.removeItem('token');
                localStorage.removeItem('inspector_id');
                localStorage.removeItem('name');
                return app.protocol.guest();
            break;
            case 403:
                alert("U probeert gegevens op te halen zonder gebruikersgegevens. Uw sessie wordt beëindigd.");
                localStorage.removeItem('imei');
                localStorage.removeItem('token');
                localStorage.removeItem('inspector_id');
                localStorage.removeItem('name');
                return app.protocol.guest();
            break;
        }
    },
    setCategories: function(callback){
        var c = new Category();
        app.categories = {};

        c.find().all(function(categoryList){
            for(var categoryIndex in categoryList){
                var category = categoryList[categoryIndex];
                app.categories[category.id] = category.data;
            }
            callback.call(this, null);
            // setProducts();
        });
    },
    setProducts: function(callback){
        var p = new Product();
        app.products = {};
        p.find().all(function(productList){
            for(var productIndex in productList){
                var product = productList[productIndex];
                app.products[product.id] = product.data;
            }
            callback.call(this, null);
        });
    },
    setCheckpointTypes: function(callback){
        var ct = new window['CheckpointType'];
        app.checkpointTypes = {};
        ct.find().all(function(checkpointTypeList){
            for(var checkpointTypeIndex in checkpointTypeList){
                var checkpointType = checkpointTypeList[checkpointTypeIndex];
                app.checkpointTypes[checkpointType.id] = checkpointType.data;
            }
            callback.call(this, null);
        });
    },
    finish: function(){
        app.user = new User();

        setTimeout( function(e){
            if( (splash = document.querySelector('splash')) ){
                splash.remove();
            }

            if(app.user.isGuest == true){
                app.protocol.guest();
            } else {
                app.protocol.user();
            }
        }, 1000 );
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
                // xhrFields: {
                //     withCredentials: true
                // },
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
                    return app.handleError(err);
                },
                async: false
            });

            return files;
        },
        perf: function(callback){
            index = 0;

            app.sync.progressBar.min(0);
            app.sync.progressBar.max(7);
            app.sync.progressBar.value(0);

            putDays();

            // 1
            function putDays(){
                app.sync.progressBar.value(0);
                app.sync.progressBar.text( "Jobs versturen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                var d = new Day();
                d.find().all(function(request){

                    var success = function(result){
                        //setTimeout(function(e){
                            getDays();
                        //}, 500);
                    }

                    var error = function(result){
                        // setTimeout(function(e){
                            // getDays();
                        // }, 500);
                    }
                    d.send(request, success, error);
                });
            }
            // 2
            function getDays(){
                // days - 1
                app.sync.progressBar.value( 1 );
                app.sync.progressBar.text( "Jobs ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                window.setTimeout(function(e){
                    var transaction = app.database.db.transaction(['day'], "readwrite");
                    var objectStore = transaction.objectStore('day');

                    objectStore.clear();

                    var index = 0;
                    d = new Day();
                    days = d.sync();

                    if(days !== false){
                        for(var i in days){
                            if(i == 'length'){ continue; }
                            var d = new Day();
                            index++;
                            d.put({id: i, data: days[i]});
                        }
                        //setTimeout(function(e){
                            getRemarks();
                        //}, 500);
                    }
                }, 10);


            }
            // 3
            function getRemarks(){
                app.sync.progressBar.value( 3 );
                app.sync.progressBar.text( "Opmerkingen ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                window.setTimeout(function(e){
                    var transaction = app.database.db.transaction(['comments'], "readwrite");
                    var objectStore = transaction.objectStore('comments');

                    objectStore.clear();

                    var c = new Comments();
                    c.put({
                        id: 1,
                        data: c.sync()
                    });

                    var transaction = app.database.db.transaction(['remarks'], "readwrite");
                    var objectStore = transaction.objectStore('remarks');

                    objectStore.clear();

                    var r = new Remarks();
                    r.put({
                        id: 1,
                        data: r.sync()
                    });
                    // setTimeout(function(e){
                        getServiceTypes();
                    // }, 500);
                }, 10);
            }
            // 4
            function getServiceTypes(){
                app.sync.progressBar.value( 4 );
                app.sync.progressBar.text( "Controlepunttypes ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                window.setTimeout(function(e){
                    var transaction = app.database.db.transaction(['checkpointtype'], "readwrite");
                    var objectStore = transaction.objectStore('checkpointtype');

                    objectStore.clear();

                    var ct = new window['CheckpointType']();
                    var CheckpointTypes = ct.sync();

                    if(CheckpointTypes !== false){
                        for(var i in CheckpointTypes){
                            var CheckpointType = CheckpointTypes[i];
                            ct.put({
                                id: i,
                                data: CheckpointType
                            });
                        }
                        // setTimeout(function(e){
                            getProductCategories();
                        // }, 500);
                    }
                }, 10);

            }
            // 5
            function getProductCategories(){
                app.sync.progressBar.value( 5 );
                app.sync.progressBar.text( "Product categorieën ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                window.setTimeout(function(e){
                    var transaction = app.database.db.transaction(['category'], "readwrite");
                    var objectStore = transaction.objectStore('category');

                    objectStore.clear();

                    var c = new Category();
                    var categories = c.sync();

                    if(categories !== false){
                        for(var i in categories){
                            var category = categories[i];
                            c.put({
                                id: i,
                                data: category
                            });
                        }
                        // setTimeout(function(e){
                            getProducts();
                        // }, 500);
                    }
                }, 10);
            }
            // 6
            function getProducts(){
                app.sync.progressBar.value( 6 );
                app.sync.progressBar.text( "Producten ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                window.setTimeout(function(e){
                    var transaction = app.database.db.transaction(['product'], "readwrite");
                    var objectStore = transaction.objectStore('product');

                    objectStore.clear();

                    var p = new Product();
                    var products = p.sync();

                    if(products !== false){
                        for(var i in products){
                            var product = products[i];
                            p.put({
                                id: i,
                                data: product
                            });
                        }
                        // setTimeout(function(e){
                            end();
                        // }, 500);
                    }
                }, 10);
            }
            // complete
            function end(){
                app.sync.progressBar.value( 7 );
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

                var objectStore = db.createObjectStore('checkpointtype', { keyPath: "id" , autoIncrement: true});
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
            0: {'NL': 'Januari'},
            1: {'NL': 'Februari'},
            2: {'NL': 'Maart'},
            3: {'NL': 'April'},
            4: {'NL': 'Mei'},
            5: {'NL': 'Juni'},
            6: {'NL': 'Juli'},
            7: {'NL': 'Augustus'},
            8: {'NL': 'September'},
            9: {'NL': 'Oktober'},
            10: {'NL': 'November'},
            11: {'NL': 'December'}
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
            question.answered = false;
            var type = question.type;

            var answer = (question.type == QUESTION_TYPE_CHOICE || question.type == QUESTION_TYPE_PRODUCT) ? answer : answer[0];

            if(app.question.validateAnswer(type, answer, question) == true){
                question.answer = answer;
                question.answered = true;

                app.appointment.completed = 0;

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

            QUESTION_TYPE_CHOICE = 1;
            QUESTION_TYPE_YN = 2;
            QUESTION_TYPE_NUMBER = 3;
            QUESTION_TYPE_TEXT = 4;
            QUESTION_TYPE_PRODUCT = 5;

            switch(type){
                case QUESTION_TYPE_CHOICE:

                break;
                case QUESTION_TYPE_YN:
                break;
                case QUESTION_TYPE_NUMBER:
                    var min_value = question.hasOwnProperty('min_value') ? question.min_value : undefined;
                    var max_value = question.hasOwnProperty('max_value') ? question.max_value : undefined;

                    answer = parseInt(answer);



                    if( typeof min_value !== 'undefined' && answer < min_value ){
                        question.errors.push("Antwoord moet gelijk of meer zijn dan " + min_value);
                    }

                    if( typeof max_value !== 'undefined' && ( max_value > 0 ) && ( answer > max_value ) ){
                        alert( question.max_value_warning );
                        // question.errors.push("Antwoord moet gelijk of minder zijn dan " + max_value);
                    }

                break;
                case QUESTION_TYPE_TEXT:
                    // validate text
                    // var min_value = question.hasOwnProperty('min_value') ? question.min_value : undefined;
                    // var max_value = question.hasOwnProperty('max_value') ? question.max_value : undefined;
                    //
                    // if( typeof min_value !== 'undefined' && answer.length < min_value ){
                    //     question.errors.push("Antwoord moet langer zijn dan " + min_value);
                    // }
                    //
                    // if( typeof max_value !== 'undefined' && answer.length > max_value ){
                    //     question.errors.push( "Antwoord moet korter zijn dan " + max_value);
                    // }
                break;
                case QUESTION_TYPE_PRODUCT:
                    var productId = parseFloat( answer[0] );
                    var productAmount = ( answer[1] == "" || isNaN(answer[1]) ) ? 0 : parseFloat( answer[1] );
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
                case QUESTION_TYPE_CHOICE:

                    var subId = 0;

                    for(var c in question.choices){
                        var checked = '';
                        if(question.answer != undefined && question.answer != 'undefined'){
                            if(Array.isArray( question.answer )){
                                for(var i in question.answer){
                                    if( question.answer[i] == c ){
                                        checked = 'checked';
                                    }
                                }
                            }
                            // checked = (question.answer.includes(c) ? 'checked' : '');
                        }

                        str += "<div style='margin: 10px 0'>";
                        // str += "<input id='question_"+subId+"_"+questionIndex+"' type='checkbox' value='" + c + "' name='question_" + questionIndex + "' "+checked+">";
                        str += "<input id='question_"+subId+"_"+questionIndex+"' type='radio' value='" + c + "' name='question_" + questionIndex + "' "+checked+">";
                        str += "<label for='question_"+subId+"_"+questionIndex+"'>"+question.choices[c]+"</label>";
                        str += "</div>";

                        subId++;
                    }
                break;
                case QUESTION_TYPE_YN:
                for(var i in question.choices){
                    // isFalse = (question.answer == 0 ? 'checked' : '');
                    isChecked = question.answer == i ? 'checked' : '';
                    str += "<div style='margin: 10px 0'>";
                    str += "<input id='question_"+questionIndex+"_"+i+"' type='radio' value='"+i+"' name='question_" + questionIndex + "' "+isChecked+">"
                    str += "<label for='question_"+questionIndex+"_"+i+"'>"+question.choices[i]+"</label>";
                    str += "</div>";
                }

                break;
                case QUESTION_TYPE_NUMBER:

                str += "<input class='input' type='number' name='question_" + questionIndex + "' value='"+question.answer+"'>";

                break;
                case QUESTION_TYPE_TEXT:

                var val = (question.answer == undefined || question.answer == 'undefined') ? "" : question.answer;
                str += "<input class='input' type='text' name='question_" + questionIndex + "' value='"+val+"'>";

                break;
                case QUESTION_TYPE_PRODUCT:

                str += "<select name='question_" + questionIndex + "' class='select'>";

                if(question.products.length > 0){
                    var products = [];

                    for(var i in question.products){
                        var id = question.products[i];
                        var product = app.products[ id ];
                        if( product ){
                            products.push({
                                name: product.name,
                                id: id
                            });
                        }
                    }

                    products.sort(function(a, b){
                        if(a.name < b.name) return -1;
                        if(a.name > b.name) return 1;
                        return 0;
                    });

                    for(var i in products){

                        var id = products[i].id;
                        var product = app.products[id];

                        var name = "question_" + questionIndex;
                        var selected = "";
                        if(Array.isArray( question.answer )){
                            var selected = (question.answer[0] == id) ? 'selected' : '';
                        }

                        str += "<option value='" + id + "' "+selected+">" + product.name + "</option>";
                    }
                } else {
                    str += "<option value='null'>Geen producten beschikbaar</option>";
                }



                str += "</select>";
                var value = 0;
                if(Array.isArray( question.answer )){
                    value = question.answer[1];
                }
                if(question.products.length > 0){
                    str += "<input name='question_" + questionIndex + "' type='number' min='0' max='999' value='"+value+"' class='input input-default' />";
                } else {
                    str += "<input name='question_" + questionIndex + "' type='hidden' value='1'/>";
                }

                break;
            }

            if(app.appointment.sync == true || app.appointment.complete == false){
                str += "<button type='submit' class='btn btn-default wide action' mdot noselect>Beantwoorden</button>";
            }

            str += "<label class='label label-default exception hidden'></label>"
            str += "</div>";
            str += "</form>";

            return str;
        }
    },
    actions: {
        checkpointDelete: function(e){

            e.preventDefault();
            e.stopPropagation();

            $('[action="moreShow"] .more-list:not(.hidden)').each(function(e){
                $(this).addClass('hidden');
            });

            new Modal( $('#dialog-checkpoint-delete')[0] ).show();
        },
        remarkAddImage: function(e){
            var sourceType = this.getAttribute('sourceType');
            var remarkIndex = this.getAttribute('remark');
            var remark = app.checkpoint.remarks[remarkIndex];

            e.preventDefault();
            var input = this;

            navigator.camera.getPicture(successCallback, errorCallback, {
                sourceType: sourceType,
                destinationType: Camera.DestinationType.FILE_URI,
            })
            function successCallback(data){

                new Modal( $('#dialog-select-image-source')[0] ).hide();
                new Modal( $('#dialog-image-uploading')[0] ).show();

                if (data.indexOf("content://") !== -1) {
                    window.FilePath.resolveNativePath(data, function(localFileUri) {
                        up( localFileUri, data );
                    });
                } else {
                    up( data, data )
                }

                function up( fileName, data ){

                    var options = new FileUploadOptions();
                    options.fileKey = "file";

                    var parts = fileName.split('/');

                    options.fileName = parts[parts.length-1];
                    options.mimeType="image/jpeg";  // your extension

                    var params = {};
                    params.temp_id = remark.temp_id;
                    params.id = remark.id;

                    params["AppUserValidateForm[imei]"] =app.user.imei;
                    params["AppUserValidateForm[token]"] = app.user.token;
                    params["AppUserValidateForm[inspector_id]"] = app.user.inspector_id;

                    options.params = params;

                    var ft = new FileTransfer();
                    ft.upload(data,
                        encodeURI(app.restClient.remarkAddImage),
                        function (r) {
                            var json = JSON.parse(r.response);
                            if(!remark.hasOwnProperty('images')){
                                remark.images = [];
                            }
                            remark.images.push("/job/get-debtor-remark-image?item=" + json.data);
                            app.day.update(function(e){
                                new Modal( $('#dialog-image-uploading')[0] ).hide();
                                new Modal( $('#dialog-image-uploaded')[0] ).show();
                            });
                        },
                        function (error) {
                            alert("Kan afbeelding op dit moment niet uploaden.");
                        },
                        options
                    );
                }

            }
            function errorCallback(){
                alert("error");
            }

        },
        remarkViewImages: function(e){
            app.remarkIndex = this.getAttribute('remark');
            app.remark = app.checkpoint.remarks[ app.remarkIndex ];
            app.navigate.to('views/remarks/images.html', function(e){

            });
        },
        editRemark: function(e){
            app.remark = app.checkpoint.remarks[ this.getAttribute('remark') ];
            app.navigate.to('views/remarks/edit.html', function(e){

            });
        },
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
        checkpointAdd: function(e){
            new Modal( $('#dialog-checkpoint-add')[0] ).show();
        },
        checkpointCreate: function(e){
            var checkpointTypeId = $('#checkpoint-create-service_type_id').val();
            var debtor_service_type_id = parseInt( $('#checkpoint-create-debtor_service_type_id').val() );
            var checkpointType = app.checkpointTypes[checkpointTypeId];
            var cp = {
                id: null,
                barcode: '',
                location_description: '',
                debtor_service_type_id: debtor_service_type_id,
                checkpoint_type_id: checkpointTypeId,
                floorplan: {
                    x: "0%",
                    y: "0%",
                    path: ""
                },
                flags: {
                    historic: {
                        used_tox: false
                    },
                },
                remarks: [],
                is_opened: 0,
                unreachable: 0,
                exists: 1,
                is_editable: 1,
                is_required: 1,
                is_temporary: 1,
                is_deleted: 0,
                scanned: 0,
                questions: checkpointType.questions
            };
            app.appointment.checkpoints.push(cp);
            app.day.update(function(e){
                app.navigate.to('views/checkpoints/index.html', function(e){

                });
            });
        },
        navigateBack: function(e){
            app.navigate.back();
        },
        viewDebtor: function(e){
            app.navigate.to('views/debtor/view.html', function(e){

            });
        },
        viewProducts: function(e){
            app.navigate.to('views/product/index.html', function(e){

            });
        },
        viewDeliveries: function(e){
            app.navigate.to('views/deliveries/index.html', function(e){

            });
        },
        viewSummary: function(e){
            app.navigate.to('views/summary/index.html', function(e){

            });
        },
        sync: function(e){
            new Modal( $('#dialog-sync-start')[0] ).show();
            $('#dialog-sync-start').on('ok', function(e){
                e.preventDefault();
                new Modal( $('#dialog-sync-start')[0] ).hide();
                new Modal( $("#dialog-sync-progress")[0] ).show();
                setTimeout(function(e){
                    app.sync.start(function(e){
                        setTimeout(function(e){
                            app.setCategories(function(e){
                                setTimeout(function(e){
                                    app.setProducts(function(e){
                                        setTimeout(function(e){
                                            app.setCheckpointTypes(function(e){
                                                new Modal( $("#dialog-sync-progress")[0] ).hide();
                                                new Modal( $("#dialog-sync-complete")[0] ).show();
                                            });
                                        }, 500);
                                    })
                                }, 500);
                            });
                        }, 500);
                    });
                }, 500);
            });

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

                // var str = "";
                //
                // var count = 0;
                // for(var checkpointIndex in app.appointment.checkpoints){
                // 	var checkpoint = app.appointment.checkpoints[checkpointIndex];
                // 	for(var remarkIndex in checkpoint.remarks){
                //         count++;
                //         str += "\
                //             <normal style='display: inline-block; width: 100%; padding: 0; box-sizing: border-box;'>\
                //             Opmerking: " + checkpoint.remarks[remarkIndex].name + "\
                //             </normal>\
                //             <normal style='display: inline-block; width: 100%; padding: 0; box-sizing: border-box;'>\
                //             Actie: " + checkpoint.remarks[remarkIndex].action + "\
                //             </normal>";
                //     }
                // }
                // if( count > 0 ){
                //     // alert( count +  " openstaande " + ( ( count == 1 ) ? 'opmerking' : 'opmerkingen' ) + " gevonden." );
                // }


                app.navigate.to('views/appointment/index.html', function(e){
                    var str = "";
                    for(var checkpointIndex in app.appointment.checkpoints){
                    	var checkpoint = app.appointment.checkpoints[checkpointIndex];
                    	for(var remarkIndex in checkpoint.remarks){
                            str += "\
                                <normal style='display: inline-block; width: 100%; padding: 0; box-sizing: border-box;'>\
                                <strong>O</strong>: " + checkpoint.remarks[remarkIndex].name + "\
                                </normal>";
                            str += "\
                                <normal style='display: inline-block; width: 100%; padding: 0; box-sizing: border-box;'>\
                                <strong>A</strong>: " + checkpoint.remarks[remarkIndex].action + "\
                                </normal>";
                            if( checkpoint.remarks[remarkIndex].debtor_remark != null ){
                            str += "\
                                <normal style='display: inline-block; width: 100%; padding: 0; box-sizing: border-box;'>\
                                <strong>K</strong>: " + checkpoint.remarks[remarkIndex].debtor_remark + "\
                                </normal>";
                            }
                            str += "<br/><br/>";
                        }
                    }

                    if( str != "" ){
                        var modal = new Modal( $('#dialog-dialog-remark-index')[0] );
                        var inner = $( modal.element ).find('.inner');
                        inner.html( str );
                        modal.show();
                    }


                });
            });
        },

        viewCheckpoints: function(e){


            app.navigate.to('views/checkpoints/index.html');
        },
        viewCheckpoint: function(e){
            var checkpoint = $(this).attr('checkpoint');
            if(checkpoint){
                app.checkpoint = app.appointment.checkpoints[checkpoint];
                app.checkpointIndex = checkpoint;

                if( !app.checkpoint.is_scanned && !app.checkpoint.is_opened ){
                    alert("Probeer, indien mogelijk, altijd de barcodes van een controlepunt te scannen.");
                }
                app.navigate.to('views/checkpoints/view.html');
            }
        },
        viewRemarks: function(e){
            app.navigate.to('views/remarks/index.html');
        },
        remarkAdd: function(e){
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
        checkpointMarkNonExistent: function(e){
            if(confirm("Weet u zeker dat u dit punt wilt markeren als niet bestaand?")){
                app.appointment.checkpoints[app.checkpointIndex].exists = false;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/index.html', function(e){

                    });
                });
            }
        },
        checkpointMarkExistent: function(e){
            if(confirm("Weet u zeker dat u dit punt wilt markeren als bestaand?")){
                app.appointment.checkpoints[app.checkpointIndex].exists = true;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/index.html', function(e){

                    });
                });
            }
        },
        checkpointEditName: function(e){
            var cp = app.appointment.checkpoints[app.checkpointIndex];


            var title = "";
            if(cp.location_description == ""){
                title = "Naam instellen";
            } else {
                title = "Wijzigen naam: " + cp.location_description;
            }

            var newname = prompt(title);
            if(newname){
                cp.location_description = newname;
                app.day.update(function(e){
                    app.navigate.to('views/checkpoints/view.html', function(e){

                    });
                });
            }
        },

        checkpointEditBarcode: function(e){
            app.scanner.canScan = 'insertCode';
            var oldBarcode = app.checkpoint.barcode;
            var c = confirm("Scan een barcode en klik vervolgens op OK");
            if(c){
                if(app.checkpoint.barcode.length > 0 && (app.checkpoint.barcode != oldBarcode) ){

                } else {
                    app.actions.checkpointEditBarcode.call(this, e);
                }
            }
        },
        completeAppointment: function(e){
            var finish = true;
            var join = [];

            var openCheckpoints = 0;
            var checkpointName = "";

            for(var i in app.appointment.checkpoints){
                var cp = app.appointment.checkpoints[i];
                if( cp.is_deleted == false && cp.unreachable == false && cp.is_required == true && cp.is_opened == false && cp.exists == true ){
                    join.push("Openstaand controlepunt: " + cp.location_description);
                    openCheckpoints++;
                    checkpointName = cp.location_description;
                    finish = false;
                }
            }
            if( finish ){
                for(var i in app.appointment.checkpoints){
                    var cp = app.appointment.checkpoints[i];
                    if( cp.is_required && cp.is_deleted == false && cp.unreachable == false && cp.exists == true ){
                        var count = 0;
                        for(var cpqi in cp.questions){
                            var cpq = cp.questions[cpqi];
                            if(cpq.is_required == true && cpq.answered != true){
                                count++;
                            }
                        }
                        if(count > 0){
                            finish = false;
                            var qtag = (count == 1) ? 'vraag' : 'vragen';
                            join.push(count + " openstaande " + qtag + " bij controlepunt " + cp.location_description);
                        }
                    }
                }
            }

            if(finish == false){
                if(join.length > 5){
                    var l = join.length;
                    join = join.splice(0, 5);
                    join.push('en ' + (l - 5) + ' andere meldingen');
                }
                alert(join.join('\n'));
            } else {
                app.navigate.to('views/installations/index.html');
            }
        },
        signAppointment: function(e){
            app.navigate.to('views/signature/index.html');
        },
        viewSummary: function(e){

            var finish = true;
            var join = [];
            var join = [];

            for(var sti in app.appointment.service_types){
                var st = app.appointment.service_types[sti];
                if(st.state == null){
                    join.push("Servicetype " + st.name + " heeft geen status!");
                    finish = false;
                }
            }


            if(finish == true){
                for(var sti in app.appointment.service_types){
                    count = 0;
                    var st = app.appointment.service_types[sti];
                    var state = st.state;
                    var aq = st.additional_questions[state];
                    for(var i in aq){
                        var q = aq[i];
                        if(q.is_required == true && q.answered == false){
                            count++;
                        }
                    }
                    var aq = st.additional_questions['*'];
                    for(var i in aq){
                        var q = aq[i];
                        if(q.is_required == true && q.answered == false){
                            count++;
                        }
                    }

                    if(count > 0){
                        finish = false;
                        var qtag = (count == 1) ? 'vraag' : 'vragen';
                        localStorage.setItem('additional_question_list_' + sti, 'show');
                        document.querySelector('[servicetype="'+sti+'"]').setAttribute('show', '');
                        document.querySelector('[servicetype="'+sti+'"]').removeAttribute('hide');
                        join.push(count + " openstaande " + qtag + " bij servicetype " + st.name);
                        finish = false;
                    } else {
                        localStorage.setItem('additional_question_list_' + sti, 'hide');
                        document.querySelector('[servicetype="'+sti+'"]').removeAttribute('show');
                        document.querySelector('[servicetype="'+sti+'"]').setAttribute('hide', '');
                    }
                }
            }
            if(finish == true){
                app.navigate.to('views/summary/index.html', function(e){

                });
                // app.navigate.to('views/signature/index.html', function(e){
                //
                // });
            } else {
                alert(join.join("\n"));
            }
        },
        moreShow: function(e){

            e.preventDefault();
            e.stopPropagation();

            var list = $(this).find('.more-list');


            $('[action="moreShow"] .more-list:not(.hidden)').each(function(e){
                if(this !== list){
                    $(this).addClass('hidden');
                }
            });



            if(list.hasClass('hidden')){
                list.removeClass('hidden');
            } else {
                list.addClass('hidden');
            }


        },
        remarkMarkComplete: function(e){
            var index = $(this).attr('remark');
            if(app.checkpoint.remarks[index]){
                var remark = app.checkpoint.remarks[index];
                remark.is_completed = 1;
                app.day.update(function(e){
                    app.navigate.to('views/remarks/index.html', function(e){

                    });
                });
            }
        },
        remarkMarkIncomplete: function(e){
            var index = $(this).attr('remark');
            if(app.checkpoint.remarks[index]){
                var remark = app.checkpoint.remarks[index];
                remark.is_completed = 0;
                app.day.update(function(e){
                    app.navigate.to('views/remarks/index.html', function(e){

                    });
                });
            }
        },
        //https://github.com/szimek/signature_pad
        signatureReset: function(e){
            target = this.getAttribute('target');
            if(target == 'customer'){
                signaturePadCustomer.clear();
            }
        },
        signatureSubmit: function(e){
            var cancel = false;

            if(signaturePadCustomer){
                var join = [];

                app.appointment.signatures.created_at = parseInt( + new Date() / 1000 ).toFixed(0);

                if(signaturePadCustomer.isEmpty()){
                    cancel = true;
                    join.push("Klant handtekening mag niet leeg zijn!");
                } else {
                    app.appointment.signatures.customer = signaturePadCustomer.toDataURL();
                }

                var customerFirstName = $('#customer-first-name').val();
                if(customerFirstName == ""){
                    cancel = true;
                    join.push("Klant voornaam mag niet leeg zijn");
                } else {
                    app.appointment.signatures.customer_first_name = customerFirstName;
                }

                var customerLastName = $('#customer-last-name').val();
                if(customerLastName == ""){
                    cancel = true;
                    join.push("Klant achternaam mag niet leeg zijn");
                } else {
                    app.appointment.signatures.customer_last_name = customerLastName;
                }

                if(!cancel){
                    app.day.update(function(e){
                        var totalIn = 0;
                        var totalEx = 0;

                        for(var i in app.appointment.checkpoints){
                            var cp = app.appointment.checkpoints[i];
                            if(cp.is_deleted == false && cp.unreachable == false && cp.is_required == true && cp.is_opened == true){
                                for(var i in cp.questions){
                                    var q = cp.questions[i];
                                    if(q.type == QUESTION_TYPE_PRODUCT){
                                        var answer = q.answer;
                                        var productId = answer[0];
                                        var productAmount = answer[1];

                                        var product = app.products[productId];
                                        if(product){
                                            totalIn += product.price_in * productAmount;
                                            totalEx += product.price_ex * productAmount;
                                        }
                                    }
                                }
                            }
                        }

                        for(var i in app.appointment.service_types){
                            var st = app.appointment.service_types[i];
                            var state = st.state;
                            for(var i in st.additional_questions['*']){
                                var q = st.additional_questions['*'][i];
                                if(q.type == QUESTION_TYPE_PRODUCT){
                                    var answer = q.answer;
                                    var productId = answer[0];
                                    var productAmount = answer[1];

                                    var product = app.products[productId];
                                    if(product){
                                        totalIn += product.price_in * productAmount;
                                        totalEx += product.price_ex * productAmount;
                                    }
                                }
                            }
                            for(var i in st.additional_questions[state]){
                                var q = st.additional_questions[state][i];
                                if(q.type == QUESTION_TYPE_PRODUCT){
                                    var answer = q.answer;
                                    var productId = answer[0];
                                    var productAmount = answer[1];

                                    var product = app.products[productId];
                                    if(product){
                                        totalIn += product.price_in * productAmount;
                                        totalEx += product.price_ex * productAmount;
                                    }
                                }
                            }
                        }
                        app.appointment.payment.additional_in = totalIn;
                        app.appointment.payment.additional_ex = totalEx;


                        app.appointment.payment.total_in = app.appointment.payment.default_in + app.appointment.payment.additional_in;
                        app.appointment.payment.total_ex = app.appointment.payment.default_ex + app.appointment.payment.additional_ex;

                        if( app.appointment.payment.payment_method !== 'contract' && app.appointment.payment.payment_method !== 'invoice' ){

                            $('#dialog-payment [name="payment_paid"]').removeClass('error');

                            if(app.appointment.payment.paid <= app.appointment.payment.total_in  - 0.03){
                                $('#dialog-payment #to-pay').html( "€ " + app.appointment.payment.total_in.toFixed(2) );
                                $('#dialog-payment [name="payment_paid"]').val( app.appointment.payment.paid.toFixed(2) );
                                $('#dialog-payment [name="payment_paid"]').addClass('error');

                                $('.label-payment-method').removeClass('error');
                                if(!app.appointment.payment.payment_method){
                                    $('.label-payment-method').addClass('error');
                                } else {

                                    var radio = $('[name="payment_method"][value="'+app.appointment.payment.payment_method+'"]');

                                    if( radio.length > 0 ){
                                        $('[name="payment_method"][value="'+app.appointment.payment.payment_method+'"]')[0].checked = true
                                    }
                                }

                                new Modal( $('#dialog-payment')[0] ).show();
                                return;
                            } else if(app.appointment.payment.paid > app.appointment.payment.total_in + 0.03){
                                $('#dialog-payment #to-pay').html( "€ " + app.appointment.payment.total_in.toFixed(2) );
                                $('#dialog-payment [name="payment_paid"]').val( app.appointment.payment.paid.toFixed(2) );
                                $('#dialog-payment [name="payment_paid"]').addClass('error');

                                $('.label-payment-method').removeClass('error');
                                if(!app.appointment.payment.payment_method){
                                    $('.label-payment-method').addClass('error');
                                } else {
                                    $('[name="payment_method"][value="'+app.appointment.payment.payment_method+'"]')[0].checked = true
                                }

                                new Modal( $('#dialog-payment')[0] ).show();
                                return;
                            }

                        }

                        app.appointment.completed = 1;

                        if( !app.appointment.hasOwnProperty('completed_at') || app.appointment.completed_at == null ){
                            app.appointment.completed_at = parseInt(+ Date.now() / 1000).toFixed(0);
                        }

                        app.day.update(function(e){
                            app.navigate.to('views/index.html', function(e){

                            });
                        });
                    });
                }


                if(cancel){
                    alert(join.join('\n'));
                }
            }
        }
    },
    exceptions: {
        serverError: "Er ging iets mis. Probeer het opnieuw later en/of start de applicatie opnieuw",
    },
    helpers: {
        generateRandomString: function(length){
            var range = app.helpers.range('a', 'z');
            range = range.concat( app.helpers.range('A', 'Z') );
            range = range.concat( app.helpers.range('0', '9') );

            var str = "";

            while(str.length < length){
                str += range[Math.floor(Math.random() * range.length)];
            }
            return str;
        },
        range: function(start, stop){
            var result=[];
            for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
              result.push(String.fromCharCode(idx));
            }
            return result;
        }
    }
    };

var Modal = function( element ){
    this.element = element;

    var dialogCancel = this.element.getAttribute('dialog-cancel');
    var dialogOk = this.element.getAttribute('dialog-ok');

    if(dialogCancel || dialogOk){

        var btnRow = this.element.querySelector('.row.btn-row');

        if(btnRow){
            btnRow.remove();
        }

        var btnRow = document.createElement('div');

        btnRow.className = 'row btn-row'

        if(this.element.getAttribute('dialog-cancel')){
            var btnCancel = document.createElement('btn');
            btnCancel.className = 'btn btn-dialog cancel';
            btnCancel.innerHTML = dialogCancel;
            btnRow.appendChild( btnCancel );
        }

        if(this.element.getAttribute('dialog-ok')){
            var btnOk = document.createElement('btn');
            btnOk.className = 'btn btn-dialog ok';
            btnOk.innerHTML = dialogOk;
            btnRow.appendChild( btnOk );
        }

        this.element.appendChild( btnRow );
    }

    parent = this;

    this.element.addEventListener('dismiss', function(e){
        new Modal( this ).hide();
    })
}

$(document).on('click', '.modal .btn.ok', function(e){

    e.stopPropagation();
    e.preventDefault();

    var okEvent = $.Event("ok");

    $(this.parentNode.parentNode).trigger(okEvent);

    var btn = this;

    if(!okEvent.isDefaultPrevented()){
        new Modal( okEvent.target ).hide();
    }
});

$(document).on('click', '.modal .btn.cancel', function(e){
    e.stopPropagation();
    e.preventDefault();

    var cancelEvent = $.Event("cancel");

    $(this.parentNode.parentNode).trigger(cancelEvent);

    if(!cancelEvent.isDefaultPrevented()){

        new Modal( this.parentNode.parentNode ).hide();
    }
});

$(document).on('click', '.modal[open] ~ .modal-backdrop', function(e){
    $('.modal[open]').each( function( i ){
        this.dispatchEvent( new CustomEvent('dismiss', {
            cancelable: true,
            bubbles: true
        }));
    } )
})

Modal.prototype.hide = function(){
    $(this.element).trigger('beforeClose');
    this.element.removeAttribute('open');
    $(this.element).trigger('afterClose');
}
Modal.prototype.show = function(){
    $(this.element).trigger('beforeOpen');

    this.element.setAttribute('open', '');

    var element =  $('#dialog-select-image-source')[0];
    var height = this.element.offsetHeight;
    this.element.style.top = "calc( 50% - " + height / 2 + "px )";

    var computedTop = parseFloat( window.getComputedStyle( this.element )['top'] );

    if( computedTop < 10 ){
        this.element.style.top = 10;
    }

    $(this.element).trigger('afteropen');
}
Modal.prototype.content = function( content ){
    this.element.innerHTML = content;
}

app.initialize();





$(document).on('submit', '.installation-list .question-list .question-form', function(e){
    e.preventDefault();
    e.stopPropagation();

    var questionIndex = this.getAttribute('question');
    var serviceType = this.parentNode.parentNode.getAttribute('servicetype');

    var p = $($(this.parentNode.parentNode).prev());
    var on = $(this.parentNode.parentNode).attr('on');

    var serviceTypeIndex = $(this.parentNode.parentNode).attr('serviceTypeIndex');

    var fd = new FormData( $('.question-list[servicetype="'+serviceType+'"] form[question="'+questionIndex+'"]')[0] );
    var entries = fd.getAll('question_' + questionIndex);

    var question = app.appointment.service_types[serviceTypeIndex].additional_questions[serviceType][questionIndex];

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
        app.navigate.back = function( e ){
            $('#form-search-code [name="value"]').val("");
            $('.checkpoint-list .no-results').addClass('hidden');
            $('.checkpoint-list li.item').each(function(i){
                $(this).removeClass('hidden');
            });
            app.navigate.back = function( e ){
                app.navigate.to('views/appointment/index.html', function(e){

                });
            }
        }
    } else {
        $('.checkpoint-list .no-results').addClass('hidden');
        app.navigate.back = function( e ){
            app.navigate.to('views/appointment/index.html', function(e){

            });
        }
    }
});
$(document).on('click', '.installation-list > li > label', function(e){
    e.stopPropagation();

    var input = $(this.querySelector('input:checked'));

    var value = input.val();



    var servicetype = $(this.parentNode).attr('servicetype');

    app.appointment.service_types[servicetype].state = value;
    app.appointment.service_types[servicetype].replanning_days = input.attr('replanning-days');
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

    setTimeout( function(e){
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
    }, 50);
});
$(document).on('click', '[action]', function(e){
    var action = $(this).attr('action');
    if(!$(this).attr('disabled')){
        if(app.actions[action]){
            return app.actions[action].call(this, e);
        }
    }
    alert("Actie niet mogelijk.");
});

$(document).on('click', '#sync-toggler', function(e){
    $(this.parentNode).toggleClass('collapsed');
})

// frankdj : attack2018

// var baseUrl = "http://thom.at01.app.yii2.dev03.netzozeker.info";
// var baseUrl = "http://sandor.at01.app.yii2.dev03.netzozeker.info";
// var baseUrl = "http://at01-acc.app.yii2.projecten03.netzozeker.info";
// var baseUrl = "https://app-acc.scantack.eu";
// var baseUrl = "https://app.scantack.eu";
// var baseUrl = "https://at01.app.yii2.projecten03.netzozeker.info";

app.restClient = {
    ping: baseUrl + '/ping',
    userLogin: baseUrl + '/user/login',
    userAuth: baseUrl + '/user/auth',

    getFiles: baseUrl + '/job/get-files',
    getComments: baseUrl + '/job/get-comments',
    getRemarks: baseUrl + '/job/get-remarks',
    getDays: baseUrl + '/job/get-jobs',
    putDays: baseUrl + '/job/put-jobs',
    getProducts: baseUrl + '/job/get-products',
    getCategories: baseUrl + '/job/get-categories',
    getCheckpointTypes: baseUrl + '/job/get-checkpoint-types',
    remarkAddImage: baseUrl + '/job/remark-add-image',
    remarkRemoveImage: baseUrl + '/job/remark-remove-image'
};


$(document).on('click', 'body', function(e){
    $('.more-list:not(.hidden)').each(function(i){
        $(this).addClass('hidden');
    });
})

$(document).on('ok', '#dialog-image-uploaded', function(e){
    app.navigate.to('views/remarks/index.html', function(e){

    });
});

$(document).on('click', '.toggle-additional-questions', function(e){
    var parent = this.parentNode;
    var serviceType = parent.getAttribute('servicetype');
    var show = parent.getAttribute('show');

    if(typeof show == 'string'){
        localStorage.setItem('additional_question_list_' + String(serviceType), 'hide');
        parent.removeAttribute('show');
        parent.setAttribute('hide', '');
        this.innerHTML = 'Vragen weergeven';
    } else {
        localStorage.setItem('additional_question_list_' + String(serviceType), 'show');
        this.innerHTML = 'Vragen verbergen';
        parent.removeAttribute('hide');
        parent.setAttribute('show', '');
    }
});



var templates = {
    productListView: "<div class='inner product-row' data-key='1'>\
        <div class='product-count'>\
            {product.amount}x\
        </div>\
        <div class='product-name'>\
            {product.name}\
        </div>\
        <small><strong>Controlepunten: </strong></small><br/>\
        <small>{checkpoints}</small><br/>\
        <small><strong>Servicetypen: </strong></small><br/>\
        <small>{service_types}</small><br/>\
    </div>",
    remarkListView: "\
    <li class=''>\
        <p>{checkpoint}: {name}</p>\
        <p>Actie: {action}</p>\
        <p>\
            Actiehouder: {actionee}<br>\
            Type: {type}\
        </p>\
        {images}\
    </li>",
};



app.templates = templates;



$(document).on('touchstart', '[fn-longpress]', function(e){
    this.longpressTimeout = window.setTimeout( function( event ){
        this.dispatchEvent( new CustomEvent('longpress', {
            cancelable: true,
            bubbles: true,
        }) );
    }.bind(this), 1500 );
});

$(document).on('touchmove', '[fn-longpress]', function(e){
    if( this.longpressTimeout ){
        window.clearTimeout( this.longpressTimeout );
    }
})

$(document).on('touchend', '[fn-longpress]', function(e){
    if( this.longpressTimeout ){
        window.clearTimeout( this.longpressTimeout );
    }
});

$(document).on('click', '[fn-dismiss]', function(e){
    this.dispatchEvent( new CustomEvent( 'dismiss', {
        cancelable: true,
        bubbles: true
    }) );
});
