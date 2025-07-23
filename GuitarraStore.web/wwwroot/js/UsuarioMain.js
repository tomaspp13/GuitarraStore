
import { registrarUsuario, ingresarUsuario } from "./Form.js"

document.addEventListener("DOMContentLoaded", async () => {

    const formulario_ingreso = document.getElementById("ingresar_usuario");
    const formulario_registro = document.getElementById("registrar_usuario");

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

});
