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
                    code: 'CODEX666',
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

var availableRemarks = {
    actionees: {
        1: 'Attack',
        2: 'Klant',
        3: 'Derde partij'
    },
    groups: {
        1: 'Algemeen',
        2: 'Groep'
    },
    types: {
        1: 'Klacht',
        2: 'Service',
        3: 'Anders'
    }
}

var availableComments = [
    {
        actionee_id: 1,
        group_id: 1,
        type_id: 2,
        name: "Ik heb een keukenkastje opgeruimd"
    },
    {
        actionee_id: 2,
        group_id: 1,
        type_id: 3,
        name: "De klant heeft beloofd koffie neer te zetten"
    }
];

// class DataStoreHelper{
//     constructor(){
//         this.isNewRecord = true;
//     }
//     static find(){
//         var dataStoreHelper = new DataStoreHelper();
//         dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
//         dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
//         dataStoreHelper.className = this.name;
//         return dataStoreHelper;
//     }
//     all(callback){
//         var request = this.objectStore.getAll();
//         var c = this.className;
//
//         request.onsuccess = function(){
//
//             var objs = [];
//
//             for(var o in request.result){
//
//                 var obj = new window[c]();
//                 obj.isNewRecord = false;
//
//                 for(var i in request.result[o]){
//                     obj[i] = request.result[o][i];
//                 }
//
//                 objs.push(obj);
//             }
//
//             callback.call(request, objs);
//         }
//     }
//     findById(id, callback){
//         var request = this.objectStore.get(id);
//         var c = this.className;
//         request.onsuccess = function(){
//             var obj = new window[c]();
//             obj.isNewRecord = false;
//             for(var i in request.result){
//                 obj[i] = request.result[i];
//             }
//
//             callback.call(request, obj);
//         }
//     }
//     static put(data){
//         var dataStoreHelper = new DataStoreHelper();
//         dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
//         dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
//         dataStoreHelper.className = this.name;
//         dataStoreHelper.objectStore.put(data);
//     }
//     update(callback){
//         var dataStoreHelper = new DataStoreHelper();
//
//         dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
//         dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
//         dataStoreHelper.className = this.name;
//
//         var data = {};
//
//         for(var i in this){
//             if(i == 'length'){ continue; }
//             data[i] = this[i];
//         }
//
//         var request = dataStoreHelper.objectStore.put(data);
//         request.onerror = function(event) {
//         // Do something with the error
//             callback.call(this, false);
//         };
//         request.onsuccess = function(event) {
//         // Success - the data is updated!
//             callback.call(this, true);
//         };
//
//     }
// }
// window['DataStoreHelper'] = DataStoreHelper;
//
// class Day extends DataStoreHelper{
//     static storeName(){
//         return "day";
//     }
//     storeName(){
//         return "day";
//     }
// }
//
// window['Day'] = Day;



var DataStoreHelper = function() {
    this.isNewRecord = true;
    this.all = function(callback){
        var request = this.objectStore.getAll();
        var c = this.className;

        request.onsuccess = function(){

            var objs = [];

            for(var o in request.result){

                var obj = new window[c]();
                obj.isNewRecord = false;

                for(var i in request.result[o]){
                    obj[i] = request.result[o][i];
                }

                objs.push(obj);
            }

            callback.call(request, objs);
        }
    }

    this.findById = function(id, callback){
        var request = this.objectStore.get(id);
        var c = this.className;
        request.onsuccess = function(){
            var obj = new window[c]();
            obj.isNewRecord = false;
            for(var i in request.result){
                obj[i] = request.result[i];
            }

            callback.call(request, obj);
        }
    }

    this.update = function(callback){
        var dataStoreHelper = new DataStoreHelper();

        dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
        dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
        dataStoreHelper.className = this.name;

        var data = {};

        for(var i in this){
            if(i == 'length'){ continue; }
            data[i] = this[i];
        }

        var request = dataStoreHelper.objectStore.put(data);
        request.onerror = function(event) {
            // Do something with the error
            callback.call(this, false);
        };
        request.onsuccess = function(event) {
            // Success - the data is updated!
            callback.call(this, true);
        };
    }

    this.find = function(){
        var dataStoreHelper = new DataStoreHelper();
        dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
        dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
        dataStoreHelper.className = this.name;
        return dataStoreHelper;
    }

    this.put = function(data){
        var dataStoreHelper = new DataStoreHelper();
        dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
        dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
        dataStoreHelper.className = this.name;
        dataStoreHelper.objectStore.put(data);
    }
}

DataStoreHelper.all = function(callback){
    var request = this.objectStore.getAll();
    var c = this.className;

    request.onsuccess = function(){

        var objs = [];

        for(var o in request.result){

            var obj = new window[c]();
            obj.isNewRecord = false;

            for(var i in request.result[o]){
                obj[i] = request.result[o][i];
            }

            objs.push(obj);
        }

        callback.call(request, objs);
    }
}

DataStoreHelper.findById = function(id, callback){
    var request = this.objectStore.get(id);
    var c = this.className;
    request.onsuccess = function(){
        var obj = new window[c]();
        obj.isNewRecord = false;
        for(var i in request.result){
            obj[i] = request.result[i];
        }

        callback.call(request, obj);
    }
}

DataStoreHelper.update = function(callback){
    var dataStoreHelper = new DataStoreHelper();

    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.name;

    var data = {};

    for(var i in this){
        if(i == 'length' || typeof this[i] == 'function'){ continue; }
        data[i] = this[i];
    }

    var request = dataStoreHelper.objectStore.put(data);
    request.onerror = function(event) {
    // Do something with the error
        callback.call(this, false);
    };
    request.onsuccess = function(event) {
    // Success - the data is updated!
        callback.call(this, true);
    };
}

DataStoreHelper.find = function(){
    var dataStoreHelper = new DataStoreHelper();
    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.name;
    return dataStoreHelper;
}
DataStoreHelper.put = function(data){
    var dataStoreHelper = new DataStoreHelper();
    dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
    dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
    dataStoreHelper.className = this.name;
    dataStoreHelper.objectStore.put(data);
}

window['DataStoreHelper'] = DataStoreHelper;

var Day = function() {
    for(var i in DataStoreHelper){
        this[i] = DataStoreHelper[i];
    }

    this.storeName = function(){
        return "day";
    }
}
Day.storeName = function(){
    return "day";
}
for(var i in DataStoreHelper){
    Day[i] = DataStoreHelper[i];
}

window['Day'] = Day;

var Comments = function() {
    for(var i in DataStoreHelper){
        this[i] = DataStoreHelper[i];
    }

    this.storeName = function(){
        return "comments";
    }
}
Comments.storeName = function(){
    return "comments";
}
for(var i in DataStoreHelper){
    Comments[i] = DataStoreHelper[i];
}

window['Comments'] = Comments;

var Remarks = function() {
    for(var i in DataStoreHelper){
        this[i] = DataStoreHelper[i];
    }

    this.storeName = function(){
        return "remarks";
    }
}
Remarks.storeName = function(){
    return "remarks";
}
for(var i in DataStoreHelper){
    Remarks[i] = DataStoreHelper[i];
}

window['Remarks'] = Remarks;
