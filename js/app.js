

function cargarProductos(){
//CARGAR PRODUCTOS EN EL INDEX.HTML

    //GUARDO EN VARIABLE LOS PRODUCTOS ALMACENADOS EN EL SESSION STORAGE
    let storedProductos = JSON.parse(sessionStorage.getItem("productos"));
    
    if(storedProductos!=null){
        $('#listaProductos').html("");
    for(const producto of storedProductos){
        //AGREGO EN EL INDEX.HTML LOS PRODUCTOS CON SU ESTRUCTURA
        $('#listaProductos').append('<div class="col-md-3 producto"><p class="nProducto">Producto N°: ' + producto.id + 
        '</p>  <img src="../img/'+ producto.image +
        '"><h5 class="nombre">' + producto.nombre + 
        '</h5><p class="precio"> $ '  + producto.precio + 
        '</p> <button class="btn btn-dark agregar" id="agr'+ producto.id +
        '">Agregar</button><p class="cantidad">'+ producto.cantidad +'</p></div>');
        
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
    let NombreDefault = "";
    let DireccionDefault = "";
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
                    $('#comprar').click(function ingresarDatos (nombre, direccion, errorIngresoDatos){
                        animarCompra();
                            
                            if(NombreDefault == ""){
                                NombreDefault=nombre;
                                nombre = "";
                            }
                                
                            
                            if(DireccionDefault == ""){
                                DireccionDefault=direccion;
                                direccion ="";
                            }

                            if(errorIngresoDatos == "error"){
                                errorIngresoDatos = "Por favor, ingrese correctamente los datos"
                            }else{
                                errorIngresoDatos = "";
                            }

                            $('#compra').html(`<div class="ticket"><p>Completa los datos del pedido</p><p class="error">${errorIngresoDatos}</p><label for="nombre">Ingrese su nombre</label><input type="name" class="form-control" id="nombre" value="${nombre}"><label for="direccion">Ingrese la direccion de entrega</label><input id="direccion" type="text" class="form-control" value="${direccion}"><button id="atras1" class="btn btn-secondary">Atras</button><button id="continuarCompra" class="btn btn-outline-success">Continuar Compra</button></div>`)
                            $('.error').fadeIn();
                           
                            //Click en el boton atras, vuelve a completar el carrito
                            $('#atras1').click(()=>{
                                animarCompra();
                                $('#compra').html('<h2>CARRITO</h2><div id="listaCompra"></div><h5 id="total"></h5>');
                                cargarCarrito();
                            })

                        //Click en boton continuar compra
                        $('#continuarCompra').click(()=>{
                            //Se guardan los datos de los input en variables        
                            let nombre = $("#nombre").val();
                            let direccion = $("#direccion").val();
                           
                            //Se validan los ingresos de los input
                            if(nombre=="" || direccion==""){
                                let errorIngresoDatos = "error";
                                ingresarDatos(nombre,direccion,errorIngresoDatos);
                            }else{
                                //Se cambia a fondo blanco la compra y se anima
                                $('#compra').css("background","white");
                                animarCompra();

                                //Se agregan los datos de la compra
                                $('#compra').html("");
                                $('#compra').append('<p class="detalle"> El detalle de la compra es:</p>');
                                $('#compra').append('<p>Nombre: '+ nombre );
                                $('#compra').append('<p>Direccion: '+ direccion);
                                for(const producto of storedCarrito){
                                    $('#compra').append('<ul><li>' + producto.nombre +'</li> <li> Precio $: ' + producto.precio + '</li></ul>');
                                }
                                $('#compra').append(`<div class="total"><p> TOTAL: $${suma}`);   
                                $('#compra').append('<div ><button id="atras2" class="btn btn-secondary">Atras</button><button id="confirmarCompra" class="btn btn-outline-success">Confirmar Compra</button></div>');
                            }
                            //Cliick en boton atras, se dirige al ingreso de datos
                            $('#atras2').click(()=>{
                                animarCompra();
                                ingresarDatos(nombre, direccion);
                            })

                            //Click el boton confirmar compra, se vacia el session storage y se deja mensaje de confirmacion
                            $('#confirmarCompra').click(()=>{

                                //La informacion al enviar al backend
                                console.log("nombre: " + nombre);
                                console.log("direccion: " + direccion);
                                let index =1;
                                for(const producto of storedCarrito){
                                    console.log(index +":"+ producto.nombre);
                                    index++;
                                }
                                console.log("total: " + suma);

                                //Vacio el sessionStorage
                                sessionStorage.removeItem("carrito");
                                sessionStorage.removeItem("productos");
                                
                                //Cargo la animacion y envio mensaje de confirmacion
                                animarCompra();
                                $('#compra').html("<p>Compra Confirmada, muchas gracias!. El pedido sera enviado a la brevedad.</p>");
                                $('#compra').append('<div"><button id="realizarOtroPedido" class="btn btn-outline-success">Realizar otro pedido</button></div>');
                                
                                //Click en boton de realizar otro pedido
                                $('#realizarOtroPedido').click(()=>{
                                    cargarProductos();
                                    $('#compra').html('<h2>CARRITO</h2><div id="listaCompra"></div><h5 id="total"></h5>');
                                    cargarCarrito();
                                });


                            });  
                        });
                        
                    });
                }      
                //Se listan los productos en el carrito
                $('#listaCompra').append('<div id="itemCarrito'+ i +'"><p class="nombreSuma">' + producto.nombre +'</p> <p> Precio $: ' + producto.precio + '</p><button id="elm'+ i +'" class="btn btn-outline-danger eliminar">Eliminar</button></div>');
                
                //Condiciono la animacion al agregar productos y no al eliminar
                if((i+1 == storedCarrito.length)&&(operacion==1)){
                    $(`#itemCarrito${i}`).css("display","none");
                    $(`#itemCarrito${i}`).fadeIn();
                }      

                //Accion al elimnar producto
                $(`#elm${i}`).click(function(){
                    storedCarrito.splice(producto.posicion,1);
                    sessionStorage.setItem("carrito", JSON.stringify(storedCarrito)); 
                    let storedProductos = JSON.parse(sessionStorage.getItem("productos"));    
                    storedProductos[producto.id].cantidad--;
                    if(storedProductos[producto.id].cantidad==0){
                        storedProductos[producto.id].cantidad="";
                    }
                    sessionStorage.setItem("productos", JSON.stringify(storedProductos));
                    cargarCarrito();  
                    cargarProductos();
                });
            }  
        }    
}


//Animacion en los pasos de la compra
function animarCompra(){
    $('#compra').css("display","none");
    $('#compra').fadeIn();
}

