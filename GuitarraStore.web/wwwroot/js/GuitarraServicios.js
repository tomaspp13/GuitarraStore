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
export async function ObtenerNuevosIngresos() {

    try {
        var respuesta = await fetch("/api/Guitarra/GuitarrasNuevas");

        if (!respuesta.ok) { enviarErrorAlServidor("Error en la respuesta de la Api de Nuevos Ingresos " + respuesta.status) }

        return await respuesta.json();

    }
    catch (error) {

        enviarErrorAlServidor("Error al obtener nuevas guitarras" + error.message);
    }
}
export async function GuitarrasMasVendidas() {

    try {
        var respuesta = await fetch("/api/Guitarra/GuitarrasMasVendidas");

        if (!respuesta.ok) { enviarErrorAlServidor("Error en la respuesta de la Api de GuitarrasMasVendidas" + respuesta.status) }

        return await respuesta.json();

    } catch (error) {

        enviarErrorAlServidor("Error al obtener guitarras mas vendidas" + error.message);
    }
}
export async function GuitarrasEnOferta() {

    try {

        var respuesta = await fetch("/api/Guitarra/GuitarrasEnOfertas");

        if (!respuesta.ok) {

            enviarErrorAlServidor("Error en la respuesta de la Api de GuitarrasEnOfertas" + respuesta.status);
        }

        return await respuesta.json();
    }
    catch (error) {
        enviarErrorAlServidor("Error al obtener guitarras en ofertas")
    }
}
export async function guitarrasPorGenero(genero) {

    try {

        var guitarra = await fetch(`/api/Guitarra/Genero/${genero}`);
        if (!guitarra.ok) {
            enviarErrorAlServidor(`Error en la respuesta de la API  de guitarrasPorGenero(${guitarra.status})`);
        }
        return await guitarra.json();
    }
    catch (error) {

        enviarErrorAlServidor(`Error al obtener guitarras para ${genero}: ${error.message}`);

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
export function agregarAlCarrito(guitarra) {

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

    try {

        const valor = await fetch("https://dolarapi.com/v1/dolares/oficial");
        if (!valor.ok) {
            enviarErrorAlServidor("Error en la Api de obtener el valor del Dolar. Respuesta: " + valor.status);
            return;
        }

        const dolar = await valor.json();

        return parseFloat(dolar.venta);

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
