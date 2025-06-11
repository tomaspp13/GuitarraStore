
import { crearGuitarras, obtenerGuitarras, editarGuitarras, obtenerGuitarrasPorId } from "./GuitarraServicios.js";
import { MostrarGuitarras } from "./ui.js"

export async function validarFormulario(contenedor) {

    const formulario = document.getElementById("formulario");

    const url = window.location.href;
    const siEditar = url.includes("/Editar/");
    const id = siEditar ? url.split("/").pop() : null;

    if (siEditar && id) {

        try {

            const guitarra = await obtenerGuitarrasPorId(id);
            
            if (!guitarra) throw new Error("Guitarra no encontrada");

            document.getElementById("marca").value = guitarra.marca;
            document.getElementById("modelo").value = guitarra.modelo;
            document.getElementById("precio").value = guitarra.precio;
            document.getElementById("imagen").value = guitarra.urlImagen || "";

        }
        catch (error) {

            alert("Error al cargar guitarra: " + error.message);

        }

    }

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const marcaInput = document.getElementById("marca").value;
        const modeloInput = document.getElementById("modelo").value;
        const precioInput = parseFloat(document.getElementById("precio").value);
        const imagenInput = document.getElementById("imagen").value;

        try {
            if (siEditar && id) {
                await editarGuitarras(id, {
                    marca: marcaInput,
                    modelo: modeloInput,
                    precio: precioInput,
                    urlImagen: imagenInput
                });

                window.location.href = "/Home/GuitarrasCrud";

            } else {

                await crearGuitarras({
                    marca: marcaInput,
                    modelo: modeloInput,
                    precio: precioInput,
                    urlImagen: imagenInput
                });

                formulario.reset();
                alert("Guitarra creada exitosamente");

                if (contenedor) {
                    const mostrar = await obtenerGuitarras();
                    await MostrarGuitarras(mostrar, contenedor);
                }
            }
        } catch (error) {
            alert("Error al guardar la guitarra: " + error.message);
        }
    });
}
