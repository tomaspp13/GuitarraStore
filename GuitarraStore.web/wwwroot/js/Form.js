
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
        const imagenInput = document.getElementById("imagen");

        console.log("siEditar: " + siEditar);
        console.log("id: " + id);
        console.log("marcaInput: " + marcaInput);
        console.log("modeloInput: " + modeloInput);
        console.log("precioInput: " + precioInput);

        try {
            const formData = new FormData();
            formData.append("Marca", marcaInput);
            formData.append("Modelo", modeloInput);
            formData.append("Precio", precioInput);

            if (imagenInput.files.length > 0) {
                formData.append("ImagenArchivo", imagenInput.files[0]);
            }

            if (siEditar && id) {
                await editarGuitarras(id, formData);
                window.location.href = "/Home/GuitarrasCrud";
            } else {
                await crearGuitarras(formData);
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
export async function registrarUsuario(usuario, contraseña) {

    const user = {

        Email: usuario.trim(),
        Password: contraseña.trim()
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

        window.location.href = "/Home/Index";
        
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

        const usuario = await respuesta.json();

        if (usuario.tipoUsuario == "Administrador") {
            window.location.href = "/Home/GuitarrasCrud";
        }
        else {

            if (usuario.tipoUsuario == "Cliente") {
                window.location.href = "/Home/Index";
            }
        }

    }
    catch (error) {
        alert("Error al ingresar usuario: " + error.message);
    }
}
