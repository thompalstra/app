var scanner = {
    canScan: false,
    onsuccess: function(data){
        if(app.scanner.canScan == false){
            alert("Selecteer eerst een afspraak, voordat u een controlepunt scant.");
        } else if(app.scanner.canScan == 'insertCode'){
            var debtor_service_type_id = app.checkpoint.debtor_service_type_id;
            var exists = false;
            for(var i in app.appointment.checkpoints){
                var cp = app.appointment.checkpoints[i];

                if(cp.debtor_service_type_id == debtor_service_type_id){

                    if( String( cp.barcode ) == String( data ) ){
                        exists = true;
                        break;
                    }
                }
            }
            if( exists == true ){
                alert("Barcode wordt reeds gebruikt. Gebruik een andere barcode");
            } else {
                app.checkpoint.barcode = data;
                app.checkpoint.is_scanned = true;
                app.scanner.canScan = false;
                app.day.update(function(e){
                    alert("Barcode bijgewerkt.");

                    app.navigate.to('views/checkpoints/view.html');
                });
            }
        } else {
            $('.form-search-code input[name="value"]').val(data);
            $('.form-search-code').submit();

            console.log('search for barcode: ' + data);

            var items = $('.checkpoint-list .item:not(.hidden');
            if(items.length == 1){
                var checkpoint = $(items[0]).attr('checkpoint');
                app.checkpoint = app.appointment.checkpoints[checkpoint];
                app.checkpoint.scanned = true;
                app.checkpointIndex = checkpoint;
                if(app.checkpoint){
                    if(!app.checkpoint.is_opened){
                        app.checkpoint.is_opened = true;
                        app.day.update(function(e){
                            app.navigate.to('views/checkpoints/view.html');
                        });
                    }

                    app.navigate.to('views/checkpoints/view.html');
                }
            }
        }
    },
    onerror: function(data){
        alert("Oeps er ging iets mis. (0001)");
    },
    register: function(){
        cordova.exec(app.scanner.onsuccess, app.scanner.onerror, "nzzPlugin", "registerScanner", []);
    }
};
var doubleTapToast = {
    onsuccess: function(data){
    },
    onerror: function(data){
    },
    show: function(){
        cordova.exec(doubleTapToast.onsuccess, doubleTapToast.onerror, "nzzPlugin", "doubleTapToast", []);
    }
}
