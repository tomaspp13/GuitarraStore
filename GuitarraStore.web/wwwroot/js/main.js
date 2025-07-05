
import { obtenerGuitarras, obtenerGuitarrasPorId, obtenerValorDolar, obtenerGuitarrasPorMarca, cargarMarcas } from "./GuitarraServicios.js";
import { MostrarGuitarras, MostrarGuitarrasCrud, mostrarGuitarraDetalles, mostrarCarrito } from "./ui.js";
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

    let dolar = 1;

    try {
        dolar = await obtenerValorDolar();
    } catch (error) {
        console.error("No se pudo obtener cotización:", error);
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

        btn_buscar.addEventListener("click",async () => {

            const inputBuscar = document.getElementById("inputBuscar").value;
            const marca = "todas";
            document.getElementById("selectMarca").value = "todas";

            const contenedorFiltro = document.getElementById("filtro");
            const filtro = contenedorFiltro.value;

            const preMinStr = document.getElementById("precioMin").value.trim();
            const preMaxStr = document.getElementById("precioMax").value.trim();
            const preMin = preMinStr !== "" ? parseFloat(preMinStr) : null;
            const preMax = preMaxStr !== "" ? parseFloat(preMaxStr) : null;

            try {

                const guitarra_filtrada = await obtenerGuitarrasPorMarca(inputBuscar, marca, filtro, preMin, preMax);

                if (!guitarra_filtrada.ok) {

                    const errorText = await guitarra_filtrada.text();
                    throw new Error("Error al obtener las guitarras. Respuesta: " + guitarra_filtrada.status + " - " + errorText);
                }

                await MostrarGuitarras(guitarra_filtrada, contenedor_principal, dolar);

            }
            catch (error) {

                console.error("Error al buscar las guitarras:", error);

            }
        })

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

            const preMin = preMinInput ? parseFloat(preMinInput) : null;
            const preMax = preMaxInput ? parseFloat(preMaxInput) : null;
            
            if ((preMin !== null && isNaN(preMin)) || (preMax !== null && isNaN(preMax))) {
                alert("Por favor, ingresa valores numéricos válidos en los precios.");
                return;
            }
           
            if (preMin !== null && preMax !== null && preMin > preMax) {
                alert("El precio mínimo no puede ser mayor que el precio máximo.");
                return;
            }

            console.log(buscar,tipoFiltro,preMin, preMax);

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

    if (listado_del_crud) { MostrarGuitarrasCrud(listado_del_crud); }

    if (botonCrear) { botonCrear.addEventListener("click", function () { window.location.href = "/Home/Privacy" }); }

    if (contenedor_principal) {   
  
        const guitarra = await obtenerGuitarras();            
        await MostrarGuitarras(guitarra, contenedor_principal, dolar);

    }
    
    if (contenedorDetalles) {

        const url = window.location.href;
        const id = url.split("/").pop();

        try {

            const guitarra_detalles = await obtenerGuitarrasPorId(id);
            
           await mostrarGuitarraDetalles(guitarra_detalles, contenedorDetalles);
        }
        catch (error) {
            console.error("Error al cargar los detalles de la guitarra:", error);
            
        }
    }

});

