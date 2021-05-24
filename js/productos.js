
const productos = [];
const URLGET = "../data.json";
//$.ajaxSetup({async: false});
$.get("../data.json", function(result, estado){
    console.log(status);
    if(estado === "success"){
        for (const producto of result) {
            productos.push(producto);
        }    
    }
});





