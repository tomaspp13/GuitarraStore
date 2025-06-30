import { obtenerMarcas ,obtenerValorDolar} from "./GuitarraServicios.js";
import { cargarDropdownMarcas } from "./ui.js";
import { registrarUsuario, ingresarUsuario } from "./Form.js"

document.addEventListener("DOMContentLoaded", async () => {
    const contenedorDropdown = document.getElementById("dropdownMarcas");
    const contenedor_principal = document.getElementById("contenedorGuitarras") || null;
    const formulario_ingreso = document.getElementById("ingresar_usuario");
    const formulario_registro = document.getElementById("registrar_usuario");
    let dolar = 1;

    try {
        dolar = await obtenerValorDolar();
    }
    catch (error) {
        console.error("No se pudo obtener cotización:", error);
    }

    if (contenedorDropdown) {
        try {
            const marcas = await obtenerMarcas();
            await cargarDropdownMarcas(marcas, contenedorDropdown, contenedor_principal, dolar, "", 0, 999999);
        } catch (error) {
            console.error("Error al obtener marcas:", error);
        }
    }

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

            await registrarUsuario(email, contraseña);

        })

    }

});
