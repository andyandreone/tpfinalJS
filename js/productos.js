
const productos = [];
$.ajaxSetup({async: false});
$.getJSON("../data.json", function(result, estado){
    console.log(status);
    for (const producto of result) {
        productos.push(producto);
    }
});





