
const productos = [];
$.ajaxSetup({async: false});
$.getJSON("../data.json", function(result, estado){
    for (const producto of result) {
        productos.push(producto);
    }
});





