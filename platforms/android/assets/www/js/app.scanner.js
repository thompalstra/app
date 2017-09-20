var scanner = {
    onsuccess: function(data){
        alert("Success scanner: " + data);
    },
    onerror: function(data){
        console.log("Error: " + data);
    },
    register: function(){
        cordova.exec(scanner.onsuccess, scanner.onerror, "nzzPlugin", "registerScanner", []);
    }
};

var doubleTapToast = {
    onsuccess: function(data){
        //console.log("Success: " + data);
    },
    onerror: function(data){
        //console.log("Error: " + data);
    },
    show: function(){
        cordova.exec(doubleTapToast.onsuccess, doubleTapToast.onerror, "nzzPlugin", "doubleTapToast", []);
    }
}
