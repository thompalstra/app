var data = {
    // timestamp of the current day
    1505822400 : {
        // appointment object
        34: {
            completed: false,
            walking_time: '00:45:00',
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
                email: 'info@ah-heerhugowaard.nl'
            },
            checkpoints: {
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
                    }
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
                    }
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
            map: {
                icons: {
                    0: {
                        name: 'Icon A',
                        y: '38%',
                        x: '85%',
                    }
                },
            },
        },
        40: {
            walking_time: '00:30:00',
            completed: false,
            debtor: {
                name: 'Jumbo',
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
                email: 'info@ah-heerhugowaard.nl'
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
        },
    },
    1505908800: {
        53: {
            walking_time: '01:30:00',
            completed: false,
            debtor: {
                name: 'Grolsch',
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
                email: 'info@ah-heerhugowaard.nl'
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
        },
        402 : {
            walking_time: '00:45:00',
            completed: false,
            debtor: {
                name: 'Heineken',
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
                email: 'info@ah-heerhugowaard.nl'
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
        }
    }
};

var availableProducts = {
    1: {
        code: 'Non Tox',
        name: 'Sorkil Non Tox',
        description: 'Niet giftig'
    },
    2: {
        code: 'Non Tox',
        name: 'Blue Ridge Termite spray',
        description: 'Non Tox',
    },
    3: {
        code: 'Tox',
        name: "Heel erg giftige gif",
        description: 'Alles gaat hierdoor dood ofzo :(',
    },
};

class DataStoreHelper{
    constructor(){
        this.isNewRecord = true;
    }
    static find(){
        var dataStoreHelper = new DataStoreHelper();
        dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
        dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
        dataStoreHelper.className = this.name;
        return dataStoreHelper;
    }
    all(callback){
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
    findById(id, callback){
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
    static put(data){
        var dataStoreHelper = new DataStoreHelper();
        dataStoreHelper.transaction = app.database.db.transaction([this.storeName()], "readwrite");
        dataStoreHelper.objectStore = dataStoreHelper.transaction.objectStore(this.storeName());
        dataStoreHelper.className = this.name;
        dataStoreHelper.objectStore.put(data);
    }
    update(callback){
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
}
window['DataStoreHelper'] = DataStoreHelper;

class Day extends DataStoreHelper{
    static storeName(){
        return "day";
    }
    storeName(){
        return "day";
    }
}

window['Day'] = Day;
