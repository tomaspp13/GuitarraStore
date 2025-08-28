import {
    obtenerGuitarras, eliminarGuitarras, obtenerGuitarrasPorFactura, crearTarjetasGuitarras,
    crearTarjetasCompletas, obtenerCategoriasGuitarras, optimizarImagenCloudinary, obtenerValorDolar, obtenerComentarioDeGuitarra
} from "./GuitarraServicios.js";

import { obtenerFacturasDeUsuario } from "./UsuarioServicios.js"

export async function MostrarGuitarras(guitarras, contenedor, dolar) {

    if (!contenedor) {
        console.warn("Contenedor no encontrado");
        return;
    } else if (!guitarras) {
        console.warn("Guitarras no encontradas");
        return;
    }

    contenedor.innerHTML = "";

    const fila = await crearTarjetasGuitarras(guitarras, dolar);

    contenedor.appendChild(fila);
}
export function mostrarCarrito() {
    const contenedor = document.getElementById("carritoContainer");
    contenedor.classList.add("bg-dark", "text-white", "p-3", "rounded");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                🛒 Tu carrito está vacío.
            </div>`;
        return;
    }

    let html = `
        <div class="table-responsive"> 
            <table class="table table-dark table-striped table-hover align-middle text-center shadow rounded">
                <thead class="table-light text-dark">
                    <tr>
                        <th style="min-width: 90px;">Imagen</th>
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
                         class="img-thumbnail shadow-sm rounded"
                         style="width: 90px; height: 120px; object-fit: cover;"/>
                </td>
                <td class="fw-bold">${guitarra.marca}</td>
                <td>${guitarra.modelo}</td>
                <td>$${guitarra.precio.toLocaleString()}</td>
                <td>
                    <span class="badge bg-info fs-6">${guitarra.cantidad}</span>
                </td>
                <td class="fw-bold">$${total.toLocaleString()}</td>
                <td>
                    <div class="d-flex justify-content-center gap-1 flex-wrap">
                        <button class="btn btn-sm btn-success btn-sumar" data-id="${guitarra.id}" title="Agregar">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-warning btn-restar" data-id="${guitarra.id}" title="Reducir">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${guitarra.id}" title="Eliminar">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-end mt-3">
            <h4 class="bg-light text-dark px-3 py-2 rounded shadow">
                Total del carrito: <span class="fw-bold">$${totalCarrito.toLocaleString()}</span>
            </h4>
        </div>
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

        const guitarra = carrito[index];

        if (cambio === 1 && guitarra.cantidad >= guitarra.stock) {
            alert("No podés agregar más unidades, stock máximo alcanzado.");
            return;
        }

        guitarra.cantidad += cambio;

        if (guitarra.cantidad <= 0) {
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
export function vaciarCarrito() {
    localStorage.setItem("carrito", JSON.stringify([]));
    mostrarCarrito();
}
export async function mostrarGuitarraDetalles(guitarra) {

    const imagen = guitarra.urlImagen || "/images/placeholder.png";

    const descripcion = document.getElementById("descripcionDetalles");

    const precio = document.getElementById("precio");

    const marca = document.getElementById("marca");

    const modelo = document.getElementById("modelo");

    const imagenGuitarra = document.getElementById("imagenGuitarraDetalle");

    const urlVideo = document.getElementById("videoGuitarra");

    if (descripcion) descripcion.innerText = guitarra.descripcion || "Sin descripción";
    if (precio) precio.innerText = `$${guitarra.precio || "0"}`;
    document.getElementById("3cuotas").innerText = `$3 x ${(guitarra.precio / 3).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("6cuotas").innerText = `$6 x ${(guitarra.precio / 6).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("12cuotas").innerText = `$12 x ${(guitarra.precio / 12).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (marca) marca.innerText = guitarra.marca || "Marca desconocida";
    if (modelo) modelo.innerText = guitarra.modelo || "Modelo desconocido";
    if (imagenGuitarra) {
        imagenGuitarra.src = imagen;
        imagenGuitarra.alt = guitarra.marca || "Guitarra";
    }
    if (urlVideo) urlVideo.src = guitarra.urlVideo || "";
}
export async function MostrarGuitarrasInicio(contenedor) {

    contenedor.innerHTML = "";

    const [guitarrasCategorias, dolar] = await Promise.all([
        obtenerCategoriasGuitarras(),
        obtenerValorDolar()
    ]);

    const metal = guitarrasCategorias.metal;
    const rock = guitarrasCategorias.rock;
    const pop = guitarrasCategorias.pop;
    const jazz = guitarrasCategorias.jazz;
    const masVendidas = guitarrasCategorias.masVendidas;
    const enOferta = guitarrasCategorias.enOfertas;
    const masNuevo = guitarrasCategorias.nuevas;

    const primerGuitarra = masVendidas[0] || enOferta[0] ||masNuevo[0] ||  metal[0] || rock[0] || pop[0] || jazz[0] ;

    if (primerGuitarra) {
        const { src } = optimizarImagenCloudinary(primerGuitarra.urlImagen, 300, 400);
        const preload = document.createElement("link");
        preload.rel = "preload";
        preload.as = "image";
        preload.href = src;
        preload.fetchPriority = "high";
        document.head.appendChild(preload);
    }

    const [
        div_mas_vendido,
        div_ofertas,
        div_nuevos_ingresos,
        div_genero_metal,
        div_genero_rock,
        div_genero_pop,
        div_genero_jazz
    ] = await Promise.all([
        contenedor_Guitarras_Mas_Vendidas(masVendidas, dolar),
        contenedor_Guitarras_En_Ofertas(enOferta, dolar),
        contenedor_Guitarras_Nuevas(masNuevo, dolar),
        contenedor_Guitarras_Metal(metal, dolar),
        contenedor_Guitarras_Rock(rock, dolar),
        contenedor_Guitarras_Pop(pop, dolar),
        contenedor_Guitarras_Jazz(jazz, dolar)
    ]);

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
async function contenedor_Guitarras_Jazz(guitarrasJazz,dolar) {

    if (!Array.isArray(guitarrasJazz) || guitarrasJazz.length === 0 || !(guitarrasJazz.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlGuitarraJazz = "https://res.cloudinary.com/dgqkeshqh/video/upload/v1754675329/guitarrasJazz_pzu9gg.mp4";

    return await crearTarjetasCompletas(guitarrasJazz, urlGuitarraJazz,"Jazz","video",dolar);
}
async function contenedor_Guitarras_Pop(guitarrasPop,dolar) {

    if (!Array.isArray(guitarrasPop) || guitarrasPop.length === 0 || !(guitarrasPop.some(guitarra => guitarra.stock > 0))) {
        return null;
    }
    const urlGuitarraPop = "https://res.cloudinary.com/dgqkeshqh/video/upload/v1754674666/guitarrasPop_knptq8.mp4";

    return await crearTarjetasCompletas(guitarrasPop, urlGuitarraPop,"Pop","video",dolar);
}
async function contenedor_Guitarras_Rock(guitarrasRock,dolar) {

    if (!Array.isArray(guitarrasRock) || guitarrasRock.length === 0 || !(guitarrasRock.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlGuitarraRock = "https://res.cloudinary.com/dgqkeshqh/video/upload/v1754675331/guitarrasRock_q2wvy4.mp4";

    return await crearTarjetasCompletas(guitarrasRock, urlGuitarraRock,"Rock","video",dolar);
}
async function contenedor_Guitarras_Metal(guitarrasMetal,dolar) {

    if (!Array.isArray(guitarrasMetal) || guitarrasMetal.length === 0 || !(guitarrasMetal.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlGuitarraMetal = "https://res.cloudinary.com/dgqkeshqh/video/upload/v1754675330/guitarrasMetal_skseed.mp4";

    return await crearTarjetasCompletas(guitarrasMetal, urlGuitarraMetal,"Metal","video",dolar);

}
async function contenedor_Guitarras_Nuevas(guitarrasMasNuevas,dolar) {

    if (!Array.isArray(guitarrasMasNuevas) || guitarrasMasNuevas.length === 0 || !(guitarrasMasNuevas.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlGuitarrasNuevas = "https://images.unsplash.com/photo-1615716175369-dbcda46573c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return await crearTarjetasCompletas(guitarrasMasNuevas, urlGuitarrasNuevas,"Nuevos Ingresos","imagen",dolar);

}
async function contenedor_Guitarras_En_Ofertas(guitarrasEnOferta,dolar) {

    if (!Array.isArray(guitarrasEnOferta) || guitarrasEnOferta.length === 0 || !(guitarrasEnOferta.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlEnOferta = "https://images.unsplash.com/photo-1589264110781-1ebfa05f901e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return await crearTarjetasCompletas(guitarrasEnOferta, urlEnOferta,"Ofertas","imagen",dolar);

}
async function contenedor_Guitarras_Mas_Vendidas(guitarrasMasVendidas,dolar) {

    if (!Array.isArray(guitarrasMasVendidas) || guitarrasMasVendidas.length === 0 || !(guitarrasMasVendidas.some(guitarra => guitarra.stock > 0))) {
        return null;
    }

    const urlMasVendidas = "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvbmRvJTIwZGVncmFkYWRvfGVufDB8fDB8fHww";

    return await crearTarjetasCompletas(guitarrasMasVendidas, urlMasVendidas,"Mas vendido","imagen",dolar);
    
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
export async function MostrarGuitarrasUsuario() {
    const contenedor_guitarras = document.getElementById("contenedor_guitarras_compradas");
    contenedor_guitarras.innerHTML = "";

    const id = document.body.dataset.userid;
    const facturas = await obtenerFacturasDeUsuario(id);

    if (!facturas || facturas.length === 0) {
        contenedor_guitarras.innerHTML = `
            <div class="alert alert-dark text-light bg-secondary">No se encontraron facturas para este usuario.</div>`;
        return;
    }

    facturas.forEach(async (factura) => {

        const guitarras = await obtenerGuitarrasPorFactura(factura.id, id);

        const tarjetaFactura = document.createElement("div");
        tarjetaFactura.className = "card bg-dark text-light mb-4 shadow border-0 rounded-3";

        const fechaOriginal = new Date(factura.fecha);
        const fechaFormateada = fechaOriginal.toLocaleDateString("es-AR");

        const contenedorFactura = document.createElement("div");
        contenedorFactura.className = "card-header bg-secondary text-white fw-bold fs-5 border-bottom border-light";
        contenedorFactura.innerHTML = `<div class="d-flex justify-content-between"><span>Factura Nº ${factura.id}</span><span>Fecha de Compra: ${fechaFormateada}</span></div>`;


        tarjetaFactura.appendChild(contenedorFactura);

        const bodyFactura = document.createElement("div");
        bodyFactura.className = "card-body d-flex flex-wrap gap-4";

        guitarras.forEach(guitarra => {
            const tarjetaGuitarra = document.createElement("div");
            tarjetaGuitarra.className = "card bg-secondary text-white shadow-sm border-0 rounded";
            tarjetaGuitarra.style.width = "200px";

            const tarjetaBody = document.createElement("div");
            tarjetaBody.className = "card-body";

            tarjetaBody.innerHTML = `
                <h6 class="card-title fw-bold">${guitarra.marca} ${guitarra.modelo}</h6>
                <p class="card-text"><strong>Precio:</strong> $${guitarra.precio}</p>
            `;

            tarjetaGuitarra.appendChild(tarjetaBody);
            bodyFactura.appendChild(tarjetaGuitarra);
        });

        tarjetaFactura.appendChild(bodyFactura);
        contenedor_guitarras.appendChild(tarjetaFactura);
    });
}
export async function MostrarComentariosDeGuitarra(contenedor, id) {

    const comentarios = await obtenerComentarioDeGuitarra(id);
    contenedor.innerHTML = "";

    comentarios.forEach(opinion => {
        const nombreUsuario = opinion.nombreUsuario || "Desconocido";

        const fechaObj = new Date(opinion.fecha);
        const fecha = `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;

        const calificacion = opinion.calificacion || 0;
        const estrellas = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);

        const comentarioTexto = opinion.comentario || "";

        const div = document.createElement("div");
        div.innerHTML = `<p><strong>${nombreUsuario}</strong> - ${fecha}</p><p>Calificación : ${estrellas}</p>
        <p>${comentarioTexto}</p>`;

        contenedor.appendChild(div);

    });

}


