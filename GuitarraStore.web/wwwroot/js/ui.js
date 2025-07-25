﻿import { obtenerGuitarras, eliminarGuitarras, agregarAlCarrito, GuitarrasMasVendidas, GuitarrasEnOferta, ObtenerNuevosIngresos, guitarrasPorGenero } from "./GuitarraServicios.js";

export async function MostrarGuitarras(guitarras, contenedor, dolar) {

    if (!contenedor) {
        console.warn("Contenedor no encontrado");
        return;
    } else if (!guitarras) {
        console.warn("Guitarras no encontradas");
        return;
    }

    contenedor.innerHTML = "";

    const fila = document.createElement("div");
    fila.className = "row";

    guitarras.forEach(guitarra => {

        const col = document.createElement("div");
        col.className = "col-md-4 mb-4"; 

        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white"; 

        const imagen = guitarra.urlImagen || "/images/placeholder.png";

        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>
                <button class="btn btn-primary btn-agregar-carrito">Agregar al carrito</button>
            </div>
        `;
       
        card.style.cursor = "pointer";

        const btnAgregar = card.querySelector(".btn-agregar-carrito");

        btnAgregar.addEventListener("click", function (e) {

            e.preventDefault();
            e.stopPropagation();

            agregarAlCarrito(guitarra);

        })

        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });

        card.addEventListener("click", function () {
            
            window.location.href = `/Home/Detalles/${guitarra.id}`;

        })

        col.appendChild(card);

        fila.appendChild(col);
    });

    contenedor.appendChild(fila);
}
export function mostrarCarrito() {
    const contenedor = document.getElementById("carritoContainer");
    contenedor.classList.add("bg-black", "text-white", "p-3");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let html = `
        <table class="table table-dark table-sm text-white">
            <thead>
                <tr>
                    <th style="min-width: 80px;">Imagen</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalCarrito = 0;

    carrito.forEach((guitarra) => {
        const total = guitarra.precio * guitarra.cantidad;
        totalCarrito += total;

        html += `
            <tr>
                <td>
                    <img src="${guitarra.urlImagen}" 
                         alt="${guitarra.marca}" 
                         style="width: 100%; max-width: 120px; height: auto; object-fit: cover; border-radius: 5px;" />
                </td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${guitarra.marca}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${guitarra.modelo}</td>
                <td>$${guitarra.precio}</td>
                <td>${guitarra.cantidad}</td>
                <td>$${total}</td>
                <td>
                    <button class="btn btn-sm btn-success btn-sumar" data-id="${guitarra.id}">+</button>
                    <button class="btn btn-sm btn-warning btn-restar" data-id="${guitarra.id}">-</button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${guitarra.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <h4>Total del carrito: $${totalCarrito}</h4>
    `;

    contenedor.innerHTML = html;

    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", () => {
            modificarCantidad(parseInt(btn.dataset.id), 1);
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", () => {
            modificarCantidad(parseInt(btn.dataset.id), -1);
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarGuitarra(parseInt(btn.dataset.id));
        });
    });
}
function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(g => g.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cambio;

        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}
function eliminarGuitarra(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.filter(g => g.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); 
}
export async function mostrarGuitarraDetalles(guitarra, contenedor) {

    const div_contenedor_general = document.createElement("div");
    const div_contenedor = document.createElement("div");
    const div_titulo = document.createElement("div");
    const div_descripcion = document.createElement("div");
    const div_imagen = document.createElement("div");

    const imagen = guitarra.urlImagen || "/images/placeholder.png";

    div_titulo.innerHTML = `
        <h3>${guitarra.marca} <br>${guitarra.modelo}</h3>
        <p><strong>Precio:</strong> $${guitarra.precio}</p>
    `;

    div_descripcion.innerHTML = `
        <p>${guitarra.descripcion || "sin descripcion"}</p>
    `;

    div_imagen.innerHTML = `
        <img src="${imagen}" class="img-fluid rounded shadow" alt="${guitarra.marca}" />
    `;

    contenedor.classList.add("container", "my-4");

    div_contenedor.classList.add("row", "align-items-center", "mb-4");

    div_imagen.classList.add("col-sm-6", "text-center");
    div_titulo.classList.add("col-sm-6", "text-center");
    div_descripcion.classList.add("col-sm-6", "text-center", "w-100");
    div_contenedor_general.classList.add("col-sm-6", "d-flex", "flex-column", "justify-content-center", "align-items-center", "text-center");

    div_titulo.style.fontFamily = "'Poppins', sans-serif";
    div_descripcion.style.fontFamily = "'Montserrat', sans-serif";

    div_contenedor_general.appendChild(div_titulo);
    div_contenedor_general.appendChild(div_descripcion);

    div_contenedor.appendChild(div_imagen);
    div_contenedor.appendChild(div_contenedor_general);

    contenedor.appendChild(div_contenedor);
}
export async function MostrarGuitarrasInicio(contenedor,dolar) {

    contenedor.innerHTML = "";

    const div_mas_vendido = await contenedor_Guitarras_Mas_Vendidas(dolar);
    const div_ofertas = await contenedor_Guitarras_En_Ofertas(dolar);
    const div_nuevos_ingresos = await contenedor_Guitarras_Nuevas(dolar);
    const div_genero_metal = await contenedor_Guitarras_Metal(dolar);
    const div_genero_rock = await contenedor_Guitarras_Rock(dolar);
    const div_genero_pop = await contenedor_Guitarras_Pop(dolar);
    const div_genero_jazz = await contenedor_Guitarras_Jazz(dolar);
    
    if (div_mas_vendido) {
        div_mas_vendido.classList.add("mb-3");
        contenedor.appendChild(div_mas_vendido);
    }

    if (div_ofertas) {
        div_ofertas.classList.add("mb-3");
        contenedor.appendChild(div_ofertas);
    }

    if (div_nuevos_ingresos) {
        div_nuevos_ingresos.classList.add("mb-3");
        contenedor.appendChild(div_nuevos_ingresos);
    }

    if (div_genero_metal) {
        div_genero_metal.classList.add("mb-3");
        contenedor.appendChild(div_genero_metal);
    }

    if (div_genero_rock) {
        div_genero_rock.classList.add("mb-3");
        contenedor.appendChild(div_genero_rock);
    }

    if (div_genero_pop) {
        div_genero_pop.classList.add("mb-3");
        contenedor.appendChild(div_genero_pop);
    }

    if (div_genero_jazz) {
        div_genero_jazz.classList.add("mb-3");
        contenedor.appendChild(div_genero_jazz);
    }

}
async function contenedor_Guitarras_Jazz(dolar) {
    const guitarras = await guitarrasPorGenero("Jazz");

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.color = "white";
    columnaTitulo.style.fontWeight = "bold";
    columnaTitulo.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";

    columnaTitulo.style.position = "relative";

    const fondoGif = document.createElement("div");
    fondoGif.style.backgroundImage = "url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnplNmcyZGFlN2F2YWo0YTRpZHFrdW02b3g1cDVoaTg0Y3ljdnhmNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/loSbOhhEjg0ROfM1Mr/giphy.gif')";
    fondoGif.style.backgroundSize = "cover";
    fondoGif.style.backgroundPosition = "center";
    fondoGif.style.backgroundRepeat = "no-repeat";

    fondoGif.style.position = "absolute";
    fondoGif.style.top = "0";
    fondoGif.style.left = "0";
    fondoGif.style.width = "100%";
    fondoGif.style.height = "100%";
    fondoGif.style.zIndex = "1";

    fondoGif.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    fondoGif.style.backgroundBlendMode = "darken";

    const tituloDiv = document.createElement("div");
    tituloDiv.style.position = "relative";
    tituloDiv.style.zIndex = "2";
    tituloDiv.innerHTML = `<h3 class="text-center m-0">Jazz</h3>`;

    columnaTitulo.appendChild(fondoGif);
    columnaTitulo.appendChild(tituloDiv);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_Pop(dolar) {
    const guitarras = await guitarrasPorGenero("Pop");

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.color = "white";
    columnaTitulo.style.fontWeight = "bold";
    columnaTitulo.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";

    columnaTitulo.style.position = "relative";

    const fondoGif = document.createElement("div");
    fondoGif.style.backgroundImage = "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDJnMHkwemZraWswYmNjcTMzaXRvbW00NHpydDJnZTJ5MHV6aGpmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zMyimpINxc6c6Joi99/giphy.gif')";
    fondoGif.style.backgroundSize = "cover";
    fondoGif.style.backgroundPosition = "center";
    fondoGif.style.backgroundRepeat = "no-repeat";

    fondoGif.style.position = "absolute";
    fondoGif.style.top = "0";
    fondoGif.style.left = "0";
    fondoGif.style.width = "100%";
    fondoGif.style.height = "100%";
    fondoGif.style.zIndex = "1";

    fondoGif.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    fondoGif.style.backgroundBlendMode = "darken";

    const tituloDiv = document.createElement("div");
    tituloDiv.style.position = "relative";
    tituloDiv.style.zIndex = "2";
    tituloDiv.innerHTML = `<h3 class="text-center m-0">Pop</h3>`;

    columnaTitulo.appendChild(fondoGif);
    columnaTitulo.appendChild(tituloDiv);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_Rock(dolar) {
    const guitarras = await guitarrasPorGenero("Rock");

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";
 
    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.color = "white";
    columnaTitulo.style.fontWeight = "bold";
    columnaTitulo.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";

    columnaTitulo.style.position = "relative";

    const fondoGif = document.createElement("div");
    fondoGif.style.backgroundImage = "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDVzeWc2azR5b3NoNDF0NmZ6bWYzdzAyb3lrZXVpOHp2azBjcGdncyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1dMQmQ0fexFtQeNxNj/giphy.gif')";
    fondoGif.style.backgroundSize = "cover";
    fondoGif.style.backgroundPosition = "center";
    fondoGif.style.backgroundRepeat = "no-repeat";

    fondoGif.style.position = "absolute";
    fondoGif.style.top = "0";
    fondoGif.style.left = "0";
    fondoGif.style.width = "100%";
    fondoGif.style.height = "100%";
    fondoGif.style.zIndex = "1";

    fondoGif.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    fondoGif.style.backgroundBlendMode = "darken";

    const tituloDiv = document.createElement("div");
    tituloDiv.style.position = "relative";
    tituloDiv.style.zIndex = "2";
    tituloDiv.innerHTML = `<h3 class="text-center m-0">Rock</h3>`;

    columnaTitulo.appendChild(fondoGif);
    columnaTitulo.appendChild(tituloDiv);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";


    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_Metal(dolar) {
    const guitarras = await guitarrasPorGenero("Metal");

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.color = "white";
    columnaTitulo.style.fontWeight = "bold";
    columnaTitulo.style.textShadow = "2px 2px 4px rgba(0,0,0,0.7)";

    columnaTitulo.style.position = "relative";

    const fondoGif = document.createElement("div");
    fondoGif.style.backgroundImage = "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWF0M2s4czF4Y253MjBqNnB2b29zcjBvYWdhZ3M5aHZ0MDRndWtmNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M3w8IfaVAo2iY/giphy.gif')";
    fondoGif.style.backgroundSize = "cover";
    fondoGif.style.backgroundPosition = "center";
    fondoGif.style.backgroundRepeat = "no-repeat";

    fondoGif.style.position = "absolute";
    fondoGif.style.top = "0";
    fondoGif.style.left = "0";
    fondoGif.style.width = "100%";
    fondoGif.style.height = "100%";
    fondoGif.style.zIndex = "1";

    fondoGif.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    fondoGif.style.backgroundBlendMode = "darken";

    const tituloDiv = document.createElement("div");
    tituloDiv.style.position = "relative";
    tituloDiv.style.zIndex = "2";
    tituloDiv.innerHTML = `<h3 class="text-center m-0">Metal</h3>`;

    columnaTitulo.appendChild(fondoGif);
    columnaTitulo.appendChild(tituloDiv);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_Nuevas(dolar) {

    const guitarras = await ObtenerNuevosIngresos();

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.position = "relative";
    columnaTitulo.style.overflow = "hidden";

    const fondo = document.createElement("div");
    fondo.style.position = "absolute";
    fondo.style.top = "0";
    fondo.style.left = "0";
    fondo.style.width = "100%";
    fondo.style.height = "100%";
    fondo.style.backgroundImage = "url('https://images.unsplash.com/photo-1615716175369-dbcda46573c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    fondo.style.backgroundSize = "cover";
    fondo.style.backgroundPosition = "center";
    fondo.style.backgroundRepeat = "no-repeat";
    fondo.style.backgroundColor = "rgba(0,0,0,0.5)";
    fondo.style.backgroundBlendMode = "darken";
    fondo.style.zIndex = "1";

    const texto = document.createElement("div");
    texto.style.position = "relative";
    texto.style.zIndex = "2";
    texto.innerHTML = `<h3 class="text-center text-white m-0">Nuevos Ingresos</h3>`;

    columnaTitulo.appendChild(fondo);
    columnaTitulo.appendChild(texto);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_En_Ofertas(dolar) {

    const guitarras = await GuitarrasEnOferta();

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.position = "relative";
    columnaTitulo.style.overflow = "hidden";

    const fondo = document.createElement("div");
    fondo.style.position = "absolute";
    fondo.style.top = "0";
    fondo.style.left = "0";
    fondo.style.width = "100%";
    fondo.style.height = "100%";
    fondo.style.backgroundImage = "url('https://images.unsplash.com/photo-1589264110781-1ebfa05f901e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    fondo.style.backgroundSize = "cover";
    fondo.style.backgroundPosition = "center";
    fondo.style.backgroundRepeat = "no-repeat";
    fondo.style.backgroundColor = "rgba(0,0,0,0.5)";
    fondo.style.backgroundBlendMode = "darken";
    fondo.style.zIndex = "1";

    const texto = document.createElement("div");
    texto.style.position = "relative";
    texto.style.zIndex = "2";
    texto.innerHTML = `<h3 class="text-center text-white m-0">En Oferta</h3>`;

    columnaTitulo.appendChild(fondo);
    columnaTitulo.appendChild(texto);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;

}
async function contenedor_Guitarras_Mas_Vendidas(dolar) {

    const guitarras = await GuitarrasMasVendidas();

    if (!Array.isArray(guitarras) || guitarras.length === 0) {
        return null;
    }

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row bg-black text-white";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 mb-3 d-flex align-items-center justify-content-center position-relative";
    columnaTitulo.style.zIndex = "10";
    columnaTitulo.style.flex = "0 0 25%";
    columnaTitulo.style.maxWidth = "25%";
    columnaTitulo.style.padding = "1rem";
    columnaTitulo.style.position = "relative";
    columnaTitulo.style.overflow = "hidden"; 

    const fondo = document.createElement("div");
    fondo.style.position = "absolute";
    fondo.style.top = "0";
    fondo.style.left = "0";
    fondo.style.width = "100%";
    fondo.style.height = "100%";
    fondo.style.backgroundImage = "url('https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvbmRvJTIwZGVncmFkYWRvfGVufDB8fDB8fHww')";
    fondo.style.backgroundSize = "cover";
    fondo.style.backgroundPosition = "center";
    fondo.style.backgroundRepeat = "no-repeat";
    fondo.style.backgroundColor = "rgba(0,0,0,0.5)";
    fondo.style.backgroundBlendMode = "darken";
    fondo.style.zIndex = "1";

    const texto = document.createElement("div");
    texto.style.position = "relative";
    texto.style.zIndex = "2";
    texto.innerHTML = `<h3 class="text-center text-white m-0">Más Vendidas</h3>`;

    columnaTitulo.appendChild(fondo);
    columnaTitulo.appendChild(texto);

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.gap = "1rem";
    scrollContainer.style.paddingBottom = "0.5rem";
    scrollContainer.style.scrollBehavior = "smooth";
    scrollContainer.style.whiteSpace = "nowrap";

    guitarras.forEach(guitarra => {
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white";
        card.style.minWidth = "300px";
        card.style.display = "inline-block";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";
        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 0.5rem; font-size: 0.7rem;">
                <h5 class="card-title" style="font-size: 0.8rem; margin-bottom: 0.3rem;">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text" style="margin-bottom: 0.15rem;"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold" style="margin-bottom: 0.15rem;">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>  
            </div>
        `;
        card.style.cursor = "pointer"; 

        card.addEventListener("click", () => {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        scrollContainer.appendChild(card);
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.style.position = "absolute";
    flechaIzq.style.top = "50%";
    flechaIzq.style.left = "0";
    flechaIzq.style.transform = "translateY(-50%)";
    flechaIzq.style.zIndex = "20";
    flechaIzq.style.background = "rgba(255,255,255,0.8)";
    flechaIzq.style.border = "none";
    flechaIzq.style.fontSize = "2rem";
    flechaIzq.style.cursor = "pointer";
    flechaIzq.style.padding = "0 0.5rem";
    flechaIzq.style.borderRadius = "0 5px 5px 0";
    flechaIzq.style.userSelect = "none";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.style.position = "absolute";
    flechaDer.style.top = "50%";
    flechaDer.style.right = "0";
    flechaDer.style.transform = "translateY(-50%)";
    flechaDer.style.zIndex = "20";
    flechaDer.style.background = "rgba(255,255,255,0.8)";
    flechaDer.style.border = "none";
    flechaDer.style.fontSize = "2rem";
    flechaDer.style.cursor = "pointer";
    flechaDer.style.padding = "0 0.5rem";
    flechaDer.style.borderRadius = "5px 0 0 5px";
    flechaDer.style.userSelect = "none";

    const scrollAmount = 300;

    flechaIzq.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    flechaDer.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    columnaGuitarras.appendChild(flechaIzq);
    columnaGuitarras.appendChild(flechaDer);

    filaPrincipal.appendChild(columnaTitulo);
    filaPrincipal.appendChild(columnaGuitarras);

    return filaPrincipal;
}
export async function MostrarGuitarrasCrud(listado) {
    try {

        const guitarras = await obtenerGuitarras();

        listado.innerHTML = "";

        guitarras.forEach(guitarra => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap bg-dark text-white";

            
            const info = document.createElement("div");
            info.innerHTML = `
                <h5 class="mb-1">${guitarra.marca} - ${guitarra.modelo}</h5>
                <p class="mb-1 text-muted">$${guitarra.precio}</p>
            `;

            const botones = document.createElement("div");
            botones.className = "btn-group";

            const botondetalles = document.createElement("button");
            botondetalles.className = "btn btn-outline-primary btn-sm";
            botondetalles.innerText = "Detalles";
            botondetalles.type = "button";

            botondetalles.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("Redirigiendo a:", `/Home/Detalles/${guitarra.id}?from=crud`);
                window.location.href = `/Home/Detalles/${guitarra.id}?from=crud`;
            });

            const botonedit = document.createElement("button");
            botonedit.className = "btn btn-outline-warning btn-sm";
            botonedit.innerText = "Editar";
            botonedit.addEventListener("click", () => {
                window.location.href = `/Home/Editar/${guitarra.id}`;
            });

            const botonelim = document.createElement("button");
            botonelim.className = "btn btn-outline-danger btn-sm";
            botonelim.innerText = "Eliminar";
            botonelim.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    await eliminarGuitarras(guitarra);
                    await MostrarGuitarrasCrud(listado);
                } catch (error) {
                    alert("Error al eliminar la guitarra: " + error.message);
                }
            });

            botones.appendChild(botondetalles);
            botones.appendChild(botonedit);
            botones.appendChild(botonelim);

            li.appendChild(info);
            li.appendChild(botones);
            listado.appendChild(li);
        });

    } catch (error) {
        alert("Error al cargar las guitarras: " + error.message);
    }
}