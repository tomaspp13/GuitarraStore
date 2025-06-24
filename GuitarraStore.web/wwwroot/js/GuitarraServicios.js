export async function obtenerGuitarras() {

    try {

        const respuesta = await fetch("/api/guitarra/Get");

        if (!respuesta.ok) {

            const errorText = await respuesta.text();
            throw new Error("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);

        }

        return await respuesta.json();

    } catch (error) {
        alert("Error al obtener las guitarras: " + error.message);
    }  

}
export async function obtenerGuitarrasPorFiltros(busqueda, tipoFiltro, precioMin, precioMax) {

    const params = new URLSearchParams({
        busqueda: busqueda || "",
        tipofiltro: tipoFiltro || "",
        precioMin: isNaN(precioMin) ? "" : precioMin,
        precioMax: isNaN(precioMax) ? "" : precioMax
    });

    try {

        const guitarrasFiltradas = await fetch(`/api/guitarra/FiltroGuitarras?${params.toString()}`);

        if (!guitarrasFiltradas.ok) {

            const errorText = await guitarrasFiltradas.text();
            throw new Error("Error al obtener las guitarras. Respuesta: " + guitarrasFiltradas.status + " - " + errorText);

        }

        return await guitarrasFiltradas.json();

    } catch (error) {
        console.error("Error al obtener guitarras por filtros:", error);
        return [];
    }
}


export async function obtenerGuitarrasPorId(id)
{
    try
    {

        const respuesta = await fetch(`/api/guitarra/Get/${id}`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al obtener la guitarra por ID. Respuesta: " + respuesta.status + " - " + errorText);
        }

        return await respuesta.json();

    } catch (error)
    {
        alert("Error al obtener guitarra por ID: " + error.message);
    }

}

export async function crearGuitarras(guitarra) {

    try
    {

        const documento = await fetch("/api/guitarra/Create", {

            method: "POST",
            headers: {

                "Content-Type": "application/json"

            },
            body: JSON.stringify(guitarra)

        });

        if (!documento.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        return;

    } catch (error)
    {

        alert("Error al crear la guitarra: " + error.message);

    }

}
export async function editarGuitarras(id,guitarraCambio)
{
    try
    {

        const respuesta = await fetch(`/api/guitarra/Put/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(guitarraCambio)
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al editar la guitarra. Respuesta: " + respuesta.status + " - " + errorText);
            return;
        }

        alert("Guitarra actualizada correctamente.");
        window.location.href = "/Home/GuitarrasCrud";

    } catch (error) {

        alert("Error al editar: " + error.message);
    }
    
}

export async function obtenerValorDolar() {

    try {

        const valor = await fetch("https://dolarapi.com/v1/dolares/oficial");
        if (!valor.ok) {
            throw new Error("Error al obtener el valor del Dolar. Respuesta: " + valor.status);
        }

        const dolar = await valor.json();

        return parseFloat(dolar.venta);

    }
    catch (error) {

        alert("Error al obtener valor del Dolar: " + error.message);
    }
}

export async function eliminarGuitarras(id)
{

    try {

        const respuesta = await fetch(`/api/guitarra/Delete/${id}`, { method: "DELETE" });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al eliminar la guitarra. Respuesta: " + respuesta.status + " - " + errorText);
        }

        alert("Guitarra eliminada correctamente.");
        return;
    }
    catch (error) {
        alert("Error al eliminar la guitarra: " + error.message);
    }    

}