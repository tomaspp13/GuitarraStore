
let dolarCache = null;
let dolarCacheTime = null;

export async function obtenerGuitarras() {

    try {

        const respuesta = await fetch("/api/guitarra/Get");

        if (!respuesta.ok) {

            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);

        }

        return await respuesta.json();

    } catch (error) {
        enviarErrorAlServidor("Error al obtener las guitarras: " + error.message);
    }

}
export async function obtenerMarcas() {

    try {

        const respuesta = await fetch(`/api/guitarra/ObtenerMarcas`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);
        }

        const marcas = await respuesta.json();

        return marcas;
    } catch (error) {
        enviarErrorAlServidor("Error al obtener las guitarras: " + error.message);
        return [];
    }
}
function enviarErrorAlServidor(mensaje) {
    fetch('/api/guitarra/LogError', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: mensaje, fecha: new Date() })
    }).catch(() => {

    });
}
function renderEstrellas(promedio) {
    let estrellas = "";
    const totalEstrellas = 5;

    for (let i = 0; i < Math.floor(promedio); i++) {
        estrellas += "★";
    }

    if (promedio % 1 >= 0.5) {
        estrellas += "☆";
    }

    while (estrellas.length < totalEstrellas) {
        estrellas += "☆";
    }

    return estrellas;
}
export async function crearTarjetasGuitarras(guitarras,dolar) {

    const fila = document.createElement("div");
    fila.className = "row";

    guitarras.forEach((guitarra, index) => {
        
        const opiniones = guitarra.opiniones || [];
        const promedio = opiniones.length > 0
            ? opiniones.reduce((acc, o) => acc + o.calificacion, 0) / opiniones.length
            : 0;

        const estrellasHTML = renderEstrellas(promedio);

        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";

        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 bg-dark text-white position-relative";

        const { src, srcset, sizes } = optimizarImagenCloudinary(guitarra.urlImagen, 400, 600);

        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        const sinStock = guitarra.stock === 0;

        const prioridad = index === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

        card.innerHTML = `
            <div class="position-relative">
                <img
            src="${src}" 
            srcset="${srcset}" 
            sizes="${sizes}" 
            class="card-img-top"  
            width="300" 
            height="300" 
            alt="Imagen de guitarra" 
            style="height: 300px; object-fit: cover;" 
            ${prioridad}>
                ${sinStock ? `
                    <div class="position-absolute top-50 start-50 translate-middle text-center bg-danger bg-opacity-75 text-white px-3 py-2 rounded">
                        SIN STOCK
                    </div>
                ` : ""}
            </div>
            <div class="card-body">
                <h3 class="card-title">${guitarra.marca} </h3>
                <h3 class="card-title">${guitarra.modelo} </h3>
                <div>
                
                <p class="card-text"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>
                <p class="card-text">${estrellasHTML} (${promedio.toFixed(1)})</p>
                <button class="btn btn-primary btn-agregar-carrito" ${sinStock ? "disabled" : ""}>
                    Agregar al carrito
                </button>
                
                </div>          
            </div>
        `;

        card.style.cursor = "pointer";

        const btnAgregar = card.querySelector(".btn-agregar-carrito");

        if (!sinStock) {
            btnAgregar.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                agregarAlCarrito(guitarra);
            });
        } else {
            btnAgregar.style.cursor = "not-allowed";
        }

        card.addEventListener("click", function () {
            window.location.href = `/Home/Detalles/${guitarra.id}`;
        });

        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });

        col.appendChild(card);
        fila.appendChild(col);
    });

    return fila;
}
export async function crearTarjetasCompletas(guitarras, urlCloudinary, titulo, tipoFondo,dolar) {

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "row";

    const columnaTitulo = document.createElement("div");
    columnaTitulo.className = "col-3 d-flex align-items-center justify-content-center columna-titulo";

    if (tipoFondo == "imagen") {

        const fondoImg = document.createElement("img");

        const { src, srcset, sizes } = optimizarImagenCloudinary(urlCloudinary, 400, 400);

        fondoImg.src = src;
        fondoImg.srcset = srcset;
        fondoImg.sizes = sizes;

        fondoImg.alt = "Fondo sección";
        fondoImg.width = 400;
        fondoImg.height = 400;
        fondoImg.style.aspectRatio = "1 / 1";
        fondoImg.style.objectFit = "cover";
        fondoImg.fetchPriority = "high";

        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const texto = document.createElement("div");
        texto.className = "texto";
        texto.innerHTML = `<h3 class="text-center text-white m-0">${titulo}</h3>`;
      
        columnaTitulo.append(fondoImg, overlay, texto);

    }
    else if (tipoFondo == "video") {

        const fondoVideo = document.createElement("video");
        fondoVideo.src = urlCloudinary;
        fondoVideo.autoplay = true;
        fondoVideo.loop = true;
        fondoVideo.muted = true;
        fondoVideo.playsInline = true;
        fondoVideo.classList.add("fondo-video");
        fondoVideo.style.minHeight = "400px";


        const tituloDiv = document.createElement("div");
        tituloDiv.classList.add("titulo-div");
        tituloDiv.innerHTML = `<h3 class="m-0">${titulo}</h3>`;

        columnaTitulo.appendChild(fondoVideo);
        columnaTitulo.appendChild(tituloDiv);

    }

    const columnaGuitarras = document.createElement("div");
    columnaGuitarras.className = "col-9 position-relative";

    const scrollContainer = document.createElement("div");
    scrollContainer.className = "scroll-container";

    guitarras.forEach((guitarra, index) => {
        if (guitarra.stock > 0) {

            const card = document.createElement("div");
            card.className = "card card-guitarra shadow-sm h-100 bg-dark text-white";

            const precioDolar = (guitarra.precio / dolar).toFixed(2);
            const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

            const { src, srcset, sizes } = optimizarImagenCloudinary(guitarra.urlImagen, 300, 400);

            let atributosImg = index < 1 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" fetchpriority="low"';
            
            card.innerHTML = `
            <img src="${src}" srcset="${srcset}" sizes="${sizes}" ${atributosImg}
                    width="300" height="400"
                    style="aspect-ratio: 3 / 4; object-fit: cover;"
                    class="card-img-top" 
                    alt="Imagen de guitarra marca ${guitarra.marca} modelo ${guitarra.modelo}">
            
            <div class="card-body-inicio" style="padding: 0.5rem; font-size: 1.1rem;">
                <h3 class="card-title" style="font-size: 1.2rem; margin-bottom: 0.3rem;">
                    ${guitarra.marca} ${guitarra.modelo}
                </h3>
                <p class="card-text mb-1 textoTarjetas"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text mb-1 textoTarjetas"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text mb-1 textoTarjetas"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold mb-1 textoTarjetas">6 x $${Math.round(guitarra.precio / 6)} sin interés</p>
            </div>
        `;

            card.addEventListener("click", () => {
                window.location.href = `/Home/Detalles/${guitarra.id}`;
            });

            scrollContainer.appendChild(card);
        }
    });

    columnaGuitarras.appendChild(scrollContainer);

    const flechaIzq = document.createElement("button");
    flechaIzq.innerHTML = "&#8249;";
    flechaIzq.className = "btn-scroll btn-scroll-left";

    const flechaDer = document.createElement("button");
    flechaDer.innerHTML = "&#8250;";
    flechaDer.className = "btn-scroll btn-scroll-right";

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
export function optimizarImagenCloudinary(url, anchoBase = 300, altoBase = 400) {
    if (!url) {
        return {
            src: "/images/placeholder.png",
            srcset: "",
            sizes: "",
        };
    }

    const base = url.replace("/upload/","/upload/f_auto,q_auto/");

    const variantes = [anchoBase * 0.66, anchoBase, anchoBase * 1.33, anchoBase * 2];

    const src = base.replace(
        "/upload/",
        `/upload/w_${anchoBase},h_${altoBase},c_fill,g_auto,f_auto,q_auto/`
    );

    const srcset = variantes
        .map(w => {
            const h = Math.round((w * altoBase) / anchoBase); 
            return `${base.replace(
                "/upload/",
                `/upload/w_${Math.round(w)},h_${h},c_fill,g_auto,f_auto,q_auto/`
            )} ${Math.round(w)}w`;
        })
        .join(", ");

    const sizes = "(max-width: 576px) 200px, (max-width: 992px) 300px, 400px";

    return { src, srcset, sizes };
}
export async function crearComentario(idUsuario, calificacion, comentario, idGuitarra,nombreUsuario) {
    try {
        const respuesta = await fetch(`/api/guitarra/CrearComentario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idGuitarra: Number(idGuitarra),
                comentario: comentario,
                calificacion: Number(calificacion),
                usuarioId: Number(idUsuario),
                nombreUsuario: nombreUsuario
            })
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error de la Api al crearComentario. Respuesta: " + respuesta.status + " - " + errorText);
        }else {
            mostrarToast("Comentario enviado.", "success");
        }
    }
    catch (error) {
        enviarErrorAlServidor("Error al Crear Comentario:", error);
        mostrarToast("No se ha podido enviar su comentario.", "Danger");
    }
}
export async function obtenerComentarioDeGuitarra(idGuitarra) {
    try {
        const respuesta = await fetch(`/api/guitarra/ObtenerComentarios/${idGuitarra}`);

        const data = await respuesta.json();

        if (!respuesta.ok) {
            enviarErrorAlServidor(
                "Error de Api de obtenerComentarioDeGuitarra. Respuesta: " +
                respuesta.status + " - " + JSON.stringify(data)
            );

            console.log("!respuesta.ok")

            return [];
        }

        return data;

    } catch (error) {
        enviarErrorAlServidor("Error al obtener Comentario De Guitarra:", error);
        return [];
    }
}
export async function obtenerGuitarrasPorMarca(busqueda, marca, tipoFiltro, precioMin, precioMax) {

    const params = new URLSearchParams();

    if (busqueda) params.append("busqueda", busqueda);
    if (marca) params.append("marca", marca);
    if (tipoFiltro) params.append("tipofiltro", tipoFiltro);
    if (precioMin != null && precioMin !== "") params.append("precioMin", precioMin);
    if (precioMax != null && precioMax !== "") params.append("precioMax", precioMax);

    try {

        const guitarrasFiltradas = await fetch(`/api/guitarra/FiltroGuitarras?${params.toString()}`);

        if (!guitarrasFiltradas.ok) {

            const errorText = await guitarrasFiltradas.text();
            enviarErrorAlServidor("Error de Api de obtener las guitarras. Respuesta: " + guitarrasFiltradas.status + " - " + errorText);

        }

        const guitarras = await guitarrasFiltradas.json();

        return guitarras;

    } catch (error) {
        enviarErrorAlServidor("Error al obtener guitarras por filtros:", error);
        return [];
    }
}
export async function cargarMarcas(contenedorMarcas) {

    try {

        const respuesta = await fetch('/api/guitarra/ObtenerMarcas');

        if (!respuesta.ok) {

            const errorText = await respuesta.text();

            enviarErrorAlServidor("Error de la Api de obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);
        }

        const marcas = await respuesta.json();

        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            contenedorMarcas.appendChild(option);
        });
    }
    catch (error) {

        enviarErrorAlServidor("Error en obtener las guitarras" + error.message);
    }

}
export async function obtenerGuitarrasPorId(id) {
    try {
        const respuesta = await fetch(`/api/guitarra/Get/${id}`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error de la Api de obtener la guitarra por ID. Respuesta: " + respuesta.status + " - " + errorText);
        }

        return await respuesta.json();

    } catch (error) {
        enviarErrorAlServidor("Error al obtener guitarra por ID: " + error.message);
    }

}
export async function obtenerCategoriasGuitarras() {

    try {
        const respuesta = await fetch("/api/Guitarra/GuitarrasCategorias");

        if (!respuesta.ok) {
            enviarErrorAlServidor("Error en la respuesta de la Api para obtener las categorias de las guitarras " + respuesta.status);
            return [];
        }

        const datos = await respuesta.json();

        return datos || {};

    }
    catch (error) {

        enviarErrorAlServidor("Error al obtener nuevas guitarras" + error.message);
    }
}
export async function crearGuitarras(formData) {
    try {
        const response = await fetch("/api/Guitarra/Create", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const mensajeError = await response.text();
            mostrarToast("Error al crear guitarra", "danger");
            enviarErrorAlServidor("Error en la respuesta de la API de crear guitarras" + response.message);
            return { exito: false, mensaje: mensajeError || "Error desconocido al crear guitarra." };
        }

        return { exito: true };

    } catch (error) {
        enviarErrorAlServidor("Error al crear guitarra : " + error.message);
        return { exito: false, mensaje: "Error al crear la guitarra: " + error.message };
    }
}
export async function editarGuitarras(formData) {
    try {
        const respuesta = await fetch(`/api/guitarra/Put`, {
            method: "PUT",
            body: formData
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error en la Api de editar la guitarra. Respuesta: " + respuesta.status + " - " + errorText);
            mostrarToast("Error al editar guitarra")
            return;
        }

        window.location.href = "/Home/GuitarrasCrud";

    } catch (error) {
        enviarErrorAlServidor("Error al editar guitarra : " + error.message)
        mostrarToast("Error al editar guitarra: " + error.message, "danger");
    }

}
function agregarAlCarrito(guitarra) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(g => g.id === guitarra.id);

    if (index === -1) {

        carrito.push({ ...guitarra, cantidad: 1, stock: guitarra.stock });
        mostrarToast("Guitarra agregada al carrito.", "success");
    } else {

        const enCarrito = carrito[index];

        if (enCarrito.cantidad < guitarra.stock) {
            enCarrito.cantidad += 1;
            mostrarToast("Cantidad aumentada en el carrito.", "success");
        } else {
            mostrarToast("Ya agregaste el máximo disponible de esta guitarra.", "danger");
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

}

export async function obtenerValorDolar() {

    if (dolarCache !== null && (Date.now() - dolarCacheTime) < 10 * 60 * 1000) {
        return dolarCache;
    }

    try {

        const valor = await fetch("/api/guitarra/ValorDolar");
        if (!valor.ok) {
            enviarErrorAlServidor("Error en la Api de obtener el valor del Dolar. Respuesta: " + valor.status);
            return 1; 
        }

        const resultado = await valor.json();

        const valorDolar = Number(resultado);

        dolarCache = valorDolar;
        dolarCacheTime = Date.now();

        return resultado

    }
    catch (error) {

        enviarErrorAlServidor("Error al obtener valor del Dolar: " + error.message);
    }
}
export async function eliminarGuitarras(guitarra) {

    try {

        const respuesta = await fetch(`/api/guitarra/Delete/${guitarra.id}`, {
            method: "DELETE"

        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            mostrarToast("Error al eliminar la guitarra", "danger");
            enviarErrorAlServidor("Error en la Api de eliminar guitarra. Respuesta: " + respuesta.status + " - " + errorText);
        }
        mostrarToast("Guitarra eliminada correctamente", "success");
        return;
    }
    catch (error) {
        enviarErrorAlServidor("Error al eliminar la guitarra: " + error.message);

    }

}
export async function obtenerGuitarrasPorFactura(facturaId, idUsuario) {

    try {

        const respuesta = await fetch(`/api/guitarra/ObtenerGuitarrasFactura/${facturaId}/${idUsuario}`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error en la Api de obtener guitarras de facturas. Respuesta: " + respuesta.status + " - " + errorText);
            return;
        }

        return await respuesta.json();
    }
    catch (error) {

        enviarErrorAlServidor("Error al eliminar la guitarra: " + error.message);
        return [];
    }

}
export async function generarCompra() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length == 0) {

        mostrarMensaje("Tu carrito esta vacio", "danger");
        return;

    }

    const usuarioId = document.body.dataset.userid;

    const datosCompra = {

        idUsuario: usuarioId,
        GuitarrasCompradas: carrito.map(g => ({

            idGuitarra: g.id,
            StokGuitarra: g.cantidad

        }))

    };

    try {

        const respuesta = await fetch(`/api/guitarra/Compra`, {

            method: "POST",
            headers: {

                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCompra)

        });

        if (respuesta.ok) {

            mostrarToast("Compra realizada correctamente.", "success");
            localStorage.removeItem("carrito");
            setTimeout(() => {
                location.reload();
            }, 2000);

        } else {

            mostrarToast("Error del servidor", "danger");
            enviarErrorAlServidor("Error en la api de generarCompra" + respuesta.message);
            return
        }

    }
    catch (error) {

        mostrarToast("No se pudo conectar con el servidor. Intenta más tarde.", "danger");
        enviarErrorAlServidor("Error al generar compra: " + error.message);

    }

}
function mostrarMensaje(texto, tipo) {
    const mensajeP = document.getElementById("mensajeAlerta");
    mensajeP.textContent = texto;
    mensajeP.className = "";
    mensajeP.classList.add("mt-2", "fw-bold");

    if (tipo === "success") {
        mensajeP.classList.add("text-success");
    } else if (tipo === "danger") {
        mensajeP.classList.add("text-danger");
    }
}
export function mostrarToast(mensaje, tipo) {

    const toastElemento = document.getElementById("toastMensaje");
    const toastTexto = document.getElementById("toastTexto");

    toastTexto.textContent = mensaje;

    toastElemento.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");
    toastElemento.classList.add(`bg-${tipo}`);

    const toast = new bootstrap.Toast(toastElemento, { delay: 2000 });
    toast.show();
}
window.mostrarToast = mostrarToast;
