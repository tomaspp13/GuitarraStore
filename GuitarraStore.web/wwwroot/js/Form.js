
import { obtenerGuitarras, obtenerGuitarrasPorId,crearGuitarras, editarGuitarras } from "./GuitarraServicios.js";
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
            document.getElementById("stock").value = guitarra.stock;
            document.getElementById("descripcion").value = guitarra.descripcion;
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
        const descripcionInput = document.getElementById("descripcion").value;
        const precioInput = parseFloat(document.getElementById("precio").value);
        const stockInput = parseInt(document.getElementById("stock").value);
        const esMasVendida = document.getElementById("MasVendido").checked;
        const estaEnOferta = document.getElementById("EstaEnOferta").checked;
        const genero = document.getElementById("Genero")?.value || "Sin genero";
        const imagenInput = document.getElementById("imagen");  

        try {
            const formData = new FormData();

            formData.append("Marca", marcaInput);
            formData.append("Modelo", modeloInput);
            formData.append("Descripcion", descripcionInput);
            formData.append("Stock", stockInput);
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

                localStorage.setItem("toastMensaje", "Guitarra editada correctamente");
                localStorage.setItem("toastTipo", "success");
            } else {
                await crearGuitarras(formData);

                localStorage.setItem("toastMensaje", "Guitarra creada correctamente");
                localStorage.setItem("toastTipo", "success");

                if (contenedor) {
                    const mostrar = await obtenerGuitarras();
                    await MostrarGuitarras(mostrar, contenedor);
                }
            }

            formulario.reset();
            window.location.href = "/Home/GuitarrasCrud"; 

        } catch (error) {

            localStorage.setItem("toastMensaje", "Error del servidor " + error.message);
            localStorage.setItem("toastTipo", "danger");
            window.location.href = "/Home/GuitarrasCrud";
        }
    });

}
export async function registrarUsuario(usuario, contraseña, nombre) {

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
            enviarErrorAlServidor("Error en la api de Registrar Usuario. Respuesta: " + respuesta.status + " - " + errorText);
            mostrarToast("Error al registrar usuario", "danger");
            return;
            
        }

        window.location.href = "/Usuarios/Ingresar";

    }
    catch (error) {
        enviarErrorAlServidor("Error al Registrar Usuario. Respuesta: " + error.message);
        mostrarToast("Error de servidor", "danger");

        
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
            enviarErrorAlServidor("Error en la Api ingresar usuario. Respuesta: " + respuesta.status + " - " + errorText);
            mostrarToast("Error al ingresar usuario", "danger");
            return;
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
        enviarErrorAlServidor("Error al ingresar usuario: " + error.message);
        mostrarToast("Error servidor", "danger");
    }
}
