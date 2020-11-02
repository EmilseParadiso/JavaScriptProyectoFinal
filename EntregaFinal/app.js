/* creo esta constante para que si la persona recarga la pàgina le siga apareciendo lo previo que habìa elegido*/
let carrito = localStorage.carrito ? JSON.parse(localStorage.carrito) : [];

// Inicializo todas las variables que luego voy a usar// ---------------------------------------------------------------------------------
const divElementos = document.querySelector("#productos");
const divCarrito = document.querySelector('#carrito');
const divTotalCarrito = document.querySelector('#totalCarrito');
const vaciarCarrito = document.querySelector("#eliminar");
const exitocompra = document.querySelector("#exito");

// fin de las variables// ---------------------------------------------------------------------------------

// llamo a la funcion que genera todos los productos en la grilla de la web// ---------------------------------------------------------------------------------
agregarProductos()
// fin de la llamada/ --------------------------------------------------------------------------------------


// llamo a la funcion que elimina todos los elementos que contiene el carrito// ----------------------------------------------------------------------------------------------
vaciarCarrito.addEventListener('click', eliminarCarritoCompleto())
// fin de la llamada/ --------------------------------------------------------------------------------------

//funcion que sirve para emitir cartel en caso de que la persona quiera finalizar la compra.
//escucha a el boton de finalizar compra en caso de que se haga click lanza un alerta de finalización//----------------------------------------
exitocompra.addEventListener('click', function (e) {
  alert("Su compra fue realizada con éxito, a la brevedad nos comunicaremos con usted.");
});
// fin de la funcioón/ --------------------------------------------------------------------------------------


//JQuery-- genero varias clases que luego utilizo en CSS, para dar animación a cuando el cliente elige agregar un producto//----------------------------------------	
$(document).ready(function () {
  // recorro todos los productos para buscar el nombre de la clase que puse, para que solo se active si se hizo click en ese elemento//
  productos.forEach((producto) => {
    $(`#${producto.nombre}`).click(function () {
      // genero una nueva clase, que luego uso en CSS//
      $(this).addClass("activo");


      // genero una nueva clase, que luego uso en CSS//
      setTimeout(function () {
        $(`#${producto.nombre}`).addClass("exitoso");
      }, 2000);

      // elimino las clases, para que vuelva el Boton a su estado inicial//

      setTimeout(function () {
        $(`#${producto.nombre}`).removeClass("activo");
        $(`#${producto.nombre}`).removeClass("exitoso");
      }, 3500);
    });
  });
});

//JQuery-- Fin //---------------

//Inicio de las funciones de la app// -------------------------------------------------

//agregarProductos se encarga de cargar todos los productos que se encuentra en productos.js en la grilla principal de la web// -------------------

function agregarProductos() {
  //recorro los productos//
  productos.forEach((producto) => {
    //genero el html que los va a contener//
    let divIn = document.createElement("div");
    divIn.className = "col";
    // genero un boton llamado "agregaralcarrito" que luego al hacer click será el que dispare agregar dicho elemento al carrito, aquí mismo también//
    //le asigno a la clase del boton el id que necesito para luego usarlo en JQuery//
    divIn.innerHTML = ` <h3>${producto.nombre}</h3> 
        <img src=${producto.img} alt="${producto.nombre}"class="fotos">
        <p class="precioProd" > Precio por Kg $ ${producto.precio}</p>
        <button id=${producto.nombre} onclick="agregarACarrito(${productos.indexOf(producto)})">Agregar Al Carrito</button>`;
    //para que todo esto tenga validez, lo agrego al padre //
    divElementos.appendChild(divIn);
  })
}
//Fin agregar productoS// ------------------------------------------

//agregar al carrito viene con una variable asignada que le dejo el agregarproductos en el boton que lo que hace es traer el index del producto que quiero agregar//----

function agregarACarrito(index) {
  var elemento = productos[index];
  //primero chequeo si el carrito tiene algo adentro//
  if (carrito.length > 0) {
    //en el caso de que si seteo una variable y lo empiezo a recorrer//
    var flagExistencia = true;
    for (var i = 0; i < carrito.length; i++) {
      //si al recorrerlo encuentro el mismo producto que venía en el index, entonces le digo que le agregue cantidad//
      if (elemento.nombre == carrito[i].nombre) {
        carrito[i].cantidad++;
        flagExistencia = false;
      }
    }
    //si no existe el producto, entonces le digo, agregame el elemento al carrito//
    if (flagExistencia) {
      elemento.cantidad = 1;
      carrito.push(elemento);
    }
    //si el carrito esta vacio, entonces le digo, agregame el elemento al carrito//
  } else {
    elemento.cantidad = 1;
    carrito.push(elemento);
  }
  //llamo a la funcion que va a cargar toda la info en la seccion de "nuestro carrito frutero-verdulero"//
  loadCarrito();
  localStorage.carrito = JSON.stringify(carrito);
}
//fin funcion agregar al carrito// ----------------------------------------------------------------------------------------------------------------

//funcion cargar carrito, se encarga de cada elemento que este en agregarcarrito sea agregado, podría estar adentro de dicha función, pero entiendo que
//en cuanto a la parametrización queda mucho mejor// ------------------------------------------------------------------------------------------------
function loadCarrito() {

  //lo primero que hago es setear en vacio lo que luego va a usar//

  divCarrito.innerHTML = "";
  divTotalCarrito.innerHTML = "";
  // pregunta si el carrito esta con elementos, para poder arrancar, sino no puede hacer nada //
  if (carrito.length > 0) {
    // crea una variable sumador para despues poder hacer los cálculos que necesita para el total//
    var sumador = 0;
    // intera el carrito por cada elemento que tiene el carrito //

    carrito.forEach((e) => {
      //Generé la info de HTML que necesito agregar//
      let divCar = document.createElement("div");
      // aca generé tres funciones más dos a partir de un boton y otra cuando el input cambie//
      // la primera es por si el cliente decide cambiar sobre el input, que lo pueda hacer//
      //la segunda es si se confundio y eligió mal el producto que lo pueda eliminar//
      //la tercera es por si agregó kg de más de fruta o verdura//
      divCar.innerHTML = `<p class="productocarrito">${e.nombre} X ${e.cantidad} kg $${e.precio * e.cantidad}</p><input name="${carrito.indexOf(e)}" style="float:left; width:100px;height:100px;
      " value="${e.cantidad}" onchange="inputChange(event)"> 
      <button onclick="eliminarProducto(${carrito.indexOf(e)})">Eliminar el producto</button><br>
      <div>
      <button onclick="eliminarCantidadProducto(${carrito.indexOf(e)})">Eliminar 1kg</button>
      </div>`;
      //para finalizar agrego todo a el carrito padre//
      divCarrito.appendChild(divCar);
      //sumo cada producto y lo multiplico por la cantidad, para sacar el calculo del total//
      sumador = sumador + e.precio * e.cantidad;
    });

    //total del carrito //
    let divTot = document.createElement("div");
    //genero un html para el total de todos los productos y le pongo el sumador que había generado arriba //
    divTot.innerHTML = `<p class="total"> Total: ${sumador}</p>`;
    //termina agregando este divtot a el total padre//
    divTotalCarrito.appendChild(divTot);
  }
}
//fin de la funcion load Carrito // ---------------------------------------------------------------------------------------------------------------------


//Funcion eliminarCantidadProductos, lo que hace es basicamente eliminar un kg si la persona toca el boton de la derecha y así lo decide.// ----------------------------------------------
function eliminarCantidadProducto(index) {
  //vengo con el index del producto donde hizo click y le digo que le reste uno//
  carrito[index].cantidad = carrito[index].cantidad - 1;
  // ahora si la cantidad es igual a 0, le digo elimina el elemento del carrito//
  if (carrito[index].cantidad = 0) {
    carrito.splice(index, 1);
  }


  localStorage.carrito = JSON.stringify(carrito);
  // y vuelvo a llamar a load carrito para que vuelva a hacer todos los calculos y cambiar lo que se ve en la página web//
  loadCarrito();
}

//fin funcion eliminarcantidadproductos// ------------------------------------------------------------------------------------------------------------


// eliminar productos, basicamente elimina el producto si la persona toca el boton de la derecha, en caso que lo necesite// ----------------------------
function eliminarProducto(index) {
  //setea el valor de cantidad en 0, y lo elimina// 
  carrito[index].cantidad = 0;
  carrito.splice(index, 1);

  localStorage.carrito = JSON.stringify(carrito);
  // y vuelvo a llamar a load carrito para que vuelva a hacer todos los calculos y cambiar lo que se ve en la página web//
  loadCarrito();
}
// fin funcion eliminarProducto// ---------------------------------------------------------------------------------------------------------------------

// lo que hace esta funcion es que si el cliente decide modificar desde el input lo deja y actualiza en base a lo que cambia.// -----------------------
function inputChange(e) {
  // si le pone un 0 entonces le dice borralo//
  if (e.target.value == 0) {
    carrito.splice(e.target.name, 1);
  } else {

    // sino actualiza la cantidad con ese numero//
    carrito[e.target.name].cantidad = e.target.value;
  }
  // y vuelvo a llamar a load carrito para que vuelva a hacer todos los calculos y cambiar lo que se ve en la página web//
  loadCarrito();
  localStorage.carrito = JSON.stringify(carrito);
}
// fin funcion inputchange// -------------------------------------------------------------------------------------------------------------------------------

// eliminar carrito en caso que la persona desee no comprar nada, o que se haya confundido y no quiera apretar todos los botones//------------------------------------------

function eliminarCarritoCompleto() {
  // primero se fija que el carrito este lleno //
  if (carrito.length > 0) {
    // borra todo de todos lados//
    divCarrito.innerHTML = "";
    divTotalCarrito.innerHTML = "";
    carrito = []
    localStorage.carrito = JSON.stringify(carrito);

  };

}
//fin eliminarcarrito// ---------------------------------------------------------------------------------------------------------------------------------
//Fin proyecto JavaScript
//Gracias Profe por la paciencia y las ganas que le pusiste siempre :) //