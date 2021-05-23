

function cargarProductos(){
//CARGAR PRODUCTOS EN EL INDEX.HTML

    //GUARDO EN VARIABLE LOS PRODUCTOS ALMACENADOS EN EL SESSION STORAGE
    let storedProductos = JSON.parse(sessionStorage.getItem("productos"));
    
    if(storedProductos!=null){
        $('#listaProductos').html("");
    for(const producto of storedProductos){
        //AGREGO EN EL INDEX.HTML LOS PRODUCTOS CON SU ESTRUCTURA
        $('#listaProductos').append('<div class="col-md-3 producto"><div><p class="nProducto">Producto N°: ' + producto.id + 
        '</p> <h5 class="nombre">' + producto.nombre + 
        '</h5> <img src="../img/1.png"><p class="precio"> $ '  + producto.precio + 
        '</p> <button class="btn btn-dark agregar" id="agr'+ producto.id +
        '">Agregar</button><p class="cantidad">'+ producto.cantidad +'</p></div></div>');
        
        //ACCION AL REALIZAR CLICK EN AGREGAR
        $(`#agr${producto.id}`).click(function(){
            let storedCarrito = sessionStorage.getItem("carrito");
            let arrayCarrito = [];
            if( storedCarrito != null){
                let tempMyCarrito = JSON.parse(storedCarrito);
                for (const product of tempMyCarrito) {
                    arrayCarrito.push(product);     
                }        
            }
            //LE SUMO UNA UNIDAD EN LA CANTIDAD Y LO ALMACENO EN EL SESSIONSTORAGE
            producto.cantidad ++;
            sessionStorage.setItem("productos", JSON.stringify(storedProductos));

            //AGREGO EL PRODUCTO AL CARRITO Y LUEGO LO ALMACENO EN EL SESSIONSTORAGE
            arrayCarrito.push(producto);  
            sessionStorage.setItem("carrito", JSON.stringify(arrayCarrito));

            cargarCarrito(1);
            cargarProductos();
        });
    }
    }else{
        //SI NO HAY PRODUCTOS EN EL SESSIONSTORAGE LO ALMACENO POR PRIMERA VEZ
        sessionStorage.setItem("productos", JSON.stringify(productos));
        cargarProductos();
    }
}



function cargarCarrito(operacion){

    $('#listaCompra').html("");
    let storedCarrito = JSON.parse(sessionStorage.getItem("carrito"));
    let i=-1;
    let suma = 0;
  
    if(storedCarrito==null||storedCarrito.length==[]){   
        $('#total').html("No hay productos agregados");
        
    }else{
            for(const producto of storedCarrito){
                i++;
                producto.posicion = i;
                suma = suma + producto.precio;
            
                if(suma!=0){
                    $('#total').html(`<div><p> TOTAL: $${suma}</p><button id="comprar" class="btn btn-success">Comprar</button></div>`);
                    //Accion al apretar el boton comprar
                    $('#comprar').click(()=>{
                        $('#compra').css("display","none");
                        $('#compra').fadeIn();
                        $('#compra').html('<div class="ticket"><p>Completa tus datos para confirmar el pedido</p><input type="name" class="form-control" id="nombre" placeholder="Ingrese su nombre"><input id="direccion" type="text" class="form-control" placeholder="Ingrese la direccion de envio"><button id="continuarCompra" class="btn btn-outline-success">Continuar Compra</button></div>')
                        //Accion al apretar el boton continuar compra
                        $('#continuarCompra').click(()=>{
                            let nombre = $("#nombre").val();
                            let direccion = $("#direccion").val();
                            $('#compra').css("display","none");
                            $('#compra').css("background","white");
                            $('#compra').fadeIn();
                            $('#compra').html("");
                            $('#compra').append('<p class="detalle"> El detalle de la compra es:</p>');
                            $('#compra').append('<p>Nombre: '+ nombre );
                            $('#compra').append('<p>Direccion: '+ direccion);
                                for(const producto of storedCarrito){
                                    $('#compra').append('<ul><li>' + producto.nombre +'</li> <li> Precio $: ' + producto.precio + '</li></ul>');
                                }
                            $('#compra').append(`<div class="total"><p> TOTAL: $${suma}`);   
                            $('#compra').append('<div ><button id="confirmarCompra" class="btn btn-outline-success">Confirmar Compra</button></div>');
                            //Accion al apretar el boton confirmar compra
                            $('#confirmarCompra').click(()=>{
                                sessionStorage.removeItem("carrito");
                                sessionStorage.removeItem("productos");
                                $('#compra').css("display","none");
                                $('#compra').fadeIn();
                                $('#compra').html("<p>Compra Confirmada, muchas gracias!. El pedido llegara en menos de 40 minutos.</p>");
                                $('#compra').append('<div"><button id="realizarOtroPedido" class="btn btn-outline-success">Realizar otro pedido</button></div>');
                                $('#realizarOtroPedido').click(()=>{
                                    window.location.reload();
                                });


                            });  
                        });
                        
                    });
                }      
                $('#listaCompra').append('<div id="itemCarrito'+ i +'"><p class="nombreSuma">' + producto.nombre +'</p> <p> Precio $: ' + producto.precio + '</p><button id="elm'+ i +'" class="btn btn-outline-danger eliminar">Eliminar</button></div>');
                
                if((i+1 == storedCarrito.length)&&(operacion==1)){
                    $(`#itemCarrito${i}`).css("display","none");
                    $(`#itemCarrito${i}`).fadeIn();
                }      
                
                $(`#elm${i}`).click(function(){
                    storedCarrito.splice(producto.posicion,1);
                    sessionStorage.setItem("carrito", JSON.stringify(storedCarrito));
                    
                    
                    let storedProductos = JSON.parse(sessionStorage.getItem("productos"));
                    
                    storedProductos[producto.id].cantidad--;
                    sessionStorage.setItem("productos", JSON.stringify(storedProductos));

                    cargarCarrito();  
                    cargarProductos();
                          
                });
            }  
        }    
}
