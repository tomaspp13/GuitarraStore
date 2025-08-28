
import { obtenerGuitarras, obtenerGuitarrasPorId, obtenerGuitarrasPorMarca, cargarMarcas, generarCompra, obtenerValorDolar } from "./GuitarraServicios.js";
import { MostrarGuitarras, MostrarGuitarrasCrud, mostrarGuitarraDetalles, mostrarCarrito, vaciarCarrito, MostrarGuitarrasInicio, MostrarComentariosDeGuitarra } from "./ui.js";
import { validarFormulario, validarComentarios } from "./Form.js"; 

document.addEventListener("DOMContentLoaded", async () => {

    let dolar = await obtenerValorDolar();

    const contenedor_principal = document.getElementById("contenedorGuitarras");
    const contenedorDetalles = document.getElementById("contenedorDetalles");
    const formulario = document.getElementById("formulario");
    const listado_del_crud = document.getElementById("listado");
    const botonCrear = document.getElementById("botonagregar");
    const form_filtros = document.getElementById("formulario_filtro");
    const contenedorFiltro = document.getElementById("filtro");
    const contenedor_carrito = document.getElementById("carritoContainer");
    const contenedor_marcas = document.getElementById("selectMarca");
    const btn_buscar = document.getElementById("botonBuscar");
    const contenedor_inicio = document.getElementById("contenedor_inicio");
    const btn_comprar = document.getElementById("btnCompra");
    const btnvaciarCarrito = document.getElementById("vaciarCarrito");
    const contenedorOpinion = document.getElementById("contenedorOpinion");
    const contenedorCom = document.getElementById("contenedorCom");

    if (contenedor_inicio) {

        await MostrarGuitarrasInicio(contenedor_inicio);

    }
    if (contenedor_marcas)
    {
        try {
            await cargarMarcas(contenedor_marcas);
        }
        catch (error) {
            console.error("Error al cargar las marcas : ", error);
        }
    }
    if (btn_buscar) {
        btn_buscar.addEventListener("click", () => {

            const busqueda = document.getElementById("inputBuscar").value.trim() || "todas";

            if (window.location.pathname.endsWith("/Guitarras")) {

                const marca = "todas";
                document.getElementById("selectMarca").value = "todas";

                const contenedorFiltro = document.getElementById("filtro");
                const filtro = contenedorFiltro.value;

                const preMinStr = document.getElementById("precioMin").value.trim();
                const preMaxStr = document.getElementById("precioMax").value.trim();
                const preMin = preMinStr !== "" ? parseFloat(preMinStr) : 0;
                const preMax = preMaxStr !== "" ? parseFloat(preMaxStr) : 99999999;

                obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax)
                    .then(guitarra_filtrada => {
                        MostrarGuitarras(guitarra_filtrada, contenedor_principal,dolar);
                    })
                    .catch(error => {
                        console.error("Error al buscar las guitarras:", error);
                    });

            } else{
                
                window.location.href = `/Home/Guitarras?busqueda=${encodeURIComponent(busqueda)}`;
            }
        });
    }
    if (contenedorFiltro) {

        contenedorFiltro.addEventListener("change", async () => {

            const busqueda = document.getElementById("inputBuscar").value;
            const marca = document.getElementById("selectMarca").value;

            const contenedorFiltro = document.getElementById("filtro");
            const filtro = contenedorFiltro.value;

            const preMinInput = document.getElementById("precioMin").value;
            const preMaxInput = document.getElementById("precioMax").value;

            const preMin = preMinInput !== "" ? parseFloat(preMinInput) : null;
            const preMax = preMaxInput !== "" ? parseFloat(preMaxInput) : null;

            if ((preMinInput !== "" && isNaN(preMin)) || (preMaxInput !== "" && isNaN(preMax))) {
                mostrarToast("Por favor, ingresa valores numéricos válidos en los precios.","Danger");
                return;  
            }

            if (preMin !== null && preMax !== null && preMin > preMax) {
                mostrarToast("El precio mínimo no puede ser mayor que el precio máximo.", "Danger");
                return;
            }

            try {

                await obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax).then(guitarra => {

                    MostrarGuitarras(guitarra, contenedor_principal, dolar);
                });
                
            } catch (error) {
                console.error("Error al cargar las guitarras:", error);
            }

        })

    }
    if (contenedor_marcas) {

        contenedor_marcas.addEventListener("change", async () => {

            const busqueda = document.getElementById("inputBuscar").value = "";
            const marca = document.getElementById("selectMarca").value;

            const contenedorFiltro = document.getElementById("filtro");
            const filtro = contenedorFiltro.value;

            const preMinInput = document.getElementById("precioMin").value;
            const preMaxInput = document.getElementById("precioMax").value;

            const preMin = preMinInput !== "" ? parseFloat(preMinInput) : null;
            const preMax = preMaxInput !== "" ? parseFloat(preMaxInput) : null;

            if ((preMinInput !== "" && isNaN(preMin)) || (preMaxInput !== "" && isNaN(preMax))) {
                mostrarToast("Por favor, ingresa valores numéricos válidos en los precios.", "Danger");
                return;
            }

            if (preMin !== null && preMax !== null && preMin > preMax) {
                mostrarToast("El precio mínimo no puede ser mayor que el precio máximo.", "Danger");
                return;
            }

            try {

                await obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax).then(guitarra_filtradas => {
                    MostrarGuitarras(guitarra_filtradas, contenedor_principal, dolar);

                });                   
                
            } catch (error) {
                console.error("Error al cargar las guitarras:", error);
            }

        })

    }
    if (form_filtros)
    {
        form_filtros.addEventListener("submit", async function (e) {
            e.preventDefault();

            const marca = document.getElementById("selectMarca").value;
            const busqueda = document.getElementById("inputBuscar").value;

            const contenedorFiltro = document.getElementById("filtro");
            const tipoFiltro = contenedorFiltro.value;

            const preMinInput = document.getElementById("precioMin").value;
            const preMaxInput = document.getElementById("precioMax").value;

            const preMin = preMinInput ? parseFloat(preMinInput) : 0;
            const preMax = preMaxInput ? parseFloat(preMaxInput) : 999999999;
            
            if ((preMin !== null && isNaN(preMin)) || (preMax !== null && isNaN(preMax))) {
                mostrarToast("Por favor, ingresa valores numéricos válidos en los precios.", "Danger");
                return;
            }
           
            if (preMin !== null && preMax !== null && preMin > preMax) {
                mostrarToast("El precio mínimo no puede ser mayor que el precio máximo.", "Danger");
                return;
            }

            await obtenerGuitarrasPorMarca(busqueda, marca, tipoFiltro, preMin, preMax).then(guitarra_filtradas => {

                MostrarGuitarras(guitarra_filtradas, contenedor_principal, dolar);

            }) 

        });
    }
    if (formulario) {
        validarFormulario(contenedor_principal);
    }
    if (contenedor_carrito) {
        mostrarCarrito();
    }
    if (listado_del_crud) {

        MostrarGuitarrasCrud(listado_del_crud);
    }
    if (botonCrear) { botonCrear.addEventListener("click", function () { window.location.href = "/Home/Crear" }); }
    if (contenedor_principal && !window.location.search.includes("busqueda=")) {

        await obtenerGuitarras().then(guitarras => {

            MostrarGuitarras(guitarras, contenedor_principal, dolar);

        })

    }
    if (contenedor_principal && window.location.pathname.includes("/Home/Guitarras")) {
        const urlParams = new URLSearchParams(window.location.search);
        const busqueda = urlParams.get("busqueda");

        document.getElementById("inputBuscar").value = busqueda;

        if (busqueda) {
            const marca = "todas";
            const filtro = "relevante";
            const preMin = 0;
            const preMax = 99999999;

            try {
                await obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax).then(guitarra_filtrada => {

                    MostrarGuitarras(guitarra_filtrada, contenedor_principal, dolar);
                })
                
            } catch (error) {
                mostrarToast("Error al buscar las guitarras :", "Danger");
            }

            return; 
        }
    }
    if (contenedorDetalles) {

        const url = window.location.href;
        const id = url.split("/").pop();

        try {

            const urlParams = new URLSearchParams(window.location.search);
            const from = urlParams.get("from");

            const btnVolverCrud = document.getElementById("volverAlCrud");

            if (btnVolverCrud) {
                if (from === "crud") {
                    btnVolverCrud.style.display = "inline-block";
                } else {
                    btnVolverCrud.style.display = "none";
                }
            }

            await obtenerGuitarrasPorId(id).then(guitarra_detalles => {
                mostrarGuitarraDetalles(guitarra_detalles);
            })       
           
        }
        catch (error) {
            console.error("Error al cargar los detalles de la guitarra:", error);
            
        }
    }
    if (btn_comprar) {
        btn_comprar.addEventListener("click", generarCompra);
    }
    if (btnvaciarCarrito) {

        btnvaciarCarrito.addEventListener("click", vaciarCarrito);
    }

    const userRole = document.body.dataset.usuario;

    if (userRole) {
        if (contenedorOpinion) {

            contenedorOpinion.innerHTML = `
            <form id="formularioOpinion">

                    <div class="mb-3">
                        <label class="form-label">Calificación</label>
                        <div class="rating">
                            <input type="radio" id="estrella5" name="calificacion" value="5" required>
                            <label for="estrella5">★</label>

                            <input type="radio" id="estrella4" name="calificacion" value="4">
                            <label for="estrella4">★</label>

                            <input type="radio" id="estrella3" name="calificacion" value="3">
                            <label for="estrella3">★</label>

                            <input type="radio" id="estrella2" name="calificacion" value="2">
                            <label for="estrella2">★</label>

                            <input type="radio" id="estrella1" name="calificacion" value="1">
                            <label for="estrella1">★</label>
                        </div>
                    </div>


                    <div class="mb-3">
                        <label for="comentario" class="form-label">Comentario</label>
                        <textarea id="comentario" class="form-control comentario-fijo" required maxlength="350" rows="3" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
            `;

        }
        
    } else {

        if (contenedorOpinion) {
            contenedorOpinion.innerHTML = `
            <div class="alert text-center p-3 rounded" style="background-color: #444; color: #fff;">
                <strong>Para dejar tu opinión necesitas </strong>
                <a href="/Usuarios/Ingresar" class="btn btn-sm btn-primary ms-2">Iniciar sesión</a>
            </div>
        `;

        } 

        
    }

    if (window.location.href.includes("Detalles")) {

        const url = window.location.href;
        const partes = url.split("/");
        const guitarraId = partes[partes.length - 1];

        if (contenedorCom) {

            await MostrarComentariosDeGuitarra(contenedorCom, guitarraId);

        }

        const formularioComentario = document.getElementById("formularioOpinion");

        formularioComentario.addEventListener("submit", async (e) => {
            e.preventDefault();
            await validarComentarios(guitarraId);
            formularioComentario.reset();
            await MostrarComentariosDeGuitarra(contenedorCom, guitarraId);
        });

    }
    
});

