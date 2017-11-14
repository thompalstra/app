var PRIO_JOB_REGULAR = 1;
var PRIO_JOB_NUISANCE = 2;
var PRIO_JOB_REGULAR_RISK = 3;
var PRIO_JOB_REGULAR_NUISANCE = 4;

var QUESTION_TYPE_CHOICE = 1;
var QUESTION_TYPE_YN = 2;
var QUESTION_TYPE_NUMBER = 3;
var QUESTION_TYPE_TEXT = 4;
var QUESTION_TYPE_PRODUCT = 5;

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
        if(app.user.isGuest == true){
            app.protocol.guest();
        } else {
            app.protocol.user();
        }
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
                        console.log('success: get days');
                        setTimeout(function(e){
                            getDays();
                        }, 500);
                    }

                    var error = function(result){
                        console.log('error: get days');
                        setTimeout(function(e){
                            getDays();
                        }, 500);
                    }
                    d.send(request, success, error);
                });
            }
            // 2
            function getDays(){
                // days - 1
                app.sync.progressBar.value( 1 );
                app.sync.progressBar.text( "Jobs ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                var transaction = app.database.db.transaction(['day'], "readwrite");
                var objectStore = transaction.objectStore('day');

                objectStore.clear();

                var index = 0;
                d = new Day();
                data = d.sync();

                for(var i in data){
                    if(i == 'length'){ continue; }
                    var d = new Day();
                    index++;
                    d.put({id: i, data: data[i]});
                }
                setTimeout(function(e){
                    getRemarks();
                }, 500);
            }
            // 3
            function getRemarks(){
                app.sync.progressBar.value( 3 );
                app.sync.progressBar.text( "Opmerkingen ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

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
                setTimeout(function(e){
                    getServiceTypes();
                }, 500);
            }
            // 4
            function getServiceTypes(){
                app.sync.progressBar.value( 4 );
                app.sync.progressBar.text( "Meetpunttypes ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                var transaction = app.database.db.transaction(['checkpointtype'], "readwrite");
                var objectStore = transaction.objectStore('checkpointtype');

                objectStore.clear();

                var ct = new window['CheckpointType']();
                var CheckpointTypes = ct.sync();

                for(var i in CheckpointTypes){
                    var CheckpointType = CheckpointTypes[i];
                    ct.put({
                        id: i,
                        data: CheckpointType
                    });
                }
                setTimeout(function(e){
                    getProductCategories();
                }, 500);
            }
            // 5
            function getProductCategories(){
                app.sync.progressBar.value( 5 );
                app.sync.progressBar.text( "Product categorieën ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

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
                setTimeout(function(e){
                    getProducts();
                }, 500);
            }
            // 6
            function getProducts(){
                app.sync.progressBar.value( 6 );
                app.sync.progressBar.text( "Producten ophalen: (" + app.sync.progressBar.value() + "/" + app.sync.progressBar.max() + ")" );

                var transaction = app.database.db.transaction(['product'], "readwrite");
                var objectStore = transaction.objectStore('product');

                objectStore.clear();

                var p = new Product();
                var products = p.sync();

                for(var i in products){
                    var product = products[i];
                    p.put({
                        id: i,
                        data: product
                    });
                }
                setTimeout(function(e){
                    end();
                }, 500);
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

                    if( typeof max_value !== 'undefined' && answer > max_value ){
                        question.errors.push("Antwoord moet gelijk of minder zijn dan " + max_value);
                    }

                break;
                case QUESTION_TYPE_TEXT:
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
                case QUESTION_TYPE_PRODUCT:
                    console.log('validating product...');
                    var productId = parseFloat( answer[0] );
                    var productAmount = isNaN( parseFloat( answer[1] ) ) ? 0 : parseFloat( answer[1] );
                    if(productAmount > 0){

                    } else {
                        question.errors.push( "Product hoeveelheid mag niet leeg zijn.");
                    }
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
                        str += "<input id='question_"+subId+"_"+questionIndex+"' type='checkbox' value='" + c + "' name='question_" + questionIndex + "' "+checked+">";
                        str += "<label for='question_"+subId+"_"+questionIndex+"'>"+question.choices[c]+"</label>";
                        str += "</div>";

                        subId++;
                    }
                break;
                case QUESTION_TYPE_YN:

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
                    for(var aC in app.categories){
                        var category = app.categories[aC];
                        str += "<optgroup label='"+category.name+"'>";
                        for(var i in question.products){
                            var id = question.products[i];
                            var product = app.products[id];

                            if(product.product_category_id == aC){
                                var name = "question_" + questionIndex;
                                var selected = "";
                                if(Array.isArray( question.answer )){
                                    var selected = (question.answer[0] == id) ? 'selected' : '';
                                }
                                str += "<option value='" + id + "' "+selected+">" + product.name + "</option>";
                            }
                        }
                        str += "</optgroup>";
                    }
                } else {
                    str += "<option value='null'>Geen producten beschikbaar</option>";
                }


                str += "</select>";
                var value = 1;
                if(Array.isArray( question.answer )){
                    value = question.answer[1];
                }
                if(question.products.length > 0){
                    str += "<input name='question_" + questionIndex + "' type='number' min='1' max='999' value='"+value+"' class='input input-default' />";
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
            new Modal( $('#dialog-checkpoint-delete')[0] ).show();
        },
        remarkAddImage: function(e){
            var remarkIndex = this.getAttribute('remark');
            var remark = app.checkpoint.remarks[remarkIndex];

            e.preventDefault();
            var input = this;

            navigator.camera.getPicture(successCallback, errorCallback)
            function successCallback(data){
                new Modal( $('#dialog-image-uploading')[0] ).show();
                fileURL = data;
                var win = function (r) {
                    var json = JSON.parse(r.response);
                    if(!remark.hasOwnProperty('images')){
                        remark.images = [];
                    }
                    remark.images.push("/job/get-debtor-remark-image?item=" + json.data);
                    app.day.update(function(e){
                        new Modal( $('#dialog-image-uploading')[0] ).hide();
                        new Modal( $('#dialog-image-uploaded')[0] ).show();
                    });
                }

                var fail = function (error) {
                    alert("Kan afbeelding op dit moment niet uploaden.");
                }

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "text/plain";

                var params = {};
                params.temp_id = remark.temp_id;
                params.id = remark.id;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI(app.restClient.remarkAddImage), win, fail, options);
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
            var debtor_service_type_id = $('#checkpoint-create-debtor_service_type_id').val();
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
                is_opened: 0,
                unreachable: 0,
                is_editable: 1,
                is_required: 1,
                is_temporary: 1,
                is_deleted: 0,
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
                                                $("#dialog-sync-complete").on('ok', function(e){
                                                    app.navigate.to('views/index.html', function(e){

                                                    });
                                                });
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
                app.navigate.to('views/appointment/index.html');
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
                if(!app.checkpoint.is_opened){
                    app.checkpoint.is_opened = true;
                    app.day.update(function(e){
                        app.navigate.to('views/checkpoints/view.html');
                    });
                } else {
                    app.navigate.to('views/checkpoints/view.html');
                }

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
        completeAppointment: function(e){
            var finish = true;
            var join = [];

            for(var i in app.appointment.checkpoints){
                var cp = app.appointment.checkpoints[i];
                if(cp.is_deleted == false && cp.unreachable == false && cp.is_required == true && cp.is_opened == false){
                    join.push("Openstaand meetpunt: " + cp.location_description);
                    finish = false;
                }
            }
            if(finish){
                for(var i in app.appointment.checkpoints){
                    var cp = app.appointment.checkpoints[i];
                    if(cp.is_deleted == false && cp.unreachable == false && cp.is_required == true && cp.is_opened == false){
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
                            join.push(count + " openstaande " + qtag + " bij meetpunt " + cp.location_description);
                        }
                    }
                }
            }
            if(!finish){
                alert(join.join('\n'));
            } else {
                app.navigate.to('views/installations/index.html');
            }
        },
        signAppointment: function(e){

            var finish = true;
            var join = [];
            var join = [];

            for(var sti in app.appointment.service_types){
                var st = app.appointment.service_types[sti];
                if(st.state == null){
                    join.push("Installatie " + st.name + " heeft geen status!");
                    console.log('geen status');
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
                        if(q.is_required == true && q.answered != true){
                            count++;
                        }
                    }
                    var aq = st.additional_questions['*'];
                    for(var i in aq){
                        var q = aq[i];
                        if(q.is_required == true && q.answered != true){
                            count++;
                        }
                    }
                    if(count > 0){
                        finish = false;
                        var qtag = (count == 1) ? 'vraag' : 'vragen';
                        join.push(count + " openstaande " + qtag + " bij installatie " + st.name);
                        console.log('openstaande intallatie');
                        finish = false;
                    }
                }
            }
            if(finish == true){
                app.navigate.to('views/signature/index.html', function(e){

                });
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
            if(target == 'customer' && signaturePadCustomer){
                signaturePadCustomer.clear();
            } else {
                signaturePadInspector.clear();
            }
        },
        signatureSubmit: function(e){
            var cancel = false;

            if(signaturePadCustomer && signaturePadInspector){
                var join = [];
                if(signaturePadCustomer.isEmpty()){
                    cancel = true;
                    join.push("Klant handtekening mag niet leeg zijn!");
                }

                if(signaturePadInspector.isEmpty()){
                    cancel = true;
                    join.push("Bestrijder handtekening mag niet leeg zijn");
                }

                var customerFirstName = $('#customer-first-name').val();
                if(customerFirstName == ""){
                    cancel = true;
                    join.push("Klant voornaam mag niet leeg zijn");
                }

                var customerLastName = $('#customer-last-name').val();
                if(customerLastName == ""){
                    cancel = true;
                    join.push("Klant achternaam mag niet leeg zijn");
                }

                if(!cancel){

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

                    $('#dialog-payment [name="payment_paid"]').removeClass('error');

                    if(app.appointment.payment.paid <= app.appointment.payment.total_in  - 0.03){
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

                if(!cancel){
                    app.appointment.signatures.customer_first_name = customerFirstName;
                    app.appointment.signatures.customer_last_name = customerLastName;
                    app.appointment.signatures.customer = signaturePadCustomer.toDataURL();
                    app.appointment.signatures.inspector = signaturePadInspector.toDataURL();
                    app.appointment.completed = 1;
                    app.day.update(function(e){
                        app.navigate.to('views/index.html', function(e){

                        });
                    });
                } else {
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

    }

    $(document).on('click', '.modal .btn.ok', function(e){

    e.stopPropagation();
    e.preventDefault();

    var okEvent = $.Event("ok");

    $(this.parentNode.parentNode).trigger(okEvent);

    if(!okEvent.isDefaultPrevented()){
        new Modal( this.parentNode.parentNode ).hide();
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

    Modal.prototype.hide = function(){
    $(this.element).trigger('beforeClose');
    this.element.removeAttribute('open');
    $(this.element).trigger('afterClose');
    }
    Modal.prototype.show = function(){
    $(this.element).trigger('beforeOpen');
    this.element.setAttribute('open', '');
    $(this.element).trigger('afteropen');
    }
    Modal.prototype.content = function( content ){
    this.element.innerHTML = content;
    }

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
        is_private: $('.form-create-remark input[name="is_private"]')[0].checked,
        temp_id: app.helpers.generateRandomString(24),
        debtor_service_type_checkpoint_id: app.checkpoint.id,
        images: [],
        is_completed: false
    };
    app.checkpoint.remarks.push(obj);
    app.day.update(function(){
        app.navigate.to('views/remarks/index.html', function(e){

        });
    });

    });



$(document).on('submit', '.installation-list .question-list .question-form', function(e){
    e.preventDefault();
    e.stopPropagation();

    var questionIndex = this.getAttribute('question');
    var serviceType = this.parentNode.parentNode.getAttribute('servicetype');

    var p = $($(this.parentNode.parentNode).prev());
    var on = $(this.parentNode.parentNode).attr('on');

    // var serviceTypeIndex = $(this.parentNode.parentNode).attr('servicetype');
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
    } else {
        $('.checkpoint-list .no-results').addClass('hidden');
    }
});
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

if(!$(this).attr('disabled')){
    if(app.actions[action]){
        return app.actions[action].call(this, e);
    }
}
alert("Actie niet toegestaan.");
});

$(document).on('click', '#sync-toggler', function(e){
    $(this.parentNode).toggleClass('collapsed');
})
    var baseUrl = "http://thom.at01.app.yii2.dev03.netzozeker.info";
    // var baseUrl = "https://at01.app.yii2.projecten03.netzozeker.info";
    // var baseUrl = "https://at01-acc.app.yii2.projecten03.netzozeker.info";

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

$(document).on('change', '#default-remarks', function(e){
    // get opt
    var option = $(this).find(':selected');

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
$(document).on('click', 'body', function(e){
    $('.more-list:not(.hidden)').each(function(i){
        $(this).addClass('hidden');
    });
})

$(document).on('ok', '#dialog-image-uploaded', function(e){
    app.navigate.to('views/remarks/index.html', function(e){

    });
});
