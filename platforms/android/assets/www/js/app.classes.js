var data = {
    // timestamp of the current day
    1505822400 : {
        // appointment object
        34: {
            completed: false,
            walking_time: '00:45:00',
            unreachable: false,
            time: "13:30",
            signatures: {
                customer: null,
                inspector: null
            },
            information: "Extra bezoek na overlast",
            debtor: {
                name: 'Albert Heijn',
                debtor_number: 1000,
                branch_code: 'AT1000',
                invoice_address: 'Factuurlaan',
                invoice_house_number: '1',
                invoice_addition: 'H',
                invoice_postcode: '9999AZ',
                invoice_city: 'Heerhugowaard',
                visit_address: 'Bezoeklaan',
                visit_house_number: '1',
                visit_addition: '-1',
                visit_postcode: '1337GG',
                visit_city: 'Rotterdam',
                phone_number: '0887779500',
                email: 'info@ah-heerhugowaard.nl',
                payment_method: 'Contract',
                times: {
                	1: {
                		from: '09:00',
                		to: '18:00'
                	},
                	2: {
                		from: '09:00',
                		to: '18:00'
                	},
                    3: {
                        from: '09:00',
                        to: '17:00'
                    },
                    4: {
                        from: '09:00',
                		to: '18:00'
                    },
                    5: {
                        from: '09:00',
                		to: '21:00'
                    }
                }
            },
            checkpoints: {
                32563: {
                    name: 'Rattenvanger Ultra MK3000Plus V2.0.1',
                    type: 'Rat',
                    code: '3STWUW007886595',
                    questions: {
                        0: {
                            question: 'Hoeveel gif is er op?',
                            type: 5,
                            answered: false,
                            required: true,
                            answer: undefined,
                            products: {
                                12: "Gif 1.5 gr.",
                                23: "Gif 1.8 gr.",
                                54: "Gif 2 gr."
                            },
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '23%',
                        y: '83%',
                        path: 'logo_00.jpg'
                    },
                },
                37: {
                    name: 'De keuken',
                    type: 'Rat',
                    code: 'CODEA000',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        2: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        62: {
                            question: "Dit is een vraag met een getal als antwoord",
                            type: 3,
                            min_value: 10,
                            max_value: 99,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        415: {
                            question: "Hoe zou je dit omschrijven?",
                            type: 1,
                            min_value: 0,
                            max_value: 0,
                            answered: false,
                            required: true,
                            answer: undefined,
                            choices: {
                                4331: "Als een antwoord",
                                4332: "Als een tweede antwoord",
                                4333: "Als dit het derde antwoord is",
                                4334: "Wanneer het ID van dit antwoord 4334 is",
                            },
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '50%',
                        y: '50%',
                        path: 'logo_00.jpg'
                    },
                },
                231: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    code: 'CODEB001',
                    questions: {
                        3: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        4: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '83%',
                        y: '23%',
                        path: 'logo_00.jpg'
                    },
                }
            },
            service_types:{
                1: {
                    name: 'Hygiëne',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions: {
                        // status
                        on: 2,
                        questions: {
                            99944: {
                                question: 'Dit is een extra vraag',
                                type: 4,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            },
                            99945: {
                                question: 'Dit is nog een extra vraag',
                                type: 2,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            }
                        },
                    }
                },
                3261: {
                    name: 'Muizen',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions: {
                        // status
                        on: 3,
                        questions: {
                            99955: {
                                question: 'Dit is een extra vraag',
                                type: 4,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            },
                            99956: {
                                question: 'Dit is nog een extra vraag',
                                type: 2,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            }
                        },
                    }
                }
            },
            floorplan: {
                0: {
                    path: 'map_56.jpg',
                    name: 'Vloerplan 56'
                },
                1: {
                    path: 'map_57.jpg',
                    name: 'Vloeplan 57'
                }
            },
            remarks: [
                {
                    id: 1,
                    name: "Dit is een opmerking",
                    actionee: "Attack",
                    group: "Algemeen",
                    type: "Klacht",
                    complete: false
                },
            ]
        },
        40: {
            completed: false,
            walking_time: '00:30:00',
            unreachable: false,
            time: "13:30",
            signatures: {
                customer: null,
                inspector: null
            },
            debtor: {
                name: 'Jumbo',
                debtor_number: 1000,
                branch_code: 'AT1001',
                invoice_address: 'Factuurlaan',
                invoice_house_number: '1',
                invoice_addition: 'H',
                invoice_postcode: '9999AZ',
                invoice_city: 'Haaksbergen',
                visit_address: 'Bezoeklaan',
                visit_house_number: '1',
                visit_addition: '-1',
                visit_postcode: '1337GG',
                visit_city: 'Rotterdam',
                phone_number: '0887779500',
                email: 'info@jumbo-haaksbergen.nl',
                payment_method: 'Contract',
                times: {},
            },
            checkpoints: {
                31: {
                    name: 'De keuken',
                    type: 'Rat',
                    code: 'CODEA000',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        2: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                },
                83: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    code: 'CODEB001',
                    questions: {
                        3: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        4: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                }
            },
            service_types:{
                501: {
                    name: 'Hygiëne',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                },
                502: {
                    name: 'Muizen',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                }
            },
            map: {
                icons: {
                    1: {
                        name: 'Icon A',
                        y: '38%',
                        x: '85%',
                    }
                },
            },
            remarks: [],
        },
    },
    1505908800: {
        53: {
            completed: false,
            walking_time: '01:30:00',
            unreachable: false,
            time: "13:30",
            signatures: {
                customer: null,
                inspector: null
            },
            debtor: {
                name: 'Grolsch',
                debtor_number: 1000,
                branch_code: 'AT1000',
                invoice_address: 'Factuurlaan',
                invoice_house_number: '1',
                invoice_addition: 'H',
                invoice_postcode: '9999AZ',
                invoice_city: 'Enschede',
                visit_address: 'Bezoeklaan',
                visit_house_number: '1',
                visit_addition: '-1',
                visit_postcode: '1337GG',
                visit_city: 'Rotterdam',
                phone_number: '0887779500',
                email: 'info@grolsch.nl',
                payment_method: 'Pin',
                times: {}
            },
            checkpoints: {
                85: {
                    name: 'De keuken',
                    type: 'Rat',
                    code: 'CODEA000',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        2: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                },
                78: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    code: 'CODEB001',
                    questions: {
                        3: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        4: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                }
            },
            service_types:{
                340:{
                    name: 'Hygiëne',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                },
                350: {
                    name: 'Ratten',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                }
            },
            map: {
                icons: {
                    1: {
                        name: 'Icon A',
                        y: '38%',
                        x: '85%',
                    }
                },
            },
            remarks: [],
        },
        402 : {
            completed: false,
            walking_time: '00:45:00',
            unreachable: false,
            time: "13:30",
            signatures: {
                customer: null,
                inspector: null
            },
            debtor: {
                name: 'Heineken',
                debtor_number: 1000,
                branch_code: 'AT1000',
                invoice_address: 'Factuurlaan',
                invoice_house_number: '1',
                invoice_addition: 'H',
                invoice_postcode: '9999AZ',
                invoice_city: 'Den Haag',
                visit_address: 'Bezoeklaan',
                visit_house_number: '1',
                visit_addition: '-1',
                visit_postcode: '1337GG',
                visit_city: 'Rotterdam',
                phone_number: '0887779500',
                email: 'info@heineken.nl',
                payment_method: 'Contant',
                times: {}
            },
            checkpoints: {
                85: {
                    name: 'De keuken',
                    type: 'Rat',
                    code: 'CODEA000',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        2: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                },
                78: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    code: 'CODEB001',
                    questions: {
                        3: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        4: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    }
                }
            },
            service_types:{
                98:{
                    name: 'Hygiëne',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                },
                100: {
                    name: 'Hygiëne',
                    remarks: 'Test installatie begane grond',
                    state: null,
                    additional_questions:{},
                }
            },
            map: {
                icons: {
                    1: {
                        name: 'Icon A',
                        y: '38%',
                        x: '85%',
                    }
                },
            },
            remarks: [],
        }
    }
};

var DataStoreHelper = function() {}


DataStoreHelper.prototype.all = DataStoreHelper.all = function(callback){
    var objectStore = this.objectStore;
	var request = objectStore.openCursor();
    var results = [];
	request.onsuccess = function(event){
		var cursor = event.target.result;
		if(cursor){
            results.push(cursor.value);
			cursor.continue();
        } else {
            callback.call(this, results);
        }

    }
}
DataStoreHelper.prototype.findByIds = DataStoreHelper.findByIds = function(keys, callback){


    var collection = [];
    var objectStore = this.objectStore;
    var constructorClass = this.className;

    if(Array.isArray( keys )){
        var length = keys.length;
        get.call(this, 0);

        function get(arrayIndex){
            console.log("Array index: " + arrayIndex);
            var request = objectStore.get(keys[arrayIndex]);

            console.log(keys[arrayIndex]);
            request.onsuccess = function(){

                var obj = false;
                if(typeof request.result != 'undefined'){
                    var obj = new window[constructorClass]();
                    obj.isNewRecord = false;
                    for(var i in request.result){
                        obj[i] = request.result[i];
                    }
                }
                collection.push(obj);
                if(arrayIndex < length - 1){
                    get(++arrayIndex);
                } else {
                    callback.call(this, collection);
                }
            }
        }
    }
}
DataStoreHelper.prototype.isNewRecord = DataStoreHelper.isNewRecord = true;
DataStoreHelper.prototype.findById = DataStoreHelper.findById = function(id, callback){
    var request = this.objectStore.get(id);
    var c = this.className;
    request.onsuccess = function(){
        var obj = false;
        if(typeof request.result != 'undefined'){
            var obj = new window[c]();
            obj.isNewRecord = false;
            for(var i in request.result){
                obj[i] = request.result[i];
            }
        }
        callback.call(request, obj);
    }
}

DataStoreHelper.prototype.update = DataStoreHelper.update = function(callback){
    var dataStoreHelper = new DataStoreHelper();

    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.className;

    var data = {};

    for(var i in this){
        if(i == 'length' || typeof this[i] == 'function'){ continue; }
        data[i] = this[i];
    }

    var request = dataStoreHelper.objectStore.put(data);
    request.onerror = function(event) {
        callback.call(this, false);
    };
    request.onsuccess = function(event) {
        callback.call(this, true);
    };
}
DataStoreHelper.prototype.find = DataStoreHelper.find = function(){
    var dataStoreHelper = new DataStoreHelper();
    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.className;
    return dataStoreHelper;
}
DataStoreHelper.prototype.put = DataStoreHelper.put = function(data){
    var dataStoreHelper = new DataStoreHelper();
    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.className;
    dataStoreHelper.objectStore.put(data);
}

window['DataStoreHelper'] = DataStoreHelper;

var Day = function() {
    this.className = 'Day';

    this.storeName = function(){
        return "day";
    }
    this.sync = function(){
        var result = [];
        $.ajax({
            url: app.restClient.getDays,
            method: 'POST',
            dataType: 'json',
            data: {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            },
            success: function(resp){
                if(resp.result == true){
                    result = resp.data;
                } else if(resp.result == false){
                    alert('Er ging iets mis! (100)');
                } else {
                    alert(app.exceptions.serverError);
                }
            },
            async: false
        });
        return result;
    }
}

Day.prototype.all = DataStoreHelper.all;
Day.prototype.findById = DataStoreHelper.findById;
Day.prototype.update = DataStoreHelper.update;
Day.prototype.find = DataStoreHelper.find;
Day.prototype.put = DataStoreHelper.put;
window['Day'] = Day;

var Comments = function() {
    this.className = 'Comments';
    this.storeName = function(){
        return "comments";
    }
    this.sync = function(){
        var result = [];
        $.ajax({
            url: app.restClient.getComments,
            method: 'POST',
            dataType: 'json',
            data: {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            },
            success: function(resp){
                if(resp.result == true){
                    result = resp.data;
                } else if(resp.result == false){
                    alert('Er ging iets mis! (100)');
                } else {
                    alert(app.exceptions.serverError);
                }
            },
            async: false
        });
        return result;
    }
}

Comments.prototype.all = DataStoreHelper.all;
Comments.prototype.findById = DataStoreHelper.findById;
Comments.prototype.update = DataStoreHelper.update;
Comments.prototype.find = DataStoreHelper.find;
Comments.prototype.put = DataStoreHelper.put;
window['Comments'] = Comments;

var Remarks = function() {
    this.className = 'Remarks';
    this.storeName = function(){
        return "remarks";
    }
    this.sync = function(){
        var result = [];
        $.ajax({
            url: app.restClient.getRemarks,
            method: 'POST',
            dataType: 'json',
            data: {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            },
            success: function(resp){
                if(resp.result == true){
                    result = resp.data;
                } else if(resp.result == false){
                    alert('Er ging iets mis! (110)');
                } else {
                    alert(app.exceptions.serverError);
                }
            },
            async: false
        });
        return result;
    }
}

Remarks.prototype.all = DataStoreHelper.all;
Remarks.prototype.findById = DataStoreHelper.findById;
Remarks.prototype.update = DataStoreHelper.update;
Remarks.prototype.find = DataStoreHelper.find;
Remarks.prototype.put = DataStoreHelper.put;
window['Remarks'] = Remarks;


var Product = function() {
    this.className = 'Product';
    this.storeName = function(){
        return "product";
    }
    this.sync = function(){
        var result = [];
        $.ajax({
            url: app.restClient.getProducts,
            method: 'POST',
            dataType: 'json',
            data: {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            },
            success: function(resp){
                if(resp.result == true){
                    result = resp.data;
                } else if(resp.result == false){
                    alert('Er ging iets mis! (110)');
                } else {
                    alert(app.exceptions.serverError);
                }
            },
            async: false
        });
        return result;
    }
}

Product.prototype.all = DataStoreHelper.all;
Product.prototype.findById = DataStoreHelper.findById;
Product.prototype.update = DataStoreHelper.update;
Product.prototype.find = DataStoreHelper.find;
Product.prototype.put = DataStoreHelper.put;
window['Product'] = Product;



var Category = function() {
    this.className = 'Category';
    this.storeName = function(){
        return "category";
    }
    this.sync = function(){
        var result = [];
        $.ajax({
            url: app.restClient.getCategories,
            method: 'POST',
            dataType: 'json',
            data: {
                "AppUserValidateForm[imei]": app.user.imei,
                "AppUserValidateForm[token]": app.user.token,
                "AppUserValidateForm[inspector_id]": app.user.inspector_id,
            },
            success: function(resp){
                if(resp.result == true){
                    result = resp.data;
                } else if(resp.result == false){
                    alert('Er ging iets mis! (110)');
                } else {
                    alert(app.exceptions.serverError);
                }
            },
            async: false
        });
        return result;
    }
}

Category.prototype.all = DataStoreHelper.all;
Category.prototype.findById = DataStoreHelper.findById;
Category.prototype.update = DataStoreHelper.update;
Category.prototype.find = DataStoreHelper.find;
Category.prototype.put = DataStoreHelper.put;
window['Category'] = Category;



var User = function(args){
    this.imei = localStorage.getItem('imei');
    this.inspector_id = localStorage.getItem('inspector_id');
    this.token = localStorage.getItem('token');

    this.isGuest =
        (this.imei == null || this.inspector_id == null || this.token == null);

    for(var i in args){
        this[i] = args;
    }
}
User.prototype.login = function(username, password, success, error){
    $.ajax({
        url: app.restClient.userLogin,
        method: 'POST',
        dataType: 'json',
        data: {
            "AppUserLoginForm[username]": username,
            "AppUserLoginForm[password]": password,
            "AppUserLoginForm[imei]": app.imei,
        },
        success: function(resp){

            if(resp.result === true){
                localStorage.setItem('imei', app.imei);
                localStorage.setItem('token', resp.data.token);
                localStorage.setItem('inspector_id', resp.data.inspector_id);
                localStorage.setItem('name', resp.data.name);

                success.call(this, resp);
            } else if(resp.result === false) {
                success.call(this, resp);
            } else {
                app.notification.show(app.exceptions.serverError);
            }

        },
        error: function(){

            localStorage.removeItem('imei');
            localStorage.removeItem('token');
            localStorage.removeItem('inspector_id');
            localStorage.removeItem('name');

            error.call(this, null);
        },
        async: false
    })
}
User.prototype.auth = function(success, error){
    var p = this;
    $.ajax({
        url: app.restClient.userAuth,
        method: 'POST',
        dataType: 'json',
        data: {
            "AppUserValidateForm[imei]": this.imei,
            "AppUserValidateForm[token]": this.token,
            "AppUserValidateForm[inspector_id]": this.inspector_id,
        },
        success: function(resp){
            success.call(this, resp);
        },
        error: function(){
            error.call(this, null);
        },
        async: false,
    })
}
window['User'] = User;
