var scanner = {
    canScan: false,
    onsuccess: function(data){
        if(app.scanner.canScan == false){
            alert("Selecteer eerst een afspraak, voordat u een meetpunt scant. succ");
        } else {
            $('.form-search-code input[name="value"]').val(data);
            $('.form-search-code').submit();

            var items = $('.checkpoint-list .item:not(.hidden');
            if(items.length == 1){
            	console.log('Going to target...');

                var checkpoint = $(items[0]).attr('checkpoint');
                app.checkpoint = app.appointment.checkpoints[checkpoint];
                app.checkpoint.scanned = true;
                app.checkpointIndex = checkpoint;
                if(app.checkpoint){
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
