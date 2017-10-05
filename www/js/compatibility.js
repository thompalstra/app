if(typeof FormData.prototype.getAll == 'undefined'){
    FormData = function(element){
        this.element = element;
    }

    FormData.prototype.getAll = function(){
        var values = [];

        for(var i in $(this.element).serializeArray()){
            var item = $(this.element).serializeArray()[i];
            values.push(item.value);
        }
        return values;
    }
}
