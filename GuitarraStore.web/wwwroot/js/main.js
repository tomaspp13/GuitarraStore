
import { obtenerGuitarras, obtenerGuitarrasPorId, obtenerValorDolar, obtenerGuitarrasPorFiltros } from "./GuitarraServicios.js";
import { MostrarGuitarras, MostrarGuitarrasCrud, mostrarGuitarraDetalles } from "./ui.js";
import { validarFormulario } from "./Form.js"; 


document.addEventListener("DOMContentLoaded", async () => {

    const contenedor_principal = document.getElementById("contenedorGuitarras");
    const contenedorDetalles = document.getElementById("contenedorDetalles");
    const formulario = document.getElementById("formulario");
    const listado_del_crud = document.getElementById("listado");
    const botonCrear = document.getElementById("botonagregar");
    const filtros = document.getElementById("filtro");

    if (filtros) {
        console.log("Estoy en el filtro");
        filtros.addEventListener("change", async function () {
            console.log("Entre al evento del filtro");
            const tipoFiltro = filtros.value;
            contenedor_principal.innerHTML = "";
            const guitarras_filtradas = await obtenerGuitarrasPorFiltros(tipoFiltro);
            await MostrarGuitarras(guitarras_filtradas, contenedor_principal);

        });

    }

    if (formulario) {

        validarFormulario(contenedor_principal);

    }

    let dolar = 1;

    try {
        dolar = await obtenerValorDolar();
    } catch (error) {
        console.error("No se pudo obtener cotización:", error);  
    }

    if (listado_del_crud) { MostrarGuitarrasCrud(listado_del_crud); }

    if (botonCrear) { botonCrear.addEventListener("click", function () { window.location.href = "/Home/Privacy" }); }

    if (contenedor_principal) {

        try {

            const guitarras = await obtenerGuitarras();

            MostrarGuitarras(guitarras, contenedor_principal,dolar);

        } catch (error) {
            console.error("Error al cargar las guitarras:", error);
        }

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

