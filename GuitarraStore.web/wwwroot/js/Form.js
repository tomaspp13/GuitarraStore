
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
            const fechaFormateada = guitarra.fechaIngreso.split("T")[0];
            document.getElementById("FechaIngreso").value = fechaFormateada;
            document.getElementById("MasVendido").checked = guitarra.esMasVendida;
            document.getElementById("EstaEnOferta").checked = guitarra.estaEnOferta;
            document.getElementById("Genero").value = guitarra.genero;

            const imgPreview = document.getElementById("previewImagen");
            if (imgPreview && guitarra.urlImagen) {
                imgPreview.src = guitarra.urlImagen;
            }

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
        const esMasVendida = document.getElementById("MasVendido").checked;
        const estaEnOferta = document.getElementById("EstaEnOferta").checked;
        const genero = document.getElementById("Genero")?.value || "Sin genero";
        const imagenInput = document.getElementById("imagen");        

        try {
            const formData = new FormData();

            formData.append("Marca", marcaInput);
            formData.append("Modelo", modeloInput);
            formData.append("Precio", precioInput);
            formData.append("Oferta", estaEnOferta);
            formData.append("MasVendida", esMasVendida);
            formData.append("Genero", genero);

            if (imagenInput.files.length > 0) {
                formData.append("ImagenArchivo", imagenInput.files[0]);
            }
            
            if (siEditar && id) {
                formData.append("Id", id);
                const fechaIngreso = document.getElementById("FechaIngreso").value;
                formData.append("FechaIngreso", fechaIngreso);
                await editarGuitarras(formData);
                window.location.href = "/Home/GuitarrasCrud";
            } else {
                await crearGuitarras(formData);
                formulario.reset();                
                window.location.href = "/Home/GuitarrasCrud";

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
export async function registrarUsuario(usuario, contraseña,nombre) {

    const user = {

        Email: usuario.trim(),
        Password: contraseña.trim(),
        Nombre: nombre.trim()
    }

    try {

        const respuesta = await fetch(`/api/UsuariosApi/RegistrarUsuario`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })

        if (!respuesta.ok) {

            const errorText = await respuesta.text();
            throw new Error("Error al registrar usuario. Respuesta: " + respuesta.status + " - " + errorText);
        }

        window.location.href = "/Home/Inicio";
        
    }
    catch (error) {
        alert("Error al registrar usuario: " + error.message);
    }
}
export async function ingresarUsuario(email, contraseña) {

    const user = {

        Email: email.trim(),
        Password: contraseña.trim()
    };

    try {

        const respuesta = await fetch(`/api/UsuariosApi/DevolverUsuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al ingresar usuario. Respuesta: " + respuesta.status + " - " + errorText);
        }

        const usuario = await respuesta.text();

        if (usuario == "Administrador") {
            window.location.href = "/Home/GuitarrasCrud";
        }
        else {

            if (usuario == "Cliente") {
                window.location.href = "/Home/Inicio";
            }
        }

    }
    catch (error) {
        alert("Error al ingresar usuario: " + error.message);
    }
}
