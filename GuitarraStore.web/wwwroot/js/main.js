
import { obtenerGuitarras, obtenerGuitarrasPorId, obtenerValorDolar, obtenerGuitarrasPorMarca, cargarMarcas } from "./GuitarraServicios.js";
import { MostrarGuitarras, MostrarGuitarrasCrud, mostrarGuitarraDetalles, mostrarCarrito, MostrarGuitarrasInicio } from "./ui.js";
import { validarFormulario } from "./Form.js"; 
obtenerGuitarrasPorMarca
document.addEventListener("DOMContentLoaded", async () => {

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

    let dolar = 1;

    try {
        dolar = await obtenerValorDolar();
    } catch (error) {
        console.error("No se pudo obtener cotización:", error);
    }

    if (contenedor_inicio) {

        await MostrarGuitarrasInicio(contenedor_inicio, dolar);

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

            const busquedas = document.getElementById("inputBuscar").value.trim();

            if (window.location.pathname.includes("/Home/Guitarras")) {
                const marca = "todas";
                document.getElementById("selectMarca").value = "todas";

                const contenedorFiltro = document.getElementById("filtro");
                const filtro = contenedorFiltro.value;

                const preMinStr = document.getElementById("precioMin").value.trim();
                const preMaxStr = document.getElementById("precioMax").value.trim();
                const preMin = preMinStr !== "" ? parseFloat(preMinStr) : 0;
                const preMax = preMaxStr !== "" ? parseFloat(preMaxStr) : 99999999;

                obtenerGuitarrasPorMarca(busquedas, marca, filtro, preMin, preMax)
                    .then(guitarra_filtrada => {
                        MostrarGuitarras(guitarra_filtrada, contenedor_principal, dolar);
                    })
                    .catch(error => {
                        console.error("Error al buscar las guitarras:", error);
                    });

            } else {
                
                window.location.href = `/Home/Guitarras?busqueda=${encodeURIComponent(busquedas)}`;
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
                alert("Por favor, ingresa valores numéricos válidos en los precios.");
                return;
            }

            if (preMin !== null && preMax !== null && preMin > preMax) {
                alert("El precio mínimo no puede ser mayor que el precio máximo.");
                return;
            }

            try {
                const guitarras = await obtenerGuitarrasPorMarca(busqueda,marca, filtro, preMin, preMax);
                await MostrarGuitarras(guitarras, contenedor_principal, dolar);
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
                alert("Por favor, ingresa valores numéricos válidos en los precios.");
                return;
            }

            if (preMin !== null && preMax !== null && preMin > preMax) {
                alert("El precio mínimo no puede ser mayor que el precio máximo.");
                return;
            }

            try {
                const guitarras = await obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax);
                await MostrarGuitarras(guitarras, contenedor_principal, dolar);
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
                alert("Por favor, ingresa valores numéricos válidos en los precios.");
                return;
            }
           
            if (preMin !== null && preMax !== null && preMin > preMax) {
                alert("El precio mínimo no puede ser mayor que el precio máximo.");
                return;
            }

            const guitarras_filtradas = await obtenerGuitarrasPorMarca(busqueda, marca, tipoFiltro, preMin, preMax);
            await MostrarGuitarras(guitarras_filtradas, contenedor_principal, dolar);

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
        const guitarra = await obtenerGuitarras();
        await MostrarGuitarras(guitarra, contenedor_principal, dolar);
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
                const guitarra_filtrada = await obtenerGuitarrasPorMarca(busqueda, marca, filtro, preMin, preMax);
                await MostrarGuitarras(guitarra_filtrada, contenedor_principal, dolar);
            } catch (error) {
                console.error("Error al buscar las guitarras por URL:", error);
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

            const guitarra_detalles = await obtenerGuitarrasPorId(id);
            
           await mostrarGuitarraDetalles(guitarra_detalles, contenedorDetalles);
        }
        catch (error) {
            console.error("Error al cargar los detalles de la guitarra:", error);
            
        }
    }

});

