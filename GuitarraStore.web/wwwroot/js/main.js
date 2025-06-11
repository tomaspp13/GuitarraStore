
import { obtenerGuitarras, obtenerGuitarrasPorId } from "./GuitarraServicios.js";
import { MostrarGuitarras, MostrarGuitarrasCrud, mostrarGuitarraDetalles } from "./ui.js";
import { validarFormulario } from "./Form.js"; 


document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.getElementById("contenedorGuitarras");
    const contenedorDetalles = document.getElementById("contenedorDetalles");
    const formulario = document.getElementById("formulario");
    const listado_del_crud = document.getElementById("listado");
    const botonCrear = document.getElementById("botonagregar");

    if (formulario) {

        validarFormulario(contenedor);

    }

    if (listado_del_crud) { MostrarGuitarrasCrud(listado_del_crud); }

    if (botonCrear) { botonCrear.addEventListener("click", function () { window.location.href = "/Home/Privacy" }); }

    if (contenedor) {

        try {

            const guitarras = await obtenerGuitarras();

            MostrarGuitarras(guitarras, contenedor);

        } catch (error) {
            console.error("Error al cargar las guitarras:", error);
        }

    }

    if (contenedorDetalles) {

        const url = window.location.href;
        const id = url.split("/").pop();

        console.log("ID de guitarra:", id);

        try {

            const guitarra_detalles = await obtenerGuitarrasPorId(id);
            mostrarGuitarraDetalles(guitarra_detalles, contenedorDetalles);
        }
        catch (error) {
            console.error("Error al cargar los detalles de la guitarra:", error);
            
        }
    }

});

