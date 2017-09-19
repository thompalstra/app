var scanner = {
    onsuccess: function(data){
        alert("Success: " + data);
    },
    onerror: function(data){
        console.log("Error: " + data);
    },
    register: function(){
        cordova.exec(scanner.onsuccess, scanner.onerror, "nzzPlugin", "registerScanner", []);
    }
};
