
import { registrarUsuario, ingresarUsuario } from "./Form.js"
import { MostrarGuitarrasUsuario } from "./ui.js"

document.addEventListener("DOMContentLoaded", async () => {

    const formulario_ingreso = document.getElementById("ingresar_usuario");
    const formulario_registro = document.getElementById("registrar_usuario");
    const correo = document.getElementById("correo");
    const saludo = document.getElementById("saludo");
    const contenedorGuitarras = document.getElementById("contenedor_guitarras_compradas");

    if (formulario_ingreso) {

        formulario_ingreso.addEventListener("submit", async function (e) {

            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const contraseña = document.getElementById("contraseña").value.trim();

            await ingresarUsuario(email, contraseña);

        })

    }

    if (formulario_registro) {

        formulario_registro.addEventListener("submit", async function (e) {

            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const contraseña = document.getElementById("contraseña").value.trim();
            const nombre = document.getElementById("nombre").value.trim();

            await registrarUsuario(email, contraseña,nombre);

        })

    }

    if (saludo) {

        const userName = document.body.dataset.username;
        saludo.innerHTML = `Hola ${userName}`;

    }

    if (correo) {
 
        const userEmail = document.body.dataset.useremail;
        correo.innerHTML = `${userEmail}`;

    }

    if (contenedorGuitarras) {

        MostrarGuitarrasUsuario();
    }



});
