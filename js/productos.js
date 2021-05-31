
const productos = [];
const URLGET = "../data.json";

//Solcito los datos de los productos en data.json y los guardo en el array productos
$.get("../data.json", function(result, estado){
    console.log(estado);
    if(estado === "success"){
        for (const producto of result) {
            productos.push(producto);
        }    
        cargarProductos();
        cargarCarrito();
    }
});





