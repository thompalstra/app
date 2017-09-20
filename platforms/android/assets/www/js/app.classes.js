var data = {
    // timestamp of the current day
    1505822400 : {
        // appointment object
        34: {
            walking_time: '00:45:00',
            // customer data
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
            // service point models
            service_points: {
                37: {
                    name: 'De keuken',
                    type: 'Rat',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            answerType: 'TEXT',
                            answer: null,
                        },
                        1: {
                            question: 'Dit is nog een vraag',
                            answerType: 'BOOLEAN',
                            answer: null,
                        }
                    }
                },
                231: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            answerType: 'TEXT',
                            answer: null,
                        },
                        1: {
                            question: 'Dit is nog een vraag',
                            answerType: 'BOOLEAN',
                            answer: null,
                        }
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
        },
    },
    1505908800: {
        53: {
            walking_time: '01:30:00',

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
        },
        402 : {
            walking_time: '00:45:00',

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
        }
    }
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
